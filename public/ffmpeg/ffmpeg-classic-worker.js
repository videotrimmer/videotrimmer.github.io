/* Classic Web Worker for FFmpeg WebAssembly Core (Zero ES module imports for 100% Vite & GitHub Pages compatibility) */
let core = null;
let probeLogCollector = null;

function isInternalAbortNoise(message) {
  const trimmed = String(message || '').trim();
  return !trimmed || /^Aborted\(/i.test(trimmed);
}

async function initCore(coreUrl, wasmUrl) {
  if (core) return true;

  importScripts(coreUrl);
  const factory = typeof createFFmpegCore === 'function' ? createFFmpegCore : self.createFFmpegCore;
  if (typeof factory !== 'function') {
    throw new Error('createFFmpegCore not found after importScripts');
  }

  const wasmResp = await fetch(wasmUrl);
  if (!wasmResp.ok) {
    throw new Error('Failed to fetch wasm binary: ' + wasmResp.status);
  }
  const wasmBuffer = await wasmResp.arrayBuffer();

  core = await factory({
    wasmBinary: new Uint8Array(wasmBuffer),
  });

  core.setLogger((data) => {
    const rawMsg = data && data.message ? String(data.message) : '';
    if (probeLogCollector) {
      if (rawMsg && !isInternalAbortNoise(rawMsg)) {
        probeLogCollector.push(rawMsg);
      }
      return;
    }
    if (isInternalAbortNoise(rawMsg)) {
      return;
    }
    self.postMessage({ type: 'LOG', data });
  });

  core.setProgress((data) => {
    self.postMessage({ type: 'PROGRESS', data });
  });

  return true;
}

function parseProbeLines(lines) {
  let duration = 0;
  let hasAudio = false;
  let hasVideo = false;
  for (const line of lines) {
    const trimmed = String(line || '').trim();
    const m = trimmed.match(/^duration=([0-9.]+)/);
    if (m) {
      const val = parseFloat(m[1]);
      if (Number.isFinite(val) && val > 0) {
        duration = val;
      }
    }
    if (trimmed === 'codec_type=audio') hasAudio = true;
    if (trimmed === 'codec_type=video') hasVideo = true;
  }
  return { duration, hasAudio, hasVideo };
}

self.onmessage = async (event) => {
  const { id, type, data } = event.data || {};
  const transfer = [];
  let result = null;

  try {
    switch (type) {
      case 'LOAD': {
        result = await initCore(data.coreURL, data.wasmURL);
        break;
      }
      case 'WRITE_FILE': {
        core.FS.writeFile(data.path, data.data);
        result = true;
        break;
      }
      case 'EXEC': {
        core.setTimeout(data.timeout ?? -1);
        try {
          core.exec(...data.args);
          result = typeof core.ret === 'number' ? core.ret : 0;
        } finally {
          core.reset();
        }
        break;
      }
      case 'PROBE': {
        probeLogCollector = [];
        try {
          core.setTimeout(-1);
          core.ffprobe('-v', 'error', '-show_entries', 'format=duration:stream=codec_type', data.path);
          core.reset();
        } finally {
          const lines = probeLogCollector || [];
          probeLogCollector = null;
          result = parseProbeLines(lines);
        }
        break;
      }
      case 'READ_FILE': {
        const out = core.FS.readFile(data.path, { encoding: data.encoding || 'binary' });
        result = out instanceof Uint8Array ? new Uint8Array(out) : out;
        if (result instanceof Uint8Array) {
          transfer.push(result.buffer);
        }
        break;
      }
      case 'DELETE_FILE': {
        try {
          core.FS.unlink(data.path);
        } catch (_) {}
        result = true;
        break;
      }
      case 'RENAME': {
        core.FS.rename(data.oldPath, data.newPath);
        result = true;
        break;
      }
      default:
        throw new Error('Unknown worker command: ' + type);
    }

    self.postMessage({ id, type, data: result }, transfer);
  } catch (err) {
    const rawErr = err && err.message ? err.message : String(err);
    // Reset core if a non-normal WASM runtime error occurred so next run re-initializes cleanly
    if (err instanceof WebAssembly.RuntimeError || /out of bounds|memory/i.test(rawErr)) {
      core = null;
    }
    const cleanErr = isInternalAbortNoise(rawErr)
      ? 'FFmpeg runtime reset while processing this media segment.'
      : rawErr;
    self.postMessage({
      id,
      type: 'ERROR',
      data: cleanErr,
    });
  }
};
