/**
 * Doubles for the browser capture APIs the recorders rely on, none of which
 * jsdom implements: `navigator.mediaDevices`, `MediaStream`, `MediaRecorder`,
 * and the playback methods of `HTMLMediaElement`.
 *
 * Shared by the audio and the video recorder specs. The Web Audio doubles
 * (`AudioContext`, `AudioWorkletNode`, `Worker`) sit in the second half of this
 * file, behind `installWebAudioHarness`: only `useAudioRecorder` needs them,
 * but both of its specs do.
 */

/** A track the component can stop to release the device. */
export function fakeTrack(kind: 'audio' | 'video' = 'video') {
  return { kind, enabled: true, stop: vi.fn() } as unknown as MediaStreamTrack;
}

/**
 * `MediaStream` has to exist as a constructor, not just as a shape:
 * <VideoRecorder> narrows with `srcObject instanceof MediaStream` before
 * resetting it.
 */
export class FakeMediaStream {
  id: string;
  private tracks: MediaStreamTrack[];

  constructor(tracks: MediaStreamTrack[] = [fakeTrack(), fakeTrack('audio')]) {
    this.tracks = tracks;
    this.id = `stream-${FakeMediaStream.created++}`;
  }

  static created = 0;

  getTracks() {
    return this.tracks;
  }
}

export type FakeMediaStreamInstance = FakeMediaStream & MediaStream;

/** Records what the component asked of it, and lets a test push data back. */
export class FakeMediaRecorder {
  static instances: FakeMediaRecorder[] = [];
  /** Mime types rejected by `isTypeSupported`, to exercise the fallbacks. */
  static unsupported: string[] = [];

  state: 'inactive' | 'recording' | 'paused' = 'inactive';
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;

  readonly stream: MediaStream;
  readonly mimeType: string;
  readonly start = vi.fn((timeslice?: number) => {
    this.state = 'recording';
    this.timeslice = timeslice;
  });
  readonly stop = vi.fn(() => {
    this.state = 'inactive';
  });
  readonly requestData = vi.fn();
  timeslice?: number;

  constructor(stream: MediaStream, options?: { mimeType?: string }) {
    this.stream = stream;
    this.mimeType = options?.mimeType ?? '';
    FakeMediaRecorder.instances.push(this);
  }

  static isTypeSupported(type: string) {
    return !FakeMediaRecorder.unsupported.includes(type);
  }

  /** Hands a chunk to the component, as the browser would every timeslice. */
  emitData(blob: Blob) {
    this.ondataavailable?.({ data: blob });
  }

  emitError(event: unknown = new Error('recorder failed')) {
    this.onerror?.(event);
  }
}

export type MediaHarness = {
  /** The stream handed over by `getUserMedia`. */
  stream: FakeMediaStreamInstance;
  getUserMedia: ReturnType<typeof vi.fn>;
  enumerateDevices: ReturnType<typeof vi.fn>;
  createObjectURL: ReturnType<typeof vi.fn>;
  revokeObjectURL: ReturnType<typeof vi.fn>;
  /** Every MediaRecorder built since the harness was installed. */
  recorders: FakeMediaRecorder[];
  /** The recorder currently in use, i.e. the last one built. */
  recorder: () => FakeMediaRecorder;
};

export function videoInput(
  deviceId: string,
  label = `camera ${deviceId}`,
): MediaDeviceInfo {
  return {
    deviceId,
    label,
    groupId: '',
    kind: 'videoinput',
  } as MediaDeviceInfo;
}

export function audioInput(deviceId = 'mic'): MediaDeviceInfo {
  return {
    deviceId,
    label: 'microphone',
    groupId: '',
    kind: 'audioinput',
  } as MediaDeviceInfo;
}

/**
 * Installs every double on the global scope. Call from `beforeEach`; the stubs
 * are torn down by the `restoreMocks`/`unstubGlobals` handling of the runner,
 * so nothing has to be undone by hand.
 *
 * @param devices what `enumerateDevices` should report
 * @param stream the stream `getUserMedia` should resolve to
 */
export function installMediaHarness({
  devices = [videoInput('camera-1'), audioInput()],
  stream = new FakeMediaStream() as FakeMediaStreamInstance,
}: {
  devices?: MediaDeviceInfo[];
  stream?: FakeMediaStreamInstance;
} = {}): MediaHarness {
  FakeMediaRecorder.instances = [];
  FakeMediaRecorder.unsupported = [];

  const getUserMedia = vi.fn(async () => stream);
  const enumerateDevices = vi.fn(async () => devices);

  vi.stubGlobal('MediaStream', FakeMediaStream);
  vi.stubGlobal('MediaRecorder', FakeMediaRecorder);
  vi.stubGlobal('mediaDevices', { getUserMedia, enumerateDevices });
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    writable: true,
    value: { getUserMedia, enumerateDevices },
  });

  // Both recorders turn their result into a blob URL. Defined for the whole
  // file rather than stubbed per test: the cleanup effects revoke these URLs
  // during the Testing Library teardown, after a per-test stub would be gone.
  const createObjectURL = vi.fn(
    (blob: Blob) => `blob:${(blob as Blob & { type: string }).type || 'data'}`,
  );
  const revokeObjectURL = vi.fn();
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    writable: true,
    value: createObjectURL,
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    writable: true,
    value: revokeObjectURL,
  });

  // jsdom implements none of these and throws "Not implemented" instead.
  installMediaElementStubs();

  return {
    stream,
    getUserMedia,
    enumerateDevices,
    createObjectURL,
    revokeObjectURL,
    recorders: FakeMediaRecorder.instances,
    recorder: () =>
      FakeMediaRecorder.instances[FakeMediaRecorder.instances.length - 1],
  };
}

/**
 * Replaces the playback methods jsdom leaves unimplemented, and makes
 * `currentTime` writable so the components can rewind their media element.
 */
export function installMediaElementStubs() {
  const prototype = window.HTMLMediaElement.prototype;

  Object.defineProperty(prototype, 'play', {
    configurable: true,
    writable: true,
    value: vi.fn(() => Promise.resolve()),
  });
  Object.defineProperty(prototype, 'pause', {
    configurable: true,
    writable: true,
    value: vi.fn(),
  });
  Object.defineProperty(prototype, 'load', {
    configurable: true,
    writable: true,
    value: vi.fn(),
  });
}

/* ------------------------------------------------------------------------- *
 * Web Audio — needed only by useAudioRecorder
 * ------------------------------------------------------------------------- */

/** A node the hook can connect and disconnect. */
function fakeAudioNode() {
  return { connect: vi.fn(), disconnect: vi.fn() };
}

export class FakeAudioWorkletNode {
  static instances: FakeAudioWorkletNode[] = [];

  readonly connect = vi.fn();
  readonly disconnect = vi.fn();
  /**
   * The `MessagePort` is driven by hand: the hook subscribes with
   * `addEventListener`, so the listeners are replayed by `emitSamples`.
   */
  readonly port = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    close: vi.fn(),
    start: vi.fn(),
    postMessage: vi.fn(),
  };

  constructor(
    readonly context: FakeAudioContext,
    readonly processorName: string,
  ) {
    FakeAudioWorkletNode.instances.push(this);
  }

  /** Replays a block of samples, as the AudioWorkletProcessor would. */
  emitSamples(inputs: unknown) {
    this.port.addEventListener.mock.calls
      .filter(([type]) => type === 'message')
      .forEach(([, listener]) => listener({ data: { inputs } }));
  }
}

export class FakeAudioContext {
  static instances: FakeAudioContext[] = [];
  /** Replaceable, to exercise the addModule failure path. */
  static addModule = vi.fn<(moduleURL: string) => Promise<void>>(
    async () => undefined,
  );

  readonly sampleRate: number;
  /** Writable: the hook reads it to compute the elapsed recording time. */
  currentTime = 0;
  readonly destination = fakeAudioNode();
  readonly close = vi.fn();
  readonly suspend = vi.fn();
  readonly resume = vi.fn();
  readonly createMediaStreamSource = vi.fn(() => fakeAudioNode());
  readonly audioWorklet = {
    addModule: (path: string) => FakeAudioContext.addModule(path),
  };

  constructor(options?: { sampleRate?: number }) {
    this.sampleRate = options?.sampleRate ?? 48000;
    FakeAudioContext.instances.push(this);
  }
}

export class FakeWorker {
  static instances: FakeWorker[] = [];

  readonly postMessage = vi.fn();
  readonly terminate = vi.fn();
  onmessage: ((event: { data: unknown }) => void) | null = null;

  constructor(readonly url: string) {
    FakeWorker.instances.push(this);
  }

  /** Answers the last `postMessage`, as the encoder worker would. */
  emit(data: unknown) {
    this.onmessage?.({ data });
  }

  /** The payload of the last message the hook sent, e.g. ['wav', …]. */
  lastMessage() {
    const calls = this.postMessage.mock.calls;
    return calls[calls.length - 1]?.[0];
  }
}

export type WebAudioHarness = {
  /** The context opened by the current recording. */
  context: () => FakeAudioContext;
  /** The worklet node processing the current recording. */
  workletNode: () => FakeAudioWorkletNode;
  /** The encoder worker, created once on mount. */
  worker: () => FakeWorker;
  addModule: typeof FakeAudioContext.addModule;
};

/**
 * Installs the Web Audio doubles. Combine with `installMediaHarness`, which
 * provides `getUserMedia` and the blob URL factory the encoder result needs.
 */
export function installWebAudioHarness(): WebAudioHarness {
  FakeAudioContext.instances = [];
  FakeAudioWorkletNode.instances = [];
  FakeWorker.instances = [];
  FakeAudioContext.addModule = vi.fn(async (): Promise<void> => undefined);

  vi.stubGlobal('AudioContext', FakeAudioContext);
  vi.stubGlobal('AudioWorkletNode', FakeAudioWorkletNode);
  vi.stubGlobal('Worker', FakeWorker);

  const last = <T>(instances: T[]) => instances[instances.length - 1];

  return {
    context: () => last(FakeAudioContext.instances),
    workletNode: () => last(FakeAudioWorkletNode.instances),
    worker: () => last(FakeWorker.instances),
    addModule: FakeAudioContext.addModule,
  };
}
