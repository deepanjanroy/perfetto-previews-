var perfetto = (function () {
	'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var logging = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });
	function assertExists(value) {
	    if (value === null || value === undefined) {
	        throw new Error('Value doesn\'t exist');
	    }
	    return value;
	}
	exports.assertExists = assertExists;
	function assertTrue(value) {
	    if (value !== true) {
	        throw new Error('Failed assertion');
	    }
	    return value;
	}
	exports.assertTrue = assertTrue;

	});

	unwrapExports(logging);
	var logging_1 = logging.assertExists;
	var logging_2 = logging.assertTrue;

	var state = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });
	function createEmptyState() {
	    return {
	        route: null,
	        nextId: 0,
	        engines: {},
	        traceTime: { startSec: 0, endSec: 10, lastUpdate: 0 },
	        visibleTraceTime: { startSec: 0, endSec: 10, lastUpdate: 0 },
	        tracks: {},
	        displayedTrackIds: [],
	        queries: {},
	        permalink: {},
	        status: { msg: '', timestamp: 0 },
	    };
	}
	exports.createEmptyState = createEmptyState;

	});

	unwrapExports(state);
	var state_1 = state.createEmptyState;

	var actions = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });
	function openTraceFromUrl(url) {
	    return {
	        type: 'OPEN_TRACE_FROM_URL',
	        id: new Date().toISOString(),
	        url,
	    };
	}
	exports.openTraceFromUrl = openTraceFromUrl;
	function openTraceFromFile(file) {
	    return {
	        type: 'OPEN_TRACE_FROM_FILE',
	        id: new Date().toISOString(),
	        file,
	    };
	}
	exports.openTraceFromFile = openTraceFromFile;
	// TODO(hjd): Remove CPU and add a generic way to handle track specific state.
	function addTrack(engineId, trackKind, cpu) {
	    return {
	        type: 'ADD_TRACK',
	        engineId,
	        trackKind,
	        cpu,
	    };
	}
	exports.addTrack = addTrack;
	function requestTrackData(trackId, start, end, resolution) {
	    return { type: 'REQ_TRACK_DATA', trackId, start, end, resolution };
	}
	exports.requestTrackData = requestTrackData;
	function clearTrackDataRequest(trackId) {
	    return { type: 'CLEAR_TRACK_DATA_REQ', trackId };
	}
	exports.clearTrackDataRequest = clearTrackDataRequest;
	// TODO: There should be merged with addTrack above.
	function addChromeSliceTrack(engineId, trackKind, upid, utid, threadName, maxDepth) {
	    return {
	        type: 'ADD_CHROME_TRACK',
	        engineId,
	        trackKind,
	        upid,
	        utid,
	        threadName,
	        maxDepth,
	    };
	}
	exports.addChromeSliceTrack = addChromeSliceTrack;
	function executeQuery(engineId, queryId, query) {
	    return {
	        type: 'EXECUTE_QUERY',
	        engineId,
	        queryId,
	        query,
	    };
	}
	exports.executeQuery = executeQuery;
	function deleteQuery(queryId) {
	    return {
	        type: 'DELETE_QUERY',
	        queryId,
	    };
	}
	exports.deleteQuery = deleteQuery;
	function navigate(route) {
	    return {
	        type: 'NAVIGATE',
	        route,
	    };
	}
	exports.navigate = navigate;
	function moveTrack(trackId, direction) {
	    return {
	        type: 'MOVE_TRACK',
	        trackId,
	        direction,
	    };
	}
	exports.moveTrack = moveTrack;
	function setEngineReady(engineId, ready = true) {
	    return { type: 'SET_ENGINE_READY', engineId, ready };
	}
	exports.setEngineReady = setEngineReady;
	function createPermalink() {
	    return { type: 'CREATE_PERMALINK', requestId: new Date().toISOString() };
	}
	exports.createPermalink = createPermalink;
	function setPermalink(requestId, hash) {
	    return { type: 'SET_PERMALINK', requestId, hash };
	}
	exports.setPermalink = setPermalink;
	function loadPermalink(hash) {
	    return { type: 'LOAD_PERMALINK', requestId: new Date().toISOString(), hash };
	}
	exports.loadPermalink = loadPermalink;
	function setState(newState) {
	    return {
	        type: 'SET_STATE',
	        newState,
	    };
	}
	exports.setState = setState;
	function setTraceTime(ts) {
	    return {
	        type: 'SET_TRACE_TIME',
	        startSec: ts.start,
	        endSec: ts.end,
	        lastUpdate: Date.now() / 1000,
	    };
	}
	exports.setTraceTime = setTraceTime;
	function setVisibleTraceTime(ts) {
	    return {
	        type: 'SET_VISIBLE_TRACE_TIME',
	        startSec: ts.start,
	        endSec: ts.end,
	        lastUpdate: Date.now() / 1000,
	    };
	}
	exports.setVisibleTraceTime = setVisibleTraceTime;
	function updateStatus(msg) {
	    return { type: 'UPDATE_STATUS', msg, timestamp: Date.now() / 1000 };
	}
	exports.updateStatus = updateStatus;

	});

	unwrapExports(actions);
	var actions_1 = actions.openTraceFromUrl;
	var actions_2 = actions.openTraceFromFile;
	var actions_3 = actions.addTrack;
	var actions_4 = actions.requestTrackData;
	var actions_5 = actions.clearTrackDataRequest;
	var actions_6 = actions.addChromeSliceTrack;
	var actions_7 = actions.executeQuery;
	var actions_8 = actions.deleteQuery;
	var actions_9 = actions.navigate;
	var actions_10 = actions.moveTrack;
	var actions_11 = actions.setEngineReady;
	var actions_12 = actions.createPermalink;
	var actions_13 = actions.setPermalink;
	var actions_14 = actions.loadPermalink;
	var actions_15 = actions.setState;
	var actions_16 = actions.setTraceTime;
	var actions_17 = actions.setVisibleTraceTime;
	var actions_18 = actions.updateStatus;

	var time = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });

	function timeToString(sec) {
	    const units = ['s', 'ms', 'us', 'ns'];
	    const sign = Math.sign(sec);
	    let n = Math.abs(sec);
	    let u = 0;
	    while (n < 1 && n !== 0 && u < units.length - 1) {
	        n *= 1000;
	        u++;
	    }
	    return `${sign < 0 ? '-' : ''}${Math.round(n * 10) / 10} ${units[u]}`;
	}
	exports.timeToString = timeToString;
	function fromNs(ns) {
	    return ns / 1e9;
	}
	exports.fromNs = fromNs;
	class TimeSpan {
	    constructor(start, end) {
	        logging.assertTrue(start <= end);
	        this.start = start;
	        this.end = end;
	    }
	    get duration() {
	        return this.end - this.start;
	    }
	    add(sec) {
	        return new TimeSpan(this.start + sec, this.end + sec);
	    }
	}
	exports.TimeSpan = TimeSpan;

	});

	unwrapExports(time);
	var time_1 = time.timeToString;
	var time_2 = time.fromNs;
	var time_3 = time.TimeSpan;

	var time_scale = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * Defines a mapping between number and Milliseconds for the entire application.
	 * Linearly scales time values from boundsMs to pixel values in boundsPx and
	 * back.
	 */
	class TimeScale {
	    constructor(timeBounds, boundsPx) {
	        this.secPerPx = 0;
	        this.timeBounds = timeBounds;
	        this.startPx = boundsPx[0];
	        this.endPx = boundsPx[1];
	        this.updateSlope();
	    }
	    updateSlope() {
	        this.secPerPx = this.timeBounds.duration / (this.endPx - this.startPx);
	    }
	    deltaTimeToPx(time) {
	        return Math.round(time / this.secPerPx);
	    }
	    timeToPx(time) {
	        return this.startPx + (time - this.timeBounds.start) / this.secPerPx;
	    }
	    pxToTime(px) {
	        return this.timeBounds.start + (px - this.startPx) * this.secPerPx;
	    }
	    deltaPxToDuration(px) {
	        return px * this.secPerPx;
	    }
	    setTimeBounds(timeBounds) {
	        this.timeBounds = timeBounds;
	        this.updateSlope();
	    }
	    setLimitsPx(pxStart, pxEnd) {
	        this.startPx = pxStart;
	        this.endPx = pxEnd;
	        this.updateSlope();
	    }
	}
	exports.TimeScale = TimeScale;

	});

	unwrapExports(time_scale);
	var time_scale_1 = time_scale.TimeScale;

	var frontend_local_state = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });




	/**
	 * State that is shared between several frontend components, but not the
	 * controller. This state is updated at 60fps.
	 */
	class FrontendLocalState {
	    constructor() {
	        this.visibleWindowTime = new time.TimeSpan(0, 10);
	        this.timeScale = new time_scale.TimeScale(this.visibleWindowTime, [0, 0]);
	        this._visibleTimeLastUpdate = 0;
	    }
	    // TODO: there is some redundancy in the fact that both |visibleWindowTime|
	    // and a |timeScale| have a notion of time range. That should live in one
	    // place only.
	    updateVisibleTime(ts) {
	        const startSec = Math.max(ts.start, globals.globals.state.traceTime.startSec);
	        const endSec = Math.min(ts.end, globals.globals.state.traceTime.endSec);
	        this.visibleWindowTime = new time.TimeSpan(startSec, endSec);
	        this.timeScale.setTimeBounds(this.visibleWindowTime);
	        this._visibleTimeLastUpdate = Date.now() / 1000;
	        // Post a delayed update to the controller.
	        const alreadyPosted = this.pendingGlobalTimeUpdate !== undefined;
	        this.pendingGlobalTimeUpdate = this.visibleWindowTime;
	        if (alreadyPosted)
	            return;
	        setTimeout(() => {
	            globals.globals.dispatch(actions.setVisibleTraceTime(this.pendingGlobalTimeUpdate));
	            this._visibleTimeLastUpdate = Date.now() / 1000;
	            this.pendingGlobalTimeUpdate = undefined;
	        }, 100);
	    }
	    get visibleTimeLastUpdate() {
	        return this._visibleTimeLastUpdate;
	    }
	}
	exports.FrontendLocalState = FrontendLocalState;

	});

	unwrapExports(frontend_local_state);
	var frontend_local_state_1 = frontend_local_state.FrontendLocalState;

	var raf_scheduler = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });
	// This class orchestrates all RAFs in the UI. It ensures that there is only
	// one animation frame handler overall and that callbacks are called in
	// predictable order. There are two types of callbacks here:
	// - actions (e.g. pan/zoon animations), which will alter the "fast"
	//  (main-thread-only) state (e.g. update visible time bounds @ 60 fps).
	// - redraw callbacks that will repaint canvases.
	// This class guarantees that, on each frame, redraw callbacks are called after
	// all action callbacks.
	class RafScheduler {
	    constructor() {
	        this.actionCallbacks = new Set();
	        this.canvasRedrawCallbacks = new Set();
	        this._syncDomRedraw = _ => { };
	        this.hasScheduledNextFrame = false;
	        this.requestedFullRedraw = false;
	        this.isRedrawing = false;
	    }
	    start(cb) {
	        this.actionCallbacks.add(cb);
	        this.maybeScheduleAnimationFrame();
	    }
	    stop(cb) {
	        this.actionCallbacks.delete(cb);
	    }
	    addRedrawCallback(cb) {
	        this.canvasRedrawCallbacks.add(cb);
	    }
	    removeRedrawCallback(cb) {
	        this.canvasRedrawCallbacks.delete(cb);
	    }
	    scheduleRedraw() {
	        this.maybeScheduleAnimationFrame(true);
	    }
	    set domRedraw(cb) {
	        this._syncDomRedraw = cb || (_ => { });
	    }
	    scheduleFullRedraw() {
	        this.requestedFullRedraw = true;
	        this.maybeScheduleAnimationFrame(true);
	    }
	    syncCanvasRedraw(nowMs) {
	        if (this.isRedrawing)
	            return;
	        this.isRedrawing = true;
	        for (const redraw of this.canvasRedrawCallbacks)
	            redraw(nowMs);
	        this.isRedrawing = false;
	    }
	    maybeScheduleAnimationFrame(force = false) {
	        if (this.hasScheduledNextFrame)
	            return;
	        if (this.actionCallbacks.size !== 0 || force) {
	            this.hasScheduledNextFrame = true;
	            window.requestAnimationFrame(this.onAnimationFrame.bind(this));
	        }
	    }
	    onAnimationFrame(nowMs) {
	        this.hasScheduledNextFrame = false;
	        const doFullRedraw = this.requestedFullRedraw;
	        this.requestedFullRedraw = false;
	        for (const action of this.actionCallbacks)
	            action(nowMs);
	        if (doFullRedraw)
	            this._syncDomRedraw(nowMs);
	        this.syncCanvasRedraw(nowMs);
	        this.maybeScheduleAnimationFrame();
	    }
	}
	exports.RafScheduler = RafScheduler;

	});

	unwrapExports(raf_scheduler);
	var raf_scheduler_1 = raf_scheduler.RafScheduler;

	var globals = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });




	/**
	 * Global accessors for state/dispatch in the frontend.
	 */
	class Globals {
	    constructor() {
	        this._dispatch = undefined;
	        this._state = undefined;
	        this._trackDataStore = undefined;
	        this._queryResults = undefined;
	        this._frontendLocalState = undefined;
	        this._rafScheduler = undefined;
	        this._overviewStore = undefined;
	        this._threadMap = undefined;
	    }
	    initialize(dispatch) {
	        this._dispatch = dispatch;
	        this._state = state.createEmptyState();
	        this._trackDataStore = new Map();
	        this._queryResults = new Map();
	        this._frontendLocalState = new frontend_local_state.FrontendLocalState();
	        this._rafScheduler = new raf_scheduler.RafScheduler();
	        this._overviewStore = new Map();
	        this._threadMap = new Map();
	    }
	    get state() {
	        return logging.assertExists(this._state);
	    }
	    set state(state$$1) {
	        this._state = logging.assertExists(state$$1);
	    }
	    get dispatch() {
	        return logging.assertExists(this._dispatch);
	    }
	    get overviewStore() {
	        return logging.assertExists(this._overviewStore);
	    }
	    get trackDataStore() {
	        return logging.assertExists(this._trackDataStore);
	    }
	    get queryResults() {
	        return logging.assertExists(this._queryResults);
	    }
	    get frontendLocalState() {
	        return logging.assertExists(this._frontendLocalState);
	    }
	    get rafScheduler() {
	        return logging.assertExists(this._rafScheduler);
	    }
	    get threads() {
	        return logging.assertExists(this._threadMap);
	    }
	    resetForTesting() {
	        this._dispatch = undefined;
	        this._state = undefined;
	        this._trackDataStore = undefined;
	        this._queryResults = undefined;
	        this._frontendLocalState = undefined;
	        this._rafScheduler = undefined;
	        this._overviewStore = undefined;
	    }
	}
	exports.globals = new Globals();

	});

	unwrapExports(globals);
	var globals_1 = globals.globals;

	var track = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * The abstract class that needs to be implemented by all tracks.
	 */
	class Track {
	    /**
	     * Receive data published by the TrackController of this track.
	     */
	    constructor(trackState) {
	        this.trackState = trackState;
	    }
	    getHeight() {
	        return 40;
	    }
	    onMouseMove(_position) { }
	    onMouseOut() { }
	}
	exports.Track = Track;

	});

	unwrapExports(track);
	var track_1 = track.Track;

	var registry = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });
	class Registry {
	    constructor() {
	        this.registry = new Map();
	    }
	    register(registrant) {
	        const kind = registrant.kind;
	        if (this.registry.has(kind)) {
	            throw new Error(`Registrant ${kind} already exists in the registry`);
	        }
	        this.registry.set(kind, registrant);
	    }
	    has(kind) {
	        return this.registry.has(kind);
	    }
	    get(kind) {
	        const registrant = this.registry.get(kind);
	        if (registrant === undefined) {
	            throw new Error(`${kind} has not been registered.`);
	        }
	        return registrant;
	    }
	    unregisterAllForTesting() {
	        this.registry.clear();
	    }
	}
	exports.Registry = Registry;

	});

	unwrapExports(registry);
	var registry_1 = registry.Registry;

	var track_registry = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });

	/**
	 * Global registry that maps types to TrackCreator.
	 */
	exports.trackRegistry = new registry.Registry();

	});

	unwrapExports(track_registry);
	var track_registry_1 = track_registry.trackRegistry;

	var common = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CPU_COUNTER_TRACK_KIND = 'CpuCounterTrack';

	});

	unwrapExports(common);
	var common_1 = common.CPU_COUNTER_TRACK_KIND;

	var frontend = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });




	/**
	 * Demo track as so we can at least have two kinds of tracks.
	 */
	class CpuCounterTrack extends track.Track {
	    constructor(trackState) {
	        super(trackState);
	    }
	    static create(trackState) {
	        return new CpuCounterTrack(trackState);
	    }
	    // No-op
	    consumeData() { }
	    renderCanvas(ctx) {
	        const { timeScale, visibleWindowTime } = globals.globals.frontendLocalState;
	        // It is possible to get width of track from visibleWindowMs.
	        const visibleStartPx = timeScale.timeToPx(visibleWindowTime.start);
	        const visibleEndPx = timeScale.timeToPx(visibleWindowTime.end);
	        const visibleWidthPx = visibleEndPx - visibleStartPx;
	        ctx.fillStyle = '#eee';
	        ctx.fillRect(Math.round(0.25 * visibleWidthPx), 0, Math.round(0.5 * visibleWidthPx), this.getHeight());
	        ctx.font = '16px Arial';
	        ctx.fillStyle = '#000';
	        ctx.fillText('Drawing ' + CpuCounterTrack.kind, Math.round(0.4 * visibleWidthPx), 20);
	    }
	}
	CpuCounterTrack.kind = common.CPU_COUNTER_TRACK_KIND;
	track_registry.trackRegistry.register(CpuCounterTrack);

	});

	unwrapExports(frontend);

	var common$2 = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CPU_SLICE_TRACK_KIND = 'CpuSliceTrack';

	});

	unwrapExports(common$2);
	var common_1$1 = common$2.CPU_SLICE_TRACK_KIND;

	var frontend$2 = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });






	const MARGIN_TOP = 5;
	const RECT_HEIGHT = 30;
	function cropText(str, charWidth, rectWidth) {
	    const maxTextWidth = rectWidth - 4;
	    let displayText = '';
	    const nameLength = str.length * charWidth;
	    if (nameLength < maxTextWidth) {
	        displayText = str;
	    }
	    else {
	        // -3 for the 3 ellipsis.
	        const displayedChars = Math.floor(maxTextWidth / charWidth) - 3;
	        if (displayedChars > 3) {
	            displayText = str.substring(0, displayedChars) + '...';
	        }
	    }
	    return displayText;
	}
	function getCurResolution() {
	    // Truncate the resolution to the closest power of 10.
	    const resolution = globals.globals.frontendLocalState.timeScale.deltaPxToDuration(1);
	    return Math.pow(10, Math.floor(Math.log10(resolution)));
	}
	class CpuSliceTrack extends track.Track {
	    constructor(trackState) {
	        super(trackState);
	        this.hoveredUtid = -1;
	        this.reqPending = false;
	    }
	    static create(trackState) {
	        return new CpuSliceTrack(trackState);
	    }
	    reqDataDeferred() {
	        const { visibleWindowTime } = globals.globals.frontendLocalState;
	        const reqStart = visibleWindowTime.start - visibleWindowTime.duration;
	        const reqEnd = visibleWindowTime.end + visibleWindowTime.duration;
	        const reqRes = getCurResolution();
	        this.reqPending = false;
	        globals.globals.dispatch(actions.requestTrackData(this.trackState.id, reqStart, reqEnd, reqRes));
	    }
	    renderCanvas(ctx) {
	        // TODO: fonts and colors should come from the CSS and not hardcoded here.
	        const { timeScale, visibleWindowTime } = globals.globals.frontendLocalState;
	        const trackData = this.trackData;
	        // If there aren't enough cached slices data in |trackData| request more to
	        // the controller.
	        const inRange = trackData !== undefined &&
	            (visibleWindowTime.start >= trackData.start &&
	                visibleWindowTime.end <= trackData.end);
	        if (!inRange || trackData.resolution > getCurResolution()) {
	            if (!this.reqPending) {
	                this.reqPending = true;
	                setTimeout(() => this.reqDataDeferred(), 50);
	            }
	            if (trackData === undefined)
	                return; // Can't possibly draw anything.
	        }
	        ctx.textAlign = 'center';
	        ctx.font = '12px Google Sans';
	        const charWidth = ctx.measureText('dbpqaouk').width / 8;
	        // TODO: this needs to be kept in sync with the hue generation algorithm
	        // of overview_timeline_panel.ts
	        const hue = (128 + (32 * this.trackState.cpu)) % 256;
	        // If the cached trace slices don't fully cover the visible time range,
	        // show a gray rectangle with a "Loading..." label.
	        ctx.font = '12px Google Sans';
	        if (trackData.start > visibleWindowTime.start) {
	            const rectWidth = timeScale.timeToPx(Math.min(trackData.start, visibleWindowTime.end));
	            ctx.fillStyle = '#eee';
	            ctx.fillRect(0, MARGIN_TOP, rectWidth, RECT_HEIGHT);
	            ctx.fillStyle = '#666';
	            ctx.fillText('loading...', rectWidth / 2, MARGIN_TOP + RECT_HEIGHT / 2, rectWidth);
	        }
	        if (trackData.end < visibleWindowTime.end) {
	            const rectX = timeScale.timeToPx(Math.max(trackData.end, visibleWindowTime.start));
	            const rectWidth = timeScale.timeToPx(visibleWindowTime.end) - rectX;
	            ctx.fillStyle = '#eee';
	            ctx.fillRect(rectX, MARGIN_TOP, rectWidth, RECT_HEIGHT);
	            ctx.fillStyle = '#666';
	            ctx.fillText('loading...', rectX + rectWidth / 2, MARGIN_TOP + RECT_HEIGHT / 2, rectWidth);
	        }
	        logging.assertTrue(trackData.starts.length === trackData.ends.length);
	        logging.assertTrue(trackData.starts.length === trackData.utids.length);
	        for (let i = 0; i < trackData.starts.length; i++) {
	            const tStart = trackData.starts[i];
	            const tEnd = trackData.ends[i];
	            const utid = trackData.utids[i];
	            if (tEnd <= visibleWindowTime.start || tStart >= visibleWindowTime.end) {
	                continue;
	            }
	            const rectStart = timeScale.timeToPx(tStart);
	            const rectEnd = timeScale.timeToPx(tEnd);
	            const rectWidth = rectEnd - rectStart;
	            if (rectWidth < 0.1)
	                continue;
	            const hovered = this.hoveredUtid === utid;
	            ctx.fillStyle = `hsl(${hue}, 50%, ${hovered ? 25 : 60}%`;
	            ctx.fillRect(rectStart, MARGIN_TOP, rectEnd - rectStart, RECT_HEIGHT);
	            // TODO: consider de-duplicating this code with the copied one from
	            // chrome_slices/frontend.ts.
	            let title = `[utid:${utid}]`;
	            let subTitle = '';
	            const threadInfo = globals.globals.threads.get(utid);
	            if (threadInfo !== undefined) {
	                title = `${threadInfo.procName} [${threadInfo.pid}]`;
	                subTitle = `${threadInfo.threadName} [${threadInfo.tid}]`;
	            }
	            title = cropText(title, charWidth, rectWidth);
	            subTitle = cropText(subTitle, charWidth, rectWidth);
	            ctx.fillStyle = '#fff';
	            ctx.font = '12px Google Sans';
	            // ctx.fillText(title, rectXCenter, MARGIN_TOP + RECT_HEIGHT / 2 - 3);
	            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
	            ctx.font = '10px Google Sans';
	        }
	        const hoveredThread = globals.globals.threads.get(this.hoveredUtid);
	        if (hoveredThread !== undefined) {
	            const procTitle = `P: ${hoveredThread.procName} [${hoveredThread.pid}]`;
	            const threadTitle = `T: ${hoveredThread.threadName} [${hoveredThread.tid}]`;
	            ctx.font = '10px Google Sans';
	            const procTitleWidth = ctx.measureText(procTitle).width;
	            const threadTitleWidth = ctx.measureText(threadTitle).width;
	            const width = Math.max(procTitleWidth, threadTitleWidth);
	            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
	            ctx.fillRect(this.mouseXpos, MARGIN_TOP, width + 16, RECT_HEIGHT);
	            ctx.fillStyle = 'hsl(200, 50%, 40%)';
	            ctx.textAlign = 'left';
	            ctx.fillText(procTitle, this.mouseXpos + 8, 18);
	            ctx.fillText(threadTitle, this.mouseXpos + 8, 28);
	        }
	    }
	    onMouseMove({ x, y }) {
	        const trackData = this.trackData;
	        this.mouseXpos = x;
	        if (trackData === undefined)
	            return;
	        const { timeScale } = globals.globals.frontendLocalState;
	        if (y < MARGIN_TOP || y > MARGIN_TOP + RECT_HEIGHT) {
	            this.hoveredUtid = -1;
	            return;
	        }
	        const t = timeScale.pxToTime(x);
	        this.hoveredUtid = -1;
	        for (let i = 0; i < trackData.starts.length; i++) {
	            const tStart = trackData.starts[i];
	            const tEnd = trackData.ends[i];
	            const utid = trackData.utids[i];
	            if (tStart <= t && t <= tEnd) {
	                this.hoveredUtid = utid;
	                break;
	            }
	        }
	    }
	    onMouseOut() {
	        this.hoveredUtid = -1;
	        this.mouseXpos = 0;
	    }
	    get trackData() {
	        return globals.globals.trackDataStore.get(this.trackState.id);
	    }
	}
	CpuSliceTrack.kind = common$2.CPU_SLICE_TRACK_KIND;
	track_registry.trackRegistry.register(CpuSliceTrack);

	});

	unwrapExports(frontend$2);

	var common$4 = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SLICE_TRACK_KIND = 'ChromeSliceTrack';

	});

	unwrapExports(common$4);
	var common_1$2 = common$4.SLICE_TRACK_KIND;

	var frontend$4 = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });





	const SLICE_HEIGHT = 30;
	const TRACK_PADDING = 5;
	function hash(s) {
	    let hash = 0x811c9dc5 & 0xfffffff;
	    for (let i = 0; i < s.length; i++) {
	        hash ^= s.charCodeAt(i);
	        hash = (hash * 16777619) & 0xffffffff;
	    }
	    return hash & 0xff;
	}
	function getCurResolution() {
	    // Truncate the resolution to the closest power of 10.
	    const resolution = globals.globals.frontendLocalState.timeScale.deltaPxToDuration(1);
	    return Math.pow(10, Math.floor(Math.log10(resolution)));
	}
	class ChromeSliceTrack extends track.Track {
	    constructor(trackState) {
	        super(trackState);
	        this.hoveredTitleId = -1;
	        this.reqPending = false;
	    }
	    static create(trackState) {
	        return new ChromeSliceTrack(trackState);
	    }
	    reqDataDeferred() {
	        const { visibleWindowTime } = globals.globals.frontendLocalState;
	        const reqStart = visibleWindowTime.start - visibleWindowTime.duration;
	        const reqEnd = visibleWindowTime.end + visibleWindowTime.duration;
	        const reqRes = getCurResolution();
	        this.reqPending = false;
	        globals.globals.dispatch(actions.requestTrackData(this.trackState.id, reqStart, reqEnd, reqRes));
	    }
	    renderCanvas(ctx) {
	        // TODO: fonts and colors should come from the CSS and not hardcoded here.
	        const { timeScale, visibleWindowTime } = globals.globals.frontendLocalState;
	        const trackData = this.trackData;
	        // If there aren't enough cached slices data in |trackData| request more to
	        // the controller.
	        const inRange = trackData !== undefined &&
	            (visibleWindowTime.start >= trackData.start &&
	                visibleWindowTime.end <= trackData.end);
	        if (!inRange || trackData.resolution > getCurResolution()) {
	            if (!this.reqPending) {
	                this.reqPending = true;
	                setTimeout(() => this.reqDataDeferred(), 50);
	            }
	            if (trackData === undefined)
	                return; // Can't possibly draw anything.
	        }
	        // If the cached trace slices don't fully cover the visible time range,
	        // show a gray rectangle with a "Loading..." label.
	        ctx.font = '12px Google Sans';
	        if (trackData.start > visibleWindowTime.start) {
	            const rectWidth = timeScale.timeToPx(Math.min(trackData.start, visibleWindowTime.end));
	            ctx.fillStyle = '#eee';
	            ctx.fillRect(0, TRACK_PADDING, rectWidth, SLICE_HEIGHT);
	            ctx.fillStyle = '#666';
	            ctx.fillText('loading...', rectWidth / 2, TRACK_PADDING + SLICE_HEIGHT / 2, rectWidth);
	        }
	        if (trackData.end < visibleWindowTime.end) {
	            const rectX = timeScale.timeToPx(Math.max(trackData.end, visibleWindowTime.start));
	            const rectWidth = timeScale.timeToPx(visibleWindowTime.end) - rectX;
	            ctx.fillStyle = '#eee';
	            ctx.fillRect(rectX, TRACK_PADDING, rectWidth, SLICE_HEIGHT);
	            ctx.fillStyle = '#666';
	            ctx.fillText('loading...', rectX + rectWidth / 2, TRACK_PADDING + SLICE_HEIGHT / 2, rectWidth);
	        }
	        ctx.font = '12px Google Sans';
	        ctx.textAlign = 'center';
	        // measuretext is expensive so we only use it once.
	        const charWidth = ctx.measureText('abcdefghij').width / 10;
	        const pxEnd = timeScale.timeToPx(visibleWindowTime.end);
	        for (let i = 0; i < trackData.starts.length; i++) {
	            const tStart = trackData.starts[i];
	            const tEnd = trackData.ends[i];
	            const depth = trackData.depths[i];
	            const cat = trackData.strings[trackData.categories[i]];
	            const titleId = trackData.titles[i];
	            const title = trackData.strings[titleId];
	            if (tEnd <= visibleWindowTime.start || tStart >= visibleWindowTime.end) {
	                continue;
	            }
	            const rectXStart = Math.max(timeScale.timeToPx(tStart), 0);
	            const rectXEnd = Math.min(timeScale.timeToPx(tEnd), pxEnd);
	            const rectWidth = rectXEnd - rectXStart;
	            if (rectWidth < 0.1)
	                continue;
	            const rectYStart = TRACK_PADDING + depth * SLICE_HEIGHT;
	            const hovered = titleId === this.hoveredTitleId;
	            const hue = hash(cat);
	            const saturation = Math.min(20 + depth * 10, 70);
	            ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${hovered ? 30 : 65}%)`;
	            ctx.fillRect(rectXStart, rectYStart, rectWidth, SLICE_HEIGHT);
	            const nameLength = title.length * charWidth;
	            ctx.fillStyle = 'white';
	            const maxTextWidth = rectWidth - 15;
	            let displayText = '';
	            if (nameLength < maxTextWidth) {
	                displayText = title;
	            }
	            else {
	                // -3 for the 3 ellipsis.
	                const displayedChars = Math.floor(maxTextWidth / charWidth) - 3;
	                if (displayedChars > 3) {
	                    displayText = title.substring(0, displayedChars) + '...';
	                }
	            }
	            const rectXCenter = rectXStart + rectWidth / 2;
	            ctx.fillText(displayText, rectXCenter, rectYStart + SLICE_HEIGHT / 2);
	        }
	    }
	    onMouseMove({ x, y }) {
	        const trackData = this.trackData;
	        this.hoveredTitleId = -1;
	        if (trackData === undefined)
	            return;
	        const { timeScale } = globals.globals.frontendLocalState;
	        if (y < TRACK_PADDING)
	            return;
	        const t = timeScale.pxToTime(x);
	        const depth = Math.floor(y / SLICE_HEIGHT);
	        for (let i = 0; i < trackData.starts.length; i++) {
	            const tStart = trackData.starts[i];
	            const tEnd = trackData.ends[i];
	            const titleId = trackData.titles[i];
	            if (tStart <= t && t <= tEnd && depth === trackData.depths[i]) {
	                this.hoveredTitleId = titleId;
	                break;
	            }
	        }
	    }
	    onMouseOut() {
	        this.hoveredTitleId = -1;
	    }
	    getHeight() {
	        return SLICE_HEIGHT * (this.trackState.maxDepth + 1) + 2 * TRACK_PADDING;
	    }
	    get trackData() {
	        return globals.globals.trackDataStore.get(this.trackState.id);
	    }
	}
	ChromeSliceTrack.kind = common$4.SLICE_TRACK_KIND;
	track_registry.trackRegistry.register(ChromeSliceTrack);

	});

	unwrapExports(frontend$4);

	var all_frontend = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });
	// Import all currently implemented tracks. After implemeting a new track, an
	// import statement for it needs to be added here.




	});

	unwrapExports(all_frontend);

	var mithril = createCommonjsModule(function (module) {
	(function() {
	function Vnode(tag, key, attrs0, children, text, dom) {
		return {tag: tag, key: key, attrs: attrs0, children: children, text: text, dom: dom, domSize: undefined, state: undefined, _state: undefined, events: undefined, instance: undefined, skip: false}
	}
	Vnode.normalize = function(node) {
		if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined)
		if (node != null && typeof node !== "object") return Vnode("#", undefined, undefined, node === false ? "" : node, undefined, undefined)
		return node
	};
	Vnode.normalizeChildren = function normalizeChildren(children) {
		for (var i = 0; i < children.length; i++) {
			children[i] = Vnode.normalize(children[i]);
		}
		return children
	};
	var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g;
	var selectorCache = {};
	var hasOwn = {}.hasOwnProperty;
	function isEmpty(object) {
		for (var key in object) if (hasOwn.call(object, key)) return false
		return true
	}
	function compileSelector(selector) {
		var match, tag = "div", classes = [], attrs = {};
		while (match = selectorParser.exec(selector)) {
			var type = match[1], value = match[2];
			if (type === "" && value !== "") tag = value;
			else if (type === "#") attrs.id = value;
			else if (type === ".") classes.push(value);
			else if (match[3][0] === "[") {
				var attrValue = match[6];
				if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\");
				if (match[4] === "class") classes.push(attrValue);
				else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true;
			}
		}
		if (classes.length > 0) attrs.className = classes.join(" ");
		return selectorCache[selector] = {tag: tag, attrs: attrs}
	}
	function execSelector(state, attrs, children) {
		var hasAttrs = false, childList, text;
		var className = attrs.className || attrs.class;
		if (!isEmpty(state.attrs) && !isEmpty(attrs)) {
			var newAttrs = {};
			for(var key in attrs) {
				if (hasOwn.call(attrs, key)) {
					newAttrs[key] = attrs[key];
				}
			}
			attrs = newAttrs;
		}
		for (var key in state.attrs) {
			if (hasOwn.call(state.attrs, key)) {
				attrs[key] = state.attrs[key];
			}
		}
		if (className !== undefined) {
			if (attrs.class !== undefined) {
				attrs.class = undefined;
				attrs.className = className;
			}
			if (state.attrs.className != null) {
				attrs.className = state.attrs.className + " " + className;
			}
		}
		for (var key in attrs) {
			if (hasOwn.call(attrs, key) && key !== "key") {
				hasAttrs = true;
				break
			}
		}
		if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
			text = children[0].children;
		} else {
			childList = children;
		}
		return Vnode(state.tag, attrs.key, hasAttrs ? attrs : undefined, childList, text)
	}
	function hyperscript(selector) {
		// Because sloppy mode sucks
		var attrs = arguments[1], start = 2, children;
		if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
			throw Error("The selector must be either a string or a component.");
		}
		if (typeof selector === "string") {
			var cached = selectorCache[selector] || compileSelector(selector);
		}
		if (attrs == null) {
			attrs = {};
		} else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
			attrs = {};
			start = 1;
		}
		if (arguments.length === start + 1) {
			children = arguments[start];
			if (!Array.isArray(children)) children = [children];
		} else {
			children = [];
			while (start < arguments.length) children.push(arguments[start++]);
		}
		var normalized = Vnode.normalizeChildren(children);
		if (typeof selector === "string") {
			return execSelector(cached, attrs, normalized)
		} else {
			return Vnode(selector, attrs.key, attrs, normalized)
		}
	}
	hyperscript.trust = function(html) {
		if (html == null) html = "";
		return Vnode("<", undefined, undefined, html, undefined, undefined)
	};
	hyperscript.fragment = function(attrs1, children) {
		return Vnode("[", attrs1.key, attrs1, Vnode.normalizeChildren(children), undefined, undefined)
	};
	var m = hyperscript;
	/** @constructor */
	var PromisePolyfill = function(executor) {
		if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
		if (typeof executor !== "function") throw new TypeError("executor must be a function")
		var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false);
		var instance = self._instance = {resolvers: resolvers, rejectors: rejectors};
		var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout;
		function handler(list, shouldAbsorb) {
			return function execute(value) {
				var then;
				try {
					if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
						if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
						executeOnce(then.bind(value));
					}
					else {
						callAsync(function() {
							if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value);
							for (var i = 0; i < list.length; i++) list[i](value);
							resolvers.length = 0, rejectors.length = 0;
							instance.state = shouldAbsorb;
							instance.retry = function() {execute(value);};
						});
					}
				}
				catch (e) {
					rejectCurrent(e);
				}
			}
		}
		function executeOnce(then) {
			var runs = 0;
			function run(fn) {
				return function(value) {
					if (runs++ > 0) return
					fn(value);
				}
			}
			var onerror = run(rejectCurrent);
			try {then(run(resolveCurrent), onerror);} catch (e) {onerror(e);}
		}
		executeOnce(executor);
	};
	PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
		var self = this, instance = self._instance;
		function handle(callback, list, next, state) {
			list.push(function(value) {
				if (typeof callback !== "function") next(value);
				else try {resolveNext(callback(value));} catch (e) {if (rejectNext) rejectNext(e);}
			});
			if (typeof instance.retry === "function" && state === instance.state) instance.retry();
		}
		var resolveNext, rejectNext;
		var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject;});
		handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false);
		return promise
	};
	PromisePolyfill.prototype.catch = function(onRejection) {
		return this.then(null, onRejection)
	};
	PromisePolyfill.resolve = function(value) {
		if (value instanceof PromisePolyfill) return value
		return new PromisePolyfill(function(resolve) {resolve(value);})
	};
	PromisePolyfill.reject = function(value) {
		return new PromisePolyfill(function(resolve, reject) {reject(value);})
	};
	PromisePolyfill.all = function(list) {
		return new PromisePolyfill(function(resolve, reject) {
			var total = list.length, count = 0, values = [];
			if (list.length === 0) resolve([]);
			else for (var i = 0; i < list.length; i++) {
				(function(i) {
					function consume(value) {
						count++;
						values[i] = value;
						if (count === total) resolve(values);
					}
					if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
						list[i].then(consume, reject);
					}
					else consume(list[i]);
				})(i);
			}
		})
	};
	PromisePolyfill.race = function(list) {
		return new PromisePolyfill(function(resolve, reject) {
			for (var i = 0; i < list.length; i++) {
				list[i].then(resolve, reject);
			}
		})
	};
	if (typeof window !== "undefined") {
		if (typeof window.Promise === "undefined") window.Promise = PromisePolyfill;
		var PromisePolyfill = window.Promise;
	} else if (typeof commonjsGlobal !== "undefined") {
		if (typeof commonjsGlobal.Promise === "undefined") commonjsGlobal.Promise = PromisePolyfill;
		var PromisePolyfill = commonjsGlobal.Promise;
	}
	var buildQueryString = function(object) {
		if (Object.prototype.toString.call(object) !== "[object Object]") return ""
		var args = [];
		for (var key0 in object) {
			destructure(key0, object[key0]);
		}
		return args.join("&")
		function destructure(key0, value) {
			if (Array.isArray(value)) {
				for (var i = 0; i < value.length; i++) {
					destructure(key0 + "[" + i + "]", value[i]);
				}
			}
			else if (Object.prototype.toString.call(value) === "[object Object]") {
				for (var i in value) {
					destructure(key0 + "[" + i + "]", value[i]);
				}
			}
			else args.push(encodeURIComponent(key0) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""));
		}
	};
	var FILE_PROTOCOL_REGEX = new RegExp("^file://", "i");
	var _8 = function($window, Promise) {
		var callbackCount = 0;
		var oncompletion;
		function setCompletionCallback(callback) {oncompletion = callback;}
		function finalizer() {
			var count = 0;
			function complete() {if (--count === 0 && typeof oncompletion === "function") oncompletion();}
			return function finalize(promise0) {
				var then0 = promise0.then;
				promise0.then = function() {
					count++;
					var next = then0.apply(promise0, arguments);
					next.then(complete, function(e) {
						complete();
						if (count === 0) throw e
					});
					return finalize(next)
				};
				return promise0
			}
		}
		function normalize(args, extra) {
			if (typeof args === "string") {
				var url = args;
				args = extra || {};
				if (args.url == null) args.url = url;
			}
			return args
		}
		function request(args, extra) {
			var finalize = finalizer();
			args = normalize(args, extra);
			var promise0 = new Promise(function(resolve, reject) {
				if (args.method == null) args.method = "GET";
				args.method = args.method.toUpperCase();
				var useBody = (args.method === "GET" || args.method === "TRACE") ? false : (typeof args.useBody === "boolean" ? args.useBody : true);
				if (typeof args.serialize !== "function") args.serialize = typeof FormData !== "undefined" && args.data instanceof FormData ? function(value) {return value} : JSON.stringify;
				if (typeof args.deserialize !== "function") args.deserialize = deserialize;
				if (typeof args.extract !== "function") args.extract = extract;
				args.url = interpolate(args.url, args.data);
				if (useBody) args.data = args.serialize(args.data);
				else args.url = assemble(args.url, args.data);
				var xhr = new $window.XMLHttpRequest(),
					aborted = false,
					_abort = xhr.abort;
				xhr.abort = function abort() {
					aborted = true;
					_abort.call(xhr);
				};
				xhr.open(args.method, args.url, typeof args.async === "boolean" ? args.async : true, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined);
				if (args.serialize === JSON.stringify && useBody && !(args.headers && args.headers.hasOwnProperty("Content-Type"))) {
					xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
				}
				if (args.deserialize === deserialize && !(args.headers && args.headers.hasOwnProperty("Accept"))) {
					xhr.setRequestHeader("Accept", "application/json, text/*");
				}
				if (args.withCredentials) xhr.withCredentials = args.withCredentials;
				for (var key in args.headers) if ({}.hasOwnProperty.call(args.headers, key)) {
					xhr.setRequestHeader(key, args.headers[key]);
				}
				if (typeof args.config === "function") xhr = args.config(xhr, args) || xhr;
				xhr.onreadystatechange = function() {
					// Don't throw errors on xhr.abort().
					if(aborted) return
					if (xhr.readyState === 4) {
						try {
							var response = (args.extract !== extract) ? args.extract(xhr, args) : args.deserialize(args.extract(xhr, args));
							if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || FILE_PROTOCOL_REGEX.test(args.url)) {
								resolve(cast(args.type, response));
							}
							else {
								var error = new Error(xhr.responseText);
								for (var key in response) error[key] = response[key];
								reject(error);
							}
						}
						catch (e) {
							reject(e);
						}
					}
				};
				if (useBody && (args.data != null)) xhr.send(args.data);
				else xhr.send();
			});
			return args.background === true ? promise0 : finalize(promise0)
		}
		function jsonp(args, extra) {
			var finalize = finalizer();
			args = normalize(args, extra);
			var promise0 = new Promise(function(resolve, reject) {
				var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++;
				var script = $window.document.createElement("script");
				$window[callbackName] = function(data) {
					script.parentNode.removeChild(script);
					resolve(cast(args.type, data));
					delete $window[callbackName];
				};
				script.onerror = function() {
					script.parentNode.removeChild(script);
					reject(new Error("JSONP request failed"));
					delete $window[callbackName];
				};
				if (args.data == null) args.data = {};
				args.url = interpolate(args.url, args.data);
				args.data[args.callbackKey || "callback"] = callbackName;
				script.src = assemble(args.url, args.data);
				$window.document.documentElement.appendChild(script);
			});
			return args.background === true? promise0 : finalize(promise0)
		}
		function interpolate(url, data) {
			if (data == null) return url
			var tokens = url.match(/:[^\/]+/gi) || [];
			for (var i = 0; i < tokens.length; i++) {
				var key = tokens[i].slice(1);
				if (data[key] != null) {
					url = url.replace(tokens[i], data[key]);
				}
			}
			return url
		}
		function assemble(url, data) {
			var querystring = buildQueryString(data);
			if (querystring !== "") {
				var prefix = url.indexOf("?") < 0 ? "?" : "&";
				url += prefix + querystring;
			}
			return url
		}
		function deserialize(data) {
			try {return data !== "" ? JSON.parse(data) : null}
			catch (e) {throw new Error(data)}
		}
		function extract(xhr) {return xhr.responseText}
		function cast(type0, data) {
			if (typeof type0 === "function") {
				if (Array.isArray(data)) {
					for (var i = 0; i < data.length; i++) {
						data[i] = new type0(data[i]);
					}
				}
				else return new type0(data)
			}
			return data
		}
		return {request: request, jsonp: jsonp, setCompletionCallback: setCompletionCallback}
	};
	var requestService = _8(window, PromisePolyfill);
	var coreRenderer = function($window) {
		var $doc = $window.document;
		var $emptyFragment = $doc.createDocumentFragment();
		var nameSpace = {
			svg: "http://www.w3.org/2000/svg",
			math: "http://www.w3.org/1998/Math/MathML"
		};
		var onevent;
		function setEventCallback(callback) {return onevent = callback}
		function getNameSpace(vnode) {
			return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag]
		}
		//create
		function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
			for (var i = start; i < end; i++) {
				var vnode = vnodes[i];
				if (vnode != null) {
					createNode(parent, vnode, hooks, ns, nextSibling);
				}
			}
		}
		function createNode(parent, vnode, hooks, ns, nextSibling) {
			var tag = vnode.tag;
			if (typeof tag === "string") {
				vnode.state = {};
				if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks);
				switch (tag) {
					case "#": return createText(parent, vnode, nextSibling)
					case "<": return createHTML(parent, vnode, nextSibling)
					case "[": return createFragment(parent, vnode, hooks, ns, nextSibling)
					default: return createElement(parent, vnode, hooks, ns, nextSibling)
				}
			}
			else return createComponent(parent, vnode, hooks, ns, nextSibling)
		}
		function createText(parent, vnode, nextSibling) {
			vnode.dom = $doc.createTextNode(vnode.children);
			insertNode(parent, vnode.dom, nextSibling);
			return vnode.dom
		}
		function createHTML(parent, vnode, nextSibling) {
			var match1 = vnode.children.match(/^\s*?<(\w+)/im) || [];
			var parent1 = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}[match1[1]] || "div";
			var temp = $doc.createElement(parent1);
			temp.innerHTML = vnode.children;
			vnode.dom = temp.firstChild;
			vnode.domSize = temp.childNodes.length;
			var fragment = $doc.createDocumentFragment();
			var child;
			while (child = temp.firstChild) {
				fragment.appendChild(child);
			}
			insertNode(parent, fragment, nextSibling);
			return fragment
		}
		function createFragment(parent, vnode, hooks, ns, nextSibling) {
			var fragment = $doc.createDocumentFragment();
			if (vnode.children != null) {
				var children = vnode.children;
				createNodes(fragment, children, 0, children.length, hooks, null, ns);
			}
			vnode.dom = fragment.firstChild;
			vnode.domSize = fragment.childNodes.length;
			insertNode(parent, fragment, nextSibling);
			return fragment
		}
		function createElement(parent, vnode, hooks, ns, nextSibling) {
			var tag = vnode.tag;
			var attrs2 = vnode.attrs;
			var is = attrs2 && attrs2.is;
			ns = getNameSpace(vnode) || ns;
			var element = ns ?
				is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
				is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag);
			vnode.dom = element;
			if (attrs2 != null) {
				setAttrs(vnode, attrs2, ns);
			}
			insertNode(parent, element, nextSibling);
			if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
				setContentEditable(vnode);
			}
			else {
				if (vnode.text != null) {
					if (vnode.text !== "") element.textContent = vnode.text;
					else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)];
				}
				if (vnode.children != null) {
					var children = vnode.children;
					createNodes(element, children, 0, children.length, hooks, null, ns);
					setLateAttrs(vnode);
				}
			}
			return element
		}
		function initComponent(vnode, hooks) {
			var sentinel;
			if (typeof vnode.tag.view === "function") {
				vnode.state = Object.create(vnode.tag);
				sentinel = vnode.state.view;
				if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
				sentinel.$$reentrantLock$$ = true;
			} else {
				vnode.state = void 0;
				sentinel = vnode.tag;
				if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
				sentinel.$$reentrantLock$$ = true;
				vnode.state = (vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function") ? new vnode.tag(vnode) : vnode.tag(vnode);
			}
			vnode._state = vnode.state;
			if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks);
			initLifecycle(vnode._state, vnode, hooks);
			vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode));
			if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
			sentinel.$$reentrantLock$$ = null;
		}
		function createComponent(parent, vnode, hooks, ns, nextSibling) {
			initComponent(vnode, hooks);
			if (vnode.instance != null) {
				var element = createNode(parent, vnode.instance, hooks, ns, nextSibling);
				vnode.dom = vnode.instance.dom;
				vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0;
				insertNode(parent, element, nextSibling);
				return element
			}
			else {
				vnode.domSize = 0;
				return $emptyFragment
			}
		}
		//update
		function updateNodes(parent, old, vnodes, recycling, hooks, nextSibling, ns) {
			if (old === vnodes || old == null && vnodes == null) return
			else if (old == null) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns);
			else if (vnodes == null) removeNodes(old, 0, old.length, vnodes);
			else {
				if (old.length === vnodes.length) {
					var isUnkeyed = false;
					for (var i = 0; i < vnodes.length; i++) {
						if (vnodes[i] != null && old[i] != null) {
							isUnkeyed = vnodes[i].key == null && old[i].key == null;
							break
						}
					}
					if (isUnkeyed) {
						for (var i = 0; i < old.length; i++) {
							if (old[i] === vnodes[i]) continue
							else if (old[i] == null && vnodes[i] != null) createNode(parent, vnodes[i], hooks, ns, getNextSibling(old, i + 1, nextSibling));
							else if (vnodes[i] == null) removeNodes(old, i, i + 1, vnodes);
							else updateNode(parent, old[i], vnodes[i], hooks, getNextSibling(old, i + 1, nextSibling), recycling, ns);
						}
						return
					}
				}
				recycling = recycling || isRecyclable(old, vnodes);
				if (recycling) {
					var pool = old.pool;
					old = old.concat(old.pool);
				}
				var oldStart = 0, start = 0, oldEnd = old.length - 1, end = vnodes.length - 1, map;
				while (oldEnd >= oldStart && end >= start) {
					var o = old[oldStart], v = vnodes[start];
					if (o === v && !recycling) oldStart++, start++;
					else if (o == null) oldStart++;
					else if (v == null) start++;
					else if (o.key === v.key) {
						var shouldRecycle = (pool != null && oldStart >= old.length - pool.length) || ((pool == null) && recycling);
						oldStart++, start++;
						updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), shouldRecycle, ns);
						if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling);
					}
					else {
						var o = old[oldEnd];
						if (o === v && !recycling) oldEnd--, start++;
						else if (o == null) oldEnd--;
						else if (v == null) start++;
						else if (o.key === v.key) {
							var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling);
							updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns);
							if (recycling || start < end) insertNode(parent, toFragment(o), getNextSibling(old, oldStart, nextSibling));
							oldEnd--, start++;
						}
						else break
					}
				}
				while (oldEnd >= oldStart && end >= start) {
					var o = old[oldEnd], v = vnodes[end];
					if (o === v && !recycling) oldEnd--, end--;
					else if (o == null) oldEnd--;
					else if (v == null) end--;
					else if (o.key === v.key) {
						var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling);
						updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns);
						if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling);
						if (o.dom != null) nextSibling = o.dom;
						oldEnd--, end--;
					}
					else {
						if (!map) map = getKeyMap(old, oldEnd);
						if (v != null) {
							var oldIndex = map[v.key];
							if (oldIndex != null) {
								var movable = old[oldIndex];
								var shouldRecycle = (pool != null && oldIndex >= old.length - pool.length) || ((pool == null) && recycling);
								updateNode(parent, movable, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), recycling, ns);
								insertNode(parent, toFragment(movable), nextSibling);
								old[oldIndex].skip = true;
								if (movable.dom != null) nextSibling = movable.dom;
							}
							else {
								var dom = createNode(parent, v, hooks, ns, nextSibling);
								nextSibling = dom;
							}
						}
						end--;
					}
					if (end < start) break
				}
				createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns);
				removeNodes(old, oldStart, oldEnd + 1, vnodes);
			}
		}
		function updateNode(parent, old, vnode, hooks, nextSibling, recycling, ns) {
			var oldTag = old.tag, tag = vnode.tag;
			if (oldTag === tag) {
				vnode.state = old.state;
				vnode._state = old._state;
				vnode.events = old.events;
				if (!recycling && shouldNotUpdate(vnode, old)) return
				if (typeof oldTag === "string") {
					if (vnode.attrs != null) {
						if (recycling) {
							vnode.state = {};
							initLifecycle(vnode.attrs, vnode, hooks);
						}
						else updateLifecycle(vnode.attrs, vnode, hooks);
					}
					switch (oldTag) {
						case "#": updateText(old, vnode); break
						case "<": updateHTML(parent, old, vnode, nextSibling); break
						case "[": updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns); break
						default: updateElement(old, vnode, recycling, hooks, ns);
					}
				}
				else updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns);
			}
			else {
				removeNode(old, null);
				createNode(parent, vnode, hooks, ns, nextSibling);
			}
		}
		function updateText(old, vnode) {
			if (old.children.toString() !== vnode.children.toString()) {
				old.dom.nodeValue = vnode.children;
			}
			vnode.dom = old.dom;
		}
		function updateHTML(parent, old, vnode, nextSibling) {
			if (old.children !== vnode.children) {
				toFragment(old);
				createHTML(parent, vnode, nextSibling);
			}
			else vnode.dom = old.dom, vnode.domSize = old.domSize;
		}
		function updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns) {
			updateNodes(parent, old.children, vnode.children, recycling, hooks, nextSibling, ns);
			var domSize = 0, children = vnode.children;
			vnode.dom = null;
			if (children != null) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i];
					if (child != null && child.dom != null) {
						if (vnode.dom == null) vnode.dom = child.dom;
						domSize += child.domSize || 1;
					}
				}
				if (domSize !== 1) vnode.domSize = domSize;
			}
		}
		function updateElement(old, vnode, recycling, hooks, ns) {
			var element = vnode.dom = old.dom;
			ns = getNameSpace(vnode) || ns;
			if (vnode.tag === "textarea") {
				if (vnode.attrs == null) vnode.attrs = {};
				if (vnode.text != null) {
					vnode.attrs.value = vnode.text; //FIXME handle0 multiple children
					vnode.text = undefined;
				}
			}
			updateAttrs(vnode, old.attrs, vnode.attrs, ns);
			if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
				setContentEditable(vnode);
			}
			else if (old.text != null && vnode.text != null && vnode.text !== "") {
				if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text;
			}
			else {
				if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)];
				if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)];
				updateNodes(element, old.children, vnode.children, recycling, hooks, null, ns);
			}
		}
		function updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns) {
			if (recycling) {
				initComponent(vnode, hooks);
			} else {
				vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode));
				if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
				if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks);
				updateLifecycle(vnode._state, vnode, hooks);
			}
			if (vnode.instance != null) {
				if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling);
				else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, recycling, ns);
				vnode.dom = vnode.instance.dom;
				vnode.domSize = vnode.instance.domSize;
			}
			else if (old.instance != null) {
				removeNode(old.instance, null);
				vnode.dom = undefined;
				vnode.domSize = 0;
			}
			else {
				vnode.dom = old.dom;
				vnode.domSize = old.domSize;
			}
		}
		function isRecyclable(old, vnodes) {
			if (old.pool != null && Math.abs(old.pool.length - vnodes.length) <= Math.abs(old.length - vnodes.length)) {
				var oldChildrenLength = old[0] && old[0].children && old[0].children.length || 0;
				var poolChildrenLength = old.pool[0] && old.pool[0].children && old.pool[0].children.length || 0;
				var vnodesChildrenLength = vnodes[0] && vnodes[0].children && vnodes[0].children.length || 0;
				if (Math.abs(poolChildrenLength - vnodesChildrenLength) <= Math.abs(oldChildrenLength - vnodesChildrenLength)) {
					return true
				}
			}
			return false
		}
		function getKeyMap(vnodes, end) {
			var map = {}, i = 0;
			for (var i = 0; i < end; i++) {
				var vnode = vnodes[i];
				if (vnode != null) {
					var key2 = vnode.key;
					if (key2 != null) map[key2] = i;
				}
			}
			return map
		}
		function toFragment(vnode) {
			var count0 = vnode.domSize;
			if (count0 != null || vnode.dom == null) {
				var fragment = $doc.createDocumentFragment();
				if (count0 > 0) {
					var dom = vnode.dom;
					while (--count0) fragment.appendChild(dom.nextSibling);
					fragment.insertBefore(dom, fragment.firstChild);
				}
				return fragment
			}
			else return vnode.dom
		}
		function getNextSibling(vnodes, i, nextSibling) {
			for (; i < vnodes.length; i++) {
				if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom
			}
			return nextSibling
		}
		function insertNode(parent, dom, nextSibling) {
			if (nextSibling && nextSibling.parentNode) parent.insertBefore(dom, nextSibling);
			else parent.appendChild(dom);
		}
		function setContentEditable(vnode) {
			var children = vnode.children;
			if (children != null && children.length === 1 && children[0].tag === "<") {
				var content = children[0].children;
				if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content;
			}
			else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted")
		}
		//remove
		function removeNodes(vnodes, start, end, context) {
			for (var i = start; i < end; i++) {
				var vnode = vnodes[i];
				if (vnode != null) {
					if (vnode.skip) vnode.skip = false;
					else removeNode(vnode, context);
				}
			}
		}
		function removeNode(vnode, context) {
			var expected = 1, called = 0;
			if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
				var result = vnode.attrs.onbeforeremove.call(vnode.state, vnode);
				if (result != null && typeof result.then === "function") {
					expected++;
					result.then(continuation, continuation);
				}
			}
			if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeremove === "function") {
				var result = vnode._state.onbeforeremove.call(vnode.state, vnode);
				if (result != null && typeof result.then === "function") {
					expected++;
					result.then(continuation, continuation);
				}
			}
			continuation();
			function continuation() {
				if (++called === expected) {
					onremove(vnode);
					if (vnode.dom) {
						var count0 = vnode.domSize || 1;
						if (count0 > 1) {
							var dom = vnode.dom;
							while (--count0) {
								removeNodeFromDOM(dom.nextSibling);
							}
						}
						removeNodeFromDOM(vnode.dom);
						if (context != null && vnode.domSize == null && !hasIntegrationMethods(vnode.attrs) && typeof vnode.tag === "string") { //TODO test custom elements
							if (!context.pool) context.pool = [vnode];
							else context.pool.push(vnode);
						}
					}
				}
			}
		}
		function removeNodeFromDOM(node) {
			var parent = node.parentNode;
			if (parent != null) parent.removeChild(node);
		}
		function onremove(vnode) {
			if (vnode.attrs && typeof vnode.attrs.onremove === "function") vnode.attrs.onremove.call(vnode.state, vnode);
			if (typeof vnode.tag !== "string") {
				if (typeof vnode._state.onremove === "function") vnode._state.onremove.call(vnode.state, vnode);
				if (vnode.instance != null) onremove(vnode.instance);
			} else {
				var children = vnode.children;
				if (Array.isArray(children)) {
					for (var i = 0; i < children.length; i++) {
						var child = children[i];
						if (child != null) onremove(child);
					}
				}
			}
		}
		//attrs2
		function setAttrs(vnode, attrs2, ns) {
			for (var key2 in attrs2) {
				setAttr(vnode, key2, null, attrs2[key2], ns);
			}
		}
		function setAttr(vnode, key2, old, value, ns) {
			var element = vnode.dom;
			if (key2 === "key" || key2 === "is" || (old === value && !isFormAttribute(vnode, key2)) && typeof value !== "object" || typeof value === "undefined" || isLifecycleMethod(key2)) return
			var nsLastIndex = key2.indexOf(":");
			if (nsLastIndex > -1 && key2.substr(0, nsLastIndex) === "xlink") {
				element.setAttributeNS("http://www.w3.org/1999/xlink", key2.slice(nsLastIndex + 1), value);
			}
			else if (key2[0] === "o" && key2[1] === "n" && typeof value === "function") updateEvent(vnode, key2, value);
			else if (key2 === "style") updateStyle(element, old, value);
			else if (key2 in element && !isAttribute(key2) && ns === undefined && !isCustomElement(vnode)) {
				if (key2 === "value") {
					var normalized0 = "" + value; // eslint-disable-line no-implicit-coercion
					//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
					if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
					//setting select[value] to same value while having select open blinks select dropdown in Chrome
					if (vnode.tag === "select") {
						if (value === null) {
							if (vnode.dom.selectedIndex === -1 && vnode.dom === $doc.activeElement) return
						} else {
							if (old !== null && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
						}
					}
					//setting option[value] to same value while having select open blinks select dropdown in Chrome
					if (vnode.tag === "option" && old != null && vnode.dom.value === normalized0) return
				}
				// If you assign an input type1 that is not supported by IE 11 with an assignment expression, an error0 will occur.
				if (vnode.tag === "input" && key2 === "type") {
					element.setAttribute(key2, value);
					return
				}
				element[key2] = value;
			}
			else {
				if (typeof value === "boolean") {
					if (value) element.setAttribute(key2, "");
					else element.removeAttribute(key2);
				}
				else element.setAttribute(key2 === "className" ? "class" : key2, value);
			}
		}
		function setLateAttrs(vnode) {
			var attrs2 = vnode.attrs;
			if (vnode.tag === "select" && attrs2 != null) {
				if ("value" in attrs2) setAttr(vnode, "value", null, attrs2.value, undefined);
				if ("selectedIndex" in attrs2) setAttr(vnode, "selectedIndex", null, attrs2.selectedIndex, undefined);
			}
		}
		function updateAttrs(vnode, old, attrs2, ns) {
			if (attrs2 != null) {
				for (var key2 in attrs2) {
					setAttr(vnode, key2, old && old[key2], attrs2[key2], ns);
				}
			}
			if (old != null) {
				for (var key2 in old) {
					if (attrs2 == null || !(key2 in attrs2)) {
						if (key2 === "className") key2 = "class";
						if (key2[0] === "o" && key2[1] === "n" && !isLifecycleMethod(key2)) updateEvent(vnode, key2, undefined);
						else if (key2 !== "key") vnode.dom.removeAttribute(key2);
					}
				}
			}
		}
		function isFormAttribute(vnode, attr) {
			return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === $doc.activeElement
		}
		function isLifecycleMethod(attr) {
			return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
		}
		function isAttribute(attr) {
			return attr === "href" || attr === "list" || attr === "form" || attr === "width" || attr === "height"// || attr === "type"
		}
		function isCustomElement(vnode){
			return vnode.attrs.is || vnode.tag.indexOf("-") > -1
		}
		function hasIntegrationMethods(source) {
			return source != null && (source.oncreate || source.onupdate || source.onbeforeremove || source.onremove)
		}
		//style
		function updateStyle(element, old, style) {
			if (old === style) element.style.cssText = "", old = null;
			if (style == null) element.style.cssText = "";
			else if (typeof style === "string") element.style.cssText = style;
			else {
				if (typeof old === "string") element.style.cssText = "";
				for (var key2 in style) {
					element.style[key2] = style[key2];
				}
				if (old != null && typeof old !== "string") {
					for (var key2 in old) {
						if (!(key2 in style)) element.style[key2] = "";
					}
				}
			}
		}
		//event
		function updateEvent(vnode, key2, value) {
			var element = vnode.dom;
			var callback = typeof onevent !== "function" ? value : function(e) {
				var result = value.call(element, e);
				onevent.call(element, e);
				return result
			};
			if (key2 in element) element[key2] = typeof value === "function" ? callback : null;
			else {
				var eventName = key2.slice(2);
				if (vnode.events === undefined) vnode.events = {};
				if (vnode.events[key2] === callback) return
				if (vnode.events[key2] != null) element.removeEventListener(eventName, vnode.events[key2], false);
				if (typeof value === "function") {
					vnode.events[key2] = callback;
					element.addEventListener(eventName, vnode.events[key2], false);
				}
			}
		}
		//lifecycle
		function initLifecycle(source, vnode, hooks) {
			if (typeof source.oninit === "function") source.oninit.call(vnode.state, vnode);
			if (typeof source.oncreate === "function") hooks.push(source.oncreate.bind(vnode.state, vnode));
		}
		function updateLifecycle(source, vnode, hooks) {
			if (typeof source.onupdate === "function") hooks.push(source.onupdate.bind(vnode.state, vnode));
		}
		function shouldNotUpdate(vnode, old) {
			var forceVnodeUpdate, forceComponentUpdate;
			if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") forceVnodeUpdate = vnode.attrs.onbeforeupdate.call(vnode.state, vnode, old);
			if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeupdate === "function") forceComponentUpdate = vnode._state.onbeforeupdate.call(vnode.state, vnode, old);
			if (!(forceVnodeUpdate === undefined && forceComponentUpdate === undefined) && !forceVnodeUpdate && !forceComponentUpdate) {
				vnode.dom = old.dom;
				vnode.domSize = old.domSize;
				vnode.instance = old.instance;
				return true
			}
			return false
		}
		function render(dom, vnodes) {
			if (!dom) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.")
			var hooks = [];
			var active = $doc.activeElement;
			var namespace = dom.namespaceURI;
			// First time0 rendering into a node clears it out
			if (dom.vnodes == null) dom.textContent = "";
			if (!Array.isArray(vnodes)) vnodes = [vnodes];
			updateNodes(dom, dom.vnodes, Vnode.normalizeChildren(vnodes), false, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace);
			dom.vnodes = vnodes;
			// document.activeElement can return null in IE https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement
			if (active != null && $doc.activeElement !== active) active.focus();
			for (var i = 0; i < hooks.length; i++) hooks[i]();
		}
		return {render: render, setEventCallback: setEventCallback}
	};
	function throttle(callback) {
		//60fps translates to 16.6ms, round it down since setTimeout requires int
		var time = 16;
		var last = 0, pending = null;
		var timeout = typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout;
		return function() {
			var now = Date.now();
			if (last === 0 || now - last >= time) {
				last = now;
				callback();
			}
			else if (pending === null) {
				pending = timeout(function() {
					pending = null;
					callback();
					last = Date.now();
				}, time - (now - last));
			}
		}
	}
	var _11 = function($window) {
		var renderService = coreRenderer($window);
		renderService.setEventCallback(function(e) {
			if (e.redraw === false) e.redraw = undefined;
			else redraw();
		});
		var callbacks = [];
		function subscribe(key1, callback) {
			unsubscribe(key1);
			callbacks.push(key1, throttle(callback));
		}
		function unsubscribe(key1) {
			var index = callbacks.indexOf(key1);
			if (index > -1) callbacks.splice(index, 2);
		}
		function redraw() {
			for (var i = 1; i < callbacks.length; i += 2) {
				callbacks[i]();
			}
		}
		return {subscribe: subscribe, unsubscribe: unsubscribe, redraw: redraw, render: renderService.render}
	};
	var redrawService = _11(window);
	requestService.setCompletionCallback(redrawService.redraw);
	var _16 = function(redrawService0) {
		return function(root, component) {
			if (component === null) {
				redrawService0.render(root, []);
				redrawService0.unsubscribe(root);
				return
			}
			
			if (component.view == null && typeof component !== "function") throw new Error("m.mount(element, component) expects a component, not a vnode")
			
			var run0 = function() {
				redrawService0.render(root, Vnode(component));
			};
			redrawService0.subscribe(root, run0);
			redrawService0.redraw();
		}
	};
	m.mount = _16(redrawService);
	var Promise = PromisePolyfill;
	var parseQueryString = function(string) {
		if (string === "" || string == null) return {}
		if (string.charAt(0) === "?") string = string.slice(1);
		var entries = string.split("&"), data0 = {}, counters = {};
		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i].split("=");
			var key5 = decodeURIComponent(entry[0]);
			var value = entry.length === 2 ? decodeURIComponent(entry[1]) : "";
			if (value === "true") value = true;
			else if (value === "false") value = false;
			var levels = key5.split(/\]\[?|\[/);
			var cursor = data0;
			if (key5.indexOf("[") > -1) levels.pop();
			for (var j = 0; j < levels.length; j++) {
				var level = levels[j], nextLevel = levels[j + 1];
				var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10));
				var isValue = j === levels.length - 1;
				if (level === "") {
					var key5 = levels.slice(0, j).join();
					if (counters[key5] == null) counters[key5] = 0;
					level = counters[key5]++;
				}
				if (cursor[level] == null) {
					cursor[level] = isValue ? value : isNumber ? [] : {};
				}
				cursor = cursor[level];
			}
		}
		return data0
	};
	var coreRouter = function($window) {
		var supportsPushState = typeof $window.history.pushState === "function";
		var callAsync0 = typeof setImmediate === "function" ? setImmediate : setTimeout;
		function normalize1(fragment0) {
			var data = $window.location[fragment0].replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent);
			if (fragment0 === "pathname" && data[0] !== "/") data = "/" + data;
			return data
		}
		var asyncId;
		function debounceAsync(callback0) {
			return function() {
				if (asyncId != null) return
				asyncId = callAsync0(function() {
					asyncId = null;
					callback0();
				});
			}
		}
		function parsePath(path, queryData, hashData) {
			var queryIndex = path.indexOf("?");
			var hashIndex = path.indexOf("#");
			var pathEnd = queryIndex > -1 ? queryIndex : hashIndex > -1 ? hashIndex : path.length;
			if (queryIndex > -1) {
				var queryEnd = hashIndex > -1 ? hashIndex : path.length;
				var queryParams = parseQueryString(path.slice(queryIndex + 1, queryEnd));
				for (var key4 in queryParams) queryData[key4] = queryParams[key4];
			}
			if (hashIndex > -1) {
				var hashParams = parseQueryString(path.slice(hashIndex + 1));
				for (var key4 in hashParams) hashData[key4] = hashParams[key4];
			}
			return path.slice(0, pathEnd)
		}
		var router = {prefix: "#!"};
		router.getPath = function() {
			var type2 = router.prefix.charAt(0);
			switch (type2) {
				case "#": return normalize1("hash").slice(router.prefix.length)
				case "?": return normalize1("search").slice(router.prefix.length) + normalize1("hash")
				default: return normalize1("pathname").slice(router.prefix.length) + normalize1("search") + normalize1("hash")
			}
		};
		router.setPath = function(path, data, options) {
			var queryData = {}, hashData = {};
			path = parsePath(path, queryData, hashData);
			if (data != null) {
				for (var key4 in data) queryData[key4] = data[key4];
				path = path.replace(/:([^\/]+)/g, function(match2, token) {
					delete queryData[token];
					return data[token]
				});
			}
			var query = buildQueryString(queryData);
			if (query) path += "?" + query;
			var hash = buildQueryString(hashData);
			if (hash) path += "#" + hash;
			if (supportsPushState) {
				var state = options ? options.state : null;
				var title = options ? options.title : null;
				$window.onpopstate();
				if (options && options.replace) $window.history.replaceState(state, title, router.prefix + path);
				else $window.history.pushState(state, title, router.prefix + path);
			}
			else $window.location.href = router.prefix + path;
		};
		router.defineRoutes = function(routes, resolve, reject) {
			function resolveRoute() {
				var path = router.getPath();
				var params = {};
				var pathname = parsePath(path, params, params);
				var state = $window.history.state;
				if (state != null) {
					for (var k in state) params[k] = state[k];
				}
				for (var route0 in routes) {
					var matcher = new RegExp("^" + route0.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");
					if (matcher.test(pathname)) {
						pathname.replace(matcher, function() {
							var keys = route0.match(/:[^\/]+/g) || [];
							var values = [].slice.call(arguments, 1, -2);
							for (var i = 0; i < keys.length; i++) {
								params[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i]);
							}
							resolve(routes[route0], params, path, route0);
						});
						return
					}
				}
				reject(path, params);
			}
			if (supportsPushState) $window.onpopstate = debounceAsync(resolveRoute);
			else if (router.prefix.charAt(0) === "#") $window.onhashchange = resolveRoute;
			resolveRoute();
		};
		return router
	};
	var _20 = function($window, redrawService0) {
		var routeService = coreRouter($window);
		var identity = function(v) {return v};
		var render1, component, attrs3, currentPath, lastUpdate;
		var route = function(root, defaultRoute, routes) {
			if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined")
			var run1 = function() {
				if (render1 != null) redrawService0.render(root, render1(Vnode(component, attrs3.key, attrs3)));
			};
			var bail = function(path) {
				if (path !== defaultRoute) routeService.setPath(defaultRoute, null, {replace: true});
				else throw new Error("Could not resolve default route " + defaultRoute)
			};
			routeService.defineRoutes(routes, function(payload, params, path) {
				var update = lastUpdate = function(routeResolver, comp) {
					if (update !== lastUpdate) return
					component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div";
					attrs3 = params, currentPath = path, lastUpdate = null;
					render1 = (routeResolver.render || identity).bind(routeResolver);
					run1();
				};
				if (payload.view || typeof payload === "function") update({}, payload);
				else {
					if (payload.onmatch) {
						Promise.resolve(payload.onmatch(params, path)).then(function(resolved) {
							update(payload, resolved);
						}, bail);
					}
					else update(payload, "div");
				}
			}, bail);
			redrawService0.subscribe(root, run1);
		};
		route.set = function(path, data, options) {
			if (lastUpdate != null) {
				options = options || {};
				options.replace = true;
			}
			lastUpdate = null;
			routeService.setPath(path, data, options);
		};
		route.get = function() {return currentPath};
		route.prefix = function(prefix0) {routeService.prefix = prefix0;};
		route.link = function(vnode1) {
			vnode1.dom.setAttribute("href", routeService.prefix + vnode1.attrs.href);
			vnode1.dom.onclick = function(e) {
				if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return
				e.preventDefault();
				e.redraw = false;
				var href = this.getAttribute("href");
				if (href.indexOf(routeService.prefix) === 0) href = href.slice(routeService.prefix.length);
				route.set(href, undefined, undefined);
			};
		};
		route.param = function(key3) {
			if(typeof attrs3 !== "undefined" && typeof key3 !== "undefined") return attrs3[key3]
			return attrs3
		};
		return route
	};
	m.route = _20(window, redrawService);
	m.withAttr = function(attrName, callback1, context) {
		return function(e) {
			callback1.call(context || this, attrName in e.currentTarget ? e.currentTarget[attrName] : e.currentTarget.getAttribute(attrName));
		}
	};
	var _28 = coreRenderer(window);
	m.render = _28.render;
	m.redraw = redrawService.redraw;
	m.request = requestService.request;
	m.jsonp = requestService.jsonp;
	m.parseQueryString = parseQueryString;
	m.buildQueryString = buildQueryString;
	m.version = "1.1.6";
	m.vnode = Vnode;
	module["exports"] = m;
	}());
	});

	var deferred = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * Create a promise with exposed resolve and reject callbacks.
	 */
	function defer() {
	    let resolve = null;
	    let reject = null;
	    const p = new Promise((res, rej) => [resolve, reject] = [res, rej]);
	    return Object.assign(p, { resolve, reject });
	}
	exports.defer = defer;

	});

	unwrapExports(deferred);
	var deferred_1 = deferred.defer;

	var remote = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });

	/**
	 * A proxy for an object that lives on another thread.
	 */
	class Remote {
	    constructor(port) {
	        this.nextRequestId = 0;
	        this.deferredRequests = new Map();
	        this.port = port;
	        this.port.onmessage = (event) => {
	            this.receive(event.data);
	        };
	    }
	    /**
	     * Invoke method with name |method| with |args| on the remote object.
	     * Optionally set |transferList| to transfer those objects.
	     */
	    // tslint:disable-next-line no-any
	    send(method, args, transferList) {
	        const d = deferred.defer();
	        this.deferredRequests.set(this.nextRequestId, d);
	        this.port.postMessage({
	            responseId: this.nextRequestId,
	            method,
	            args,
	        }, transferList);
	        this.nextRequestId += 1;
	        return d;
	    }
	    receive(response) {
	        const d = this.deferredRequests.get(response.id);
	        if (!d)
	            throw new Error(`No deferred response with ID ${response.id}`);
	        this.deferredRequests.delete(response.id);
	        d.resolve(response.result);
	    }
	}
	exports.Remote = Remote;
	/**
	 * Given a MessagePort |port| where the other end is owned by a Remote
	 * (see above) turn each incoming MessageEvent into a call on |handler|
	 * and post the result back to the calling thread.
	 */
	function forwardRemoteCalls(port, 
	// tslint:disable-next-line no-any
	handler) {
	    port.onmessage = (msg) => {
	        const method = msg.data.method;
	        const id = msg.data.responseId;
	        const args = msg.data.args || [];
	        if (method === undefined || id === undefined) {
	            throw new Error(`Invalid call method: ${method} id: ${id}`);
	        }
	        if (!(handler[method] instanceof Function)) {
	            throw new Error(`Method not known: ${method}(${args})`);
	        }
	        const result = handler[method].apply(handler, args);
	        const transferList = [];
	        if (result !== undefined && result.port instanceof MessagePort) {
	            transferList.push(result.port);
	        }
	        port.postMessage({
	            id,
	            result,
	        }, transferList);
	    };
	}
	exports.forwardRemoteCalls = forwardRemoteCalls;

	});

	unwrapExports(remote);
	var remote_1 = remote.Remote;
	var remote_2 = remote.forwardRemoteCalls;

	var aspromise = asPromise;

	/**
	 * Callback as used by {@link util.asPromise}.
	 * @typedef asPromiseCallback
	 * @type {function}
	 * @param {Error|null} error Error, if any
	 * @param {...*} params Additional arguments
	 * @returns {undefined}
	 */

	/**
	 * Returns a promise from a node-style callback function.
	 * @memberof util
	 * @param {asPromiseCallback} fn Function to call
	 * @param {*} ctx Function context
	 * @param {...*} params Function arguments
	 * @returns {Promise<*>} Promisified function
	 */
	function asPromise(fn, ctx/*, varargs */) {
	    var params  = new Array(arguments.length - 1),
	        offset  = 0,
	        index   = 2,
	        pending = true;
	    while (index < arguments.length)
	        params[offset++] = arguments[index++];
	    return new Promise(function executor(resolve, reject) {
	        params[offset] = function callback(err/*, varargs */) {
	            if (pending) {
	                pending = false;
	                if (err)
	                    reject(err);
	                else {
	                    var params = new Array(arguments.length - 1),
	                        offset = 0;
	                    while (offset < params.length)
	                        params[offset++] = arguments[offset];
	                    resolve.apply(null, params);
	                }
	            }
	        };
	        try {
	            fn.apply(ctx || null, params);
	        } catch (err) {
	            if (pending) {
	                pending = false;
	                reject(err);
	            }
	        }
	    });
	}

	var base64_1 = createCommonjsModule(function (module, exports) {

	/**
	 * A minimal base64 implementation for number arrays.
	 * @memberof util
	 * @namespace
	 */
	var base64 = exports;

	/**
	 * Calculates the byte length of a base64 encoded string.
	 * @param {string} string Base64 encoded string
	 * @returns {number} Byte length
	 */
	base64.length = function length(string) {
	    var p = string.length;
	    if (!p)
	        return 0;
	    var n = 0;
	    while (--p % 4 > 1 && string.charAt(p) === "=")
	        ++n;
	    return Math.ceil(string.length * 3) / 4 - n;
	};

	// Base64 encoding table
	var b64 = new Array(64);

	// Base64 decoding table
	var s64 = new Array(123);

	// 65..90, 97..122, 48..57, 43, 47
	for (var i = 0; i < 64;)
	    s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;

	/**
	 * Encodes a buffer to a base64 encoded string.
	 * @param {Uint8Array} buffer Source buffer
	 * @param {number} start Source start
	 * @param {number} end Source end
	 * @returns {string} Base64 encoded string
	 */
	base64.encode = function encode(buffer, start, end) {
	    var parts = null,
	        chunk = [];
	    var i = 0, // output index
	        j = 0, // goto index
	        t;     // temporary
	    while (start < end) {
	        var b = buffer[start++];
	        switch (j) {
	            case 0:
	                chunk[i++] = b64[b >> 2];
	                t = (b & 3) << 4;
	                j = 1;
	                break;
	            case 1:
	                chunk[i++] = b64[t | b >> 4];
	                t = (b & 15) << 2;
	                j = 2;
	                break;
	            case 2:
	                chunk[i++] = b64[t | b >> 6];
	                chunk[i++] = b64[b & 63];
	                j = 0;
	                break;
	        }
	        if (i > 8191) {
	            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
	            i = 0;
	        }
	    }
	    if (j) {
	        chunk[i++] = b64[t];
	        chunk[i++] = 61;
	        if (j === 1)
	            chunk[i++] = 61;
	    }
	    if (parts) {
	        if (i)
	            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
	        return parts.join("");
	    }
	    return String.fromCharCode.apply(String, chunk.slice(0, i));
	};

	var invalidEncoding = "invalid encoding";

	/**
	 * Decodes a base64 encoded string to a buffer.
	 * @param {string} string Source string
	 * @param {Uint8Array} buffer Destination buffer
	 * @param {number} offset Destination offset
	 * @returns {number} Number of bytes written
	 * @throws {Error} If encoding is invalid
	 */
	base64.decode = function decode(string, buffer, offset) {
	    var start = offset;
	    var j = 0, // goto index
	        t;     // temporary
	    for (var i = 0; i < string.length;) {
	        var c = string.charCodeAt(i++);
	        if (c === 61 && j > 1)
	            break;
	        if ((c = s64[c]) === undefined)
	            throw Error(invalidEncoding);
	        switch (j) {
	            case 0:
	                t = c;
	                j = 1;
	                break;
	            case 1:
	                buffer[offset++] = t << 2 | (c & 48) >> 4;
	                t = c;
	                j = 2;
	                break;
	            case 2:
	                buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
	                t = c;
	                j = 3;
	                break;
	            case 3:
	                buffer[offset++] = (t & 3) << 6 | c;
	                j = 0;
	                break;
	        }
	    }
	    if (j === 1)
	        throw Error(invalidEncoding);
	    return offset - start;
	};

	/**
	 * Tests if the specified string appears to be base64 encoded.
	 * @param {string} string String to test
	 * @returns {boolean} `true` if probably base64 encoded, otherwise false
	 */
	base64.test = function test(string) {
	    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
	};
	});

	var eventemitter = EventEmitter;

	/**
	 * Constructs a new event emitter instance.
	 * @classdesc A minimal event emitter.
	 * @memberof util
	 * @constructor
	 */
	function EventEmitter() {

	    /**
	     * Registered listeners.
	     * @type {Object.<string,*>}
	     * @private
	     */
	    this._listeners = {};
	}

	/**
	 * Registers an event listener.
	 * @param {string} evt Event name
	 * @param {function} fn Listener
	 * @param {*} [ctx] Listener context
	 * @returns {util.EventEmitter} `this`
	 */
	EventEmitter.prototype.on = function on(evt, fn, ctx) {
	    (this._listeners[evt] || (this._listeners[evt] = [])).push({
	        fn  : fn,
	        ctx : ctx || this
	    });
	    return this;
	};

	/**
	 * Removes an event listener or any matching listeners if arguments are omitted.
	 * @param {string} [evt] Event name. Removes all listeners if omitted.
	 * @param {function} [fn] Listener to remove. Removes all listeners of `evt` if omitted.
	 * @returns {util.EventEmitter} `this`
	 */
	EventEmitter.prototype.off = function off(evt, fn) {
	    if (evt === undefined)
	        this._listeners = {};
	    else {
	        if (fn === undefined)
	            this._listeners[evt] = [];
	        else {
	            var listeners = this._listeners[evt];
	            for (var i = 0; i < listeners.length;)
	                if (listeners[i].fn === fn)
	                    listeners.splice(i, 1);
	                else
	                    ++i;
	        }
	    }
	    return this;
	};

	/**
	 * Emits an event by calling its listeners with the specified arguments.
	 * @param {string} evt Event name
	 * @param {...*} args Arguments
	 * @returns {util.EventEmitter} `this`
	 */
	EventEmitter.prototype.emit = function emit(evt) {
	    var listeners = this._listeners[evt];
	    if (listeners) {
	        var args = [],
	            i = 1;
	        for (; i < arguments.length;)
	            args.push(arguments[i++]);
	        for (i = 0; i < listeners.length;)
	            listeners[i].fn.apply(listeners[i++].ctx, args);
	    }
	    return this;
	};

	var float_1 = factory(factory);

	/**
	 * Reads / writes floats / doubles from / to buffers.
	 * @name util.float
	 * @namespace
	 */

	/**
	 * Writes a 32 bit float to a buffer using little endian byte order.
	 * @name util.float.writeFloatLE
	 * @function
	 * @param {number} val Value to write
	 * @param {Uint8Array} buf Target buffer
	 * @param {number} pos Target buffer offset
	 * @returns {undefined}
	 */

	/**
	 * Writes a 32 bit float to a buffer using big endian byte order.
	 * @name util.float.writeFloatBE
	 * @function
	 * @param {number} val Value to write
	 * @param {Uint8Array} buf Target buffer
	 * @param {number} pos Target buffer offset
	 * @returns {undefined}
	 */

	/**
	 * Reads a 32 bit float from a buffer using little endian byte order.
	 * @name util.float.readFloatLE
	 * @function
	 * @param {Uint8Array} buf Source buffer
	 * @param {number} pos Source buffer offset
	 * @returns {number} Value read
	 */

	/**
	 * Reads a 32 bit float from a buffer using big endian byte order.
	 * @name util.float.readFloatBE
	 * @function
	 * @param {Uint8Array} buf Source buffer
	 * @param {number} pos Source buffer offset
	 * @returns {number} Value read
	 */

	/**
	 * Writes a 64 bit double to a buffer using little endian byte order.
	 * @name util.float.writeDoubleLE
	 * @function
	 * @param {number} val Value to write
	 * @param {Uint8Array} buf Target buffer
	 * @param {number} pos Target buffer offset
	 * @returns {undefined}
	 */

	/**
	 * Writes a 64 bit double to a buffer using big endian byte order.
	 * @name util.float.writeDoubleBE
	 * @function
	 * @param {number} val Value to write
	 * @param {Uint8Array} buf Target buffer
	 * @param {number} pos Target buffer offset
	 * @returns {undefined}
	 */

	/**
	 * Reads a 64 bit double from a buffer using little endian byte order.
	 * @name util.float.readDoubleLE
	 * @function
	 * @param {Uint8Array} buf Source buffer
	 * @param {number} pos Source buffer offset
	 * @returns {number} Value read
	 */

	/**
	 * Reads a 64 bit double from a buffer using big endian byte order.
	 * @name util.float.readDoubleBE
	 * @function
	 * @param {Uint8Array} buf Source buffer
	 * @param {number} pos Source buffer offset
	 * @returns {number} Value read
	 */

	// Factory function for the purpose of node-based testing in modified global environments
	function factory(exports) {

	    // float: typed array
	    if (typeof Float32Array !== "undefined") (function() {

	        var f32 = new Float32Array([ -0 ]),
	            f8b = new Uint8Array(f32.buffer),
	            le  = f8b[3] === 128;

	        function writeFloat_f32_cpy(val, buf, pos) {
	            f32[0] = val;
	            buf[pos    ] = f8b[0];
	            buf[pos + 1] = f8b[1];
	            buf[pos + 2] = f8b[2];
	            buf[pos + 3] = f8b[3];
	        }

	        function writeFloat_f32_rev(val, buf, pos) {
	            f32[0] = val;
	            buf[pos    ] = f8b[3];
	            buf[pos + 1] = f8b[2];
	            buf[pos + 2] = f8b[1];
	            buf[pos + 3] = f8b[0];
	        }

	        /* istanbul ignore next */
	        exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
	        /* istanbul ignore next */
	        exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;

	        function readFloat_f32_cpy(buf, pos) {
	            f8b[0] = buf[pos    ];
	            f8b[1] = buf[pos + 1];
	            f8b[2] = buf[pos + 2];
	            f8b[3] = buf[pos + 3];
	            return f32[0];
	        }

	        function readFloat_f32_rev(buf, pos) {
	            f8b[3] = buf[pos    ];
	            f8b[2] = buf[pos + 1];
	            f8b[1] = buf[pos + 2];
	            f8b[0] = buf[pos + 3];
	            return f32[0];
	        }

	        /* istanbul ignore next */
	        exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
	        /* istanbul ignore next */
	        exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;

	    // float: ieee754
	    })(); else (function() {

	        function writeFloat_ieee754(writeUint, val, buf, pos) {
	            var sign = val < 0 ? 1 : 0;
	            if (sign)
	                val = -val;
	            if (val === 0)
	                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos);
	            else if (isNaN(val))
	                writeUint(2143289344, buf, pos);
	            else if (val > 3.4028234663852886e+38) // +-Infinity
	                writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
	            else if (val < 1.1754943508222875e-38) // denormal
	                writeUint((sign << 31 | Math.round(val / 1.401298464324817e-45)) >>> 0, buf, pos);
	            else {
	                var exponent = Math.floor(Math.log(val) / Math.LN2),
	                    mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
	                writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
	            }
	        }

	        exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
	        exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);

	        function readFloat_ieee754(readUint, buf, pos) {
	            var uint = readUint(buf, pos),
	                sign = (uint >> 31) * 2 + 1,
	                exponent = uint >>> 23 & 255,
	                mantissa = uint & 8388607;
	            return exponent === 255
	                ? mantissa
	                ? NaN
	                : sign * Infinity
	                : exponent === 0 // denormal
	                ? sign * 1.401298464324817e-45 * mantissa
	                : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
	        }

	        exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
	        exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);

	    })();

	    // double: typed array
	    if (typeof Float64Array !== "undefined") (function() {

	        var f64 = new Float64Array([-0]),
	            f8b = new Uint8Array(f64.buffer),
	            le  = f8b[7] === 128;

	        function writeDouble_f64_cpy(val, buf, pos) {
	            f64[0] = val;
	            buf[pos    ] = f8b[0];
	            buf[pos + 1] = f8b[1];
	            buf[pos + 2] = f8b[2];
	            buf[pos + 3] = f8b[3];
	            buf[pos + 4] = f8b[4];
	            buf[pos + 5] = f8b[5];
	            buf[pos + 6] = f8b[6];
	            buf[pos + 7] = f8b[7];
	        }

	        function writeDouble_f64_rev(val, buf, pos) {
	            f64[0] = val;
	            buf[pos    ] = f8b[7];
	            buf[pos + 1] = f8b[6];
	            buf[pos + 2] = f8b[5];
	            buf[pos + 3] = f8b[4];
	            buf[pos + 4] = f8b[3];
	            buf[pos + 5] = f8b[2];
	            buf[pos + 6] = f8b[1];
	            buf[pos + 7] = f8b[0];
	        }

	        /* istanbul ignore next */
	        exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
	        /* istanbul ignore next */
	        exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;

	        function readDouble_f64_cpy(buf, pos) {
	            f8b[0] = buf[pos    ];
	            f8b[1] = buf[pos + 1];
	            f8b[2] = buf[pos + 2];
	            f8b[3] = buf[pos + 3];
	            f8b[4] = buf[pos + 4];
	            f8b[5] = buf[pos + 5];
	            f8b[6] = buf[pos + 6];
	            f8b[7] = buf[pos + 7];
	            return f64[0];
	        }

	        function readDouble_f64_rev(buf, pos) {
	            f8b[7] = buf[pos    ];
	            f8b[6] = buf[pos + 1];
	            f8b[5] = buf[pos + 2];
	            f8b[4] = buf[pos + 3];
	            f8b[3] = buf[pos + 4];
	            f8b[2] = buf[pos + 5];
	            f8b[1] = buf[pos + 6];
	            f8b[0] = buf[pos + 7];
	            return f64[0];
	        }

	        /* istanbul ignore next */
	        exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
	        /* istanbul ignore next */
	        exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;

	    // double: ieee754
	    })(); else (function() {

	        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
	            var sign = val < 0 ? 1 : 0;
	            if (sign)
	                val = -val;
	            if (val === 0) {
	                writeUint(0, buf, pos + off0);
	                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos + off1);
	            } else if (isNaN(val)) {
	                writeUint(0, buf, pos + off0);
	                writeUint(2146959360, buf, pos + off1);
	            } else if (val > 1.7976931348623157e+308) { // +-Infinity
	                writeUint(0, buf, pos + off0);
	                writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
	            } else {
	                var mantissa;
	                if (val < 2.2250738585072014e-308) { // denormal
	                    mantissa = val / 5e-324;
	                    writeUint(mantissa >>> 0, buf, pos + off0);
	                    writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
	                } else {
	                    var exponent = Math.floor(Math.log(val) / Math.LN2);
	                    if (exponent === 1024)
	                        exponent = 1023;
	                    mantissa = val * Math.pow(2, -exponent);
	                    writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
	                    writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
	                }
	            }
	        }

	        exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
	        exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);

	        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
	            var lo = readUint(buf, pos + off0),
	                hi = readUint(buf, pos + off1);
	            var sign = (hi >> 31) * 2 + 1,
	                exponent = hi >>> 20 & 2047,
	                mantissa = 4294967296 * (hi & 1048575) + lo;
	            return exponent === 2047
	                ? mantissa
	                ? NaN
	                : sign * Infinity
	                : exponent === 0 // denormal
	                ? sign * 5e-324 * mantissa
	                : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
	        }

	        exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
	        exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);

	    })();

	    return exports;
	}

	// uint helpers

	function writeUintLE(val, buf, pos) {
	    buf[pos    ] =  val        & 255;
	    buf[pos + 1] =  val >>> 8  & 255;
	    buf[pos + 2] =  val >>> 16 & 255;
	    buf[pos + 3] =  val >>> 24;
	}

	function writeUintBE(val, buf, pos) {
	    buf[pos    ] =  val >>> 24;
	    buf[pos + 1] =  val >>> 16 & 255;
	    buf[pos + 2] =  val >>> 8  & 255;
	    buf[pos + 3] =  val        & 255;
	}

	function readUintLE(buf, pos) {
	    return (buf[pos    ]
	          | buf[pos + 1] << 8
	          | buf[pos + 2] << 16
	          | buf[pos + 3] << 24) >>> 0;
	}

	function readUintBE(buf, pos) {
	    return (buf[pos    ] << 24
	          | buf[pos + 1] << 16
	          | buf[pos + 2] << 8
	          | buf[pos + 3]) >>> 0;
	}

	var inquire_1 = inquire;

	/**
	 * Requires a module only if available.
	 * @memberof util
	 * @param {string} moduleName Module to require
	 * @returns {?Object} Required module if available and not empty, otherwise `null`
	 */
	function inquire(moduleName) {
	    try {
	        var mod = eval("quire".replace(/^/,"re"))(moduleName); // eslint-disable-line no-eval
	        if (mod && (mod.length || Object.keys(mod).length))
	            return mod;
	    } catch (e) {} // eslint-disable-line no-empty
	    return null;
	}

	var utf8_1 = createCommonjsModule(function (module, exports) {

	/**
	 * A minimal UTF8 implementation for number arrays.
	 * @memberof util
	 * @namespace
	 */
	var utf8 = exports;

	/**
	 * Calculates the UTF8 byte length of a string.
	 * @param {string} string String
	 * @returns {number} Byte length
	 */
	utf8.length = function utf8_length(string) {
	    var len = 0,
	        c = 0;
	    for (var i = 0; i < string.length; ++i) {
	        c = string.charCodeAt(i);
	        if (c < 128)
	            len += 1;
	        else if (c < 2048)
	            len += 2;
	        else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
	            ++i;
	            len += 4;
	        } else
	            len += 3;
	    }
	    return len;
	};

	/**
	 * Reads UTF8 bytes as a string.
	 * @param {Uint8Array} buffer Source buffer
	 * @param {number} start Source start
	 * @param {number} end Source end
	 * @returns {string} String read
	 */
	utf8.read = function utf8_read(buffer, start, end) {
	    var len = end - start;
	    if (len < 1)
	        return "";
	    var parts = null,
	        chunk = [],
	        i = 0, // char offset
	        t;     // temporary
	    while (start < end) {
	        t = buffer[start++];
	        if (t < 128)
	            chunk[i++] = t;
	        else if (t > 191 && t < 224)
	            chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
	        else if (t > 239 && t < 365) {
	            t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 0x10000;
	            chunk[i++] = 0xD800 + (t >> 10);
	            chunk[i++] = 0xDC00 + (t & 1023);
	        } else
	            chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
	        if (i > 8191) {
	            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
	            i = 0;
	        }
	    }
	    if (parts) {
	        if (i)
	            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
	        return parts.join("");
	    }
	    return String.fromCharCode.apply(String, chunk.slice(0, i));
	};

	/**
	 * Writes a string as UTF8 bytes.
	 * @param {string} string Source string
	 * @param {Uint8Array} buffer Destination buffer
	 * @param {number} offset Destination offset
	 * @returns {number} Bytes written
	 */
	utf8.write = function utf8_write(string, buffer, offset) {
	    var start = offset,
	        c1, // character 1
	        c2; // character 2
	    for (var i = 0; i < string.length; ++i) {
	        c1 = string.charCodeAt(i);
	        if (c1 < 128) {
	            buffer[offset++] = c1;
	        } else if (c1 < 2048) {
	            buffer[offset++] = c1 >> 6       | 192;
	            buffer[offset++] = c1       & 63 | 128;
	        } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
	            c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
	            ++i;
	            buffer[offset++] = c1 >> 18      | 240;
	            buffer[offset++] = c1 >> 12 & 63 | 128;
	            buffer[offset++] = c1 >> 6  & 63 | 128;
	            buffer[offset++] = c1       & 63 | 128;
	        } else {
	            buffer[offset++] = c1 >> 12      | 224;
	            buffer[offset++] = c1 >> 6  & 63 | 128;
	            buffer[offset++] = c1       & 63 | 128;
	        }
	    }
	    return offset - start;
	};
	});

	var pool_1 = pool;

	/**
	 * An allocator as used by {@link util.pool}.
	 * @typedef PoolAllocator
	 * @type {function}
	 * @param {number} size Buffer size
	 * @returns {Uint8Array} Buffer
	 */

	/**
	 * A slicer as used by {@link util.pool}.
	 * @typedef PoolSlicer
	 * @type {function}
	 * @param {number} start Start offset
	 * @param {number} end End offset
	 * @returns {Uint8Array} Buffer slice
	 * @this {Uint8Array}
	 */

	/**
	 * A general purpose buffer pool.
	 * @memberof util
	 * @function
	 * @param {PoolAllocator} alloc Allocator
	 * @param {PoolSlicer} slice Slicer
	 * @param {number} [size=8192] Slab size
	 * @returns {PoolAllocator} Pooled allocator
	 */
	function pool(alloc, slice, size) {
	    var SIZE   = size || 8192;
	    var MAX    = SIZE >>> 1;
	    var slab   = null;
	    var offset = SIZE;
	    return function pool_alloc(size) {
	        if (size < 1 || size > MAX)
	            return alloc(size);
	        if (offset + size > SIZE) {
	            slab = alloc(SIZE);
	            offset = 0;
	        }
	        var buf = slice.call(slab, offset, offset += size);
	        if (offset & 7) // align to 32 bit
	            offset = (offset | 7) + 1;
	        return buf;
	    };
	}

	var longbits = LongBits;



	/**
	 * Constructs new long bits.
	 * @classdesc Helper class for working with the low and high bits of a 64 bit value.
	 * @memberof util
	 * @constructor
	 * @param {number} lo Low 32 bits, unsigned
	 * @param {number} hi High 32 bits, unsigned
	 */
	function LongBits(lo, hi) {

	    // note that the casts below are theoretically unnecessary as of today, but older statically
	    // generated converter code might still call the ctor with signed 32bits. kept for compat.

	    /**
	     * Low bits.
	     * @type {number}
	     */
	    this.lo = lo >>> 0;

	    /**
	     * High bits.
	     * @type {number}
	     */
	    this.hi = hi >>> 0;
	}

	/**
	 * Zero bits.
	 * @memberof util.LongBits
	 * @type {util.LongBits}
	 */
	var zero = LongBits.zero = new LongBits(0, 0);

	zero.toNumber = function() { return 0; };
	zero.zzEncode = zero.zzDecode = function() { return this; };
	zero.length = function() { return 1; };

	/**
	 * Zero hash.
	 * @memberof util.LongBits
	 * @type {string}
	 */
	var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";

	/**
	 * Constructs new long bits from the specified number.
	 * @param {number} value Value
	 * @returns {util.LongBits} Instance
	 */
	LongBits.fromNumber = function fromNumber(value) {
	    if (value === 0)
	        return zero;
	    var sign = value < 0;
	    if (sign)
	        value = -value;
	    var lo = value >>> 0,
	        hi = (value - lo) / 4294967296 >>> 0;
	    if (sign) {
	        hi = ~hi >>> 0;
	        lo = ~lo >>> 0;
	        if (++lo > 4294967295) {
	            lo = 0;
	            if (++hi > 4294967295)
	                hi = 0;
	        }
	    }
	    return new LongBits(lo, hi);
	};

	/**
	 * Constructs new long bits from a number, long or string.
	 * @param {Long|number|string} value Value
	 * @returns {util.LongBits} Instance
	 */
	LongBits.from = function from(value) {
	    if (typeof value === "number")
	        return LongBits.fromNumber(value);
	    if (minimal.isString(value)) {
	        /* istanbul ignore else */
	        if (minimal.Long)
	            value = minimal.Long.fromString(value);
	        else
	            return LongBits.fromNumber(parseInt(value, 10));
	    }
	    return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
	};

	/**
	 * Converts this long bits to a possibly unsafe JavaScript number.
	 * @param {boolean} [unsigned=false] Whether unsigned or not
	 * @returns {number} Possibly unsafe number
	 */
	LongBits.prototype.toNumber = function toNumber(unsigned) {
	    if (!unsigned && this.hi >>> 31) {
	        var lo = ~this.lo + 1 >>> 0,
	            hi = ~this.hi     >>> 0;
	        if (!lo)
	            hi = hi + 1 >>> 0;
	        return -(lo + hi * 4294967296);
	    }
	    return this.lo + this.hi * 4294967296;
	};

	/**
	 * Converts this long bits to a long.
	 * @param {boolean} [unsigned=false] Whether unsigned or not
	 * @returns {Long} Long
	 */
	LongBits.prototype.toLong = function toLong(unsigned) {
	    return minimal.Long
	        ? new minimal.Long(this.lo | 0, this.hi | 0, Boolean(unsigned))
	        /* istanbul ignore next */
	        : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
	};

	var charCodeAt = String.prototype.charCodeAt;

	/**
	 * Constructs new long bits from the specified 8 characters long hash.
	 * @param {string} hash Hash
	 * @returns {util.LongBits} Bits
	 */
	LongBits.fromHash = function fromHash(hash) {
	    if (hash === zeroHash)
	        return zero;
	    return new LongBits(
	        ( charCodeAt.call(hash, 0)
	        | charCodeAt.call(hash, 1) << 8
	        | charCodeAt.call(hash, 2) << 16
	        | charCodeAt.call(hash, 3) << 24) >>> 0
	    ,
	        ( charCodeAt.call(hash, 4)
	        | charCodeAt.call(hash, 5) << 8
	        | charCodeAt.call(hash, 6) << 16
	        | charCodeAt.call(hash, 7) << 24) >>> 0
	    );
	};

	/**
	 * Converts this long bits to a 8 characters long hash.
	 * @returns {string} Hash
	 */
	LongBits.prototype.toHash = function toHash() {
	    return String.fromCharCode(
	        this.lo        & 255,
	        this.lo >>> 8  & 255,
	        this.lo >>> 16 & 255,
	        this.lo >>> 24      ,
	        this.hi        & 255,
	        this.hi >>> 8  & 255,
	        this.hi >>> 16 & 255,
	        this.hi >>> 24
	    );
	};

	/**
	 * Zig-zag encodes this long bits.
	 * @returns {util.LongBits} `this`
	 */
	LongBits.prototype.zzEncode = function zzEncode() {
	    var mask =   this.hi >> 31;
	    this.hi  = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
	    this.lo  = ( this.lo << 1                   ^ mask) >>> 0;
	    return this;
	};

	/**
	 * Zig-zag decodes this long bits.
	 * @returns {util.LongBits} `this`
	 */
	LongBits.prototype.zzDecode = function zzDecode() {
	    var mask = -(this.lo & 1);
	    this.lo  = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
	    this.hi  = ( this.hi >>> 1                  ^ mask) >>> 0;
	    return this;
	};

	/**
	 * Calculates the length of this longbits when encoded as a varint.
	 * @returns {number} Length
	 */
	LongBits.prototype.length = function length() {
	    var part0 =  this.lo,
	        part1 = (this.lo >>> 28 | this.hi << 4) >>> 0,
	        part2 =  this.hi >>> 24;
	    return part2 === 0
	         ? part1 === 0
	           ? part0 < 16384
	             ? part0 < 128 ? 1 : 2
	             : part0 < 2097152 ? 3 : 4
	           : part1 < 16384
	             ? part1 < 128 ? 5 : 6
	             : part1 < 2097152 ? 7 : 8
	         : part2 < 128 ? 9 : 10;
	};

	var minimal = createCommonjsModule(function (module, exports) {
	var util = exports;

	// used to return a Promise where callback is omitted
	util.asPromise = aspromise;

	// converts to / from base64 encoded strings
	util.base64 = base64_1;

	// base class of rpc.Service
	util.EventEmitter = eventemitter;

	// float handling accross browsers
	util.float = float_1;

	// requires modules optionally and hides the call from bundlers
	util.inquire = inquire_1;

	// converts to / from utf8 encoded strings
	util.utf8 = utf8_1;

	// provides a node-like buffer pool in the browser
	util.pool = pool_1;

	// utility to work with the low and high bits of a 64 bit value
	util.LongBits = longbits;

	/**
	 * An immuable empty array.
	 * @memberof util
	 * @type {Array.<*>}
	 * @const
	 */
	util.emptyArray = Object.freeze ? Object.freeze([]) : /* istanbul ignore next */ []; // used on prototypes

	/**
	 * An immutable empty object.
	 * @type {Object}
	 * @const
	 */
	util.emptyObject = Object.freeze ? Object.freeze({}) : /* istanbul ignore next */ {}; // used on prototypes

	/**
	 * Whether running within node or not.
	 * @memberof util
	 * @type {boolean}
	 * @const
	 */
	util.isNode = Boolean(commonjsGlobal.process && commonjsGlobal.process.versions && commonjsGlobal.process.versions.node);

	/**
	 * Tests if the specified value is an integer.
	 * @function
	 * @param {*} value Value to test
	 * @returns {boolean} `true` if the value is an integer
	 */
	util.isInteger = Number.isInteger || /* istanbul ignore next */ function isInteger(value) {
	    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
	};

	/**
	 * Tests if the specified value is a string.
	 * @param {*} value Value to test
	 * @returns {boolean} `true` if the value is a string
	 */
	util.isString = function isString(value) {
	    return typeof value === "string" || value instanceof String;
	};

	/**
	 * Tests if the specified value is a non-null object.
	 * @param {*} value Value to test
	 * @returns {boolean} `true` if the value is a non-null object
	 */
	util.isObject = function isObject(value) {
	    return value && typeof value === "object";
	};

	/**
	 * Checks if a property on a message is considered to be present.
	 * This is an alias of {@link util.isSet}.
	 * @function
	 * @param {Object} obj Plain object or message instance
	 * @param {string} prop Property name
	 * @returns {boolean} `true` if considered to be present, otherwise `false`
	 */
	util.isset =

	/**
	 * Checks if a property on a message is considered to be present.
	 * @param {Object} obj Plain object or message instance
	 * @param {string} prop Property name
	 * @returns {boolean} `true` if considered to be present, otherwise `false`
	 */
	util.isSet = function isSet(obj, prop) {
	    var value = obj[prop];
	    if (value != null && obj.hasOwnProperty(prop)) // eslint-disable-line eqeqeq, no-prototype-builtins
	        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
	    return false;
	};

	/**
	 * Any compatible Buffer instance.
	 * This is a minimal stand-alone definition of a Buffer instance. The actual type is that exported by node's typings.
	 * @interface Buffer
	 * @extends Uint8Array
	 */

	/**
	 * Node's Buffer class if available.
	 * @type {Constructor<Buffer>}
	 */
	util.Buffer = (function() {
	    try {
	        var Buffer = util.inquire("buffer").Buffer;
	        // refuse to use non-node buffers if not explicitly assigned (perf reasons):
	        return Buffer.prototype.utf8Write ? Buffer : /* istanbul ignore next */ null;
	    } catch (e) {
	        /* istanbul ignore next */
	        return null;
	    }
	})();

	// Internal alias of or polyfull for Buffer.from.
	util._Buffer_from = null;

	// Internal alias of or polyfill for Buffer.allocUnsafe.
	util._Buffer_allocUnsafe = null;

	/**
	 * Creates a new buffer of whatever type supported by the environment.
	 * @param {number|number[]} [sizeOrArray=0] Buffer size or number array
	 * @returns {Uint8Array|Buffer} Buffer
	 */
	util.newBuffer = function newBuffer(sizeOrArray) {
	    /* istanbul ignore next */
	    return typeof sizeOrArray === "number"
	        ? util.Buffer
	            ? util._Buffer_allocUnsafe(sizeOrArray)
	            : new util.Array(sizeOrArray)
	        : util.Buffer
	            ? util._Buffer_from(sizeOrArray)
	            : typeof Uint8Array === "undefined"
	                ? sizeOrArray
	                : new Uint8Array(sizeOrArray);
	};

	/**
	 * Array implementation used in the browser. `Uint8Array` if supported, otherwise `Array`.
	 * @type {Constructor<Uint8Array>}
	 */
	util.Array = typeof Uint8Array !== "undefined" ? Uint8Array /* istanbul ignore next */ : Array;

	/**
	 * Any compatible Long instance.
	 * This is a minimal stand-alone definition of a Long instance. The actual type is that exported by long.js.
	 * @interface Long
	 * @property {number} low Low bits
	 * @property {number} high High bits
	 * @property {boolean} unsigned Whether unsigned or not
	 */

	/**
	 * Long.js's Long class if available.
	 * @type {Constructor<Long>}
	 */
	util.Long = /* istanbul ignore next */ commonjsGlobal.dcodeIO && /* istanbul ignore next */ commonjsGlobal.dcodeIO.Long || util.inquire("long");

	/**
	 * Regular expression used to verify 2 bit (`bool`) map keys.
	 * @type {RegExp}
	 * @const
	 */
	util.key2Re = /^true|false|0|1$/;

	/**
	 * Regular expression used to verify 32 bit (`int32` etc.) map keys.
	 * @type {RegExp}
	 * @const
	 */
	util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;

	/**
	 * Regular expression used to verify 64 bit (`int64` etc.) map keys.
	 * @type {RegExp}
	 * @const
	 */
	util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;

	/**
	 * Converts a number or long to an 8 characters long hash string.
	 * @param {Long|number} value Value to convert
	 * @returns {string} Hash
	 */
	util.longToHash = function longToHash(value) {
	    return value
	        ? util.LongBits.from(value).toHash()
	        : util.LongBits.zeroHash;
	};

	/**
	 * Converts an 8 characters long hash string to a long or number.
	 * @param {string} hash Hash
	 * @param {boolean} [unsigned=false] Whether unsigned or not
	 * @returns {Long|number} Original value
	 */
	util.longFromHash = function longFromHash(hash, unsigned) {
	    var bits = util.LongBits.fromHash(hash);
	    if (util.Long)
	        return util.Long.fromBits(bits.lo, bits.hi, unsigned);
	    return bits.toNumber(Boolean(unsigned));
	};

	/**
	 * Merges the properties of the source object into the destination object.
	 * @memberof util
	 * @param {Object.<string,*>} dst Destination object
	 * @param {Object.<string,*>} src Source object
	 * @param {boolean} [ifNotSet=false] Merges only if the key is not already set
	 * @returns {Object.<string,*>} Destination object
	 */
	function merge(dst, src, ifNotSet) { // used by converters
	    for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
	        if (dst[keys[i]] === undefined || !ifNotSet)
	            dst[keys[i]] = src[keys[i]];
	    return dst;
	}

	util.merge = merge;

	/**
	 * Converts the first character of a string to lower case.
	 * @param {string} str String to convert
	 * @returns {string} Converted string
	 */
	util.lcFirst = function lcFirst(str) {
	    return str.charAt(0).toLowerCase() + str.substring(1);
	};

	/**
	 * Creates a custom error constructor.
	 * @memberof util
	 * @param {string} name Error name
	 * @returns {Constructor<Error>} Custom error constructor
	 */
	function newError(name) {

	    function CustomError(message, properties) {

	        if (!(this instanceof CustomError))
	            return new CustomError(message, properties);

	        // Error.call(this, message);
	        // ^ just returns a new error instance because the ctor can be called as a function

	        Object.defineProperty(this, "message", { get: function() { return message; } });

	        /* istanbul ignore next */
	        if (Error.captureStackTrace) // node
	            Error.captureStackTrace(this, CustomError);
	        else
	            Object.defineProperty(this, "stack", { value: (new Error()).stack || "" });

	        if (properties)
	            merge(this, properties);
	    }

	    (CustomError.prototype = Object.create(Error.prototype)).constructor = CustomError;

	    Object.defineProperty(CustomError.prototype, "name", { get: function() { return name; } });

	    CustomError.prototype.toString = function toString() {
	        return this.name + ": " + this.message;
	    };

	    return CustomError;
	}

	util.newError = newError;

	/**
	 * Constructs a new protocol error.
	 * @classdesc Error subclass indicating a protocol specifc error.
	 * @memberof util
	 * @extends Error
	 * @template T extends Message<T>
	 * @constructor
	 * @param {string} message Error message
	 * @param {Object.<string,*>} [properties] Additional properties
	 * @example
	 * try {
	 *     MyMessage.decode(someBuffer); // throws if required fields are missing
	 * } catch (e) {
	 *     if (e instanceof ProtocolError && e.instance)
	 *         console.log("decoded so far: " + JSON.stringify(e.instance));
	 * }
	 */
	util.ProtocolError = newError("ProtocolError");

	/**
	 * So far decoded message instance.
	 * @name util.ProtocolError#instance
	 * @type {Message<T>}
	 */

	/**
	 * A OneOf getter as returned by {@link util.oneOfGetter}.
	 * @typedef OneOfGetter
	 * @type {function}
	 * @returns {string|undefined} Set field name, if any
	 */

	/**
	 * Builds a getter for a oneof's present field name.
	 * @param {string[]} fieldNames Field names
	 * @returns {OneOfGetter} Unbound getter
	 */
	util.oneOfGetter = function getOneOf(fieldNames) {
	    var fieldMap = {};
	    for (var i = 0; i < fieldNames.length; ++i)
	        fieldMap[fieldNames[i]] = 1;

	    /**
	     * @returns {string|undefined} Set field name, if any
	     * @this Object
	     * @ignore
	     */
	    return function() { // eslint-disable-line consistent-return
	        for (var keys = Object.keys(this), i = keys.length - 1; i > -1; --i)
	            if (fieldMap[keys[i]] === 1 && this[keys[i]] !== undefined && this[keys[i]] !== null)
	                return keys[i];
	    };
	};

	/**
	 * A OneOf setter as returned by {@link util.oneOfSetter}.
	 * @typedef OneOfSetter
	 * @type {function}
	 * @param {string|undefined} value Field name
	 * @returns {undefined}
	 */

	/**
	 * Builds a setter for a oneof's present field name.
	 * @param {string[]} fieldNames Field names
	 * @returns {OneOfSetter} Unbound setter
	 */
	util.oneOfSetter = function setOneOf(fieldNames) {

	    /**
	     * @param {string} name Field name
	     * @returns {undefined}
	     * @this Object
	     * @ignore
	     */
	    return function(name) {
	        for (var i = 0; i < fieldNames.length; ++i)
	            if (fieldNames[i] !== name)
	                delete this[fieldNames[i]];
	    };
	};

	/**
	 * Default conversion options used for {@link Message#toJSON} implementations.
	 *
	 * These options are close to proto3's JSON mapping with the exception that internal types like Any are handled just like messages. More precisely:
	 *
	 * - Longs become strings
	 * - Enums become string keys
	 * - Bytes become base64 encoded strings
	 * - (Sub-)Messages become plain objects
	 * - Maps become plain objects with all string keys
	 * - Repeated fields become arrays
	 * - NaN and Infinity for float and double fields become strings
	 *
	 * @type {IConversionOptions}
	 * @see https://developers.google.com/protocol-buffers/docs/proto3?hl=en#json
	 */
	util.toJSONOptions = {
	    longs: String,
	    enums: String,
	    bytes: String,
	    json: true
	};

	util._configure = function() {
	    var Buffer = util.Buffer;
	    /* istanbul ignore if */
	    if (!Buffer) {
	        util._Buffer_from = util._Buffer_allocUnsafe = null;
	        return;
	    }
	    // because node 4.x buffers are incompatible & immutable
	    // see: https://github.com/dcodeIO/protobuf.js/pull/665
	    util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from ||
	        /* istanbul ignore next */
	        function Buffer_from(value, encoding) {
	            return new Buffer(value, encoding);
	        };
	    util._Buffer_allocUnsafe = Buffer.allocUnsafe ||
	        /* istanbul ignore next */
	        function Buffer_allocUnsafe(size) {
	            return new Buffer(size);
	        };
	};
	});

	var writer = Writer;



	var BufferWriter; // cyclic

	var LongBits$1  = minimal.LongBits,
	    base64    = minimal.base64,
	    utf8      = minimal.utf8;

	/**
	 * Constructs a new writer operation instance.
	 * @classdesc Scheduled writer operation.
	 * @constructor
	 * @param {function(*, Uint8Array, number)} fn Function to call
	 * @param {number} len Value byte length
	 * @param {*} val Value to write
	 * @ignore
	 */
	function Op(fn, len, val) {

	    /**
	     * Function to call.
	     * @type {function(Uint8Array, number, *)}
	     */
	    this.fn = fn;

	    /**
	     * Value byte length.
	     * @type {number}
	     */
	    this.len = len;

	    /**
	     * Next operation.
	     * @type {Writer.Op|undefined}
	     */
	    this.next = undefined;

	    /**
	     * Value to write.
	     * @type {*}
	     */
	    this.val = val; // type varies
	}

	/* istanbul ignore next */
	function noop() {} // eslint-disable-line no-empty-function

	/**
	 * Constructs a new writer state instance.
	 * @classdesc Copied writer state.
	 * @memberof Writer
	 * @constructor
	 * @param {Writer} writer Writer to copy state from
	 * @ignore
	 */
	function State(writer) {

	    /**
	     * Current head.
	     * @type {Writer.Op}
	     */
	    this.head = writer.head;

	    /**
	     * Current tail.
	     * @type {Writer.Op}
	     */
	    this.tail = writer.tail;

	    /**
	     * Current buffer length.
	     * @type {number}
	     */
	    this.len = writer.len;

	    /**
	     * Next state.
	     * @type {State|null}
	     */
	    this.next = writer.states;
	}

	/**
	 * Constructs a new writer instance.
	 * @classdesc Wire format writer using `Uint8Array` if available, otherwise `Array`.
	 * @constructor
	 */
	function Writer() {

	    /**
	     * Current length.
	     * @type {number}
	     */
	    this.len = 0;

	    /**
	     * Operations head.
	     * @type {Object}
	     */
	    this.head = new Op(noop, 0, 0);

	    /**
	     * Operations tail
	     * @type {Object}
	     */
	    this.tail = this.head;

	    /**
	     * Linked forked states.
	     * @type {Object|null}
	     */
	    this.states = null;

	    // When a value is written, the writer calculates its byte length and puts it into a linked
	    // list of operations to perform when finish() is called. This both allows us to allocate
	    // buffers of the exact required size and reduces the amount of work we have to do compared
	    // to first calculating over objects and then encoding over objects. In our case, the encoding
	    // part is just a linked list walk calling operations with already prepared values.
	}

	/**
	 * Creates a new writer.
	 * @function
	 * @returns {BufferWriter|Writer} A {@link BufferWriter} when Buffers are supported, otherwise a {@link Writer}
	 */
	Writer.create = minimal.Buffer
	    ? function create_buffer_setup() {
	        return (Writer.create = function create_buffer() {
	            return new BufferWriter();
	        })();
	    }
	    /* istanbul ignore next */
	    : function create_array() {
	        return new Writer();
	    };

	/**
	 * Allocates a buffer of the specified size.
	 * @param {number} size Buffer size
	 * @returns {Uint8Array} Buffer
	 */
	Writer.alloc = function alloc(size) {
	    return new minimal.Array(size);
	};

	// Use Uint8Array buffer pool in the browser, just like node does with buffers
	/* istanbul ignore else */
	if (minimal.Array !== Array)
	    Writer.alloc = minimal.pool(Writer.alloc, minimal.Array.prototype.subarray);

	/**
	 * Pushes a new operation to the queue.
	 * @param {function(Uint8Array, number, *)} fn Function to call
	 * @param {number} len Value byte length
	 * @param {number} val Value to write
	 * @returns {Writer} `this`
	 * @private
	 */
	Writer.prototype._push = function push(fn, len, val) {
	    this.tail = this.tail.next = new Op(fn, len, val);
	    this.len += len;
	    return this;
	};

	function writeByte(val, buf, pos) {
	    buf[pos] = val & 255;
	}

	function writeVarint32(val, buf, pos) {
	    while (val > 127) {
	        buf[pos++] = val & 127 | 128;
	        val >>>= 7;
	    }
	    buf[pos] = val;
	}

	/**
	 * Constructs a new varint writer operation instance.
	 * @classdesc Scheduled varint writer operation.
	 * @extends Op
	 * @constructor
	 * @param {number} len Value byte length
	 * @param {number} val Value to write
	 * @ignore
	 */
	function VarintOp(len, val) {
	    this.len = len;
	    this.next = undefined;
	    this.val = val;
	}

	VarintOp.prototype = Object.create(Op.prototype);
	VarintOp.prototype.fn = writeVarint32;

	/**
	 * Writes an unsigned 32 bit value as a varint.
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.uint32 = function write_uint32(value) {
	    // here, the call to this.push has been inlined and a varint specific Op subclass is used.
	    // uint32 is by far the most frequently used operation and benefits significantly from this.
	    this.len += (this.tail = this.tail.next = new VarintOp(
	        (value = value >>> 0)
	                < 128       ? 1
	        : value < 16384     ? 2
	        : value < 2097152   ? 3
	        : value < 268435456 ? 4
	        :                     5,
	    value)).len;
	    return this;
	};

	/**
	 * Writes a signed 32 bit value as a varint.
	 * @function
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.int32 = function write_int32(value) {
	    return value < 0
	        ? this._push(writeVarint64, 10, LongBits$1.fromNumber(value)) // 10 bytes per spec
	        : this.uint32(value);
	};

	/**
	 * Writes a 32 bit value as a varint, zig-zag encoded.
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.sint32 = function write_sint32(value) {
	    return this.uint32((value << 1 ^ value >> 31) >>> 0);
	};

	function writeVarint64(val, buf, pos) {
	    while (val.hi) {
	        buf[pos++] = val.lo & 127 | 128;
	        val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
	        val.hi >>>= 7;
	    }
	    while (val.lo > 127) {
	        buf[pos++] = val.lo & 127 | 128;
	        val.lo = val.lo >>> 7;
	    }
	    buf[pos++] = val.lo;
	}

	/**
	 * Writes an unsigned 64 bit value as a varint.
	 * @param {Long|number|string} value Value to write
	 * @returns {Writer} `this`
	 * @throws {TypeError} If `value` is a string and no long library is present.
	 */
	Writer.prototype.uint64 = function write_uint64(value) {
	    var bits = LongBits$1.from(value);
	    return this._push(writeVarint64, bits.length(), bits);
	};

	/**
	 * Writes a signed 64 bit value as a varint.
	 * @function
	 * @param {Long|number|string} value Value to write
	 * @returns {Writer} `this`
	 * @throws {TypeError} If `value` is a string and no long library is present.
	 */
	Writer.prototype.int64 = Writer.prototype.uint64;

	/**
	 * Writes a signed 64 bit value as a varint, zig-zag encoded.
	 * @param {Long|number|string} value Value to write
	 * @returns {Writer} `this`
	 * @throws {TypeError} If `value` is a string and no long library is present.
	 */
	Writer.prototype.sint64 = function write_sint64(value) {
	    var bits = LongBits$1.from(value).zzEncode();
	    return this._push(writeVarint64, bits.length(), bits);
	};

	/**
	 * Writes a boolish value as a varint.
	 * @param {boolean} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.bool = function write_bool(value) {
	    return this._push(writeByte, 1, value ? 1 : 0);
	};

	function writeFixed32(val, buf, pos) {
	    buf[pos    ] =  val         & 255;
	    buf[pos + 1] =  val >>> 8   & 255;
	    buf[pos + 2] =  val >>> 16  & 255;
	    buf[pos + 3] =  val >>> 24;
	}

	/**
	 * Writes an unsigned 32 bit value as fixed 32 bits.
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.fixed32 = function write_fixed32(value) {
	    return this._push(writeFixed32, 4, value >>> 0);
	};

	/**
	 * Writes a signed 32 bit value as fixed 32 bits.
	 * @function
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.sfixed32 = Writer.prototype.fixed32;

	/**
	 * Writes an unsigned 64 bit value as fixed 64 bits.
	 * @param {Long|number|string} value Value to write
	 * @returns {Writer} `this`
	 * @throws {TypeError} If `value` is a string and no long library is present.
	 */
	Writer.prototype.fixed64 = function write_fixed64(value) {
	    var bits = LongBits$1.from(value);
	    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
	};

	/**
	 * Writes a signed 64 bit value as fixed 64 bits.
	 * @function
	 * @param {Long|number|string} value Value to write
	 * @returns {Writer} `this`
	 * @throws {TypeError} If `value` is a string and no long library is present.
	 */
	Writer.prototype.sfixed64 = Writer.prototype.fixed64;

	/**
	 * Writes a float (32 bit).
	 * @function
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.float = function write_float(value) {
	    return this._push(minimal.float.writeFloatLE, 4, value);
	};

	/**
	 * Writes a double (64 bit float).
	 * @function
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.double = function write_double(value) {
	    return this._push(minimal.float.writeDoubleLE, 8, value);
	};

	var writeBytes = minimal.Array.prototype.set
	    ? function writeBytes_set(val, buf, pos) {
	        buf.set(val, pos); // also works for plain array values
	    }
	    /* istanbul ignore next */
	    : function writeBytes_for(val, buf, pos) {
	        for (var i = 0; i < val.length; ++i)
	            buf[pos + i] = val[i];
	    };

	/**
	 * Writes a sequence of bytes.
	 * @param {Uint8Array|string} value Buffer or base64 encoded string to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.bytes = function write_bytes(value) {
	    var len = value.length >>> 0;
	    if (!len)
	        return this._push(writeByte, 1, 0);
	    if (minimal.isString(value)) {
	        var buf = Writer.alloc(len = base64.length(value));
	        base64.decode(value, buf, 0);
	        value = buf;
	    }
	    return this.uint32(len)._push(writeBytes, len, value);
	};

	/**
	 * Writes a string.
	 * @param {string} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.string = function write_string(value) {
	    var len = utf8.length(value);
	    return len
	        ? this.uint32(len)._push(utf8.write, len, value)
	        : this._push(writeByte, 1, 0);
	};

	/**
	 * Forks this writer's state by pushing it to a stack.
	 * Calling {@link Writer#reset|reset} or {@link Writer#ldelim|ldelim} resets the writer to the previous state.
	 * @returns {Writer} `this`
	 */
	Writer.prototype.fork = function fork() {
	    this.states = new State(this);
	    this.head = this.tail = new Op(noop, 0, 0);
	    this.len = 0;
	    return this;
	};

	/**
	 * Resets this instance to the last state.
	 * @returns {Writer} `this`
	 */
	Writer.prototype.reset = function reset() {
	    if (this.states) {
	        this.head   = this.states.head;
	        this.tail   = this.states.tail;
	        this.len    = this.states.len;
	        this.states = this.states.next;
	    } else {
	        this.head = this.tail = new Op(noop, 0, 0);
	        this.len  = 0;
	    }
	    return this;
	};

	/**
	 * Resets to the last state and appends the fork state's current write length as a varint followed by its operations.
	 * @returns {Writer} `this`
	 */
	Writer.prototype.ldelim = function ldelim() {
	    var head = this.head,
	        tail = this.tail,
	        len  = this.len;
	    this.reset().uint32(len);
	    if (len) {
	        this.tail.next = head.next; // skip noop
	        this.tail = tail;
	        this.len += len;
	    }
	    return this;
	};

	/**
	 * Finishes the write operation.
	 * @returns {Uint8Array} Finished buffer
	 */
	Writer.prototype.finish = function finish() {
	    var head = this.head.next, // skip noop
	        buf  = this.constructor.alloc(this.len),
	        pos  = 0;
	    while (head) {
	        head.fn(head.val, buf, pos);
	        pos += head.len;
	        head = head.next;
	    }
	    // this.head = this.tail = null;
	    return buf;
	};

	Writer._configure = function(BufferWriter_) {
	    BufferWriter = BufferWriter_;
	};

	var writer_buffer = BufferWriter$1;

	// extends Writer

	(BufferWriter$1.prototype = Object.create(writer.prototype)).constructor = BufferWriter$1;



	var Buffer = minimal.Buffer;

	/**
	 * Constructs a new buffer writer instance.
	 * @classdesc Wire format writer using node buffers.
	 * @extends Writer
	 * @constructor
	 */
	function BufferWriter$1() {
	    writer.call(this);
	}

	/**
	 * Allocates a buffer of the specified size.
	 * @param {number} size Buffer size
	 * @returns {Buffer} Buffer
	 */
	BufferWriter$1.alloc = function alloc_buffer(size) {
	    return (BufferWriter$1.alloc = minimal._Buffer_allocUnsafe)(size);
	};

	var writeBytesBuffer = Buffer && Buffer.prototype instanceof Uint8Array && Buffer.prototype.set.name === "set"
	    ? function writeBytesBuffer_set(val, buf, pos) {
	        buf.set(val, pos); // faster than copy (requires node >= 4 where Buffers extend Uint8Array and set is properly inherited)
	                           // also works for plain array values
	    }
	    /* istanbul ignore next */
	    : function writeBytesBuffer_copy(val, buf, pos) {
	        if (val.copy) // Buffer values
	            val.copy(buf, pos, 0, val.length);
	        else for (var i = 0; i < val.length;) // plain array values
	            buf[pos++] = val[i++];
	    };

	/**
	 * @override
	 */
	BufferWriter$1.prototype.bytes = function write_bytes_buffer(value) {
	    if (minimal.isString(value))
	        value = minimal._Buffer_from(value, "base64");
	    var len = value.length >>> 0;
	    this.uint32(len);
	    if (len)
	        this._push(writeBytesBuffer, len, value);
	    return this;
	};

	function writeStringBuffer(val, buf, pos) {
	    if (val.length < 40) // plain js is faster for short strings (probably due to redundant assertions)
	        minimal.utf8.write(val, buf, pos);
	    else
	        buf.utf8Write(val, pos);
	}

	/**
	 * @override
	 */
	BufferWriter$1.prototype.string = function write_string_buffer(value) {
	    var len = Buffer.byteLength(value);
	    this.uint32(len);
	    if (len)
	        this._push(writeStringBuffer, len, value);
	    return this;
	};

	var reader = Reader;



	var BufferReader; // cyclic

	var LongBits$2  = minimal.LongBits,
	    utf8$1      = minimal.utf8;

	/* istanbul ignore next */
	function indexOutOfRange(reader, writeLength) {
	    return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
	}

	/**
	 * Constructs a new reader instance using the specified buffer.
	 * @classdesc Wire format reader using `Uint8Array` if available, otherwise `Array`.
	 * @constructor
	 * @param {Uint8Array} buffer Buffer to read from
	 */
	function Reader(buffer) {

	    /**
	     * Read buffer.
	     * @type {Uint8Array}
	     */
	    this.buf = buffer;

	    /**
	     * Read buffer position.
	     * @type {number}
	     */
	    this.pos = 0;

	    /**
	     * Read buffer length.
	     * @type {number}
	     */
	    this.len = buffer.length;
	}

	var create_array = typeof Uint8Array !== "undefined"
	    ? function create_typed_array(buffer) {
	        if (buffer instanceof Uint8Array || Array.isArray(buffer))
	            return new Reader(buffer);
	        throw Error("illegal buffer");
	    }
	    /* istanbul ignore next */
	    : function create_array(buffer) {
	        if (Array.isArray(buffer))
	            return new Reader(buffer);
	        throw Error("illegal buffer");
	    };

	/**
	 * Creates a new reader using the specified buffer.
	 * @function
	 * @param {Uint8Array|Buffer} buffer Buffer to read from
	 * @returns {Reader|BufferReader} A {@link BufferReader} if `buffer` is a Buffer, otherwise a {@link Reader}
	 * @throws {Error} If `buffer` is not a valid buffer
	 */
	Reader.create = minimal.Buffer
	    ? function create_buffer_setup(buffer) {
	        return (Reader.create = function create_buffer(buffer) {
	            return minimal.Buffer.isBuffer(buffer)
	                ? new BufferReader(buffer)
	                /* istanbul ignore next */
	                : create_array(buffer);
	        })(buffer);
	    }
	    /* istanbul ignore next */
	    : create_array;

	Reader.prototype._slice = minimal.Array.prototype.subarray || /* istanbul ignore next */ minimal.Array.prototype.slice;

	/**
	 * Reads a varint as an unsigned 32 bit value.
	 * @function
	 * @returns {number} Value read
	 */
	Reader.prototype.uint32 = (function read_uint32_setup() {
	    var value = 4294967295; // optimizer type-hint, tends to deopt otherwise (?!)
	    return function read_uint32() {
	        value = (         this.buf[this.pos] & 127       ) >>> 0; if (this.buf[this.pos++] < 128) return value;
	        value = (value | (this.buf[this.pos] & 127) <<  7) >>> 0; if (this.buf[this.pos++] < 128) return value;
	        value = (value | (this.buf[this.pos] & 127) << 14) >>> 0; if (this.buf[this.pos++] < 128) return value;
	        value = (value | (this.buf[this.pos] & 127) << 21) >>> 0; if (this.buf[this.pos++] < 128) return value;
	        value = (value | (this.buf[this.pos] &  15) << 28) >>> 0; if (this.buf[this.pos++] < 128) return value;

	        /* istanbul ignore if */
	        if ((this.pos += 5) > this.len) {
	            this.pos = this.len;
	            throw indexOutOfRange(this, 10);
	        }
	        return value;
	    };
	})();

	/**
	 * Reads a varint as a signed 32 bit value.
	 * @returns {number} Value read
	 */
	Reader.prototype.int32 = function read_int32() {
	    return this.uint32() | 0;
	};

	/**
	 * Reads a zig-zag encoded varint as a signed 32 bit value.
	 * @returns {number} Value read
	 */
	Reader.prototype.sint32 = function read_sint32() {
	    var value = this.uint32();
	    return value >>> 1 ^ -(value & 1) | 0;
	};

	/* eslint-disable no-invalid-this */

	function readLongVarint() {
	    // tends to deopt with local vars for octet etc.
	    var bits = new LongBits$2(0, 0);
	    var i = 0;
	    if (this.len - this.pos > 4) { // fast route (lo)
	        for (; i < 4; ++i) {
	            // 1st..4th
	            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
	            if (this.buf[this.pos++] < 128)
	                return bits;
	        }
	        // 5th
	        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
	        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >>  4) >>> 0;
	        if (this.buf[this.pos++] < 128)
	            return bits;
	        i = 0;
	    } else {
	        for (; i < 3; ++i) {
	            /* istanbul ignore if */
	            if (this.pos >= this.len)
	                throw indexOutOfRange(this);
	            // 1st..3th
	            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
	            if (this.buf[this.pos++] < 128)
	                return bits;
	        }
	        // 4th
	        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
	        return bits;
	    }
	    if (this.len - this.pos > 4) { // fast route (hi)
	        for (; i < 5; ++i) {
	            // 6th..10th
	            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
	            if (this.buf[this.pos++] < 128)
	                return bits;
	        }
	    } else {
	        for (; i < 5; ++i) {
	            /* istanbul ignore if */
	            if (this.pos >= this.len)
	                throw indexOutOfRange(this);
	            // 6th..10th
	            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
	            if (this.buf[this.pos++] < 128)
	                return bits;
	        }
	    }
	    /* istanbul ignore next */
	    throw Error("invalid varint encoding");
	}

	/* eslint-enable no-invalid-this */

	/**
	 * Reads a varint as a signed 64 bit value.
	 * @name Reader#int64
	 * @function
	 * @returns {Long} Value read
	 */

	/**
	 * Reads a varint as an unsigned 64 bit value.
	 * @name Reader#uint64
	 * @function
	 * @returns {Long} Value read
	 */

	/**
	 * Reads a zig-zag encoded varint as a signed 64 bit value.
	 * @name Reader#sint64
	 * @function
	 * @returns {Long} Value read
	 */

	/**
	 * Reads a varint as a boolean.
	 * @returns {boolean} Value read
	 */
	Reader.prototype.bool = function read_bool() {
	    return this.uint32() !== 0;
	};

	function readFixed32_end(buf, end) { // note that this uses `end`, not `pos`
	    return (buf[end - 4]
	          | buf[end - 3] << 8
	          | buf[end - 2] << 16
	          | buf[end - 1] << 24) >>> 0;
	}

	/**
	 * Reads fixed 32 bits as an unsigned 32 bit integer.
	 * @returns {number} Value read
	 */
	Reader.prototype.fixed32 = function read_fixed32() {

	    /* istanbul ignore if */
	    if (this.pos + 4 > this.len)
	        throw indexOutOfRange(this, 4);

	    return readFixed32_end(this.buf, this.pos += 4);
	};

	/**
	 * Reads fixed 32 bits as a signed 32 bit integer.
	 * @returns {number} Value read
	 */
	Reader.prototype.sfixed32 = function read_sfixed32() {

	    /* istanbul ignore if */
	    if (this.pos + 4 > this.len)
	        throw indexOutOfRange(this, 4);

	    return readFixed32_end(this.buf, this.pos += 4) | 0;
	};

	/* eslint-disable no-invalid-this */

	function readFixed64(/* this: Reader */) {

	    /* istanbul ignore if */
	    if (this.pos + 8 > this.len)
	        throw indexOutOfRange(this, 8);

	    return new LongBits$2(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
	}

	/* eslint-enable no-invalid-this */

	/**
	 * Reads fixed 64 bits.
	 * @name Reader#fixed64
	 * @function
	 * @returns {Long} Value read
	 */

	/**
	 * Reads zig-zag encoded fixed 64 bits.
	 * @name Reader#sfixed64
	 * @function
	 * @returns {Long} Value read
	 */

	/**
	 * Reads a float (32 bit) as a number.
	 * @function
	 * @returns {number} Value read
	 */
	Reader.prototype.float = function read_float() {

	    /* istanbul ignore if */
	    if (this.pos + 4 > this.len)
	        throw indexOutOfRange(this, 4);

	    var value = minimal.float.readFloatLE(this.buf, this.pos);
	    this.pos += 4;
	    return value;
	};

	/**
	 * Reads a double (64 bit float) as a number.
	 * @function
	 * @returns {number} Value read
	 */
	Reader.prototype.double = function read_double() {

	    /* istanbul ignore if */
	    if (this.pos + 8 > this.len)
	        throw indexOutOfRange(this, 4);

	    var value = minimal.float.readDoubleLE(this.buf, this.pos);
	    this.pos += 8;
	    return value;
	};

	/**
	 * Reads a sequence of bytes preceeded by its length as a varint.
	 * @returns {Uint8Array} Value read
	 */
	Reader.prototype.bytes = function read_bytes() {
	    var length = this.uint32(),
	        start  = this.pos,
	        end    = this.pos + length;

	    /* istanbul ignore if */
	    if (end > this.len)
	        throw indexOutOfRange(this, length);

	    this.pos += length;
	    if (Array.isArray(this.buf)) // plain array
	        return this.buf.slice(start, end);
	    return start === end // fix for IE 10/Win8 and others' subarray returning array of size 1
	        ? new this.buf.constructor(0)
	        : this._slice.call(this.buf, start, end);
	};

	/**
	 * Reads a string preceeded by its byte length as a varint.
	 * @returns {string} Value read
	 */
	Reader.prototype.string = function read_string() {
	    var bytes = this.bytes();
	    return utf8$1.read(bytes, 0, bytes.length);
	};

	/**
	 * Skips the specified number of bytes if specified, otherwise skips a varint.
	 * @param {number} [length] Length if known, otherwise a varint is assumed
	 * @returns {Reader} `this`
	 */
	Reader.prototype.skip = function skip(length) {
	    if (typeof length === "number") {
	        /* istanbul ignore if */
	        if (this.pos + length > this.len)
	            throw indexOutOfRange(this, length);
	        this.pos += length;
	    } else {
	        do {
	            /* istanbul ignore if */
	            if (this.pos >= this.len)
	                throw indexOutOfRange(this);
	        } while (this.buf[this.pos++] & 128);
	    }
	    return this;
	};

	/**
	 * Skips the next element of the specified wire type.
	 * @param {number} wireType Wire type received
	 * @returns {Reader} `this`
	 */
	Reader.prototype.skipType = function(wireType) {
	    switch (wireType) {
	        case 0:
	            this.skip();
	            break;
	        case 1:
	            this.skip(8);
	            break;
	        case 2:
	            this.skip(this.uint32());
	            break;
	        case 3:
	            do { // eslint-disable-line no-constant-condition
	                if ((wireType = this.uint32() & 7) === 4)
	                    break;
	                this.skipType(wireType);
	            } while (true);
	            break;
	        case 5:
	            this.skip(4);
	            break;

	        /* istanbul ignore next */
	        default:
	            throw Error("invalid wire type " + wireType + " at offset " + this.pos);
	    }
	    return this;
	};

	Reader._configure = function(BufferReader_) {
	    BufferReader = BufferReader_;

	    var fn = minimal.Long ? "toLong" : /* istanbul ignore next */ "toNumber";
	    minimal.merge(Reader.prototype, {

	        int64: function read_int64() {
	            return readLongVarint.call(this)[fn](false);
	        },

	        uint64: function read_uint64() {
	            return readLongVarint.call(this)[fn](true);
	        },

	        sint64: function read_sint64() {
	            return readLongVarint.call(this).zzDecode()[fn](false);
	        },

	        fixed64: function read_fixed64() {
	            return readFixed64.call(this)[fn](true);
	        },

	        sfixed64: function read_sfixed64() {
	            return readFixed64.call(this)[fn](false);
	        }

	    });
	};

	var reader_buffer = BufferReader$1;

	// extends Reader

	(BufferReader$1.prototype = Object.create(reader.prototype)).constructor = BufferReader$1;



	/**
	 * Constructs a new buffer reader instance.
	 * @classdesc Wire format reader using node buffers.
	 * @extends Reader
	 * @constructor
	 * @param {Buffer} buffer Buffer to read from
	 */
	function BufferReader$1(buffer) {
	    reader.call(this, buffer);

	    /**
	     * Read buffer.
	     * @name BufferReader#buf
	     * @type {Buffer}
	     */
	}

	/* istanbul ignore else */
	if (minimal.Buffer)
	    BufferReader$1.prototype._slice = minimal.Buffer.prototype.slice;

	/**
	 * @override
	 */
	BufferReader$1.prototype.string = function read_string_buffer() {
	    var len = this.uint32(); // modifies pos
	    return this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len));
	};

	var service = Service;



	// Extends EventEmitter
	(Service.prototype = Object.create(minimal.EventEmitter.prototype)).constructor = Service;

	/**
	 * A service method callback as used by {@link rpc.ServiceMethod|ServiceMethod}.
	 *
	 * Differs from {@link RPCImplCallback} in that it is an actual callback of a service method which may not return `response = null`.
	 * @typedef rpc.ServiceMethodCallback
	 * @template TRes extends Message<TRes>
	 * @type {function}
	 * @param {Error|null} error Error, if any
	 * @param {TRes} [response] Response message
	 * @returns {undefined}
	 */

	/**
	 * A service method part of a {@link rpc.Service} as created by {@link Service.create}.
	 * @typedef rpc.ServiceMethod
	 * @template TReq extends Message<TReq>
	 * @template TRes extends Message<TRes>
	 * @type {function}
	 * @param {TReq|Properties<TReq>} request Request message or plain object
	 * @param {rpc.ServiceMethodCallback<TRes>} [callback] Node-style callback called with the error, if any, and the response message
	 * @returns {Promise<Message<TRes>>} Promise if `callback` has been omitted, otherwise `undefined`
	 */

	/**
	 * Constructs a new RPC service instance.
	 * @classdesc An RPC service as returned by {@link Service#create}.
	 * @exports rpc.Service
	 * @extends util.EventEmitter
	 * @constructor
	 * @param {RPCImpl} rpcImpl RPC implementation
	 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
	 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
	 */
	function Service(rpcImpl, requestDelimited, responseDelimited) {

	    if (typeof rpcImpl !== "function")
	        throw TypeError("rpcImpl must be a function");

	    minimal.EventEmitter.call(this);

	    /**
	     * RPC implementation. Becomes `null` once the service is ended.
	     * @type {RPCImpl|null}
	     */
	    this.rpcImpl = rpcImpl;

	    /**
	     * Whether requests are length-delimited.
	     * @type {boolean}
	     */
	    this.requestDelimited = Boolean(requestDelimited);

	    /**
	     * Whether responses are length-delimited.
	     * @type {boolean}
	     */
	    this.responseDelimited = Boolean(responseDelimited);
	}

	/**
	 * Calls a service method through {@link rpc.Service#rpcImpl|rpcImpl}.
	 * @param {Method|rpc.ServiceMethod<TReq,TRes>} method Reflected or static method
	 * @param {Constructor<TReq>} requestCtor Request constructor
	 * @param {Constructor<TRes>} responseCtor Response constructor
	 * @param {TReq|Properties<TReq>} request Request message or plain object
	 * @param {rpc.ServiceMethodCallback<TRes>} callback Service callback
	 * @returns {undefined}
	 * @template TReq extends Message<TReq>
	 * @template TRes extends Message<TRes>
	 */
	Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {

	    if (!request)
	        throw TypeError("request must be specified");

	    var self = this;
	    if (!callback)
	        return minimal.asPromise(rpcCall, self, method, requestCtor, responseCtor, request);

	    if (!self.rpcImpl) {
	        setTimeout(function() { callback(Error("already ended")); }, 0);
	        return undefined;
	    }

	    try {
	        return self.rpcImpl(
	            method,
	            requestCtor[self.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
	            function rpcCallback(err, response) {

	                if (err) {
	                    self.emit("error", err, method);
	                    return callback(err);
	                }

	                if (response === null) {
	                    self.end(/* endedByRPC */ true);
	                    return undefined;
	                }

	                if (!(response instanceof responseCtor)) {
	                    try {
	                        response = responseCtor[self.responseDelimited ? "decodeDelimited" : "decode"](response);
	                    } catch (err) {
	                        self.emit("error", err, method);
	                        return callback(err);
	                    }
	                }

	                self.emit("data", response, method);
	                return callback(null, response);
	            }
	        );
	    } catch (err) {
	        self.emit("error", err, method);
	        setTimeout(function() { callback(err); }, 0);
	        return undefined;
	    }
	};

	/**
	 * Ends this service and emits the `end` event.
	 * @param {boolean} [endedByRPC=false] Whether the service has been ended by the RPC implementation.
	 * @returns {rpc.Service} `this`
	 */
	Service.prototype.end = function end(endedByRPC) {
	    if (this.rpcImpl) {
	        if (!endedByRPC) // signal end to rpcImpl
	            this.rpcImpl(null, null, null);
	        this.rpcImpl = null;
	        this.emit("end").off();
	    }
	    return this;
	};

	var rpc_1 = createCommonjsModule(function (module, exports) {

	/**
	 * Streaming RPC helpers.
	 * @namespace
	 */
	var rpc = exports;

	/**
	 * RPC implementation passed to {@link Service#create} performing a service request on network level, i.e. by utilizing http requests or websockets.
	 * @typedef RPCImpl
	 * @type {function}
	 * @param {Method|rpc.ServiceMethod<Message<{}>,Message<{}>>} method Reflected or static method being called
	 * @param {Uint8Array} requestData Request data
	 * @param {RPCImplCallback} callback Callback function
	 * @returns {undefined}
	 * @example
	 * function rpcImpl(method, requestData, callback) {
	 *     if (protobuf.util.lcFirst(method.name) !== "myMethod") // compatible with static code
	 *         throw Error("no such method");
	 *     asynchronouslyObtainAResponse(requestData, function(err, responseData) {
	 *         callback(err, responseData);
	 *     });
	 * }
	 */

	/**
	 * Node-style callback as used by {@link RPCImpl}.
	 * @typedef RPCImplCallback
	 * @type {function}
	 * @param {Error|null} error Error, if any, otherwise `null`
	 * @param {Uint8Array|null} [response] Response data or `null` to signal end of stream, if there hasn't been an error
	 * @returns {undefined}
	 */

	rpc.Service = service;
	});

	var roots = {};

	var indexMinimal = createCommonjsModule(function (module, exports) {
	var protobuf = exports;

	/**
	 * Build type, one of `"full"`, `"light"` or `"minimal"`.
	 * @name build
	 * @type {string}
	 * @const
	 */
	protobuf.build = "minimal";

	// Serialization
	protobuf.Writer       = writer;
	protobuf.BufferWriter = writer_buffer;
	protobuf.Reader       = reader;
	protobuf.BufferReader = reader_buffer;

	// Utility
	protobuf.util         = minimal;
	protobuf.rpc          = rpc_1;
	protobuf.roots        = roots;
	protobuf.configure    = configure;

	/* istanbul ignore next */
	/**
	 * Reconfigures the library according to the environment.
	 * @returns {undefined}
	 */
	function configure() {
	    protobuf.Reader._configure(protobuf.BufferReader);
	    protobuf.util._configure();
	}

	// Configure serialization
	protobuf.Writer._configure(protobuf.BufferWriter);
	configure();
	});

	var minimal$1 = indexMinimal;

	// Common aliases
	var $Reader = minimal$1.Reader, $Writer = minimal$1.Writer, $util = minimal$1.util;

	// Exported root namespace
	var $root = minimal$1.roots["default"] || (minimal$1.roots["default"] = {});

	$root.perfetto = (function() {

	    /**
	     * Namespace perfetto.
	     * @exports perfetto
	     * @namespace
	     */
	    var perfetto = {};

	    perfetto.protos = (function() {

	        /**
	         * Namespace protos.
	         * @memberof perfetto
	         * @namespace
	         */
	        var protos = {};

	        protos.Sched = (function() {

	            /**
	             * Properties of a Sched.
	             * @memberof perfetto.protos
	             * @interface ISched
	             * @property {string|null} [test] Sched test
	             */

	            /**
	             * Constructs a new Sched.
	             * @memberof perfetto.protos
	             * @classdesc Represents a Sched.
	             * @implements ISched
	             * @constructor
	             * @param {perfetto.protos.ISched=} [properties] Properties to set
	             */
	            function Sched(properties) {
	                if (properties)
	                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                        if (properties[keys[i]] != null)
	                            this[keys[i]] = properties[keys[i]];
	            }

	            /**
	             * Sched test.
	             * @member {string} test
	             * @memberof perfetto.protos.Sched
	             * @instance
	             */
	            Sched.prototype.test = "";

	            /**
	             * Creates a new Sched instance using the specified properties.
	             * @function create
	             * @memberof perfetto.protos.Sched
	             * @static
	             * @param {perfetto.protos.ISched=} [properties] Properties to set
	             * @returns {perfetto.protos.Sched} Sched instance
	             */
	            Sched.create = function create(properties) {
	                return new Sched(properties);
	            };

	            /**
	             * Encodes the specified Sched message. Does not implicitly {@link perfetto.protos.Sched.verify|verify} messages.
	             * @function encode
	             * @memberof perfetto.protos.Sched
	             * @static
	             * @param {perfetto.protos.ISched} message Sched message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            Sched.encode = function encode(message, writer) {
	                if (!writer)
	                    writer = $Writer.create();
	                if (message.test != null && message.hasOwnProperty("test"))
	                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.test);
	                return writer;
	            };

	            /**
	             * Encodes the specified Sched message, length delimited. Does not implicitly {@link perfetto.protos.Sched.verify|verify} messages.
	             * @function encodeDelimited
	             * @memberof perfetto.protos.Sched
	             * @static
	             * @param {perfetto.protos.ISched} message Sched message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            Sched.encodeDelimited = function encodeDelimited(message, writer) {
	                return this.encode(message, writer).ldelim();
	            };

	            /**
	             * Decodes a Sched message from the specified reader or buffer.
	             * @function decode
	             * @memberof perfetto.protos.Sched
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @param {number} [length] Message length if known beforehand
	             * @returns {perfetto.protos.Sched} Sched
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            Sched.decode = function decode(reader, length) {
	                if (!(reader instanceof $Reader))
	                    reader = $Reader.create(reader);
	                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.Sched();
	                while (reader.pos < end) {
	                    var tag = reader.uint32();
	                    switch (tag >>> 3) {
	                    case 1:
	                        message.test = reader.string();
	                        break;
	                    default:
	                        reader.skipType(tag & 7);
	                        break;
	                    }
	                }
	                return message;
	            };

	            /**
	             * Decodes a Sched message from the specified reader or buffer, length delimited.
	             * @function decodeDelimited
	             * @memberof perfetto.protos.Sched
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @returns {perfetto.protos.Sched} Sched
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            Sched.decodeDelimited = function decodeDelimited(reader) {
	                if (!(reader instanceof $Reader))
	                    reader = new $Reader(reader);
	                return this.decode(reader, reader.uint32());
	            };

	            /**
	             * Verifies a Sched message.
	             * @function verify
	             * @memberof perfetto.protos.Sched
	             * @static
	             * @param {Object.<string,*>} message Plain object to verify
	             * @returns {string|null} `null` if valid, otherwise the reason why it is not
	             */
	            Sched.verify = function verify(message) {
	                if (typeof message !== "object" || message === null)
	                    return "object expected";
	                if (message.test != null && message.hasOwnProperty("test"))
	                    if (!$util.isString(message.test))
	                        return "test: string expected";
	                return null;
	            };

	            /**
	             * Creates a Sched message from a plain object. Also converts values to their respective internal types.
	             * @function fromObject
	             * @memberof perfetto.protos.Sched
	             * @static
	             * @param {Object.<string,*>} object Plain object
	             * @returns {perfetto.protos.Sched} Sched
	             */
	            Sched.fromObject = function fromObject(object) {
	                if (object instanceof $root.perfetto.protos.Sched)
	                    return object;
	                var message = new $root.perfetto.protos.Sched();
	                if (object.test != null)
	                    message.test = String(object.test);
	                return message;
	            };

	            /**
	             * Creates a plain object from a Sched message. Also converts values to other types if specified.
	             * @function toObject
	             * @memberof perfetto.protos.Sched
	             * @static
	             * @param {perfetto.protos.Sched} message Sched
	             * @param {$protobuf.IConversionOptions} [options] Conversion options
	             * @returns {Object.<string,*>} Plain object
	             */
	            Sched.toObject = function toObject(message, options) {
	                if (!options)
	                    options = {};
	                var object = {};
	                if (options.defaults)
	                    object.test = "";
	                if (message.test != null && message.hasOwnProperty("test"))
	                    object.test = message.test;
	                return object;
	            };

	            /**
	             * Converts this Sched to JSON.
	             * @function toJSON
	             * @memberof perfetto.protos.Sched
	             * @instance
	             * @returns {Object.<string,*>} JSON object
	             */
	            Sched.prototype.toJSON = function toJSON() {
	                return this.constructor.toObject(this, minimal$1.util.toJSONOptions);
	            };

	            return Sched;
	        })();

	        protos.RawQueryArgs = (function() {

	            /**
	             * Properties of a RawQueryArgs.
	             * @memberof perfetto.protos
	             * @interface IRawQueryArgs
	             * @property {string|null} [sqlQuery] RawQueryArgs sqlQuery
	             */

	            /**
	             * Constructs a new RawQueryArgs.
	             * @memberof perfetto.protos
	             * @classdesc Represents a RawQueryArgs.
	             * @implements IRawQueryArgs
	             * @constructor
	             * @param {perfetto.protos.IRawQueryArgs=} [properties] Properties to set
	             */
	            function RawQueryArgs(properties) {
	                if (properties)
	                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                        if (properties[keys[i]] != null)
	                            this[keys[i]] = properties[keys[i]];
	            }

	            /**
	             * RawQueryArgs sqlQuery.
	             * @member {string} sqlQuery
	             * @memberof perfetto.protos.RawQueryArgs
	             * @instance
	             */
	            RawQueryArgs.prototype.sqlQuery = "";

	            /**
	             * Creates a new RawQueryArgs instance using the specified properties.
	             * @function create
	             * @memberof perfetto.protos.RawQueryArgs
	             * @static
	             * @param {perfetto.protos.IRawQueryArgs=} [properties] Properties to set
	             * @returns {perfetto.protos.RawQueryArgs} RawQueryArgs instance
	             */
	            RawQueryArgs.create = function create(properties) {
	                return new RawQueryArgs(properties);
	            };

	            /**
	             * Encodes the specified RawQueryArgs message. Does not implicitly {@link perfetto.protos.RawQueryArgs.verify|verify} messages.
	             * @function encode
	             * @memberof perfetto.protos.RawQueryArgs
	             * @static
	             * @param {perfetto.protos.IRawQueryArgs} message RawQueryArgs message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            RawQueryArgs.encode = function encode(message, writer) {
	                if (!writer)
	                    writer = $Writer.create();
	                if (message.sqlQuery != null && message.hasOwnProperty("sqlQuery"))
	                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.sqlQuery);
	                return writer;
	            };

	            /**
	             * Encodes the specified RawQueryArgs message, length delimited. Does not implicitly {@link perfetto.protos.RawQueryArgs.verify|verify} messages.
	             * @function encodeDelimited
	             * @memberof perfetto.protos.RawQueryArgs
	             * @static
	             * @param {perfetto.protos.IRawQueryArgs} message RawQueryArgs message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            RawQueryArgs.encodeDelimited = function encodeDelimited(message, writer) {
	                return this.encode(message, writer).ldelim();
	            };

	            /**
	             * Decodes a RawQueryArgs message from the specified reader or buffer.
	             * @function decode
	             * @memberof perfetto.protos.RawQueryArgs
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @param {number} [length] Message length if known beforehand
	             * @returns {perfetto.protos.RawQueryArgs} RawQueryArgs
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            RawQueryArgs.decode = function decode(reader, length) {
	                if (!(reader instanceof $Reader))
	                    reader = $Reader.create(reader);
	                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.RawQueryArgs();
	                while (reader.pos < end) {
	                    var tag = reader.uint32();
	                    switch (tag >>> 3) {
	                    case 1:
	                        message.sqlQuery = reader.string();
	                        break;
	                    default:
	                        reader.skipType(tag & 7);
	                        break;
	                    }
	                }
	                return message;
	            };

	            /**
	             * Decodes a RawQueryArgs message from the specified reader or buffer, length delimited.
	             * @function decodeDelimited
	             * @memberof perfetto.protos.RawQueryArgs
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @returns {perfetto.protos.RawQueryArgs} RawQueryArgs
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            RawQueryArgs.decodeDelimited = function decodeDelimited(reader) {
	                if (!(reader instanceof $Reader))
	                    reader = new $Reader(reader);
	                return this.decode(reader, reader.uint32());
	            };

	            /**
	             * Verifies a RawQueryArgs message.
	             * @function verify
	             * @memberof perfetto.protos.RawQueryArgs
	             * @static
	             * @param {Object.<string,*>} message Plain object to verify
	             * @returns {string|null} `null` if valid, otherwise the reason why it is not
	             */
	            RawQueryArgs.verify = function verify(message) {
	                if (typeof message !== "object" || message === null)
	                    return "object expected";
	                if (message.sqlQuery != null && message.hasOwnProperty("sqlQuery"))
	                    if (!$util.isString(message.sqlQuery))
	                        return "sqlQuery: string expected";
	                return null;
	            };

	            /**
	             * Creates a RawQueryArgs message from a plain object. Also converts values to their respective internal types.
	             * @function fromObject
	             * @memberof perfetto.protos.RawQueryArgs
	             * @static
	             * @param {Object.<string,*>} object Plain object
	             * @returns {perfetto.protos.RawQueryArgs} RawQueryArgs
	             */
	            RawQueryArgs.fromObject = function fromObject(object) {
	                if (object instanceof $root.perfetto.protos.RawQueryArgs)
	                    return object;
	                var message = new $root.perfetto.protos.RawQueryArgs();
	                if (object.sqlQuery != null)
	                    message.sqlQuery = String(object.sqlQuery);
	                return message;
	            };

	            /**
	             * Creates a plain object from a RawQueryArgs message. Also converts values to other types if specified.
	             * @function toObject
	             * @memberof perfetto.protos.RawQueryArgs
	             * @static
	             * @param {perfetto.protos.RawQueryArgs} message RawQueryArgs
	             * @param {$protobuf.IConversionOptions} [options] Conversion options
	             * @returns {Object.<string,*>} Plain object
	             */
	            RawQueryArgs.toObject = function toObject(message, options) {
	                if (!options)
	                    options = {};
	                var object = {};
	                if (options.defaults)
	                    object.sqlQuery = "";
	                if (message.sqlQuery != null && message.hasOwnProperty("sqlQuery"))
	                    object.sqlQuery = message.sqlQuery;
	                return object;
	            };

	            /**
	             * Converts this RawQueryArgs to JSON.
	             * @function toJSON
	             * @memberof perfetto.protos.RawQueryArgs
	             * @instance
	             * @returns {Object.<string,*>} JSON object
	             */
	            RawQueryArgs.prototype.toJSON = function toJSON() {
	                return this.constructor.toObject(this, minimal$1.util.toJSONOptions);
	            };

	            return RawQueryArgs;
	        })();

	        protos.RawQueryResult = (function() {

	            /**
	             * Properties of a RawQueryResult.
	             * @memberof perfetto.protos
	             * @interface IRawQueryResult
	             * @property {Array.<perfetto.protos.RawQueryResult.IColumnDesc>|null} [columnDescriptors] RawQueryResult columnDescriptors
	             * @property {number|Long|null} [numRecords] RawQueryResult numRecords
	             * @property {Array.<perfetto.protos.RawQueryResult.IColumnValues>|null} [columns] RawQueryResult columns
	             * @property {string|null} [error] RawQueryResult error
	             */

	            /**
	             * Constructs a new RawQueryResult.
	             * @memberof perfetto.protos
	             * @classdesc Represents a RawQueryResult.
	             * @implements IRawQueryResult
	             * @constructor
	             * @param {perfetto.protos.IRawQueryResult=} [properties] Properties to set
	             */
	            function RawQueryResult(properties) {
	                this.columnDescriptors = [];
	                this.columns = [];
	                if (properties)
	                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                        if (properties[keys[i]] != null)
	                            this[keys[i]] = properties[keys[i]];
	            }

	            /**
	             * RawQueryResult columnDescriptors.
	             * @member {Array.<perfetto.protos.RawQueryResult.IColumnDesc>} columnDescriptors
	             * @memberof perfetto.protos.RawQueryResult
	             * @instance
	             */
	            RawQueryResult.prototype.columnDescriptors = $util.emptyArray;

	            /**
	             * RawQueryResult numRecords.
	             * @member {number|Long} numRecords
	             * @memberof perfetto.protos.RawQueryResult
	             * @instance
	             */
	            RawQueryResult.prototype.numRecords = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

	            /**
	             * RawQueryResult columns.
	             * @member {Array.<perfetto.protos.RawQueryResult.IColumnValues>} columns
	             * @memberof perfetto.protos.RawQueryResult
	             * @instance
	             */
	            RawQueryResult.prototype.columns = $util.emptyArray;

	            /**
	             * RawQueryResult error.
	             * @member {string} error
	             * @memberof perfetto.protos.RawQueryResult
	             * @instance
	             */
	            RawQueryResult.prototype.error = "";

	            /**
	             * Creates a new RawQueryResult instance using the specified properties.
	             * @function create
	             * @memberof perfetto.protos.RawQueryResult
	             * @static
	             * @param {perfetto.protos.IRawQueryResult=} [properties] Properties to set
	             * @returns {perfetto.protos.RawQueryResult} RawQueryResult instance
	             */
	            RawQueryResult.create = function create(properties) {
	                return new RawQueryResult(properties);
	            };

	            /**
	             * Encodes the specified RawQueryResult message. Does not implicitly {@link perfetto.protos.RawQueryResult.verify|verify} messages.
	             * @function encode
	             * @memberof perfetto.protos.RawQueryResult
	             * @static
	             * @param {perfetto.protos.IRawQueryResult} message RawQueryResult message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            RawQueryResult.encode = function encode(message, writer) {
	                if (!writer)
	                    writer = $Writer.create();
	                if (message.columnDescriptors != null && message.columnDescriptors.length)
	                    for (var i = 0; i < message.columnDescriptors.length; ++i)
	                        $root.perfetto.protos.RawQueryResult.ColumnDesc.encode(message.columnDescriptors[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
	                if (message.numRecords != null && message.hasOwnProperty("numRecords"))
	                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.numRecords);
	                if (message.columns != null && message.columns.length)
	                    for (var i = 0; i < message.columns.length; ++i)
	                        $root.perfetto.protos.RawQueryResult.ColumnValues.encode(message.columns[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
	                if (message.error != null && message.hasOwnProperty("error"))
	                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.error);
	                return writer;
	            };

	            /**
	             * Encodes the specified RawQueryResult message, length delimited. Does not implicitly {@link perfetto.protos.RawQueryResult.verify|verify} messages.
	             * @function encodeDelimited
	             * @memberof perfetto.protos.RawQueryResult
	             * @static
	             * @param {perfetto.protos.IRawQueryResult} message RawQueryResult message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            RawQueryResult.encodeDelimited = function encodeDelimited(message, writer) {
	                return this.encode(message, writer).ldelim();
	            };

	            /**
	             * Decodes a RawQueryResult message from the specified reader or buffer.
	             * @function decode
	             * @memberof perfetto.protos.RawQueryResult
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @param {number} [length] Message length if known beforehand
	             * @returns {perfetto.protos.RawQueryResult} RawQueryResult
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            RawQueryResult.decode = function decode(reader, length) {
	                if (!(reader instanceof $Reader))
	                    reader = $Reader.create(reader);
	                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.RawQueryResult();
	                while (reader.pos < end) {
	                    var tag = reader.uint32();
	                    switch (tag >>> 3) {
	                    case 1:
	                        if (!(message.columnDescriptors && message.columnDescriptors.length))
	                            message.columnDescriptors = [];
	                        message.columnDescriptors.push($root.perfetto.protos.RawQueryResult.ColumnDesc.decode(reader, reader.uint32()));
	                        break;
	                    case 2:
	                        message.numRecords = reader.uint64();
	                        break;
	                    case 3:
	                        if (!(message.columns && message.columns.length))
	                            message.columns = [];
	                        message.columns.push($root.perfetto.protos.RawQueryResult.ColumnValues.decode(reader, reader.uint32()));
	                        break;
	                    case 4:
	                        message.error = reader.string();
	                        break;
	                    default:
	                        reader.skipType(tag & 7);
	                        break;
	                    }
	                }
	                return message;
	            };

	            /**
	             * Decodes a RawQueryResult message from the specified reader or buffer, length delimited.
	             * @function decodeDelimited
	             * @memberof perfetto.protos.RawQueryResult
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @returns {perfetto.protos.RawQueryResult} RawQueryResult
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            RawQueryResult.decodeDelimited = function decodeDelimited(reader) {
	                if (!(reader instanceof $Reader))
	                    reader = new $Reader(reader);
	                return this.decode(reader, reader.uint32());
	            };

	            /**
	             * Verifies a RawQueryResult message.
	             * @function verify
	             * @memberof perfetto.protos.RawQueryResult
	             * @static
	             * @param {Object.<string,*>} message Plain object to verify
	             * @returns {string|null} `null` if valid, otherwise the reason why it is not
	             */
	            RawQueryResult.verify = function verify(message) {
	                if (typeof message !== "object" || message === null)
	                    return "object expected";
	                if (message.columnDescriptors != null && message.hasOwnProperty("columnDescriptors")) {
	                    if (!Array.isArray(message.columnDescriptors))
	                        return "columnDescriptors: array expected";
	                    for (var i = 0; i < message.columnDescriptors.length; ++i) {
	                        var error = $root.perfetto.protos.RawQueryResult.ColumnDesc.verify(message.columnDescriptors[i]);
	                        if (error)
	                            return "columnDescriptors." + error;
	                    }
	                }
	                if (message.numRecords != null && message.hasOwnProperty("numRecords"))
	                    if (!$util.isInteger(message.numRecords) && !(message.numRecords && $util.isInteger(message.numRecords.low) && $util.isInteger(message.numRecords.high)))
	                        return "numRecords: integer|Long expected";
	                if (message.columns != null && message.hasOwnProperty("columns")) {
	                    if (!Array.isArray(message.columns))
	                        return "columns: array expected";
	                    for (var i = 0; i < message.columns.length; ++i) {
	                        var error = $root.perfetto.protos.RawQueryResult.ColumnValues.verify(message.columns[i]);
	                        if (error)
	                            return "columns." + error;
	                    }
	                }
	                if (message.error != null && message.hasOwnProperty("error"))
	                    if (!$util.isString(message.error))
	                        return "error: string expected";
	                return null;
	            };

	            /**
	             * Creates a RawQueryResult message from a plain object. Also converts values to their respective internal types.
	             * @function fromObject
	             * @memberof perfetto.protos.RawQueryResult
	             * @static
	             * @param {Object.<string,*>} object Plain object
	             * @returns {perfetto.protos.RawQueryResult} RawQueryResult
	             */
	            RawQueryResult.fromObject = function fromObject(object) {
	                if (object instanceof $root.perfetto.protos.RawQueryResult)
	                    return object;
	                var message = new $root.perfetto.protos.RawQueryResult();
	                if (object.columnDescriptors) {
	                    if (!Array.isArray(object.columnDescriptors))
	                        throw TypeError(".perfetto.protos.RawQueryResult.columnDescriptors: array expected");
	                    message.columnDescriptors = [];
	                    for (var i = 0; i < object.columnDescriptors.length; ++i) {
	                        if (typeof object.columnDescriptors[i] !== "object")
	                            throw TypeError(".perfetto.protos.RawQueryResult.columnDescriptors: object expected");
	                        message.columnDescriptors[i] = $root.perfetto.protos.RawQueryResult.ColumnDesc.fromObject(object.columnDescriptors[i]);
	                    }
	                }
	                if (object.numRecords != null)
	                    if ($util.Long)
	                        (message.numRecords = $util.Long.fromValue(object.numRecords)).unsigned = true;
	                    else if (typeof object.numRecords === "string")
	                        message.numRecords = parseInt(object.numRecords, 10);
	                    else if (typeof object.numRecords === "number")
	                        message.numRecords = object.numRecords;
	                    else if (typeof object.numRecords === "object")
	                        message.numRecords = new $util.LongBits(object.numRecords.low >>> 0, object.numRecords.high >>> 0).toNumber(true);
	                if (object.columns) {
	                    if (!Array.isArray(object.columns))
	                        throw TypeError(".perfetto.protos.RawQueryResult.columns: array expected");
	                    message.columns = [];
	                    for (var i = 0; i < object.columns.length; ++i) {
	                        if (typeof object.columns[i] !== "object")
	                            throw TypeError(".perfetto.protos.RawQueryResult.columns: object expected");
	                        message.columns[i] = $root.perfetto.protos.RawQueryResult.ColumnValues.fromObject(object.columns[i]);
	                    }
	                }
	                if (object.error != null)
	                    message.error = String(object.error);
	                return message;
	            };

	            /**
	             * Creates a plain object from a RawQueryResult message. Also converts values to other types if specified.
	             * @function toObject
	             * @memberof perfetto.protos.RawQueryResult
	             * @static
	             * @param {perfetto.protos.RawQueryResult} message RawQueryResult
	             * @param {$protobuf.IConversionOptions} [options] Conversion options
	             * @returns {Object.<string,*>} Plain object
	             */
	            RawQueryResult.toObject = function toObject(message, options) {
	                if (!options)
	                    options = {};
	                var object = {};
	                if (options.arrays || options.defaults) {
	                    object.columnDescriptors = [];
	                    object.columns = [];
	                }
	                if (options.defaults) {
	                    if ($util.Long) {
	                        var long = new $util.Long(0, 0, true);
	                        object.numRecords = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
	                    } else
	                        object.numRecords = options.longs === String ? "0" : 0;
	                    object.error = "";
	                }
	                if (message.columnDescriptors && message.columnDescriptors.length) {
	                    object.columnDescriptors = [];
	                    for (var j = 0; j < message.columnDescriptors.length; ++j)
	                        object.columnDescriptors[j] = $root.perfetto.protos.RawQueryResult.ColumnDesc.toObject(message.columnDescriptors[j], options);
	                }
	                if (message.numRecords != null && message.hasOwnProperty("numRecords"))
	                    if (typeof message.numRecords === "number")
	                        object.numRecords = options.longs === String ? String(message.numRecords) : message.numRecords;
	                    else
	                        object.numRecords = options.longs === String ? $util.Long.prototype.toString.call(message.numRecords) : options.longs === Number ? new $util.LongBits(message.numRecords.low >>> 0, message.numRecords.high >>> 0).toNumber(true) : message.numRecords;
	                if (message.columns && message.columns.length) {
	                    object.columns = [];
	                    for (var j = 0; j < message.columns.length; ++j)
	                        object.columns[j] = $root.perfetto.protos.RawQueryResult.ColumnValues.toObject(message.columns[j], options);
	                }
	                if (message.error != null && message.hasOwnProperty("error"))
	                    object.error = message.error;
	                return object;
	            };

	            /**
	             * Converts this RawQueryResult to JSON.
	             * @function toJSON
	             * @memberof perfetto.protos.RawQueryResult
	             * @instance
	             * @returns {Object.<string,*>} JSON object
	             */
	            RawQueryResult.prototype.toJSON = function toJSON() {
	                return this.constructor.toObject(this, minimal$1.util.toJSONOptions);
	            };

	            RawQueryResult.ColumnDesc = (function() {

	                /**
	                 * Properties of a ColumnDesc.
	                 * @memberof perfetto.protos.RawQueryResult
	                 * @interface IColumnDesc
	                 * @property {string|null} [name] ColumnDesc name
	                 * @property {perfetto.protos.RawQueryResult.ColumnDesc.Type|null} [type] ColumnDesc type
	                 */

	                /**
	                 * Constructs a new ColumnDesc.
	                 * @memberof perfetto.protos.RawQueryResult
	                 * @classdesc Represents a ColumnDesc.
	                 * @implements IColumnDesc
	                 * @constructor
	                 * @param {perfetto.protos.RawQueryResult.IColumnDesc=} [properties] Properties to set
	                 */
	                function ColumnDesc(properties) {
	                    if (properties)
	                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                            if (properties[keys[i]] != null)
	                                this[keys[i]] = properties[keys[i]];
	                }

	                /**
	                 * ColumnDesc name.
	                 * @member {string} name
	                 * @memberof perfetto.protos.RawQueryResult.ColumnDesc
	                 * @instance
	                 */
	                ColumnDesc.prototype.name = "";

	                /**
	                 * ColumnDesc type.
	                 * @member {perfetto.protos.RawQueryResult.ColumnDesc.Type} type
	                 * @memberof perfetto.protos.RawQueryResult.ColumnDesc
	                 * @instance
	                 */
	                ColumnDesc.prototype.type = 1;

	                /**
	                 * Creates a new ColumnDesc instance using the specified properties.
	                 * @function create
	                 * @memberof perfetto.protos.RawQueryResult.ColumnDesc
	                 * @static
	                 * @param {perfetto.protos.RawQueryResult.IColumnDesc=} [properties] Properties to set
	                 * @returns {perfetto.protos.RawQueryResult.ColumnDesc} ColumnDesc instance
	                 */
	                ColumnDesc.create = function create(properties) {
	                    return new ColumnDesc(properties);
	                };

	                /**
	                 * Encodes the specified ColumnDesc message. Does not implicitly {@link perfetto.protos.RawQueryResult.ColumnDesc.verify|verify} messages.
	                 * @function encode
	                 * @memberof perfetto.protos.RawQueryResult.ColumnDesc
	                 * @static
	                 * @param {perfetto.protos.RawQueryResult.IColumnDesc} message ColumnDesc message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                ColumnDesc.encode = function encode(message, writer) {
	                    if (!writer)
	                        writer = $Writer.create();
	                    if (message.name != null && message.hasOwnProperty("name"))
	                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
	                    if (message.type != null && message.hasOwnProperty("type"))
	                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.type);
	                    return writer;
	                };

	                /**
	                 * Encodes the specified ColumnDesc message, length delimited. Does not implicitly {@link perfetto.protos.RawQueryResult.ColumnDesc.verify|verify} messages.
	                 * @function encodeDelimited
	                 * @memberof perfetto.protos.RawQueryResult.ColumnDesc
	                 * @static
	                 * @param {perfetto.protos.RawQueryResult.IColumnDesc} message ColumnDesc message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                ColumnDesc.encodeDelimited = function encodeDelimited(message, writer) {
	                    return this.encode(message, writer).ldelim();
	                };

	                /**
	                 * Decodes a ColumnDesc message from the specified reader or buffer.
	                 * @function decode
	                 * @memberof perfetto.protos.RawQueryResult.ColumnDesc
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @param {number} [length] Message length if known beforehand
	                 * @returns {perfetto.protos.RawQueryResult.ColumnDesc} ColumnDesc
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                ColumnDesc.decode = function decode(reader, length) {
	                    if (!(reader instanceof $Reader))
	                        reader = $Reader.create(reader);
	                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.RawQueryResult.ColumnDesc();
	                    while (reader.pos < end) {
	                        var tag = reader.uint32();
	                        switch (tag >>> 3) {
	                        case 1:
	                            message.name = reader.string();
	                            break;
	                        case 2:
	                            message.type = reader.int32();
	                            break;
	                        default:
	                            reader.skipType(tag & 7);
	                            break;
	                        }
	                    }
	                    return message;
	                };

	                /**
	                 * Decodes a ColumnDesc message from the specified reader or buffer, length delimited.
	                 * @function decodeDelimited
	                 * @memberof perfetto.protos.RawQueryResult.ColumnDesc
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @returns {perfetto.protos.RawQueryResult.ColumnDesc} ColumnDesc
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                ColumnDesc.decodeDelimited = function decodeDelimited(reader) {
	                    if (!(reader instanceof $Reader))
	                        reader = new $Reader(reader);
	                    return this.decode(reader, reader.uint32());
	                };

	                /**
	                 * Verifies a ColumnDesc message.
	                 * @function verify
	                 * @memberof perfetto.protos.RawQueryResult.ColumnDesc
	                 * @static
	                 * @param {Object.<string,*>} message Plain object to verify
	                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
	                 */
	                ColumnDesc.verify = function verify(message) {
	                    if (typeof message !== "object" || message === null)
	                        return "object expected";
	                    if (message.name != null && message.hasOwnProperty("name"))
	                        if (!$util.isString(message.name))
	                            return "name: string expected";
	                    if (message.type != null && message.hasOwnProperty("type"))
	                        switch (message.type) {
	                        default:
	                            return "type: enum value expected";
	                        case 1:
	                        case 2:
	                        case 3:
	                            break;
	                        }
	                    return null;
	                };

	                /**
	                 * Creates a ColumnDesc message from a plain object. Also converts values to their respective internal types.
	                 * @function fromObject
	                 * @memberof perfetto.protos.RawQueryResult.ColumnDesc
	                 * @static
	                 * @param {Object.<string,*>} object Plain object
	                 * @returns {perfetto.protos.RawQueryResult.ColumnDesc} ColumnDesc
	                 */
	                ColumnDesc.fromObject = function fromObject(object) {
	                    if (object instanceof $root.perfetto.protos.RawQueryResult.ColumnDesc)
	                        return object;
	                    var message = new $root.perfetto.protos.RawQueryResult.ColumnDesc();
	                    if (object.name != null)
	                        message.name = String(object.name);
	                    switch (object.type) {
	                    case "LONG":
	                    case 1:
	                        message.type = 1;
	                        break;
	                    case "DOUBLE":
	                    case 2:
	                        message.type = 2;
	                        break;
	                    case "STRING":
	                    case 3:
	                        message.type = 3;
	                        break;
	                    }
	                    return message;
	                };

	                /**
	                 * Creates a plain object from a ColumnDesc message. Also converts values to other types if specified.
	                 * @function toObject
	                 * @memberof perfetto.protos.RawQueryResult.ColumnDesc
	                 * @static
	                 * @param {perfetto.protos.RawQueryResult.ColumnDesc} message ColumnDesc
	                 * @param {$protobuf.IConversionOptions} [options] Conversion options
	                 * @returns {Object.<string,*>} Plain object
	                 */
	                ColumnDesc.toObject = function toObject(message, options) {
	                    if (!options)
	                        options = {};
	                    var object = {};
	                    if (options.defaults) {
	                        object.name = "";
	                        object.type = options.enums === String ? "LONG" : 1;
	                    }
	                    if (message.name != null && message.hasOwnProperty("name"))
	                        object.name = message.name;
	                    if (message.type != null && message.hasOwnProperty("type"))
	                        object.type = options.enums === String ? $root.perfetto.protos.RawQueryResult.ColumnDesc.Type[message.type] : message.type;
	                    return object;
	                };

	                /**
	                 * Converts this ColumnDesc to JSON.
	                 * @function toJSON
	                 * @memberof perfetto.protos.RawQueryResult.ColumnDesc
	                 * @instance
	                 * @returns {Object.<string,*>} JSON object
	                 */
	                ColumnDesc.prototype.toJSON = function toJSON() {
	                    return this.constructor.toObject(this, minimal$1.util.toJSONOptions);
	                };

	                /**
	                 * Type enum.
	                 * @name perfetto.protos.RawQueryResult.ColumnDesc.Type
	                 * @enum {string}
	                 * @property {number} LONG=1 LONG value
	                 * @property {number} DOUBLE=2 DOUBLE value
	                 * @property {number} STRING=3 STRING value
	                 */
	                ColumnDesc.Type = (function() {
	                    var valuesById = {}, values = Object.create(valuesById);
	                    values[valuesById[1] = "LONG"] = 1;
	                    values[valuesById[2] = "DOUBLE"] = 2;
	                    values[valuesById[3] = "STRING"] = 3;
	                    return values;
	                })();

	                return ColumnDesc;
	            })();

	            RawQueryResult.ColumnValues = (function() {

	                /**
	                 * Properties of a ColumnValues.
	                 * @memberof perfetto.protos.RawQueryResult
	                 * @interface IColumnValues
	                 * @property {Array.<number|Long>|null} [longValues] ColumnValues longValues
	                 * @property {Array.<number>|null} [doubleValues] ColumnValues doubleValues
	                 * @property {Array.<string>|null} [stringValues] ColumnValues stringValues
	                 */

	                /**
	                 * Constructs a new ColumnValues.
	                 * @memberof perfetto.protos.RawQueryResult
	                 * @classdesc Represents a ColumnValues.
	                 * @implements IColumnValues
	                 * @constructor
	                 * @param {perfetto.protos.RawQueryResult.IColumnValues=} [properties] Properties to set
	                 */
	                function ColumnValues(properties) {
	                    this.longValues = [];
	                    this.doubleValues = [];
	                    this.stringValues = [];
	                    if (properties)
	                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                            if (properties[keys[i]] != null)
	                                this[keys[i]] = properties[keys[i]];
	                }

	                /**
	                 * ColumnValues longValues.
	                 * @member {Array.<number|Long>} longValues
	                 * @memberof perfetto.protos.RawQueryResult.ColumnValues
	                 * @instance
	                 */
	                ColumnValues.prototype.longValues = $util.emptyArray;

	                /**
	                 * ColumnValues doubleValues.
	                 * @member {Array.<number>} doubleValues
	                 * @memberof perfetto.protos.RawQueryResult.ColumnValues
	                 * @instance
	                 */
	                ColumnValues.prototype.doubleValues = $util.emptyArray;

	                /**
	                 * ColumnValues stringValues.
	                 * @member {Array.<string>} stringValues
	                 * @memberof perfetto.protos.RawQueryResult.ColumnValues
	                 * @instance
	                 */
	                ColumnValues.prototype.stringValues = $util.emptyArray;

	                /**
	                 * Creates a new ColumnValues instance using the specified properties.
	                 * @function create
	                 * @memberof perfetto.protos.RawQueryResult.ColumnValues
	                 * @static
	                 * @param {perfetto.protos.RawQueryResult.IColumnValues=} [properties] Properties to set
	                 * @returns {perfetto.protos.RawQueryResult.ColumnValues} ColumnValues instance
	                 */
	                ColumnValues.create = function create(properties) {
	                    return new ColumnValues(properties);
	                };

	                /**
	                 * Encodes the specified ColumnValues message. Does not implicitly {@link perfetto.protos.RawQueryResult.ColumnValues.verify|verify} messages.
	                 * @function encode
	                 * @memberof perfetto.protos.RawQueryResult.ColumnValues
	                 * @static
	                 * @param {perfetto.protos.RawQueryResult.IColumnValues} message ColumnValues message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                ColumnValues.encode = function encode(message, writer) {
	                    if (!writer)
	                        writer = $Writer.create();
	                    if (message.longValues != null && message.longValues.length)
	                        for (var i = 0; i < message.longValues.length; ++i)
	                            writer.uint32(/* id 1, wireType 0 =*/8).int64(message.longValues[i]);
	                    if (message.doubleValues != null && message.doubleValues.length)
	                        for (var i = 0; i < message.doubleValues.length; ++i)
	                            writer.uint32(/* id 2, wireType 1 =*/17).double(message.doubleValues[i]);
	                    if (message.stringValues != null && message.stringValues.length)
	                        for (var i = 0; i < message.stringValues.length; ++i)
	                            writer.uint32(/* id 3, wireType 2 =*/26).string(message.stringValues[i]);
	                    return writer;
	                };

	                /**
	                 * Encodes the specified ColumnValues message, length delimited. Does not implicitly {@link perfetto.protos.RawQueryResult.ColumnValues.verify|verify} messages.
	                 * @function encodeDelimited
	                 * @memberof perfetto.protos.RawQueryResult.ColumnValues
	                 * @static
	                 * @param {perfetto.protos.RawQueryResult.IColumnValues} message ColumnValues message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                ColumnValues.encodeDelimited = function encodeDelimited(message, writer) {
	                    return this.encode(message, writer).ldelim();
	                };

	                /**
	                 * Decodes a ColumnValues message from the specified reader or buffer.
	                 * @function decode
	                 * @memberof perfetto.protos.RawQueryResult.ColumnValues
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @param {number} [length] Message length if known beforehand
	                 * @returns {perfetto.protos.RawQueryResult.ColumnValues} ColumnValues
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                ColumnValues.decode = function decode(reader, length) {
	                    if (!(reader instanceof $Reader))
	                        reader = $Reader.create(reader);
	                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.RawQueryResult.ColumnValues();
	                    while (reader.pos < end) {
	                        var tag = reader.uint32();
	                        switch (tag >>> 3) {
	                        case 1:
	                            if (!(message.longValues && message.longValues.length))
	                                message.longValues = [];
	                            if ((tag & 7) === 2) {
	                                var end2 = reader.uint32() + reader.pos;
	                                while (reader.pos < end2)
	                                    message.longValues.push(reader.int64());
	                            } else
	                                message.longValues.push(reader.int64());
	                            break;
	                        case 2:
	                            if (!(message.doubleValues && message.doubleValues.length))
	                                message.doubleValues = [];
	                            if ((tag & 7) === 2) {
	                                var end2 = reader.uint32() + reader.pos;
	                                while (reader.pos < end2)
	                                    message.doubleValues.push(reader.double());
	                            } else
	                                message.doubleValues.push(reader.double());
	                            break;
	                        case 3:
	                            if (!(message.stringValues && message.stringValues.length))
	                                message.stringValues = [];
	                            message.stringValues.push(reader.string());
	                            break;
	                        default:
	                            reader.skipType(tag & 7);
	                            break;
	                        }
	                    }
	                    return message;
	                };

	                /**
	                 * Decodes a ColumnValues message from the specified reader or buffer, length delimited.
	                 * @function decodeDelimited
	                 * @memberof perfetto.protos.RawQueryResult.ColumnValues
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @returns {perfetto.protos.RawQueryResult.ColumnValues} ColumnValues
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                ColumnValues.decodeDelimited = function decodeDelimited(reader) {
	                    if (!(reader instanceof $Reader))
	                        reader = new $Reader(reader);
	                    return this.decode(reader, reader.uint32());
	                };

	                /**
	                 * Verifies a ColumnValues message.
	                 * @function verify
	                 * @memberof perfetto.protos.RawQueryResult.ColumnValues
	                 * @static
	                 * @param {Object.<string,*>} message Plain object to verify
	                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
	                 */
	                ColumnValues.verify = function verify(message) {
	                    if (typeof message !== "object" || message === null)
	                        return "object expected";
	                    if (message.longValues != null && message.hasOwnProperty("longValues")) {
	                        if (!Array.isArray(message.longValues))
	                            return "longValues: array expected";
	                        for (var i = 0; i < message.longValues.length; ++i)
	                            if (!$util.isInteger(message.longValues[i]) && !(message.longValues[i] && $util.isInteger(message.longValues[i].low) && $util.isInteger(message.longValues[i].high)))
	                                return "longValues: integer|Long[] expected";
	                    }
	                    if (message.doubleValues != null && message.hasOwnProperty("doubleValues")) {
	                        if (!Array.isArray(message.doubleValues))
	                            return "doubleValues: array expected";
	                        for (var i = 0; i < message.doubleValues.length; ++i)
	                            if (typeof message.doubleValues[i] !== "number")
	                                return "doubleValues: number[] expected";
	                    }
	                    if (message.stringValues != null && message.hasOwnProperty("stringValues")) {
	                        if (!Array.isArray(message.stringValues))
	                            return "stringValues: array expected";
	                        for (var i = 0; i < message.stringValues.length; ++i)
	                            if (!$util.isString(message.stringValues[i]))
	                                return "stringValues: string[] expected";
	                    }
	                    return null;
	                };

	                /**
	                 * Creates a ColumnValues message from a plain object. Also converts values to their respective internal types.
	                 * @function fromObject
	                 * @memberof perfetto.protos.RawQueryResult.ColumnValues
	                 * @static
	                 * @param {Object.<string,*>} object Plain object
	                 * @returns {perfetto.protos.RawQueryResult.ColumnValues} ColumnValues
	                 */
	                ColumnValues.fromObject = function fromObject(object) {
	                    if (object instanceof $root.perfetto.protos.RawQueryResult.ColumnValues)
	                        return object;
	                    var message = new $root.perfetto.protos.RawQueryResult.ColumnValues();
	                    if (object.longValues) {
	                        if (!Array.isArray(object.longValues))
	                            throw TypeError(".perfetto.protos.RawQueryResult.ColumnValues.longValues: array expected");
	                        message.longValues = [];
	                        for (var i = 0; i < object.longValues.length; ++i)
	                            if ($util.Long)
	                                (message.longValues[i] = $util.Long.fromValue(object.longValues[i])).unsigned = false;
	                            else if (typeof object.longValues[i] === "string")
	                                message.longValues[i] = parseInt(object.longValues[i], 10);
	                            else if (typeof object.longValues[i] === "number")
	                                message.longValues[i] = object.longValues[i];
	                            else if (typeof object.longValues[i] === "object")
	                                message.longValues[i] = new $util.LongBits(object.longValues[i].low >>> 0, object.longValues[i].high >>> 0).toNumber();
	                    }
	                    if (object.doubleValues) {
	                        if (!Array.isArray(object.doubleValues))
	                            throw TypeError(".perfetto.protos.RawQueryResult.ColumnValues.doubleValues: array expected");
	                        message.doubleValues = [];
	                        for (var i = 0; i < object.doubleValues.length; ++i)
	                            message.doubleValues[i] = Number(object.doubleValues[i]);
	                    }
	                    if (object.stringValues) {
	                        if (!Array.isArray(object.stringValues))
	                            throw TypeError(".perfetto.protos.RawQueryResult.ColumnValues.stringValues: array expected");
	                        message.stringValues = [];
	                        for (var i = 0; i < object.stringValues.length; ++i)
	                            message.stringValues[i] = String(object.stringValues[i]);
	                    }
	                    return message;
	                };

	                /**
	                 * Creates a plain object from a ColumnValues message. Also converts values to other types if specified.
	                 * @function toObject
	                 * @memberof perfetto.protos.RawQueryResult.ColumnValues
	                 * @static
	                 * @param {perfetto.protos.RawQueryResult.ColumnValues} message ColumnValues
	                 * @param {$protobuf.IConversionOptions} [options] Conversion options
	                 * @returns {Object.<string,*>} Plain object
	                 */
	                ColumnValues.toObject = function toObject(message, options) {
	                    if (!options)
	                        options = {};
	                    var object = {};
	                    if (options.arrays || options.defaults) {
	                        object.longValues = [];
	                        object.doubleValues = [];
	                        object.stringValues = [];
	                    }
	                    if (message.longValues && message.longValues.length) {
	                        object.longValues = [];
	                        for (var j = 0; j < message.longValues.length; ++j)
	                            if (typeof message.longValues[j] === "number")
	                                object.longValues[j] = options.longs === String ? String(message.longValues[j]) : message.longValues[j];
	                            else
	                                object.longValues[j] = options.longs === String ? $util.Long.prototype.toString.call(message.longValues[j]) : options.longs === Number ? new $util.LongBits(message.longValues[j].low >>> 0, message.longValues[j].high >>> 0).toNumber() : message.longValues[j];
	                    }
	                    if (message.doubleValues && message.doubleValues.length) {
	                        object.doubleValues = [];
	                        for (var j = 0; j < message.doubleValues.length; ++j)
	                            object.doubleValues[j] = options.json && !isFinite(message.doubleValues[j]) ? String(message.doubleValues[j]) : message.doubleValues[j];
	                    }
	                    if (message.stringValues && message.stringValues.length) {
	                        object.stringValues = [];
	                        for (var j = 0; j < message.stringValues.length; ++j)
	                            object.stringValues[j] = message.stringValues[j];
	                    }
	                    return object;
	                };

	                /**
	                 * Converts this ColumnValues to JSON.
	                 * @function toJSON
	                 * @memberof perfetto.protos.RawQueryResult.ColumnValues
	                 * @instance
	                 * @returns {Object.<string,*>} JSON object
	                 */
	                ColumnValues.prototype.toJSON = function toJSON() {
	                    return this.constructor.toObject(this, minimal$1.util.toJSONOptions);
	                };

	                return ColumnValues;
	            })();

	            return RawQueryResult;
	        })();

	        protos.TraceProcessor = (function() {

	            /**
	             * Constructs a new TraceProcessor service.
	             * @memberof perfetto.protos
	             * @classdesc Represents a TraceProcessor
	             * @extends $protobuf.rpc.Service
	             * @constructor
	             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
	             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
	             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
	             */
	            function TraceProcessor(rpcImpl, requestDelimited, responseDelimited) {
	                minimal$1.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
	            }

	            (TraceProcessor.prototype = Object.create(minimal$1.rpc.Service.prototype)).constructor = TraceProcessor;

	            /**
	             * Creates new TraceProcessor service using the specified rpc implementation.
	             * @function create
	             * @memberof perfetto.protos.TraceProcessor
	             * @static
	             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
	             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
	             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
	             * @returns {TraceProcessor} RPC service. Useful where requests and/or responses are streamed.
	             */
	            TraceProcessor.create = function create(rpcImpl, requestDelimited, responseDelimited) {
	                return new this(rpcImpl, requestDelimited, responseDelimited);
	            };

	            /**
	             * Callback as used by {@link perfetto.protos.TraceProcessor#rawQuery}.
	             * @memberof perfetto.protos.TraceProcessor
	             * @typedef RawQueryCallback
	             * @type {function}
	             * @param {Error|null} error Error, if any
	             * @param {perfetto.protos.RawQueryResult} [response] RawQueryResult
	             */

	            /**
	             * Calls RawQuery.
	             * @function rawQuery
	             * @memberof perfetto.protos.TraceProcessor
	             * @instance
	             * @param {perfetto.protos.IRawQueryArgs} request RawQueryArgs message or plain object
	             * @param {perfetto.protos.TraceProcessor.RawQueryCallback} callback Node-style callback called with the error, if any, and RawQueryResult
	             * @returns {undefined}
	             * @variation 1
	             */
	            TraceProcessor.prototype.rawQuery = function rawQuery(request, callback) {
	                return this.rpcCall(rawQuery, $root.perfetto.protos.RawQueryArgs, $root.perfetto.protos.RawQueryResult, request, callback);
	            };

	            /**
	             * Calls RawQuery.
	             * @function rawQuery
	             * @memberof perfetto.protos.TraceProcessor
	             * @instance
	             * @param {perfetto.protos.IRawQueryArgs} request RawQueryArgs message or plain object
	             * @returns {Promise<perfetto.protos.RawQueryResult>} Promise
	             * @variation 2
	             */

	            return TraceProcessor;
	        })();

	        protos.ChromeConfig = (function() {

	            /**
	             * Properties of a ChromeConfig.
	             * @memberof perfetto.protos
	             * @interface IChromeConfig
	             * @property {string|null} [traceConfig] ChromeConfig traceConfig
	             */

	            /**
	             * Constructs a new ChromeConfig.
	             * @memberof perfetto.protos
	             * @classdesc Represents a ChromeConfig.
	             * @implements IChromeConfig
	             * @constructor
	             * @param {perfetto.protos.IChromeConfig=} [properties] Properties to set
	             */
	            function ChromeConfig(properties) {
	                if (properties)
	                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                        if (properties[keys[i]] != null)
	                            this[keys[i]] = properties[keys[i]];
	            }

	            /**
	             * ChromeConfig traceConfig.
	             * @member {string} traceConfig
	             * @memberof perfetto.protos.ChromeConfig
	             * @instance
	             */
	            ChromeConfig.prototype.traceConfig = "";

	            /**
	             * Creates a new ChromeConfig instance using the specified properties.
	             * @function create
	             * @memberof perfetto.protos.ChromeConfig
	             * @static
	             * @param {perfetto.protos.IChromeConfig=} [properties] Properties to set
	             * @returns {perfetto.protos.ChromeConfig} ChromeConfig instance
	             */
	            ChromeConfig.create = function create(properties) {
	                return new ChromeConfig(properties);
	            };

	            /**
	             * Encodes the specified ChromeConfig message. Does not implicitly {@link perfetto.protos.ChromeConfig.verify|verify} messages.
	             * @function encode
	             * @memberof perfetto.protos.ChromeConfig
	             * @static
	             * @param {perfetto.protos.IChromeConfig} message ChromeConfig message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            ChromeConfig.encode = function encode(message, writer) {
	                if (!writer)
	                    writer = $Writer.create();
	                if (message.traceConfig != null && message.hasOwnProperty("traceConfig"))
	                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.traceConfig);
	                return writer;
	            };

	            /**
	             * Encodes the specified ChromeConfig message, length delimited. Does not implicitly {@link perfetto.protos.ChromeConfig.verify|verify} messages.
	             * @function encodeDelimited
	             * @memberof perfetto.protos.ChromeConfig
	             * @static
	             * @param {perfetto.protos.IChromeConfig} message ChromeConfig message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            ChromeConfig.encodeDelimited = function encodeDelimited(message, writer) {
	                return this.encode(message, writer).ldelim();
	            };

	            /**
	             * Decodes a ChromeConfig message from the specified reader or buffer.
	             * @function decode
	             * @memberof perfetto.protos.ChromeConfig
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @param {number} [length] Message length if known beforehand
	             * @returns {perfetto.protos.ChromeConfig} ChromeConfig
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            ChromeConfig.decode = function decode(reader, length) {
	                if (!(reader instanceof $Reader))
	                    reader = $Reader.create(reader);
	                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.ChromeConfig();
	                while (reader.pos < end) {
	                    var tag = reader.uint32();
	                    switch (tag >>> 3) {
	                    case 1:
	                        message.traceConfig = reader.string();
	                        break;
	                    default:
	                        reader.skipType(tag & 7);
	                        break;
	                    }
	                }
	                return message;
	            };

	            /**
	             * Decodes a ChromeConfig message from the specified reader or buffer, length delimited.
	             * @function decodeDelimited
	             * @memberof perfetto.protos.ChromeConfig
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @returns {perfetto.protos.ChromeConfig} ChromeConfig
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            ChromeConfig.decodeDelimited = function decodeDelimited(reader) {
	                if (!(reader instanceof $Reader))
	                    reader = new $Reader(reader);
	                return this.decode(reader, reader.uint32());
	            };

	            /**
	             * Verifies a ChromeConfig message.
	             * @function verify
	             * @memberof perfetto.protos.ChromeConfig
	             * @static
	             * @param {Object.<string,*>} message Plain object to verify
	             * @returns {string|null} `null` if valid, otherwise the reason why it is not
	             */
	            ChromeConfig.verify = function verify(message) {
	                if (typeof message !== "object" || message === null)
	                    return "object expected";
	                if (message.traceConfig != null && message.hasOwnProperty("traceConfig"))
	                    if (!$util.isString(message.traceConfig))
	                        return "traceConfig: string expected";
	                return null;
	            };

	            /**
	             * Creates a ChromeConfig message from a plain object. Also converts values to their respective internal types.
	             * @function fromObject
	             * @memberof perfetto.protos.ChromeConfig
	             * @static
	             * @param {Object.<string,*>} object Plain object
	             * @returns {perfetto.protos.ChromeConfig} ChromeConfig
	             */
	            ChromeConfig.fromObject = function fromObject(object) {
	                if (object instanceof $root.perfetto.protos.ChromeConfig)
	                    return object;
	                var message = new $root.perfetto.protos.ChromeConfig();
	                if (object.traceConfig != null)
	                    message.traceConfig = String(object.traceConfig);
	                return message;
	            };

	            /**
	             * Creates a plain object from a ChromeConfig message. Also converts values to other types if specified.
	             * @function toObject
	             * @memberof perfetto.protos.ChromeConfig
	             * @static
	             * @param {perfetto.protos.ChromeConfig} message ChromeConfig
	             * @param {$protobuf.IConversionOptions} [options] Conversion options
	             * @returns {Object.<string,*>} Plain object
	             */
	            ChromeConfig.toObject = function toObject(message, options) {
	                if (!options)
	                    options = {};
	                var object = {};
	                if (options.defaults)
	                    object.traceConfig = "";
	                if (message.traceConfig != null && message.hasOwnProperty("traceConfig"))
	                    object.traceConfig = message.traceConfig;
	                return object;
	            };

	            /**
	             * Converts this ChromeConfig to JSON.
	             * @function toJSON
	             * @memberof perfetto.protos.ChromeConfig
	             * @instance
	             * @returns {Object.<string,*>} JSON object
	             */
	            ChromeConfig.prototype.toJSON = function toJSON() {
	                return this.constructor.toObject(this, minimal$1.util.toJSONOptions);
	            };

	            return ChromeConfig;
	        })();

	        protos.InodeFileConfig = (function() {

	            /**
	             * Properties of an InodeFileConfig.
	             * @memberof perfetto.protos
	             * @interface IInodeFileConfig
	             * @property {number|null} [scanIntervalMs] InodeFileConfig scanIntervalMs
	             * @property {number|null} [scanDelayMs] InodeFileConfig scanDelayMs
	             * @property {number|null} [scanBatchSize] InodeFileConfig scanBatchSize
	             * @property {boolean|null} [doNotScan] InodeFileConfig doNotScan
	             * @property {Array.<string>|null} [scanMountPoints] InodeFileConfig scanMountPoints
	             * @property {Array.<perfetto.protos.InodeFileConfig.IMountPointMappingEntry>|null} [mountPointMapping] InodeFileConfig mountPointMapping
	             */

	            /**
	             * Constructs a new InodeFileConfig.
	             * @memberof perfetto.protos
	             * @classdesc Represents an InodeFileConfig.
	             * @implements IInodeFileConfig
	             * @constructor
	             * @param {perfetto.protos.IInodeFileConfig=} [properties] Properties to set
	             */
	            function InodeFileConfig(properties) {
	                this.scanMountPoints = [];
	                this.mountPointMapping = [];
	                if (properties)
	                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                        if (properties[keys[i]] != null)
	                            this[keys[i]] = properties[keys[i]];
	            }

	            /**
	             * InodeFileConfig scanIntervalMs.
	             * @member {number} scanIntervalMs
	             * @memberof perfetto.protos.InodeFileConfig
	             * @instance
	             */
	            InodeFileConfig.prototype.scanIntervalMs = 0;

	            /**
	             * InodeFileConfig scanDelayMs.
	             * @member {number} scanDelayMs
	             * @memberof perfetto.protos.InodeFileConfig
	             * @instance
	             */
	            InodeFileConfig.prototype.scanDelayMs = 0;

	            /**
	             * InodeFileConfig scanBatchSize.
	             * @member {number} scanBatchSize
	             * @memberof perfetto.protos.InodeFileConfig
	             * @instance
	             */
	            InodeFileConfig.prototype.scanBatchSize = 0;

	            /**
	             * InodeFileConfig doNotScan.
	             * @member {boolean} doNotScan
	             * @memberof perfetto.protos.InodeFileConfig
	             * @instance
	             */
	            InodeFileConfig.prototype.doNotScan = false;

	            /**
	             * InodeFileConfig scanMountPoints.
	             * @member {Array.<string>} scanMountPoints
	             * @memberof perfetto.protos.InodeFileConfig
	             * @instance
	             */
	            InodeFileConfig.prototype.scanMountPoints = $util.emptyArray;

	            /**
	             * InodeFileConfig mountPointMapping.
	             * @member {Array.<perfetto.protos.InodeFileConfig.IMountPointMappingEntry>} mountPointMapping
	             * @memberof perfetto.protos.InodeFileConfig
	             * @instance
	             */
	            InodeFileConfig.prototype.mountPointMapping = $util.emptyArray;

	            /**
	             * Creates a new InodeFileConfig instance using the specified properties.
	             * @function create
	             * @memberof perfetto.protos.InodeFileConfig
	             * @static
	             * @param {perfetto.protos.IInodeFileConfig=} [properties] Properties to set
	             * @returns {perfetto.protos.InodeFileConfig} InodeFileConfig instance
	             */
	            InodeFileConfig.create = function create(properties) {
	                return new InodeFileConfig(properties);
	            };

	            /**
	             * Encodes the specified InodeFileConfig message. Does not implicitly {@link perfetto.protos.InodeFileConfig.verify|verify} messages.
	             * @function encode
	             * @memberof perfetto.protos.InodeFileConfig
	             * @static
	             * @param {perfetto.protos.IInodeFileConfig} message InodeFileConfig message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            InodeFileConfig.encode = function encode(message, writer) {
	                if (!writer)
	                    writer = $Writer.create();
	                if (message.scanIntervalMs != null && message.hasOwnProperty("scanIntervalMs"))
	                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.scanIntervalMs);
	                if (message.scanDelayMs != null && message.hasOwnProperty("scanDelayMs"))
	                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.scanDelayMs);
	                if (message.scanBatchSize != null && message.hasOwnProperty("scanBatchSize"))
	                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.scanBatchSize);
	                if (message.doNotScan != null && message.hasOwnProperty("doNotScan"))
	                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.doNotScan);
	                if (message.scanMountPoints != null && message.scanMountPoints.length)
	                    for (var i = 0; i < message.scanMountPoints.length; ++i)
	                        writer.uint32(/* id 5, wireType 2 =*/42).string(message.scanMountPoints[i]);
	                if (message.mountPointMapping != null && message.mountPointMapping.length)
	                    for (var i = 0; i < message.mountPointMapping.length; ++i)
	                        $root.perfetto.protos.InodeFileConfig.MountPointMappingEntry.encode(message.mountPointMapping[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
	                return writer;
	            };

	            /**
	             * Encodes the specified InodeFileConfig message, length delimited. Does not implicitly {@link perfetto.protos.InodeFileConfig.verify|verify} messages.
	             * @function encodeDelimited
	             * @memberof perfetto.protos.InodeFileConfig
	             * @static
	             * @param {perfetto.protos.IInodeFileConfig} message InodeFileConfig message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            InodeFileConfig.encodeDelimited = function encodeDelimited(message, writer) {
	                return this.encode(message, writer).ldelim();
	            };

	            /**
	             * Decodes an InodeFileConfig message from the specified reader or buffer.
	             * @function decode
	             * @memberof perfetto.protos.InodeFileConfig
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @param {number} [length] Message length if known beforehand
	             * @returns {perfetto.protos.InodeFileConfig} InodeFileConfig
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            InodeFileConfig.decode = function decode(reader, length) {
	                if (!(reader instanceof $Reader))
	                    reader = $Reader.create(reader);
	                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.InodeFileConfig();
	                while (reader.pos < end) {
	                    var tag = reader.uint32();
	                    switch (tag >>> 3) {
	                    case 1:
	                        message.scanIntervalMs = reader.uint32();
	                        break;
	                    case 2:
	                        message.scanDelayMs = reader.uint32();
	                        break;
	                    case 3:
	                        message.scanBatchSize = reader.uint32();
	                        break;
	                    case 4:
	                        message.doNotScan = reader.bool();
	                        break;
	                    case 5:
	                        if (!(message.scanMountPoints && message.scanMountPoints.length))
	                            message.scanMountPoints = [];
	                        message.scanMountPoints.push(reader.string());
	                        break;
	                    case 6:
	                        if (!(message.mountPointMapping && message.mountPointMapping.length))
	                            message.mountPointMapping = [];
	                        message.mountPointMapping.push($root.perfetto.protos.InodeFileConfig.MountPointMappingEntry.decode(reader, reader.uint32()));
	                        break;
	                    default:
	                        reader.skipType(tag & 7);
	                        break;
	                    }
	                }
	                return message;
	            };

	            /**
	             * Decodes an InodeFileConfig message from the specified reader or buffer, length delimited.
	             * @function decodeDelimited
	             * @memberof perfetto.protos.InodeFileConfig
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @returns {perfetto.protos.InodeFileConfig} InodeFileConfig
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            InodeFileConfig.decodeDelimited = function decodeDelimited(reader) {
	                if (!(reader instanceof $Reader))
	                    reader = new $Reader(reader);
	                return this.decode(reader, reader.uint32());
	            };

	            /**
	             * Verifies an InodeFileConfig message.
	             * @function verify
	             * @memberof perfetto.protos.InodeFileConfig
	             * @static
	             * @param {Object.<string,*>} message Plain object to verify
	             * @returns {string|null} `null` if valid, otherwise the reason why it is not
	             */
	            InodeFileConfig.verify = function verify(message) {
	                if (typeof message !== "object" || message === null)
	                    return "object expected";
	                if (message.scanIntervalMs != null && message.hasOwnProperty("scanIntervalMs"))
	                    if (!$util.isInteger(message.scanIntervalMs))
	                        return "scanIntervalMs: integer expected";
	                if (message.scanDelayMs != null && message.hasOwnProperty("scanDelayMs"))
	                    if (!$util.isInteger(message.scanDelayMs))
	                        return "scanDelayMs: integer expected";
	                if (message.scanBatchSize != null && message.hasOwnProperty("scanBatchSize"))
	                    if (!$util.isInteger(message.scanBatchSize))
	                        return "scanBatchSize: integer expected";
	                if (message.doNotScan != null && message.hasOwnProperty("doNotScan"))
	                    if (typeof message.doNotScan !== "boolean")
	                        return "doNotScan: boolean expected";
	                if (message.scanMountPoints != null && message.hasOwnProperty("scanMountPoints")) {
	                    if (!Array.isArray(message.scanMountPoints))
	                        return "scanMountPoints: array expected";
	                    for (var i = 0; i < message.scanMountPoints.length; ++i)
	                        if (!$util.isString(message.scanMountPoints[i]))
	                            return "scanMountPoints: string[] expected";
	                }
	                if (message.mountPointMapping != null && message.hasOwnProperty("mountPointMapping")) {
	                    if (!Array.isArray(message.mountPointMapping))
	                        return "mountPointMapping: array expected";
	                    for (var i = 0; i < message.mountPointMapping.length; ++i) {
	                        var error = $root.perfetto.protos.InodeFileConfig.MountPointMappingEntry.verify(message.mountPointMapping[i]);
	                        if (error)
	                            return "mountPointMapping." + error;
	                    }
	                }
	                return null;
	            };

	            /**
	             * Creates an InodeFileConfig message from a plain object. Also converts values to their respective internal types.
	             * @function fromObject
	             * @memberof perfetto.protos.InodeFileConfig
	             * @static
	             * @param {Object.<string,*>} object Plain object
	             * @returns {perfetto.protos.InodeFileConfig} InodeFileConfig
	             */
	            InodeFileConfig.fromObject = function fromObject(object) {
	                if (object instanceof $root.perfetto.protos.InodeFileConfig)
	                    return object;
	                var message = new $root.perfetto.protos.InodeFileConfig();
	                if (object.scanIntervalMs != null)
	                    message.scanIntervalMs = object.scanIntervalMs >>> 0;
	                if (object.scanDelayMs != null)
	                    message.scanDelayMs = object.scanDelayMs >>> 0;
	                if (object.scanBatchSize != null)
	                    message.scanBatchSize = object.scanBatchSize >>> 0;
	                if (object.doNotScan != null)
	                    message.doNotScan = Boolean(object.doNotScan);
	                if (object.scanMountPoints) {
	                    if (!Array.isArray(object.scanMountPoints))
	                        throw TypeError(".perfetto.protos.InodeFileConfig.scanMountPoints: array expected");
	                    message.scanMountPoints = [];
	                    for (var i = 0; i < object.scanMountPoints.length; ++i)
	                        message.scanMountPoints[i] = String(object.scanMountPoints[i]);
	                }
	                if (object.mountPointMapping) {
	                    if (!Array.isArray(object.mountPointMapping))
	                        throw TypeError(".perfetto.protos.InodeFileConfig.mountPointMapping: array expected");
	                    message.mountPointMapping = [];
	                    for (var i = 0; i < object.mountPointMapping.length; ++i) {
	                        if (typeof object.mountPointMapping[i] !== "object")
	                            throw TypeError(".perfetto.protos.InodeFileConfig.mountPointMapping: object expected");
	                        message.mountPointMapping[i] = $root.perfetto.protos.InodeFileConfig.MountPointMappingEntry.fromObject(object.mountPointMapping[i]);
	                    }
	                }
	                return message;
	            };

	            /**
	             * Creates a plain object from an InodeFileConfig message. Also converts values to other types if specified.
	             * @function toObject
	             * @memberof perfetto.protos.InodeFileConfig
	             * @static
	             * @param {perfetto.protos.InodeFileConfig} message InodeFileConfig
	             * @param {$protobuf.IConversionOptions} [options] Conversion options
	             * @returns {Object.<string,*>} Plain object
	             */
	            InodeFileConfig.toObject = function toObject(message, options) {
	                if (!options)
	                    options = {};
	                var object = {};
	                if (options.arrays || options.defaults) {
	                    object.scanMountPoints = [];
	                    object.mountPointMapping = [];
	                }
	                if (options.defaults) {
	                    object.scanIntervalMs = 0;
	                    object.scanDelayMs = 0;
	                    object.scanBatchSize = 0;
	                    object.doNotScan = false;
	                }
	                if (message.scanIntervalMs != null && message.hasOwnProperty("scanIntervalMs"))
	                    object.scanIntervalMs = message.scanIntervalMs;
	                if (message.scanDelayMs != null && message.hasOwnProperty("scanDelayMs"))
	                    object.scanDelayMs = message.scanDelayMs;
	                if (message.scanBatchSize != null && message.hasOwnProperty("scanBatchSize"))
	                    object.scanBatchSize = message.scanBatchSize;
	                if (message.doNotScan != null && message.hasOwnProperty("doNotScan"))
	                    object.doNotScan = message.doNotScan;
	                if (message.scanMountPoints && message.scanMountPoints.length) {
	                    object.scanMountPoints = [];
	                    for (var j = 0; j < message.scanMountPoints.length; ++j)
	                        object.scanMountPoints[j] = message.scanMountPoints[j];
	                }
	                if (message.mountPointMapping && message.mountPointMapping.length) {
	                    object.mountPointMapping = [];
	                    for (var j = 0; j < message.mountPointMapping.length; ++j)
	                        object.mountPointMapping[j] = $root.perfetto.protos.InodeFileConfig.MountPointMappingEntry.toObject(message.mountPointMapping[j], options);
	                }
	                return object;
	            };

	            /**
	             * Converts this InodeFileConfig to JSON.
	             * @function toJSON
	             * @memberof perfetto.protos.InodeFileConfig
	             * @instance
	             * @returns {Object.<string,*>} JSON object
	             */
	            InodeFileConfig.prototype.toJSON = function toJSON() {
	                return this.constructor.toObject(this, minimal$1.util.toJSONOptions);
	            };

	            InodeFileConfig.MountPointMappingEntry = (function() {

	                /**
	                 * Properties of a MountPointMappingEntry.
	                 * @memberof perfetto.protos.InodeFileConfig
	                 * @interface IMountPointMappingEntry
	                 * @property {string|null} [mountpoint] MountPointMappingEntry mountpoint
	                 * @property {Array.<string>|null} [scanRoots] MountPointMappingEntry scanRoots
	                 */

	                /**
	                 * Constructs a new MountPointMappingEntry.
	                 * @memberof perfetto.protos.InodeFileConfig
	                 * @classdesc Represents a MountPointMappingEntry.
	                 * @implements IMountPointMappingEntry
	                 * @constructor
	                 * @param {perfetto.protos.InodeFileConfig.IMountPointMappingEntry=} [properties] Properties to set
	                 */
	                function MountPointMappingEntry(properties) {
	                    this.scanRoots = [];
	                    if (properties)
	                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                            if (properties[keys[i]] != null)
	                                this[keys[i]] = properties[keys[i]];
	                }

	                /**
	                 * MountPointMappingEntry mountpoint.
	                 * @member {string} mountpoint
	                 * @memberof perfetto.protos.InodeFileConfig.MountPointMappingEntry
	                 * @instance
	                 */
	                MountPointMappingEntry.prototype.mountpoint = "";

	                /**
	                 * MountPointMappingEntry scanRoots.
	                 * @member {Array.<string>} scanRoots
	                 * @memberof perfetto.protos.InodeFileConfig.MountPointMappingEntry
	                 * @instance
	                 */
	                MountPointMappingEntry.prototype.scanRoots = $util.emptyArray;

	                /**
	                 * Creates a new MountPointMappingEntry instance using the specified properties.
	                 * @function create
	                 * @memberof perfetto.protos.InodeFileConfig.MountPointMappingEntry
	                 * @static
	                 * @param {perfetto.protos.InodeFileConfig.IMountPointMappingEntry=} [properties] Properties to set
	                 * @returns {perfetto.protos.InodeFileConfig.MountPointMappingEntry} MountPointMappingEntry instance
	                 */
	                MountPointMappingEntry.create = function create(properties) {
	                    return new MountPointMappingEntry(properties);
	                };

	                /**
	                 * Encodes the specified MountPointMappingEntry message. Does not implicitly {@link perfetto.protos.InodeFileConfig.MountPointMappingEntry.verify|verify} messages.
	                 * @function encode
	                 * @memberof perfetto.protos.InodeFileConfig.MountPointMappingEntry
	                 * @static
	                 * @param {perfetto.protos.InodeFileConfig.IMountPointMappingEntry} message MountPointMappingEntry message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                MountPointMappingEntry.encode = function encode(message, writer) {
	                    if (!writer)
	                        writer = $Writer.create();
	                    if (message.mountpoint != null && message.hasOwnProperty("mountpoint"))
	                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.mountpoint);
	                    if (message.scanRoots != null && message.scanRoots.length)
	                        for (var i = 0; i < message.scanRoots.length; ++i)
	                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.scanRoots[i]);
	                    return writer;
	                };

	                /**
	                 * Encodes the specified MountPointMappingEntry message, length delimited. Does not implicitly {@link perfetto.protos.InodeFileConfig.MountPointMappingEntry.verify|verify} messages.
	                 * @function encodeDelimited
	                 * @memberof perfetto.protos.InodeFileConfig.MountPointMappingEntry
	                 * @static
	                 * @param {perfetto.protos.InodeFileConfig.IMountPointMappingEntry} message MountPointMappingEntry message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                MountPointMappingEntry.encodeDelimited = function encodeDelimited(message, writer) {
	                    return this.encode(message, writer).ldelim();
	                };

	                /**
	                 * Decodes a MountPointMappingEntry message from the specified reader or buffer.
	                 * @function decode
	                 * @memberof perfetto.protos.InodeFileConfig.MountPointMappingEntry
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @param {number} [length] Message length if known beforehand
	                 * @returns {perfetto.protos.InodeFileConfig.MountPointMappingEntry} MountPointMappingEntry
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                MountPointMappingEntry.decode = function decode(reader, length) {
	                    if (!(reader instanceof $Reader))
	                        reader = $Reader.create(reader);
	                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.InodeFileConfig.MountPointMappingEntry();
	                    while (reader.pos < end) {
	                        var tag = reader.uint32();
	                        switch (tag >>> 3) {
	                        case 1:
	                            message.mountpoint = reader.string();
	                            break;
	                        case 2:
	                            if (!(message.scanRoots && message.scanRoots.length))
	                                message.scanRoots = [];
	                            message.scanRoots.push(reader.string());
	                            break;
	                        default:
	                            reader.skipType(tag & 7);
	                            break;
	                        }
	                    }
	                    return message;
	                };

	                /**
	                 * Decodes a MountPointMappingEntry message from the specified reader or buffer, length delimited.
	                 * @function decodeDelimited
	                 * @memberof perfetto.protos.InodeFileConfig.MountPointMappingEntry
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @returns {perfetto.protos.InodeFileConfig.MountPointMappingEntry} MountPointMappingEntry
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                MountPointMappingEntry.decodeDelimited = function decodeDelimited(reader) {
	                    if (!(reader instanceof $Reader))
	                        reader = new $Reader(reader);
	                    return this.decode(reader, reader.uint32());
	                };

	                /**
	                 * Verifies a MountPointMappingEntry message.
	                 * @function verify
	                 * @memberof perfetto.protos.InodeFileConfig.MountPointMappingEntry
	                 * @static
	                 * @param {Object.<string,*>} message Plain object to verify
	                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
	                 */
	                MountPointMappingEntry.verify = function verify(message) {
	                    if (typeof message !== "object" || message === null)
	                        return "object expected";
	                    if (message.mountpoint != null && message.hasOwnProperty("mountpoint"))
	                        if (!$util.isString(message.mountpoint))
	                            return "mountpoint: string expected";
	                    if (message.scanRoots != null && message.hasOwnProperty("scanRoots")) {
	                        if (!Array.isArray(message.scanRoots))
	                            return "scanRoots: array expected";
	                        for (var i = 0; i < message.scanRoots.length; ++i)
	                            if (!$util.isString(message.scanRoots[i]))
	                                return "scanRoots: string[] expected";
	                    }
	                    return null;
	                };

	                /**
	                 * Creates a MountPointMappingEntry message from a plain object. Also converts values to their respective internal types.
	                 * @function fromObject
	                 * @memberof perfetto.protos.InodeFileConfig.MountPointMappingEntry
	                 * @static
	                 * @param {Object.<string,*>} object Plain object
	                 * @returns {perfetto.protos.InodeFileConfig.MountPointMappingEntry} MountPointMappingEntry
	                 */
	                MountPointMappingEntry.fromObject = function fromObject(object) {
	                    if (object instanceof $root.perfetto.protos.InodeFileConfig.MountPointMappingEntry)
	                        return object;
	                    var message = new $root.perfetto.protos.InodeFileConfig.MountPointMappingEntry();
	                    if (object.mountpoint != null)
	                        message.mountpoint = String(object.mountpoint);
	                    if (object.scanRoots) {
	                        if (!Array.isArray(object.scanRoots))
	                            throw TypeError(".perfetto.protos.InodeFileConfig.MountPointMappingEntry.scanRoots: array expected");
	                        message.scanRoots = [];
	                        for (var i = 0; i < object.scanRoots.length; ++i)
	                            message.scanRoots[i] = String(object.scanRoots[i]);
	                    }
	                    return message;
	                };

	                /**
	                 * Creates a plain object from a MountPointMappingEntry message. Also converts values to other types if specified.
	                 * @function toObject
	                 * @memberof perfetto.protos.InodeFileConfig.MountPointMappingEntry
	                 * @static
	                 * @param {perfetto.protos.InodeFileConfig.MountPointMappingEntry} message MountPointMappingEntry
	                 * @param {$protobuf.IConversionOptions} [options] Conversion options
	                 * @returns {Object.<string,*>} Plain object
	                 */
	                MountPointMappingEntry.toObject = function toObject(message, options) {
	                    if (!options)
	                        options = {};
	                    var object = {};
	                    if (options.arrays || options.defaults)
	                        object.scanRoots = [];
	                    if (options.defaults)
	                        object.mountpoint = "";
	                    if (message.mountpoint != null && message.hasOwnProperty("mountpoint"))
	                        object.mountpoint = message.mountpoint;
	                    if (message.scanRoots && message.scanRoots.length) {
	                        object.scanRoots = [];
	                        for (var j = 0; j < message.scanRoots.length; ++j)
	                            object.scanRoots[j] = message.scanRoots[j];
	                    }
	                    return object;
	                };

	                /**
	                 * Converts this MountPointMappingEntry to JSON.
	                 * @function toJSON
	                 * @memberof perfetto.protos.InodeFileConfig.MountPointMappingEntry
	                 * @instance
	                 * @returns {Object.<string,*>} JSON object
	                 */
	                MountPointMappingEntry.prototype.toJSON = function toJSON() {
	                    return this.constructor.toObject(this, minimal$1.util.toJSONOptions);
	                };

	                return MountPointMappingEntry;
	            })();

	            return InodeFileConfig;
	        })();

	        protos.ProcessStatsConfig = (function() {

	            /**
	             * Properties of a ProcessStatsConfig.
	             * @memberof perfetto.protos
	             * @interface IProcessStatsConfig
	             * @property {Array.<perfetto.protos.ProcessStatsConfig.Quirks>|null} [quirks] ProcessStatsConfig quirks
	             * @property {boolean|null} [scanAllProcessesOnStart] ProcessStatsConfig scanAllProcessesOnStart
	             * @property {boolean|null} [recordThreadNames] ProcessStatsConfig recordThreadNames
	             */

	            /**
	             * Constructs a new ProcessStatsConfig.
	             * @memberof perfetto.protos
	             * @classdesc Represents a ProcessStatsConfig.
	             * @implements IProcessStatsConfig
	             * @constructor
	             * @param {perfetto.protos.IProcessStatsConfig=} [properties] Properties to set
	             */
	            function ProcessStatsConfig(properties) {
	                this.quirks = [];
	                if (properties)
	                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                        if (properties[keys[i]] != null)
	                            this[keys[i]] = properties[keys[i]];
	            }

	            /**
	             * ProcessStatsConfig quirks.
	             * @member {Array.<perfetto.protos.ProcessStatsConfig.Quirks>} quirks
	             * @memberof perfetto.protos.ProcessStatsConfig
	             * @instance
	             */
	            ProcessStatsConfig.prototype.quirks = $util.emptyArray;

	            /**
	             * ProcessStatsConfig scanAllProcessesOnStart.
	             * @member {boolean} scanAllProcessesOnStart
	             * @memberof perfetto.protos.ProcessStatsConfig
	             * @instance
	             */
	            ProcessStatsConfig.prototype.scanAllProcessesOnStart = false;

	            /**
	             * ProcessStatsConfig recordThreadNames.
	             * @member {boolean} recordThreadNames
	             * @memberof perfetto.protos.ProcessStatsConfig
	             * @instance
	             */
	            ProcessStatsConfig.prototype.recordThreadNames = false;

	            /**
	             * Creates a new ProcessStatsConfig instance using the specified properties.
	             * @function create
	             * @memberof perfetto.protos.ProcessStatsConfig
	             * @static
	             * @param {perfetto.protos.IProcessStatsConfig=} [properties] Properties to set
	             * @returns {perfetto.protos.ProcessStatsConfig} ProcessStatsConfig instance
	             */
	            ProcessStatsConfig.create = function create(properties) {
	                return new ProcessStatsConfig(properties);
	            };

	            /**
	             * Encodes the specified ProcessStatsConfig message. Does not implicitly {@link perfetto.protos.ProcessStatsConfig.verify|verify} messages.
	             * @function encode
	             * @memberof perfetto.protos.ProcessStatsConfig
	             * @static
	             * @param {perfetto.protos.IProcessStatsConfig} message ProcessStatsConfig message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            ProcessStatsConfig.encode = function encode(message, writer) {
	                if (!writer)
	                    writer = $Writer.create();
	                if (message.quirks != null && message.quirks.length)
	                    for (var i = 0; i < message.quirks.length; ++i)
	                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.quirks[i]);
	                if (message.scanAllProcessesOnStart != null && message.hasOwnProperty("scanAllProcessesOnStart"))
	                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.scanAllProcessesOnStart);
	                if (message.recordThreadNames != null && message.hasOwnProperty("recordThreadNames"))
	                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.recordThreadNames);
	                return writer;
	            };

	            /**
	             * Encodes the specified ProcessStatsConfig message, length delimited. Does not implicitly {@link perfetto.protos.ProcessStatsConfig.verify|verify} messages.
	             * @function encodeDelimited
	             * @memberof perfetto.protos.ProcessStatsConfig
	             * @static
	             * @param {perfetto.protos.IProcessStatsConfig} message ProcessStatsConfig message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            ProcessStatsConfig.encodeDelimited = function encodeDelimited(message, writer) {
	                return this.encode(message, writer).ldelim();
	            };

	            /**
	             * Decodes a ProcessStatsConfig message from the specified reader or buffer.
	             * @function decode
	             * @memberof perfetto.protos.ProcessStatsConfig
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @param {number} [length] Message length if known beforehand
	             * @returns {perfetto.protos.ProcessStatsConfig} ProcessStatsConfig
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            ProcessStatsConfig.decode = function decode(reader, length) {
	                if (!(reader instanceof $Reader))
	                    reader = $Reader.create(reader);
	                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.ProcessStatsConfig();
	                while (reader.pos < end) {
	                    var tag = reader.uint32();
	                    switch (tag >>> 3) {
	                    case 1:
	                        if (!(message.quirks && message.quirks.length))
	                            message.quirks = [];
	                        if ((tag & 7) === 2) {
	                            var end2 = reader.uint32() + reader.pos;
	                            while (reader.pos < end2)
	                                message.quirks.push(reader.int32());
	                        } else
	                            message.quirks.push(reader.int32());
	                        break;
	                    case 2:
	                        message.scanAllProcessesOnStart = reader.bool();
	                        break;
	                    case 3:
	                        message.recordThreadNames = reader.bool();
	                        break;
	                    default:
	                        reader.skipType(tag & 7);
	                        break;
	                    }
	                }
	                return message;
	            };

	            /**
	             * Decodes a ProcessStatsConfig message from the specified reader or buffer, length delimited.
	             * @function decodeDelimited
	             * @memberof perfetto.protos.ProcessStatsConfig
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @returns {perfetto.protos.ProcessStatsConfig} ProcessStatsConfig
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            ProcessStatsConfig.decodeDelimited = function decodeDelimited(reader) {
	                if (!(reader instanceof $Reader))
	                    reader = new $Reader(reader);
	                return this.decode(reader, reader.uint32());
	            };

	            /**
	             * Verifies a ProcessStatsConfig message.
	             * @function verify
	             * @memberof perfetto.protos.ProcessStatsConfig
	             * @static
	             * @param {Object.<string,*>} message Plain object to verify
	             * @returns {string|null} `null` if valid, otherwise the reason why it is not
	             */
	            ProcessStatsConfig.verify = function verify(message) {
	                if (typeof message !== "object" || message === null)
	                    return "object expected";
	                if (message.quirks != null && message.hasOwnProperty("quirks")) {
	                    if (!Array.isArray(message.quirks))
	                        return "quirks: array expected";
	                    for (var i = 0; i < message.quirks.length; ++i)
	                        switch (message.quirks[i]) {
	                        default:
	                            return "quirks: enum value[] expected";
	                        case 0:
	                        case 1:
	                        case 2:
	                            break;
	                        }
	                }
	                if (message.scanAllProcessesOnStart != null && message.hasOwnProperty("scanAllProcessesOnStart"))
	                    if (typeof message.scanAllProcessesOnStart !== "boolean")
	                        return "scanAllProcessesOnStart: boolean expected";
	                if (message.recordThreadNames != null && message.hasOwnProperty("recordThreadNames"))
	                    if (typeof message.recordThreadNames !== "boolean")
	                        return "recordThreadNames: boolean expected";
	                return null;
	            };

	            /**
	             * Creates a ProcessStatsConfig message from a plain object. Also converts values to their respective internal types.
	             * @function fromObject
	             * @memberof perfetto.protos.ProcessStatsConfig
	             * @static
	             * @param {Object.<string,*>} object Plain object
	             * @returns {perfetto.protos.ProcessStatsConfig} ProcessStatsConfig
	             */
	            ProcessStatsConfig.fromObject = function fromObject(object) {
	                if (object instanceof $root.perfetto.protos.ProcessStatsConfig)
	                    return object;
	                var message = new $root.perfetto.protos.ProcessStatsConfig();
	                if (object.quirks) {
	                    if (!Array.isArray(object.quirks))
	                        throw TypeError(".perfetto.protos.ProcessStatsConfig.quirks: array expected");
	                    message.quirks = [];
	                    for (var i = 0; i < object.quirks.length; ++i)
	                        switch (object.quirks[i]) {
	                        default:
	                        case "QUIRKS_UNSPECIFIED":
	                        case 0:
	                            message.quirks[i] = 0;
	                            break;
	                        case "DISABLE_INITIAL_DUMP":
	                        case 1:
	                            message.quirks[i] = 1;
	                            break;
	                        case "DISABLE_ON_DEMAND":
	                        case 2:
	                            message.quirks[i] = 2;
	                            break;
	                        }
	                }
	                if (object.scanAllProcessesOnStart != null)
	                    message.scanAllProcessesOnStart = Boolean(object.scanAllProcessesOnStart);
	                if (object.recordThreadNames != null)
	                    message.recordThreadNames = Boolean(object.recordThreadNames);
	                return message;
	            };

	            /**
	             * Creates a plain object from a ProcessStatsConfig message. Also converts values to other types if specified.
	             * @function toObject
	             * @memberof perfetto.protos.ProcessStatsConfig
	             * @static
	             * @param {perfetto.protos.ProcessStatsConfig} message ProcessStatsConfig
	             * @param {$protobuf.IConversionOptions} [options] Conversion options
	             * @returns {Object.<string,*>} Plain object
	             */
	            ProcessStatsConfig.toObject = function toObject(message, options) {
	                if (!options)
	                    options = {};
	                var object = {};
	                if (options.arrays || options.defaults)
	                    object.quirks = [];
	                if (options.defaults) {
	                    object.scanAllProcessesOnStart = false;
	                    object.recordThreadNames = false;
	                }
	                if (message.quirks && message.quirks.length) {
	                    object.quirks = [];
	                    for (var j = 0; j < message.quirks.length; ++j)
	                        object.quirks[j] = options.enums === String ? $root.perfetto.protos.ProcessStatsConfig.Quirks[message.quirks[j]] : message.quirks[j];
	                }
	                if (message.scanAllProcessesOnStart != null && message.hasOwnProperty("scanAllProcessesOnStart"))
	                    object.scanAllProcessesOnStart = message.scanAllProcessesOnStart;
	                if (message.recordThreadNames != null && message.hasOwnProperty("recordThreadNames"))
	                    object.recordThreadNames = message.recordThreadNames;
	                return object;
	            };

	            /**
	             * Converts this ProcessStatsConfig to JSON.
	             * @function toJSON
	             * @memberof perfetto.protos.ProcessStatsConfig
	             * @instance
	             * @returns {Object.<string,*>} JSON object
	             */
	            ProcessStatsConfig.prototype.toJSON = function toJSON() {
	                return this.constructor.toObject(this, minimal$1.util.toJSONOptions);
	            };

	            /**
	             * Quirks enum.
	             * @name perfetto.protos.ProcessStatsConfig.Quirks
	             * @enum {string}
	             * @property {number} QUIRKS_UNSPECIFIED=0 QUIRKS_UNSPECIFIED value
	             * @property {number} DISABLE_INITIAL_DUMP=1 DISABLE_INITIAL_DUMP value
	             * @property {number} DISABLE_ON_DEMAND=2 DISABLE_ON_DEMAND value
	             */
	            ProcessStatsConfig.Quirks = (function() {
	                var valuesById = {}, values = Object.create(valuesById);
	                values[valuesById[0] = "QUIRKS_UNSPECIFIED"] = 0;
	                values[valuesById[1] = "DISABLE_INITIAL_DUMP"] = 1;
	                values[valuesById[2] = "DISABLE_ON_DEMAND"] = 2;
	                return values;
	            })();

	            return ProcessStatsConfig;
	        })();

	        protos.DataSourceConfig = (function() {

	            /**
	             * Properties of a DataSourceConfig.
	             * @memberof perfetto.protos
	             * @interface IDataSourceConfig
	             * @property {string|null} [name] DataSourceConfig name
	             * @property {number|null} [targetBuffer] DataSourceConfig targetBuffer
	             * @property {number|null} [traceDurationMs] DataSourceConfig traceDurationMs
	             * @property {number|Long|null} [tracingSessionId] DataSourceConfig tracingSessionId
	             * @property {perfetto.protos.IFtraceConfig|null} [ftraceConfig] DataSourceConfig ftraceConfig
	             * @property {perfetto.protos.IChromeConfig|null} [chromeConfig] DataSourceConfig chromeConfig
	             * @property {perfetto.protos.IInodeFileConfig|null} [inodeFileConfig] DataSourceConfig inodeFileConfig
	             * @property {perfetto.protos.IProcessStatsConfig|null} [processStatsConfig] DataSourceConfig processStatsConfig
	             * @property {string|null} [legacyConfig] DataSourceConfig legacyConfig
	             * @property {perfetto.protos.ITestConfig|null} [forTesting] DataSourceConfig forTesting
	             */

	            /**
	             * Constructs a new DataSourceConfig.
	             * @memberof perfetto.protos
	             * @classdesc Represents a DataSourceConfig.
	             * @implements IDataSourceConfig
	             * @constructor
	             * @param {perfetto.protos.IDataSourceConfig=} [properties] Properties to set
	             */
	            function DataSourceConfig(properties) {
	                if (properties)
	                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                        if (properties[keys[i]] != null)
	                            this[keys[i]] = properties[keys[i]];
	            }

	            /**
	             * DataSourceConfig name.
	             * @member {string} name
	             * @memberof perfetto.protos.DataSourceConfig
	             * @instance
	             */
	            DataSourceConfig.prototype.name = "";

	            /**
	             * DataSourceConfig targetBuffer.
	             * @member {number} targetBuffer
	             * @memberof perfetto.protos.DataSourceConfig
	             * @instance
	             */
	            DataSourceConfig.prototype.targetBuffer = 0;

	            /**
	             * DataSourceConfig traceDurationMs.
	             * @member {number} traceDurationMs
	             * @memberof perfetto.protos.DataSourceConfig
	             * @instance
	             */
	            DataSourceConfig.prototype.traceDurationMs = 0;

	            /**
	             * DataSourceConfig tracingSessionId.
	             * @member {number|Long} tracingSessionId
	             * @memberof perfetto.protos.DataSourceConfig
	             * @instance
	             */
	            DataSourceConfig.prototype.tracingSessionId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

	            /**
	             * DataSourceConfig ftraceConfig.
	             * @member {perfetto.protos.IFtraceConfig|null|undefined} ftraceConfig
	             * @memberof perfetto.protos.DataSourceConfig
	             * @instance
	             */
	            DataSourceConfig.prototype.ftraceConfig = null;

	            /**
	             * DataSourceConfig chromeConfig.
	             * @member {perfetto.protos.IChromeConfig|null|undefined} chromeConfig
	             * @memberof perfetto.protos.DataSourceConfig
	             * @instance
	             */
	            DataSourceConfig.prototype.chromeConfig = null;

	            /**
	             * DataSourceConfig inodeFileConfig.
	             * @member {perfetto.protos.IInodeFileConfig|null|undefined} inodeFileConfig
	             * @memberof perfetto.protos.DataSourceConfig
	             * @instance
	             */
	            DataSourceConfig.prototype.inodeFileConfig = null;

	            /**
	             * DataSourceConfig processStatsConfig.
	             * @member {perfetto.protos.IProcessStatsConfig|null|undefined} processStatsConfig
	             * @memberof perfetto.protos.DataSourceConfig
	             * @instance
	             */
	            DataSourceConfig.prototype.processStatsConfig = null;

	            /**
	             * DataSourceConfig legacyConfig.
	             * @member {string} legacyConfig
	             * @memberof perfetto.protos.DataSourceConfig
	             * @instance
	             */
	            DataSourceConfig.prototype.legacyConfig = "";

	            /**
	             * DataSourceConfig forTesting.
	             * @member {perfetto.protos.ITestConfig|null|undefined} forTesting
	             * @memberof perfetto.protos.DataSourceConfig
	             * @instance
	             */
	            DataSourceConfig.prototype.forTesting = null;

	            /**
	             * Creates a new DataSourceConfig instance using the specified properties.
	             * @function create
	             * @memberof perfetto.protos.DataSourceConfig
	             * @static
	             * @param {perfetto.protos.IDataSourceConfig=} [properties] Properties to set
	             * @returns {perfetto.protos.DataSourceConfig} DataSourceConfig instance
	             */
	            DataSourceConfig.create = function create(properties) {
	                return new DataSourceConfig(properties);
	            };

	            /**
	             * Encodes the specified DataSourceConfig message. Does not implicitly {@link perfetto.protos.DataSourceConfig.verify|verify} messages.
	             * @function encode
	             * @memberof perfetto.protos.DataSourceConfig
	             * @static
	             * @param {perfetto.protos.IDataSourceConfig} message DataSourceConfig message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            DataSourceConfig.encode = function encode(message, writer) {
	                if (!writer)
	                    writer = $Writer.create();
	                if (message.name != null && message.hasOwnProperty("name"))
	                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
	                if (message.targetBuffer != null && message.hasOwnProperty("targetBuffer"))
	                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.targetBuffer);
	                if (message.traceDurationMs != null && message.hasOwnProperty("traceDurationMs"))
	                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.traceDurationMs);
	                if (message.tracingSessionId != null && message.hasOwnProperty("tracingSessionId"))
	                    writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.tracingSessionId);
	                if (message.ftraceConfig != null && message.hasOwnProperty("ftraceConfig"))
	                    $root.perfetto.protos.FtraceConfig.encode(message.ftraceConfig, writer.uint32(/* id 100, wireType 2 =*/802).fork()).ldelim();
	                if (message.chromeConfig != null && message.hasOwnProperty("chromeConfig"))
	                    $root.perfetto.protos.ChromeConfig.encode(message.chromeConfig, writer.uint32(/* id 101, wireType 2 =*/810).fork()).ldelim();
	                if (message.inodeFileConfig != null && message.hasOwnProperty("inodeFileConfig"))
	                    $root.perfetto.protos.InodeFileConfig.encode(message.inodeFileConfig, writer.uint32(/* id 102, wireType 2 =*/818).fork()).ldelim();
	                if (message.processStatsConfig != null && message.hasOwnProperty("processStatsConfig"))
	                    $root.perfetto.protos.ProcessStatsConfig.encode(message.processStatsConfig, writer.uint32(/* id 103, wireType 2 =*/826).fork()).ldelim();
	                if (message.legacyConfig != null && message.hasOwnProperty("legacyConfig"))
	                    writer.uint32(/* id 1000, wireType 2 =*/8002).string(message.legacyConfig);
	                if (message.forTesting != null && message.hasOwnProperty("forTesting"))
	                    $root.perfetto.protos.TestConfig.encode(message.forTesting, writer.uint32(/* id 536870911, wireType 2 =*/4294967290).fork()).ldelim();
	                return writer;
	            };

	            /**
	             * Encodes the specified DataSourceConfig message, length delimited. Does not implicitly {@link perfetto.protos.DataSourceConfig.verify|verify} messages.
	             * @function encodeDelimited
	             * @memberof perfetto.protos.DataSourceConfig
	             * @static
	             * @param {perfetto.protos.IDataSourceConfig} message DataSourceConfig message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            DataSourceConfig.encodeDelimited = function encodeDelimited(message, writer) {
	                return this.encode(message, writer).ldelim();
	            };

	            /**
	             * Decodes a DataSourceConfig message from the specified reader or buffer.
	             * @function decode
	             * @memberof perfetto.protos.DataSourceConfig
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @param {number} [length] Message length if known beforehand
	             * @returns {perfetto.protos.DataSourceConfig} DataSourceConfig
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            DataSourceConfig.decode = function decode(reader, length) {
	                if (!(reader instanceof $Reader))
	                    reader = $Reader.create(reader);
	                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.DataSourceConfig();
	                while (reader.pos < end) {
	                    var tag = reader.uint32();
	                    switch (tag >>> 3) {
	                    case 1:
	                        message.name = reader.string();
	                        break;
	                    case 2:
	                        message.targetBuffer = reader.uint32();
	                        break;
	                    case 3:
	                        message.traceDurationMs = reader.uint32();
	                        break;
	                    case 4:
	                        message.tracingSessionId = reader.uint64();
	                        break;
	                    case 100:
	                        message.ftraceConfig = $root.perfetto.protos.FtraceConfig.decode(reader, reader.uint32());
	                        break;
	                    case 101:
	                        message.chromeConfig = $root.perfetto.protos.ChromeConfig.decode(reader, reader.uint32());
	                        break;
	                    case 102:
	                        message.inodeFileConfig = $root.perfetto.protos.InodeFileConfig.decode(reader, reader.uint32());
	                        break;
	                    case 103:
	                        message.processStatsConfig = $root.perfetto.protos.ProcessStatsConfig.decode(reader, reader.uint32());
	                        break;
	                    case 1000:
	                        message.legacyConfig = reader.string();
	                        break;
	                    case 536870911:
	                        message.forTesting = $root.perfetto.protos.TestConfig.decode(reader, reader.uint32());
	                        break;
	                    default:
	                        reader.skipType(tag & 7);
	                        break;
	                    }
	                }
	                return message;
	            };

	            /**
	             * Decodes a DataSourceConfig message from the specified reader or buffer, length delimited.
	             * @function decodeDelimited
	             * @memberof perfetto.protos.DataSourceConfig
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @returns {perfetto.protos.DataSourceConfig} DataSourceConfig
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            DataSourceConfig.decodeDelimited = function decodeDelimited(reader) {
	                if (!(reader instanceof $Reader))
	                    reader = new $Reader(reader);
	                return this.decode(reader, reader.uint32());
	            };

	            /**
	             * Verifies a DataSourceConfig message.
	             * @function verify
	             * @memberof perfetto.protos.DataSourceConfig
	             * @static
	             * @param {Object.<string,*>} message Plain object to verify
	             * @returns {string|null} `null` if valid, otherwise the reason why it is not
	             */
	            DataSourceConfig.verify = function verify(message) {
	                if (typeof message !== "object" || message === null)
	                    return "object expected";
	                if (message.name != null && message.hasOwnProperty("name"))
	                    if (!$util.isString(message.name))
	                        return "name: string expected";
	                if (message.targetBuffer != null && message.hasOwnProperty("targetBuffer"))
	                    if (!$util.isInteger(message.targetBuffer))
	                        return "targetBuffer: integer expected";
	                if (message.traceDurationMs != null && message.hasOwnProperty("traceDurationMs"))
	                    if (!$util.isInteger(message.traceDurationMs))
	                        return "traceDurationMs: integer expected";
	                if (message.tracingSessionId != null && message.hasOwnProperty("tracingSessionId"))
	                    if (!$util.isInteger(message.tracingSessionId) && !(message.tracingSessionId && $util.isInteger(message.tracingSessionId.low) && $util.isInteger(message.tracingSessionId.high)))
	                        return "tracingSessionId: integer|Long expected";
	                if (message.ftraceConfig != null && message.hasOwnProperty("ftraceConfig")) {
	                    var error = $root.perfetto.protos.FtraceConfig.verify(message.ftraceConfig);
	                    if (error)
	                        return "ftraceConfig." + error;
	                }
	                if (message.chromeConfig != null && message.hasOwnProperty("chromeConfig")) {
	                    var error = $root.perfetto.protos.ChromeConfig.verify(message.chromeConfig);
	                    if (error)
	                        return "chromeConfig." + error;
	                }
	                if (message.inodeFileConfig != null && message.hasOwnProperty("inodeFileConfig")) {
	                    var error = $root.perfetto.protos.InodeFileConfig.verify(message.inodeFileConfig);
	                    if (error)
	                        return "inodeFileConfig." + error;
	                }
	                if (message.processStatsConfig != null && message.hasOwnProperty("processStatsConfig")) {
	                    var error = $root.perfetto.protos.ProcessStatsConfig.verify(message.processStatsConfig);
	                    if (error)
	                        return "processStatsConfig." + error;
	                }
	                if (message.legacyConfig != null && message.hasOwnProperty("legacyConfig"))
	                    if (!$util.isString(message.legacyConfig))
	                        return "legacyConfig: string expected";
	                if (message.forTesting != null && message.hasOwnProperty("forTesting")) {
	                    var error = $root.perfetto.protos.TestConfig.verify(message.forTesting);
	                    if (error)
	                        return "forTesting." + error;
	                }
	                return null;
	            };

	            /**
	             * Creates a DataSourceConfig message from a plain object. Also converts values to their respective internal types.
	             * @function fromObject
	             * @memberof perfetto.protos.DataSourceConfig
	             * @static
	             * @param {Object.<string,*>} object Plain object
	             * @returns {perfetto.protos.DataSourceConfig} DataSourceConfig
	             */
	            DataSourceConfig.fromObject = function fromObject(object) {
	                if (object instanceof $root.perfetto.protos.DataSourceConfig)
	                    return object;
	                var message = new $root.perfetto.protos.DataSourceConfig();
	                if (object.name != null)
	                    message.name = String(object.name);
	                if (object.targetBuffer != null)
	                    message.targetBuffer = object.targetBuffer >>> 0;
	                if (object.traceDurationMs != null)
	                    message.traceDurationMs = object.traceDurationMs >>> 0;
	                if (object.tracingSessionId != null)
	                    if ($util.Long)
	                        (message.tracingSessionId = $util.Long.fromValue(object.tracingSessionId)).unsigned = true;
	                    else if (typeof object.tracingSessionId === "string")
	                        message.tracingSessionId = parseInt(object.tracingSessionId, 10);
	                    else if (typeof object.tracingSessionId === "number")
	                        message.tracingSessionId = object.tracingSessionId;
	                    else if (typeof object.tracingSessionId === "object")
	                        message.tracingSessionId = new $util.LongBits(object.tracingSessionId.low >>> 0, object.tracingSessionId.high >>> 0).toNumber(true);
	                if (object.ftraceConfig != null) {
	                    if (typeof object.ftraceConfig !== "object")
	                        throw TypeError(".perfetto.protos.DataSourceConfig.ftraceConfig: object expected");
	                    message.ftraceConfig = $root.perfetto.protos.FtraceConfig.fromObject(object.ftraceConfig);
	                }
	                if (object.chromeConfig != null) {
	                    if (typeof object.chromeConfig !== "object")
	                        throw TypeError(".perfetto.protos.DataSourceConfig.chromeConfig: object expected");
	                    message.chromeConfig = $root.perfetto.protos.ChromeConfig.fromObject(object.chromeConfig);
	                }
	                if (object.inodeFileConfig != null) {
	                    if (typeof object.inodeFileConfig !== "object")
	                        throw TypeError(".perfetto.protos.DataSourceConfig.inodeFileConfig: object expected");
	                    message.inodeFileConfig = $root.perfetto.protos.InodeFileConfig.fromObject(object.inodeFileConfig);
	                }
	                if (object.processStatsConfig != null) {
	                    if (typeof object.processStatsConfig !== "object")
	                        throw TypeError(".perfetto.protos.DataSourceConfig.processStatsConfig: object expected");
	                    message.processStatsConfig = $root.perfetto.protos.ProcessStatsConfig.fromObject(object.processStatsConfig);
	                }
	                if (object.legacyConfig != null)
	                    message.legacyConfig = String(object.legacyConfig);
	                if (object.forTesting != null) {
	                    if (typeof object.forTesting !== "object")
	                        throw TypeError(".perfetto.protos.DataSourceConfig.forTesting: object expected");
	                    message.forTesting = $root.perfetto.protos.TestConfig.fromObject(object.forTesting);
	                }
	                return message;
	            };

	            /**
	             * Creates a plain object from a DataSourceConfig message. Also converts values to other types if specified.
	             * @function toObject
	             * @memberof perfetto.protos.DataSourceConfig
	             * @static
	             * @param {perfetto.protos.DataSourceConfig} message DataSourceConfig
	             * @param {$protobuf.IConversionOptions} [options] Conversion options
	             * @returns {Object.<string,*>} Plain object
	             */
	            DataSourceConfig.toObject = function toObject(message, options) {
	                if (!options)
	                    options = {};
	                var object = {};
	                if (options.defaults) {
	                    object.name = "";
	                    object.targetBuffer = 0;
	                    object.traceDurationMs = 0;
	                    if ($util.Long) {
	                        var long = new $util.Long(0, 0, true);
	                        object.tracingSessionId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
	                    } else
	                        object.tracingSessionId = options.longs === String ? "0" : 0;
	                    object.ftraceConfig = null;
	                    object.chromeConfig = null;
	                    object.inodeFileConfig = null;
	                    object.processStatsConfig = null;
	                    object.legacyConfig = "";
	                    object.forTesting = null;
	                }
	                if (message.name != null && message.hasOwnProperty("name"))
	                    object.name = message.name;
	                if (message.targetBuffer != null && message.hasOwnProperty("targetBuffer"))
	                    object.targetBuffer = message.targetBuffer;
	                if (message.traceDurationMs != null && message.hasOwnProperty("traceDurationMs"))
	                    object.traceDurationMs = message.traceDurationMs;
	                if (message.tracingSessionId != null && message.hasOwnProperty("tracingSessionId"))
	                    if (typeof message.tracingSessionId === "number")
	                        object.tracingSessionId = options.longs === String ? String(message.tracingSessionId) : message.tracingSessionId;
	                    else
	                        object.tracingSessionId = options.longs === String ? $util.Long.prototype.toString.call(message.tracingSessionId) : options.longs === Number ? new $util.LongBits(message.tracingSessionId.low >>> 0, message.tracingSessionId.high >>> 0).toNumber(true) : message.tracingSessionId;
	                if (message.ftraceConfig != null && message.hasOwnProperty("ftraceConfig"))
	                    object.ftraceConfig = $root.perfetto.protos.FtraceConfig.toObject(message.ftraceConfig, options);
	                if (message.chromeConfig != null && message.hasOwnProperty("chromeConfig"))
	                    object.chromeConfig = $root.perfetto.protos.ChromeConfig.toObject(message.chromeConfig, options);
	                if (message.inodeFileConfig != null && message.hasOwnProperty("inodeFileConfig"))
	                    object.inodeFileConfig = $root.perfetto.protos.InodeFileConfig.toObject(message.inodeFileConfig, options);
	                if (message.processStatsConfig != null && message.hasOwnProperty("processStatsConfig"))
	                    object.processStatsConfig = $root.perfetto.protos.ProcessStatsConfig.toObject(message.processStatsConfig, options);
	                if (message.legacyConfig != null && message.hasOwnProperty("legacyConfig"))
	                    object.legacyConfig = message.legacyConfig;
	                if (message.forTesting != null && message.hasOwnProperty("forTesting"))
	                    object.forTesting = $root.perfetto.protos.TestConfig.toObject(message.forTesting, options);
	                return object;
	            };

	            /**
	             * Converts this DataSourceConfig to JSON.
	             * @function toJSON
	             * @memberof perfetto.protos.DataSourceConfig
	             * @instance
	             * @returns {Object.<string,*>} JSON object
	             */
	            DataSourceConfig.prototype.toJSON = function toJSON() {
	                return this.constructor.toObject(this, minimal$1.util.toJSONOptions);
	            };

	            return DataSourceConfig;
	        })();

	        protos.FtraceConfig = (function() {

	            /**
	             * Properties of a FtraceConfig.
	             * @memberof perfetto.protos
	             * @interface IFtraceConfig
	             * @property {Array.<string>|null} [ftraceEvents] FtraceConfig ftraceEvents
	             * @property {Array.<string>|null} [atraceCategories] FtraceConfig atraceCategories
	             * @property {Array.<string>|null} [atraceApps] FtraceConfig atraceApps
	             * @property {number|null} [bufferSizeKb] FtraceConfig bufferSizeKb
	             * @property {number|null} [drainPeriodMs] FtraceConfig drainPeriodMs
	             */

	            /**
	             * Constructs a new FtraceConfig.
	             * @memberof perfetto.protos
	             * @classdesc Represents a FtraceConfig.
	             * @implements IFtraceConfig
	             * @constructor
	             * @param {perfetto.protos.IFtraceConfig=} [properties] Properties to set
	             */
	            function FtraceConfig(properties) {
	                this.ftraceEvents = [];
	                this.atraceCategories = [];
	                this.atraceApps = [];
	                if (properties)
	                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                        if (properties[keys[i]] != null)
	                            this[keys[i]] = properties[keys[i]];
	            }

	            /**
	             * FtraceConfig ftraceEvents.
	             * @member {Array.<string>} ftraceEvents
	             * @memberof perfetto.protos.FtraceConfig
	             * @instance
	             */
	            FtraceConfig.prototype.ftraceEvents = $util.emptyArray;

	            /**
	             * FtraceConfig atraceCategories.
	             * @member {Array.<string>} atraceCategories
	             * @memberof perfetto.protos.FtraceConfig
	             * @instance
	             */
	            FtraceConfig.prototype.atraceCategories = $util.emptyArray;

	            /**
	             * FtraceConfig atraceApps.
	             * @member {Array.<string>} atraceApps
	             * @memberof perfetto.protos.FtraceConfig
	             * @instance
	             */
	            FtraceConfig.prototype.atraceApps = $util.emptyArray;

	            /**
	             * FtraceConfig bufferSizeKb.
	             * @member {number} bufferSizeKb
	             * @memberof perfetto.protos.FtraceConfig
	             * @instance
	             */
	            FtraceConfig.prototype.bufferSizeKb = 0;

	            /**
	             * FtraceConfig drainPeriodMs.
	             * @member {number} drainPeriodMs
	             * @memberof perfetto.protos.FtraceConfig
	             * @instance
	             */
	            FtraceConfig.prototype.drainPeriodMs = 0;

	            /**
	             * Creates a new FtraceConfig instance using the specified properties.
	             * @function create
	             * @memberof perfetto.protos.FtraceConfig
	             * @static
	             * @param {perfetto.protos.IFtraceConfig=} [properties] Properties to set
	             * @returns {perfetto.protos.FtraceConfig} FtraceConfig instance
	             */
	            FtraceConfig.create = function create(properties) {
	                return new FtraceConfig(properties);
	            };

	            /**
	             * Encodes the specified FtraceConfig message. Does not implicitly {@link perfetto.protos.FtraceConfig.verify|verify} messages.
	             * @function encode
	             * @memberof perfetto.protos.FtraceConfig
	             * @static
	             * @param {perfetto.protos.IFtraceConfig} message FtraceConfig message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            FtraceConfig.encode = function encode(message, writer) {
	                if (!writer)
	                    writer = $Writer.create();
	                if (message.ftraceEvents != null && message.ftraceEvents.length)
	                    for (var i = 0; i < message.ftraceEvents.length; ++i)
	                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.ftraceEvents[i]);
	                if (message.atraceCategories != null && message.atraceCategories.length)
	                    for (var i = 0; i < message.atraceCategories.length; ++i)
	                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.atraceCategories[i]);
	                if (message.atraceApps != null && message.atraceApps.length)
	                    for (var i = 0; i < message.atraceApps.length; ++i)
	                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.atraceApps[i]);
	                if (message.bufferSizeKb != null && message.hasOwnProperty("bufferSizeKb"))
	                    writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.bufferSizeKb);
	                if (message.drainPeriodMs != null && message.hasOwnProperty("drainPeriodMs"))
	                    writer.uint32(/* id 11, wireType 0 =*/88).uint32(message.drainPeriodMs);
	                return writer;
	            };

	            /**
	             * Encodes the specified FtraceConfig message, length delimited. Does not implicitly {@link perfetto.protos.FtraceConfig.verify|verify} messages.
	             * @function encodeDelimited
	             * @memberof perfetto.protos.FtraceConfig
	             * @static
	             * @param {perfetto.protos.IFtraceConfig} message FtraceConfig message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            FtraceConfig.encodeDelimited = function encodeDelimited(message, writer) {
	                return this.encode(message, writer).ldelim();
	            };

	            /**
	             * Decodes a FtraceConfig message from the specified reader or buffer.
	             * @function decode
	             * @memberof perfetto.protos.FtraceConfig
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @param {number} [length] Message length if known beforehand
	             * @returns {perfetto.protos.FtraceConfig} FtraceConfig
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            FtraceConfig.decode = function decode(reader, length) {
	                if (!(reader instanceof $Reader))
	                    reader = $Reader.create(reader);
	                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.FtraceConfig();
	                while (reader.pos < end) {
	                    var tag = reader.uint32();
	                    switch (tag >>> 3) {
	                    case 1:
	                        if (!(message.ftraceEvents && message.ftraceEvents.length))
	                            message.ftraceEvents = [];
	                        message.ftraceEvents.push(reader.string());
	                        break;
	                    case 2:
	                        if (!(message.atraceCategories && message.atraceCategories.length))
	                            message.atraceCategories = [];
	                        message.atraceCategories.push(reader.string());
	                        break;
	                    case 3:
	                        if (!(message.atraceApps && message.atraceApps.length))
	                            message.atraceApps = [];
	                        message.atraceApps.push(reader.string());
	                        break;
	                    case 10:
	                        message.bufferSizeKb = reader.uint32();
	                        break;
	                    case 11:
	                        message.drainPeriodMs = reader.uint32();
	                        break;
	                    default:
	                        reader.skipType(tag & 7);
	                        break;
	                    }
	                }
	                return message;
	            };

	            /**
	             * Decodes a FtraceConfig message from the specified reader or buffer, length delimited.
	             * @function decodeDelimited
	             * @memberof perfetto.protos.FtraceConfig
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @returns {perfetto.protos.FtraceConfig} FtraceConfig
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            FtraceConfig.decodeDelimited = function decodeDelimited(reader) {
	                if (!(reader instanceof $Reader))
	                    reader = new $Reader(reader);
	                return this.decode(reader, reader.uint32());
	            };

	            /**
	             * Verifies a FtraceConfig message.
	             * @function verify
	             * @memberof perfetto.protos.FtraceConfig
	             * @static
	             * @param {Object.<string,*>} message Plain object to verify
	             * @returns {string|null} `null` if valid, otherwise the reason why it is not
	             */
	            FtraceConfig.verify = function verify(message) {
	                if (typeof message !== "object" || message === null)
	                    return "object expected";
	                if (message.ftraceEvents != null && message.hasOwnProperty("ftraceEvents")) {
	                    if (!Array.isArray(message.ftraceEvents))
	                        return "ftraceEvents: array expected";
	                    for (var i = 0; i < message.ftraceEvents.length; ++i)
	                        if (!$util.isString(message.ftraceEvents[i]))
	                            return "ftraceEvents: string[] expected";
	                }
	                if (message.atraceCategories != null && message.hasOwnProperty("atraceCategories")) {
	                    if (!Array.isArray(message.atraceCategories))
	                        return "atraceCategories: array expected";
	                    for (var i = 0; i < message.atraceCategories.length; ++i)
	                        if (!$util.isString(message.atraceCategories[i]))
	                            return "atraceCategories: string[] expected";
	                }
	                if (message.atraceApps != null && message.hasOwnProperty("atraceApps")) {
	                    if (!Array.isArray(message.atraceApps))
	                        return "atraceApps: array expected";
	                    for (var i = 0; i < message.atraceApps.length; ++i)
	                        if (!$util.isString(message.atraceApps[i]))
	                            return "atraceApps: string[] expected";
	                }
	                if (message.bufferSizeKb != null && message.hasOwnProperty("bufferSizeKb"))
	                    if (!$util.isInteger(message.bufferSizeKb))
	                        return "bufferSizeKb: integer expected";
	                if (message.drainPeriodMs != null && message.hasOwnProperty("drainPeriodMs"))
	                    if (!$util.isInteger(message.drainPeriodMs))
	                        return "drainPeriodMs: integer expected";
	                return null;
	            };

	            /**
	             * Creates a FtraceConfig message from a plain object. Also converts values to their respective internal types.
	             * @function fromObject
	             * @memberof perfetto.protos.FtraceConfig
	             * @static
	             * @param {Object.<string,*>} object Plain object
	             * @returns {perfetto.protos.FtraceConfig} FtraceConfig
	             */
	            FtraceConfig.fromObject = function fromObject(object) {
	                if (object instanceof $root.perfetto.protos.FtraceConfig)
	                    return object;
	                var message = new $root.perfetto.protos.FtraceConfig();
	                if (object.ftraceEvents) {
	                    if (!Array.isArray(object.ftraceEvents))
	                        throw TypeError(".perfetto.protos.FtraceConfig.ftraceEvents: array expected");
	                    message.ftraceEvents = [];
	                    for (var i = 0; i < object.ftraceEvents.length; ++i)
	                        message.ftraceEvents[i] = String(object.ftraceEvents[i]);
	                }
	                if (object.atraceCategories) {
	                    if (!Array.isArray(object.atraceCategories))
	                        throw TypeError(".perfetto.protos.FtraceConfig.atraceCategories: array expected");
	                    message.atraceCategories = [];
	                    for (var i = 0; i < object.atraceCategories.length; ++i)
	                        message.atraceCategories[i] = String(object.atraceCategories[i]);
	                }
	                if (object.atraceApps) {
	                    if (!Array.isArray(object.atraceApps))
	                        throw TypeError(".perfetto.protos.FtraceConfig.atraceApps: array expected");
	                    message.atraceApps = [];
	                    for (var i = 0; i < object.atraceApps.length; ++i)
	                        message.atraceApps[i] = String(object.atraceApps[i]);
	                }
	                if (object.bufferSizeKb != null)
	                    message.bufferSizeKb = object.bufferSizeKb >>> 0;
	                if (object.drainPeriodMs != null)
	                    message.drainPeriodMs = object.drainPeriodMs >>> 0;
	                return message;
	            };

	            /**
	             * Creates a plain object from a FtraceConfig message. Also converts values to other types if specified.
	             * @function toObject
	             * @memberof perfetto.protos.FtraceConfig
	             * @static
	             * @param {perfetto.protos.FtraceConfig} message FtraceConfig
	             * @param {$protobuf.IConversionOptions} [options] Conversion options
	             * @returns {Object.<string,*>} Plain object
	             */
	            FtraceConfig.toObject = function toObject(message, options) {
	                if (!options)
	                    options = {};
	                var object = {};
	                if (options.arrays || options.defaults) {
	                    object.ftraceEvents = [];
	                    object.atraceCategories = [];
	                    object.atraceApps = [];
	                }
	                if (options.defaults) {
	                    object.bufferSizeKb = 0;
	                    object.drainPeriodMs = 0;
	                }
	                if (message.ftraceEvents && message.ftraceEvents.length) {
	                    object.ftraceEvents = [];
	                    for (var j = 0; j < message.ftraceEvents.length; ++j)
	                        object.ftraceEvents[j] = message.ftraceEvents[j];
	                }
	                if (message.atraceCategories && message.atraceCategories.length) {
	                    object.atraceCategories = [];
	                    for (var j = 0; j < message.atraceCategories.length; ++j)
	                        object.atraceCategories[j] = message.atraceCategories[j];
	                }
	                if (message.atraceApps && message.atraceApps.length) {
	                    object.atraceApps = [];
	                    for (var j = 0; j < message.atraceApps.length; ++j)
	                        object.atraceApps[j] = message.atraceApps[j];
	                }
	                if (message.bufferSizeKb != null && message.hasOwnProperty("bufferSizeKb"))
	                    object.bufferSizeKb = message.bufferSizeKb;
	                if (message.drainPeriodMs != null && message.hasOwnProperty("drainPeriodMs"))
	                    object.drainPeriodMs = message.drainPeriodMs;
	                return object;
	            };

	            /**
	             * Converts this FtraceConfig to JSON.
	             * @function toJSON
	             * @memberof perfetto.protos.FtraceConfig
	             * @instance
	             * @returns {Object.<string,*>} JSON object
	             */
	            FtraceConfig.prototype.toJSON = function toJSON() {
	                return this.constructor.toObject(this, minimal$1.util.toJSONOptions);
	            };

	            return FtraceConfig;
	        })();

	        protos.TestConfig = (function() {

	            /**
	             * Properties of a TestConfig.
	             * @memberof perfetto.protos
	             * @interface ITestConfig
	             * @property {number|null} [messageCount] TestConfig messageCount
	             * @property {number|null} [maxMessagesPerSecond] TestConfig maxMessagesPerSecond
	             * @property {number|null} [seed] TestConfig seed
	             * @property {number|null} [messageSize] TestConfig messageSize
	             * @property {boolean|null} [sendBatchOnRegister] TestConfig sendBatchOnRegister
	             */

	            /**
	             * Constructs a new TestConfig.
	             * @memberof perfetto.protos
	             * @classdesc Represents a TestConfig.
	             * @implements ITestConfig
	             * @constructor
	             * @param {perfetto.protos.ITestConfig=} [properties] Properties to set
	             */
	            function TestConfig(properties) {
	                if (properties)
	                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                        if (properties[keys[i]] != null)
	                            this[keys[i]] = properties[keys[i]];
	            }

	            /**
	             * TestConfig messageCount.
	             * @member {number} messageCount
	             * @memberof perfetto.protos.TestConfig
	             * @instance
	             */
	            TestConfig.prototype.messageCount = 0;

	            /**
	             * TestConfig maxMessagesPerSecond.
	             * @member {number} maxMessagesPerSecond
	             * @memberof perfetto.protos.TestConfig
	             * @instance
	             */
	            TestConfig.prototype.maxMessagesPerSecond = 0;

	            /**
	             * TestConfig seed.
	             * @member {number} seed
	             * @memberof perfetto.protos.TestConfig
	             * @instance
	             */
	            TestConfig.prototype.seed = 0;

	            /**
	             * TestConfig messageSize.
	             * @member {number} messageSize
	             * @memberof perfetto.protos.TestConfig
	             * @instance
	             */
	            TestConfig.prototype.messageSize = 0;

	            /**
	             * TestConfig sendBatchOnRegister.
	             * @member {boolean} sendBatchOnRegister
	             * @memberof perfetto.protos.TestConfig
	             * @instance
	             */
	            TestConfig.prototype.sendBatchOnRegister = false;

	            /**
	             * Creates a new TestConfig instance using the specified properties.
	             * @function create
	             * @memberof perfetto.protos.TestConfig
	             * @static
	             * @param {perfetto.protos.ITestConfig=} [properties] Properties to set
	             * @returns {perfetto.protos.TestConfig} TestConfig instance
	             */
	            TestConfig.create = function create(properties) {
	                return new TestConfig(properties);
	            };

	            /**
	             * Encodes the specified TestConfig message. Does not implicitly {@link perfetto.protos.TestConfig.verify|verify} messages.
	             * @function encode
	             * @memberof perfetto.protos.TestConfig
	             * @static
	             * @param {perfetto.protos.ITestConfig} message TestConfig message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            TestConfig.encode = function encode(message, writer) {
	                if (!writer)
	                    writer = $Writer.create();
	                if (message.messageCount != null && message.hasOwnProperty("messageCount"))
	                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.messageCount);
	                if (message.maxMessagesPerSecond != null && message.hasOwnProperty("maxMessagesPerSecond"))
	                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.maxMessagesPerSecond);
	                if (message.seed != null && message.hasOwnProperty("seed"))
	                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.seed);
	                if (message.messageSize != null && message.hasOwnProperty("messageSize"))
	                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.messageSize);
	                if (message.sendBatchOnRegister != null && message.hasOwnProperty("sendBatchOnRegister"))
	                    writer.uint32(/* id 5, wireType 0 =*/40).bool(message.sendBatchOnRegister);
	                return writer;
	            };

	            /**
	             * Encodes the specified TestConfig message, length delimited. Does not implicitly {@link perfetto.protos.TestConfig.verify|verify} messages.
	             * @function encodeDelimited
	             * @memberof perfetto.protos.TestConfig
	             * @static
	             * @param {perfetto.protos.ITestConfig} message TestConfig message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            TestConfig.encodeDelimited = function encodeDelimited(message, writer) {
	                return this.encode(message, writer).ldelim();
	            };

	            /**
	             * Decodes a TestConfig message from the specified reader or buffer.
	             * @function decode
	             * @memberof perfetto.protos.TestConfig
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @param {number} [length] Message length if known beforehand
	             * @returns {perfetto.protos.TestConfig} TestConfig
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            TestConfig.decode = function decode(reader, length) {
	                if (!(reader instanceof $Reader))
	                    reader = $Reader.create(reader);
	                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.TestConfig();
	                while (reader.pos < end) {
	                    var tag = reader.uint32();
	                    switch (tag >>> 3) {
	                    case 1:
	                        message.messageCount = reader.uint32();
	                        break;
	                    case 2:
	                        message.maxMessagesPerSecond = reader.uint32();
	                        break;
	                    case 3:
	                        message.seed = reader.uint32();
	                        break;
	                    case 4:
	                        message.messageSize = reader.uint32();
	                        break;
	                    case 5:
	                        message.sendBatchOnRegister = reader.bool();
	                        break;
	                    default:
	                        reader.skipType(tag & 7);
	                        break;
	                    }
	                }
	                return message;
	            };

	            /**
	             * Decodes a TestConfig message from the specified reader or buffer, length delimited.
	             * @function decodeDelimited
	             * @memberof perfetto.protos.TestConfig
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @returns {perfetto.protos.TestConfig} TestConfig
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            TestConfig.decodeDelimited = function decodeDelimited(reader) {
	                if (!(reader instanceof $Reader))
	                    reader = new $Reader(reader);
	                return this.decode(reader, reader.uint32());
	            };

	            /**
	             * Verifies a TestConfig message.
	             * @function verify
	             * @memberof perfetto.protos.TestConfig
	             * @static
	             * @param {Object.<string,*>} message Plain object to verify
	             * @returns {string|null} `null` if valid, otherwise the reason why it is not
	             */
	            TestConfig.verify = function verify(message) {
	                if (typeof message !== "object" || message === null)
	                    return "object expected";
	                if (message.messageCount != null && message.hasOwnProperty("messageCount"))
	                    if (!$util.isInteger(message.messageCount))
	                        return "messageCount: integer expected";
	                if (message.maxMessagesPerSecond != null && message.hasOwnProperty("maxMessagesPerSecond"))
	                    if (!$util.isInteger(message.maxMessagesPerSecond))
	                        return "maxMessagesPerSecond: integer expected";
	                if (message.seed != null && message.hasOwnProperty("seed"))
	                    if (!$util.isInteger(message.seed))
	                        return "seed: integer expected";
	                if (message.messageSize != null && message.hasOwnProperty("messageSize"))
	                    if (!$util.isInteger(message.messageSize))
	                        return "messageSize: integer expected";
	                if (message.sendBatchOnRegister != null && message.hasOwnProperty("sendBatchOnRegister"))
	                    if (typeof message.sendBatchOnRegister !== "boolean")
	                        return "sendBatchOnRegister: boolean expected";
	                return null;
	            };

	            /**
	             * Creates a TestConfig message from a plain object. Also converts values to their respective internal types.
	             * @function fromObject
	             * @memberof perfetto.protos.TestConfig
	             * @static
	             * @param {Object.<string,*>} object Plain object
	             * @returns {perfetto.protos.TestConfig} TestConfig
	             */
	            TestConfig.fromObject = function fromObject(object) {
	                if (object instanceof $root.perfetto.protos.TestConfig)
	                    return object;
	                var message = new $root.perfetto.protos.TestConfig();
	                if (object.messageCount != null)
	                    message.messageCount = object.messageCount >>> 0;
	                if (object.maxMessagesPerSecond != null)
	                    message.maxMessagesPerSecond = object.maxMessagesPerSecond >>> 0;
	                if (object.seed != null)
	                    message.seed = object.seed >>> 0;
	                if (object.messageSize != null)
	                    message.messageSize = object.messageSize >>> 0;
	                if (object.sendBatchOnRegister != null)
	                    message.sendBatchOnRegister = Boolean(object.sendBatchOnRegister);
	                return message;
	            };

	            /**
	             * Creates a plain object from a TestConfig message. Also converts values to other types if specified.
	             * @function toObject
	             * @memberof perfetto.protos.TestConfig
	             * @static
	             * @param {perfetto.protos.TestConfig} message TestConfig
	             * @param {$protobuf.IConversionOptions} [options] Conversion options
	             * @returns {Object.<string,*>} Plain object
	             */
	            TestConfig.toObject = function toObject(message, options) {
	                if (!options)
	                    options = {};
	                var object = {};
	                if (options.defaults) {
	                    object.messageCount = 0;
	                    object.maxMessagesPerSecond = 0;
	                    object.seed = 0;
	                    object.messageSize = 0;
	                    object.sendBatchOnRegister = false;
	                }
	                if (message.messageCount != null && message.hasOwnProperty("messageCount"))
	                    object.messageCount = message.messageCount;
	                if (message.maxMessagesPerSecond != null && message.hasOwnProperty("maxMessagesPerSecond"))
	                    object.maxMessagesPerSecond = message.maxMessagesPerSecond;
	                if (message.seed != null && message.hasOwnProperty("seed"))
	                    object.seed = message.seed;
	                if (message.messageSize != null && message.hasOwnProperty("messageSize"))
	                    object.messageSize = message.messageSize;
	                if (message.sendBatchOnRegister != null && message.hasOwnProperty("sendBatchOnRegister"))
	                    object.sendBatchOnRegister = message.sendBatchOnRegister;
	                return object;
	            };

	            /**
	             * Converts this TestConfig to JSON.
	             * @function toJSON
	             * @memberof perfetto.protos.TestConfig
	             * @instance
	             * @returns {Object.<string,*>} JSON object
	             */
	            TestConfig.prototype.toJSON = function toJSON() {
	                return this.constructor.toObject(this, minimal$1.util.toJSONOptions);
	            };

	            return TestConfig;
	        })();

	        protos.TraceConfig = (function() {

	            /**
	             * Properties of a TraceConfig.
	             * @memberof perfetto.protos
	             * @interface ITraceConfig
	             * @property {Array.<perfetto.protos.TraceConfig.IBufferConfig>|null} [buffers] TraceConfig buffers
	             * @property {Array.<perfetto.protos.TraceConfig.IDataSource>|null} [dataSources] TraceConfig dataSources
	             * @property {number|null} [durationMs] TraceConfig durationMs
	             * @property {boolean|null} [enableExtraGuardrails] TraceConfig enableExtraGuardrails
	             * @property {perfetto.protos.TraceConfig.LockdownModeOperation|null} [lockdownMode] TraceConfig lockdownMode
	             * @property {Array.<perfetto.protos.TraceConfig.IProducerConfig>|null} [producers] TraceConfig producers
	             * @property {perfetto.protos.TraceConfig.IStatsdMetadata|null} [statsdMetadata] TraceConfig statsdMetadata
	             * @property {boolean|null} [writeIntoFile] TraceConfig writeIntoFile
	             * @property {number|null} [fileWritePeriodMs] TraceConfig fileWritePeriodMs
	             * @property {number|Long|null} [maxFileSizeBytes] TraceConfig maxFileSizeBytes
	             * @property {perfetto.protos.TraceConfig.IGuardrailOverrides|null} [guardrailOverrides] TraceConfig guardrailOverrides
	             */

	            /**
	             * Constructs a new TraceConfig.
	             * @memberof perfetto.protos
	             * @classdesc Represents a TraceConfig.
	             * @implements ITraceConfig
	             * @constructor
	             * @param {perfetto.protos.ITraceConfig=} [properties] Properties to set
	             */
	            function TraceConfig(properties) {
	                this.buffers = [];
	                this.dataSources = [];
	                this.producers = [];
	                if (properties)
	                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                        if (properties[keys[i]] != null)
	                            this[keys[i]] = properties[keys[i]];
	            }

	            /**
	             * TraceConfig buffers.
	             * @member {Array.<perfetto.protos.TraceConfig.IBufferConfig>} buffers
	             * @memberof perfetto.protos.TraceConfig
	             * @instance
	             */
	            TraceConfig.prototype.buffers = $util.emptyArray;

	            /**
	             * TraceConfig dataSources.
	             * @member {Array.<perfetto.protos.TraceConfig.IDataSource>} dataSources
	             * @memberof perfetto.protos.TraceConfig
	             * @instance
	             */
	            TraceConfig.prototype.dataSources = $util.emptyArray;

	            /**
	             * TraceConfig durationMs.
	             * @member {number} durationMs
	             * @memberof perfetto.protos.TraceConfig
	             * @instance
	             */
	            TraceConfig.prototype.durationMs = 0;

	            /**
	             * TraceConfig enableExtraGuardrails.
	             * @member {boolean} enableExtraGuardrails
	             * @memberof perfetto.protos.TraceConfig
	             * @instance
	             */
	            TraceConfig.prototype.enableExtraGuardrails = false;

	            /**
	             * TraceConfig lockdownMode.
	             * @member {perfetto.protos.TraceConfig.LockdownModeOperation} lockdownMode
	             * @memberof perfetto.protos.TraceConfig
	             * @instance
	             */
	            TraceConfig.prototype.lockdownMode = 0;

	            /**
	             * TraceConfig producers.
	             * @member {Array.<perfetto.protos.TraceConfig.IProducerConfig>} producers
	             * @memberof perfetto.protos.TraceConfig
	             * @instance
	             */
	            TraceConfig.prototype.producers = $util.emptyArray;

	            /**
	             * TraceConfig statsdMetadata.
	             * @member {perfetto.protos.TraceConfig.IStatsdMetadata|null|undefined} statsdMetadata
	             * @memberof perfetto.protos.TraceConfig
	             * @instance
	             */
	            TraceConfig.prototype.statsdMetadata = null;

	            /**
	             * TraceConfig writeIntoFile.
	             * @member {boolean} writeIntoFile
	             * @memberof perfetto.protos.TraceConfig
	             * @instance
	             */
	            TraceConfig.prototype.writeIntoFile = false;

	            /**
	             * TraceConfig fileWritePeriodMs.
	             * @member {number} fileWritePeriodMs
	             * @memberof perfetto.protos.TraceConfig
	             * @instance
	             */
	            TraceConfig.prototype.fileWritePeriodMs = 0;

	            /**
	             * TraceConfig maxFileSizeBytes.
	             * @member {number|Long} maxFileSizeBytes
	             * @memberof perfetto.protos.TraceConfig
	             * @instance
	             */
	            TraceConfig.prototype.maxFileSizeBytes = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

	            /**
	             * TraceConfig guardrailOverrides.
	             * @member {perfetto.protos.TraceConfig.IGuardrailOverrides|null|undefined} guardrailOverrides
	             * @memberof perfetto.protos.TraceConfig
	             * @instance
	             */
	            TraceConfig.prototype.guardrailOverrides = null;

	            /**
	             * Creates a new TraceConfig instance using the specified properties.
	             * @function create
	             * @memberof perfetto.protos.TraceConfig
	             * @static
	             * @param {perfetto.protos.ITraceConfig=} [properties] Properties to set
	             * @returns {perfetto.protos.TraceConfig} TraceConfig instance
	             */
	            TraceConfig.create = function create(properties) {
	                return new TraceConfig(properties);
	            };

	            /**
	             * Encodes the specified TraceConfig message. Does not implicitly {@link perfetto.protos.TraceConfig.verify|verify} messages.
	             * @function encode
	             * @memberof perfetto.protos.TraceConfig
	             * @static
	             * @param {perfetto.protos.ITraceConfig} message TraceConfig message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            TraceConfig.encode = function encode(message, writer) {
	                if (!writer)
	                    writer = $Writer.create();
	                if (message.buffers != null && message.buffers.length)
	                    for (var i = 0; i < message.buffers.length; ++i)
	                        $root.perfetto.protos.TraceConfig.BufferConfig.encode(message.buffers[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
	                if (message.dataSources != null && message.dataSources.length)
	                    for (var i = 0; i < message.dataSources.length; ++i)
	                        $root.perfetto.protos.TraceConfig.DataSource.encode(message.dataSources[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
	                if (message.durationMs != null && message.hasOwnProperty("durationMs"))
	                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.durationMs);
	                if (message.enableExtraGuardrails != null && message.hasOwnProperty("enableExtraGuardrails"))
	                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.enableExtraGuardrails);
	                if (message.lockdownMode != null && message.hasOwnProperty("lockdownMode"))
	                    writer.uint32(/* id 5, wireType 0 =*/40).int32(message.lockdownMode);
	                if (message.producers != null && message.producers.length)
	                    for (var i = 0; i < message.producers.length; ++i)
	                        $root.perfetto.protos.TraceConfig.ProducerConfig.encode(message.producers[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
	                if (message.statsdMetadata != null && message.hasOwnProperty("statsdMetadata"))
	                    $root.perfetto.protos.TraceConfig.StatsdMetadata.encode(message.statsdMetadata, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
	                if (message.writeIntoFile != null && message.hasOwnProperty("writeIntoFile"))
	                    writer.uint32(/* id 8, wireType 0 =*/64).bool(message.writeIntoFile);
	                if (message.fileWritePeriodMs != null && message.hasOwnProperty("fileWritePeriodMs"))
	                    writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.fileWritePeriodMs);
	                if (message.maxFileSizeBytes != null && message.hasOwnProperty("maxFileSizeBytes"))
	                    writer.uint32(/* id 10, wireType 0 =*/80).uint64(message.maxFileSizeBytes);
	                if (message.guardrailOverrides != null && message.hasOwnProperty("guardrailOverrides"))
	                    $root.perfetto.protos.TraceConfig.GuardrailOverrides.encode(message.guardrailOverrides, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
	                return writer;
	            };

	            /**
	             * Encodes the specified TraceConfig message, length delimited. Does not implicitly {@link perfetto.protos.TraceConfig.verify|verify} messages.
	             * @function encodeDelimited
	             * @memberof perfetto.protos.TraceConfig
	             * @static
	             * @param {perfetto.protos.ITraceConfig} message TraceConfig message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            TraceConfig.encodeDelimited = function encodeDelimited(message, writer) {
	                return this.encode(message, writer).ldelim();
	            };

	            /**
	             * Decodes a TraceConfig message from the specified reader or buffer.
	             * @function decode
	             * @memberof perfetto.protos.TraceConfig
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @param {number} [length] Message length if known beforehand
	             * @returns {perfetto.protos.TraceConfig} TraceConfig
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            TraceConfig.decode = function decode(reader, length) {
	                if (!(reader instanceof $Reader))
	                    reader = $Reader.create(reader);
	                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.TraceConfig();
	                while (reader.pos < end) {
	                    var tag = reader.uint32();
	                    switch (tag >>> 3) {
	                    case 1:
	                        if (!(message.buffers && message.buffers.length))
	                            message.buffers = [];
	                        message.buffers.push($root.perfetto.protos.TraceConfig.BufferConfig.decode(reader, reader.uint32()));
	                        break;
	                    case 2:
	                        if (!(message.dataSources && message.dataSources.length))
	                            message.dataSources = [];
	                        message.dataSources.push($root.perfetto.protos.TraceConfig.DataSource.decode(reader, reader.uint32()));
	                        break;
	                    case 3:
	                        message.durationMs = reader.uint32();
	                        break;
	                    case 4:
	                        message.enableExtraGuardrails = reader.bool();
	                        break;
	                    case 5:
	                        message.lockdownMode = reader.int32();
	                        break;
	                    case 6:
	                        if (!(message.producers && message.producers.length))
	                            message.producers = [];
	                        message.producers.push($root.perfetto.protos.TraceConfig.ProducerConfig.decode(reader, reader.uint32()));
	                        break;
	                    case 7:
	                        message.statsdMetadata = $root.perfetto.protos.TraceConfig.StatsdMetadata.decode(reader, reader.uint32());
	                        break;
	                    case 8:
	                        message.writeIntoFile = reader.bool();
	                        break;
	                    case 9:
	                        message.fileWritePeriodMs = reader.uint32();
	                        break;
	                    case 10:
	                        message.maxFileSizeBytes = reader.uint64();
	                        break;
	                    case 11:
	                        message.guardrailOverrides = $root.perfetto.protos.TraceConfig.GuardrailOverrides.decode(reader, reader.uint32());
	                        break;
	                    default:
	                        reader.skipType(tag & 7);
	                        break;
	                    }
	                }
	                return message;
	            };

	            /**
	             * Decodes a TraceConfig message from the specified reader or buffer, length delimited.
	             * @function decodeDelimited
	             * @memberof perfetto.protos.TraceConfig
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @returns {perfetto.protos.TraceConfig} TraceConfig
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            TraceConfig.decodeDelimited = function decodeDelimited(reader) {
	                if (!(reader instanceof $Reader))
	                    reader = new $Reader(reader);
	                return this.decode(reader, reader.uint32());
	            };

	            /**
	             * Verifies a TraceConfig message.
	             * @function verify
	             * @memberof perfetto.protos.TraceConfig
	             * @static
	             * @param {Object.<string,*>} message Plain object to verify
	             * @returns {string|null} `null` if valid, otherwise the reason why it is not
	             */
	            TraceConfig.verify = function verify(message) {
	                if (typeof message !== "object" || message === null)
	                    return "object expected";
	                if (message.buffers != null && message.hasOwnProperty("buffers")) {
	                    if (!Array.isArray(message.buffers))
	                        return "buffers: array expected";
	                    for (var i = 0; i < message.buffers.length; ++i) {
	                        var error = $root.perfetto.protos.TraceConfig.BufferConfig.verify(message.buffers[i]);
	                        if (error)
	                            return "buffers." + error;
	                    }
	                }
	                if (message.dataSources != null && message.hasOwnProperty("dataSources")) {
	                    if (!Array.isArray(message.dataSources))
	                        return "dataSources: array expected";
	                    for (var i = 0; i < message.dataSources.length; ++i) {
	                        var error = $root.perfetto.protos.TraceConfig.DataSource.verify(message.dataSources[i]);
	                        if (error)
	                            return "dataSources." + error;
	                    }
	                }
	                if (message.durationMs != null && message.hasOwnProperty("durationMs"))
	                    if (!$util.isInteger(message.durationMs))
	                        return "durationMs: integer expected";
	                if (message.enableExtraGuardrails != null && message.hasOwnProperty("enableExtraGuardrails"))
	                    if (typeof message.enableExtraGuardrails !== "boolean")
	                        return "enableExtraGuardrails: boolean expected";
	                if (message.lockdownMode != null && message.hasOwnProperty("lockdownMode"))
	                    switch (message.lockdownMode) {
	                    default:
	                        return "lockdownMode: enum value expected";
	                    case 0:
	                    case 1:
	                    case 2:
	                        break;
	                    }
	                if (message.producers != null && message.hasOwnProperty("producers")) {
	                    if (!Array.isArray(message.producers))
	                        return "producers: array expected";
	                    for (var i = 0; i < message.producers.length; ++i) {
	                        var error = $root.perfetto.protos.TraceConfig.ProducerConfig.verify(message.producers[i]);
	                        if (error)
	                            return "producers." + error;
	                    }
	                }
	                if (message.statsdMetadata != null && message.hasOwnProperty("statsdMetadata")) {
	                    var error = $root.perfetto.protos.TraceConfig.StatsdMetadata.verify(message.statsdMetadata);
	                    if (error)
	                        return "statsdMetadata." + error;
	                }
	                if (message.writeIntoFile != null && message.hasOwnProperty("writeIntoFile"))
	                    if (typeof message.writeIntoFile !== "boolean")
	                        return "writeIntoFile: boolean expected";
	                if (message.fileWritePeriodMs != null && message.hasOwnProperty("fileWritePeriodMs"))
	                    if (!$util.isInteger(message.fileWritePeriodMs))
	                        return "fileWritePeriodMs: integer expected";
	                if (message.maxFileSizeBytes != null && message.hasOwnProperty("maxFileSizeBytes"))
	                    if (!$util.isInteger(message.maxFileSizeBytes) && !(message.maxFileSizeBytes && $util.isInteger(message.maxFileSizeBytes.low) && $util.isInteger(message.maxFileSizeBytes.high)))
	                        return "maxFileSizeBytes: integer|Long expected";
	                if (message.guardrailOverrides != null && message.hasOwnProperty("guardrailOverrides")) {
	                    var error = $root.perfetto.protos.TraceConfig.GuardrailOverrides.verify(message.guardrailOverrides);
	                    if (error)
	                        return "guardrailOverrides." + error;
	                }
	                return null;
	            };

	            /**
	             * Creates a TraceConfig message from a plain object. Also converts values to their respective internal types.
	             * @function fromObject
	             * @memberof perfetto.protos.TraceConfig
	             * @static
	             * @param {Object.<string,*>} object Plain object
	             * @returns {perfetto.protos.TraceConfig} TraceConfig
	             */
	            TraceConfig.fromObject = function fromObject(object) {
	                if (object instanceof $root.perfetto.protos.TraceConfig)
	                    return object;
	                var message = new $root.perfetto.protos.TraceConfig();
	                if (object.buffers) {
	                    if (!Array.isArray(object.buffers))
	                        throw TypeError(".perfetto.protos.TraceConfig.buffers: array expected");
	                    message.buffers = [];
	                    for (var i = 0; i < object.buffers.length; ++i) {
	                        if (typeof object.buffers[i] !== "object")
	                            throw TypeError(".perfetto.protos.TraceConfig.buffers: object expected");
	                        message.buffers[i] = $root.perfetto.protos.TraceConfig.BufferConfig.fromObject(object.buffers[i]);
	                    }
	                }
	                if (object.dataSources) {
	                    if (!Array.isArray(object.dataSources))
	                        throw TypeError(".perfetto.protos.TraceConfig.dataSources: array expected");
	                    message.dataSources = [];
	                    for (var i = 0; i < object.dataSources.length; ++i) {
	                        if (typeof object.dataSources[i] !== "object")
	                            throw TypeError(".perfetto.protos.TraceConfig.dataSources: object expected");
	                        message.dataSources[i] = $root.perfetto.protos.TraceConfig.DataSource.fromObject(object.dataSources[i]);
	                    }
	                }
	                if (object.durationMs != null)
	                    message.durationMs = object.durationMs >>> 0;
	                if (object.enableExtraGuardrails != null)
	                    message.enableExtraGuardrails = Boolean(object.enableExtraGuardrails);
	                switch (object.lockdownMode) {
	                case "LOCKDOWN_UNCHANGED":
	                case 0:
	                    message.lockdownMode = 0;
	                    break;
	                case "LOCKDOWN_CLEAR":
	                case 1:
	                    message.lockdownMode = 1;
	                    break;
	                case "LOCKDOWN_SET":
	                case 2:
	                    message.lockdownMode = 2;
	                    break;
	                }
	                if (object.producers) {
	                    if (!Array.isArray(object.producers))
	                        throw TypeError(".perfetto.protos.TraceConfig.producers: array expected");
	                    message.producers = [];
	                    for (var i = 0; i < object.producers.length; ++i) {
	                        if (typeof object.producers[i] !== "object")
	                            throw TypeError(".perfetto.protos.TraceConfig.producers: object expected");
	                        message.producers[i] = $root.perfetto.protos.TraceConfig.ProducerConfig.fromObject(object.producers[i]);
	                    }
	                }
	                if (object.statsdMetadata != null) {
	                    if (typeof object.statsdMetadata !== "object")
	                        throw TypeError(".perfetto.protos.TraceConfig.statsdMetadata: object expected");
	                    message.statsdMetadata = $root.perfetto.protos.TraceConfig.StatsdMetadata.fromObject(object.statsdMetadata);
	                }
	                if (object.writeIntoFile != null)
	                    message.writeIntoFile = Boolean(object.writeIntoFile);
	                if (object.fileWritePeriodMs != null)
	                    message.fileWritePeriodMs = object.fileWritePeriodMs >>> 0;
	                if (object.maxFileSizeBytes != null)
	                    if ($util.Long)
	                        (message.maxFileSizeBytes = $util.Long.fromValue(object.maxFileSizeBytes)).unsigned = true;
	                    else if (typeof object.maxFileSizeBytes === "string")
	                        message.maxFileSizeBytes = parseInt(object.maxFileSizeBytes, 10);
	                    else if (typeof object.maxFileSizeBytes === "number")
	                        message.maxFileSizeBytes = object.maxFileSizeBytes;
	                    else if (typeof object.maxFileSizeBytes === "object")
	                        message.maxFileSizeBytes = new $util.LongBits(object.maxFileSizeBytes.low >>> 0, object.maxFileSizeBytes.high >>> 0).toNumber(true);
	                if (object.guardrailOverrides != null) {
	                    if (typeof object.guardrailOverrides !== "object")
	                        throw TypeError(".perfetto.protos.TraceConfig.guardrailOverrides: object expected");
	                    message.guardrailOverrides = $root.perfetto.protos.TraceConfig.GuardrailOverrides.fromObject(object.guardrailOverrides);
	                }
	                return message;
	            };

	            /**
	             * Creates a plain object from a TraceConfig message. Also converts values to other types if specified.
	             * @function toObject
	             * @memberof perfetto.protos.TraceConfig
	             * @static
	             * @param {perfetto.protos.TraceConfig} message TraceConfig
	             * @param {$protobuf.IConversionOptions} [options] Conversion options
	             * @returns {Object.<string,*>} Plain object
	             */
	            TraceConfig.toObject = function toObject(message, options) {
	                if (!options)
	                    options = {};
	                var object = {};
	                if (options.arrays || options.defaults) {
	                    object.buffers = [];
	                    object.dataSources = [];
	                    object.producers = [];
	                }
	                if (options.defaults) {
	                    object.durationMs = 0;
	                    object.enableExtraGuardrails = false;
	                    object.lockdownMode = options.enums === String ? "LOCKDOWN_UNCHANGED" : 0;
	                    object.statsdMetadata = null;
	                    object.writeIntoFile = false;
	                    object.fileWritePeriodMs = 0;
	                    if ($util.Long) {
	                        var long = new $util.Long(0, 0, true);
	                        object.maxFileSizeBytes = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
	                    } else
	                        object.maxFileSizeBytes = options.longs === String ? "0" : 0;
	                    object.guardrailOverrides = null;
	                }
	                if (message.buffers && message.buffers.length) {
	                    object.buffers = [];
	                    for (var j = 0; j < message.buffers.length; ++j)
	                        object.buffers[j] = $root.perfetto.protos.TraceConfig.BufferConfig.toObject(message.buffers[j], options);
	                }
	                if (message.dataSources && message.dataSources.length) {
	                    object.dataSources = [];
	                    for (var j = 0; j < message.dataSources.length; ++j)
	                        object.dataSources[j] = $root.perfetto.protos.TraceConfig.DataSource.toObject(message.dataSources[j], options);
	                }
	                if (message.durationMs != null && message.hasOwnProperty("durationMs"))
	                    object.durationMs = message.durationMs;
	                if (message.enableExtraGuardrails != null && message.hasOwnProperty("enableExtraGuardrails"))
	                    object.enableExtraGuardrails = message.enableExtraGuardrails;
	                if (message.lockdownMode != null && message.hasOwnProperty("lockdownMode"))
	                    object.lockdownMode = options.enums === String ? $root.perfetto.protos.TraceConfig.LockdownModeOperation[message.lockdownMode] : message.lockdownMode;
	                if (message.producers && message.producers.length) {
	                    object.producers = [];
	                    for (var j = 0; j < message.producers.length; ++j)
	                        object.producers[j] = $root.perfetto.protos.TraceConfig.ProducerConfig.toObject(message.producers[j], options);
	                }
	                if (message.statsdMetadata != null && message.hasOwnProperty("statsdMetadata"))
	                    object.statsdMetadata = $root.perfetto.protos.TraceConfig.StatsdMetadata.toObject(message.statsdMetadata, options);
	                if (message.writeIntoFile != null && message.hasOwnProperty("writeIntoFile"))
	                    object.writeIntoFile = message.writeIntoFile;
	                if (message.fileWritePeriodMs != null && message.hasOwnProperty("fileWritePeriodMs"))
	                    object.fileWritePeriodMs = message.fileWritePeriodMs;
	                if (message.maxFileSizeBytes != null && message.hasOwnProperty("maxFileSizeBytes"))
	                    if (typeof message.maxFileSizeBytes === "number")
	                        object.maxFileSizeBytes = options.longs === String ? String(message.maxFileSizeBytes) : message.maxFileSizeBytes;
	                    else
	                        object.maxFileSizeBytes = options.longs === String ? $util.Long.prototype.toString.call(message.maxFileSizeBytes) : options.longs === Number ? new $util.LongBits(message.maxFileSizeBytes.low >>> 0, message.maxFileSizeBytes.high >>> 0).toNumber(true) : message.maxFileSizeBytes;
	                if (message.guardrailOverrides != null && message.hasOwnProperty("guardrailOverrides"))
	                    object.guardrailOverrides = $root.perfetto.protos.TraceConfig.GuardrailOverrides.toObject(message.guardrailOverrides, options);
	                return object;
	            };

	            /**
	             * Converts this TraceConfig to JSON.
	             * @function toJSON
	             * @memberof perfetto.protos.TraceConfig
	             * @instance
	             * @returns {Object.<string,*>} JSON object
	             */
	            TraceConfig.prototype.toJSON = function toJSON() {
	                return this.constructor.toObject(this, minimal$1.util.toJSONOptions);
	            };

	            TraceConfig.BufferConfig = (function() {

	                /**
	                 * Properties of a BufferConfig.
	                 * @memberof perfetto.protos.TraceConfig
	                 * @interface IBufferConfig
	                 * @property {number|null} [sizeKb] BufferConfig sizeKb
	                 * @property {perfetto.protos.TraceConfig.BufferConfig.FillPolicy|null} [fillPolicy] BufferConfig fillPolicy
	                 */

	                /**
	                 * Constructs a new BufferConfig.
	                 * @memberof perfetto.protos.TraceConfig
	                 * @classdesc Represents a BufferConfig.
	                 * @implements IBufferConfig
	                 * @constructor
	                 * @param {perfetto.protos.TraceConfig.IBufferConfig=} [properties] Properties to set
	                 */
	                function BufferConfig(properties) {
	                    if (properties)
	                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                            if (properties[keys[i]] != null)
	                                this[keys[i]] = properties[keys[i]];
	                }

	                /**
	                 * BufferConfig sizeKb.
	                 * @member {number} sizeKb
	                 * @memberof perfetto.protos.TraceConfig.BufferConfig
	                 * @instance
	                 */
	                BufferConfig.prototype.sizeKb = 0;

	                /**
	                 * BufferConfig fillPolicy.
	                 * @member {perfetto.protos.TraceConfig.BufferConfig.FillPolicy} fillPolicy
	                 * @memberof perfetto.protos.TraceConfig.BufferConfig
	                 * @instance
	                 */
	                BufferConfig.prototype.fillPolicy = 0;

	                /**
	                 * Creates a new BufferConfig instance using the specified properties.
	                 * @function create
	                 * @memberof perfetto.protos.TraceConfig.BufferConfig
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.IBufferConfig=} [properties] Properties to set
	                 * @returns {perfetto.protos.TraceConfig.BufferConfig} BufferConfig instance
	                 */
	                BufferConfig.create = function create(properties) {
	                    return new BufferConfig(properties);
	                };

	                /**
	                 * Encodes the specified BufferConfig message. Does not implicitly {@link perfetto.protos.TraceConfig.BufferConfig.verify|verify} messages.
	                 * @function encode
	                 * @memberof perfetto.protos.TraceConfig.BufferConfig
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.IBufferConfig} message BufferConfig message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                BufferConfig.encode = function encode(message, writer) {
	                    if (!writer)
	                        writer = $Writer.create();
	                    if (message.sizeKb != null && message.hasOwnProperty("sizeKb"))
	                        writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.sizeKb);
	                    if (message.fillPolicy != null && message.hasOwnProperty("fillPolicy"))
	                        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.fillPolicy);
	                    return writer;
	                };

	                /**
	                 * Encodes the specified BufferConfig message, length delimited. Does not implicitly {@link perfetto.protos.TraceConfig.BufferConfig.verify|verify} messages.
	                 * @function encodeDelimited
	                 * @memberof perfetto.protos.TraceConfig.BufferConfig
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.IBufferConfig} message BufferConfig message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                BufferConfig.encodeDelimited = function encodeDelimited(message, writer) {
	                    return this.encode(message, writer).ldelim();
	                };

	                /**
	                 * Decodes a BufferConfig message from the specified reader or buffer.
	                 * @function decode
	                 * @memberof perfetto.protos.TraceConfig.BufferConfig
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @param {number} [length] Message length if known beforehand
	                 * @returns {perfetto.protos.TraceConfig.BufferConfig} BufferConfig
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                BufferConfig.decode = function decode(reader, length) {
	                    if (!(reader instanceof $Reader))
	                        reader = $Reader.create(reader);
	                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.TraceConfig.BufferConfig();
	                    while (reader.pos < end) {
	                        var tag = reader.uint32();
	                        switch (tag >>> 3) {
	                        case 1:
	                            message.sizeKb = reader.uint32();
	                            break;
	                        case 4:
	                            message.fillPolicy = reader.int32();
	                            break;
	                        default:
	                            reader.skipType(tag & 7);
	                            break;
	                        }
	                    }
	                    return message;
	                };

	                /**
	                 * Decodes a BufferConfig message from the specified reader or buffer, length delimited.
	                 * @function decodeDelimited
	                 * @memberof perfetto.protos.TraceConfig.BufferConfig
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @returns {perfetto.protos.TraceConfig.BufferConfig} BufferConfig
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                BufferConfig.decodeDelimited = function decodeDelimited(reader) {
	                    if (!(reader instanceof $Reader))
	                        reader = new $Reader(reader);
	                    return this.decode(reader, reader.uint32());
	                };

	                /**
	                 * Verifies a BufferConfig message.
	                 * @function verify
	                 * @memberof perfetto.protos.TraceConfig.BufferConfig
	                 * @static
	                 * @param {Object.<string,*>} message Plain object to verify
	                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
	                 */
	                BufferConfig.verify = function verify(message) {
	                    if (typeof message !== "object" || message === null)
	                        return "object expected";
	                    if (message.sizeKb != null && message.hasOwnProperty("sizeKb"))
	                        if (!$util.isInteger(message.sizeKb))
	                            return "sizeKb: integer expected";
	                    if (message.fillPolicy != null && message.hasOwnProperty("fillPolicy"))
	                        switch (message.fillPolicy) {
	                        default:
	                            return "fillPolicy: enum value expected";
	                        case 0:
	                        case 1:
	                            break;
	                        }
	                    return null;
	                };

	                /**
	                 * Creates a BufferConfig message from a plain object. Also converts values to their respective internal types.
	                 * @function fromObject
	                 * @memberof perfetto.protos.TraceConfig.BufferConfig
	                 * @static
	                 * @param {Object.<string,*>} object Plain object
	                 * @returns {perfetto.protos.TraceConfig.BufferConfig} BufferConfig
	                 */
	                BufferConfig.fromObject = function fromObject(object) {
	                    if (object instanceof $root.perfetto.protos.TraceConfig.BufferConfig)
	                        return object;
	                    var message = new $root.perfetto.protos.TraceConfig.BufferConfig();
	                    if (object.sizeKb != null)
	                        message.sizeKb = object.sizeKb >>> 0;
	                    switch (object.fillPolicy) {
	                    case "UNSPECIFIED":
	                    case 0:
	                        message.fillPolicy = 0;
	                        break;
	                    case "RING_BUFFER":
	                    case 1:
	                        message.fillPolicy = 1;
	                        break;
	                    }
	                    return message;
	                };

	                /**
	                 * Creates a plain object from a BufferConfig message. Also converts values to other types if specified.
	                 * @function toObject
	                 * @memberof perfetto.protos.TraceConfig.BufferConfig
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.BufferConfig} message BufferConfig
	                 * @param {$protobuf.IConversionOptions} [options] Conversion options
	                 * @returns {Object.<string,*>} Plain object
	                 */
	                BufferConfig.toObject = function toObject(message, options) {
	                    if (!options)
	                        options = {};
	                    var object = {};
	                    if (options.defaults) {
	                        object.sizeKb = 0;
	                        object.fillPolicy = options.enums === String ? "UNSPECIFIED" : 0;
	                    }
	                    if (message.sizeKb != null && message.hasOwnProperty("sizeKb"))
	                        object.sizeKb = message.sizeKb;
	                    if (message.fillPolicy != null && message.hasOwnProperty("fillPolicy"))
	                        object.fillPolicy = options.enums === String ? $root.perfetto.protos.TraceConfig.BufferConfig.FillPolicy[message.fillPolicy] : message.fillPolicy;
	                    return object;
	                };

	                /**
	                 * Converts this BufferConfig to JSON.
	                 * @function toJSON
	                 * @memberof perfetto.protos.TraceConfig.BufferConfig
	                 * @instance
	                 * @returns {Object.<string,*>} JSON object
	                 */
	                BufferConfig.prototype.toJSON = function toJSON() {
	                    return this.constructor.toObject(this, minimal$1.util.toJSONOptions);
	                };

	                /**
	                 * FillPolicy enum.
	                 * @name perfetto.protos.TraceConfig.BufferConfig.FillPolicy
	                 * @enum {string}
	                 * @property {number} UNSPECIFIED=0 UNSPECIFIED value
	                 * @property {number} RING_BUFFER=1 RING_BUFFER value
	                 */
	                BufferConfig.FillPolicy = (function() {
	                    var valuesById = {}, values = Object.create(valuesById);
	                    values[valuesById[0] = "UNSPECIFIED"] = 0;
	                    values[valuesById[1] = "RING_BUFFER"] = 1;
	                    return values;
	                })();

	                return BufferConfig;
	            })();

	            TraceConfig.DataSource = (function() {

	                /**
	                 * Properties of a DataSource.
	                 * @memberof perfetto.protos.TraceConfig
	                 * @interface IDataSource
	                 * @property {perfetto.protos.IDataSourceConfig|null} [config] DataSource config
	                 * @property {Array.<string>|null} [producerNameFilter] DataSource producerNameFilter
	                 */

	                /**
	                 * Constructs a new DataSource.
	                 * @memberof perfetto.protos.TraceConfig
	                 * @classdesc Represents a DataSource.
	                 * @implements IDataSource
	                 * @constructor
	                 * @param {perfetto.protos.TraceConfig.IDataSource=} [properties] Properties to set
	                 */
	                function DataSource(properties) {
	                    this.producerNameFilter = [];
	                    if (properties)
	                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                            if (properties[keys[i]] != null)
	                                this[keys[i]] = properties[keys[i]];
	                }

	                /**
	                 * DataSource config.
	                 * @member {perfetto.protos.IDataSourceConfig|null|undefined} config
	                 * @memberof perfetto.protos.TraceConfig.DataSource
	                 * @instance
	                 */
	                DataSource.prototype.config = null;

	                /**
	                 * DataSource producerNameFilter.
	                 * @member {Array.<string>} producerNameFilter
	                 * @memberof perfetto.protos.TraceConfig.DataSource
	                 * @instance
	                 */
	                DataSource.prototype.producerNameFilter = $util.emptyArray;

	                /**
	                 * Creates a new DataSource instance using the specified properties.
	                 * @function create
	                 * @memberof perfetto.protos.TraceConfig.DataSource
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.IDataSource=} [properties] Properties to set
	                 * @returns {perfetto.protos.TraceConfig.DataSource} DataSource instance
	                 */
	                DataSource.create = function create(properties) {
	                    return new DataSource(properties);
	                };

	                /**
	                 * Encodes the specified DataSource message. Does not implicitly {@link perfetto.protos.TraceConfig.DataSource.verify|verify} messages.
	                 * @function encode
	                 * @memberof perfetto.protos.TraceConfig.DataSource
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.IDataSource} message DataSource message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                DataSource.encode = function encode(message, writer) {
	                    if (!writer)
	                        writer = $Writer.create();
	                    if (message.config != null && message.hasOwnProperty("config"))
	                        $root.perfetto.protos.DataSourceConfig.encode(message.config, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
	                    if (message.producerNameFilter != null && message.producerNameFilter.length)
	                        for (var i = 0; i < message.producerNameFilter.length; ++i)
	                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.producerNameFilter[i]);
	                    return writer;
	                };

	                /**
	                 * Encodes the specified DataSource message, length delimited. Does not implicitly {@link perfetto.protos.TraceConfig.DataSource.verify|verify} messages.
	                 * @function encodeDelimited
	                 * @memberof perfetto.protos.TraceConfig.DataSource
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.IDataSource} message DataSource message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                DataSource.encodeDelimited = function encodeDelimited(message, writer) {
	                    return this.encode(message, writer).ldelim();
	                };

	                /**
	                 * Decodes a DataSource message from the specified reader or buffer.
	                 * @function decode
	                 * @memberof perfetto.protos.TraceConfig.DataSource
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @param {number} [length] Message length if known beforehand
	                 * @returns {perfetto.protos.TraceConfig.DataSource} DataSource
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                DataSource.decode = function decode(reader, length) {
	                    if (!(reader instanceof $Reader))
	                        reader = $Reader.create(reader);
	                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.TraceConfig.DataSource();
	                    while (reader.pos < end) {
	                        var tag = reader.uint32();
	                        switch (tag >>> 3) {
	                        case 1:
	                            message.config = $root.perfetto.protos.DataSourceConfig.decode(reader, reader.uint32());
	                            break;
	                        case 2:
	                            if (!(message.producerNameFilter && message.producerNameFilter.length))
	                                message.producerNameFilter = [];
	                            message.producerNameFilter.push(reader.string());
	                            break;
	                        default:
	                            reader.skipType(tag & 7);
	                            break;
	                        }
	                    }
	                    return message;
	                };

	                /**
	                 * Decodes a DataSource message from the specified reader or buffer, length delimited.
	                 * @function decodeDelimited
	                 * @memberof perfetto.protos.TraceConfig.DataSource
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @returns {perfetto.protos.TraceConfig.DataSource} DataSource
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                DataSource.decodeDelimited = function decodeDelimited(reader) {
	                    if (!(reader instanceof $Reader))
	                        reader = new $Reader(reader);
	                    return this.decode(reader, reader.uint32());
	                };

	                /**
	                 * Verifies a DataSource message.
	                 * @function verify
	                 * @memberof perfetto.protos.TraceConfig.DataSource
	                 * @static
	                 * @param {Object.<string,*>} message Plain object to verify
	                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
	                 */
	                DataSource.verify = function verify(message) {
	                    if (typeof message !== "object" || message === null)
	                        return "object expected";
	                    if (message.config != null && message.hasOwnProperty("config")) {
	                        var error = $root.perfetto.protos.DataSourceConfig.verify(message.config);
	                        if (error)
	                            return "config." + error;
	                    }
	                    if (message.producerNameFilter != null && message.hasOwnProperty("producerNameFilter")) {
	                        if (!Array.isArray(message.producerNameFilter))
	                            return "producerNameFilter: array expected";
	                        for (var i = 0; i < message.producerNameFilter.length; ++i)
	                            if (!$util.isString(message.producerNameFilter[i]))
	                                return "producerNameFilter: string[] expected";
	                    }
	                    return null;
	                };

	                /**
	                 * Creates a DataSource message from a plain object. Also converts values to their respective internal types.
	                 * @function fromObject
	                 * @memberof perfetto.protos.TraceConfig.DataSource
	                 * @static
	                 * @param {Object.<string,*>} object Plain object
	                 * @returns {perfetto.protos.TraceConfig.DataSource} DataSource
	                 */
	                DataSource.fromObject = function fromObject(object) {
	                    if (object instanceof $root.perfetto.protos.TraceConfig.DataSource)
	                        return object;
	                    var message = new $root.perfetto.protos.TraceConfig.DataSource();
	                    if (object.config != null) {
	                        if (typeof object.config !== "object")
	                            throw TypeError(".perfetto.protos.TraceConfig.DataSource.config: object expected");
	                        message.config = $root.perfetto.protos.DataSourceConfig.fromObject(object.config);
	                    }
	                    if (object.producerNameFilter) {
	                        if (!Array.isArray(object.producerNameFilter))
	                            throw TypeError(".perfetto.protos.TraceConfig.DataSource.producerNameFilter: array expected");
	                        message.producerNameFilter = [];
	                        for (var i = 0; i < object.producerNameFilter.length; ++i)
	                            message.producerNameFilter[i] = String(object.producerNameFilter[i]);
	                    }
	                    return message;
	                };

	                /**
	                 * Creates a plain object from a DataSource message. Also converts values to other types if specified.
	                 * @function toObject
	                 * @memberof perfetto.protos.TraceConfig.DataSource
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.DataSource} message DataSource
	                 * @param {$protobuf.IConversionOptions} [options] Conversion options
	                 * @returns {Object.<string,*>} Plain object
	                 */
	                DataSource.toObject = function toObject(message, options) {
	                    if (!options)
	                        options = {};
	                    var object = {};
	                    if (options.arrays || options.defaults)
	                        object.producerNameFilter = [];
	                    if (options.defaults)
	                        object.config = null;
	                    if (message.config != null && message.hasOwnProperty("config"))
	                        object.config = $root.perfetto.protos.DataSourceConfig.toObject(message.config, options);
	                    if (message.producerNameFilter && message.producerNameFilter.length) {
	                        object.producerNameFilter = [];
	                        for (var j = 0; j < message.producerNameFilter.length; ++j)
	                            object.producerNameFilter[j] = message.producerNameFilter[j];
	                    }
	                    return object;
	                };

	                /**
	                 * Converts this DataSource to JSON.
	                 * @function toJSON
	                 * @memberof perfetto.protos.TraceConfig.DataSource
	                 * @instance
	                 * @returns {Object.<string,*>} JSON object
	                 */
	                DataSource.prototype.toJSON = function toJSON() {
	                    return this.constructor.toObject(this, minimal$1.util.toJSONOptions);
	                };

	                return DataSource;
	            })();

	            /**
	             * LockdownModeOperation enum.
	             * @name perfetto.protos.TraceConfig.LockdownModeOperation
	             * @enum {string}
	             * @property {number} LOCKDOWN_UNCHANGED=0 LOCKDOWN_UNCHANGED value
	             * @property {number} LOCKDOWN_CLEAR=1 LOCKDOWN_CLEAR value
	             * @property {number} LOCKDOWN_SET=2 LOCKDOWN_SET value
	             */
	            TraceConfig.LockdownModeOperation = (function() {
	                var valuesById = {}, values = Object.create(valuesById);
	                values[valuesById[0] = "LOCKDOWN_UNCHANGED"] = 0;
	                values[valuesById[1] = "LOCKDOWN_CLEAR"] = 1;
	                values[valuesById[2] = "LOCKDOWN_SET"] = 2;
	                return values;
	            })();

	            TraceConfig.ProducerConfig = (function() {

	                /**
	                 * Properties of a ProducerConfig.
	                 * @memberof perfetto.protos.TraceConfig
	                 * @interface IProducerConfig
	                 * @property {string|null} [producerName] ProducerConfig producerName
	                 * @property {number|null} [shmSizeKb] ProducerConfig shmSizeKb
	                 * @property {number|null} [pageSizeKb] ProducerConfig pageSizeKb
	                 */

	                /**
	                 * Constructs a new ProducerConfig.
	                 * @memberof perfetto.protos.TraceConfig
	                 * @classdesc Represents a ProducerConfig.
	                 * @implements IProducerConfig
	                 * @constructor
	                 * @param {perfetto.protos.TraceConfig.IProducerConfig=} [properties] Properties to set
	                 */
	                function ProducerConfig(properties) {
	                    if (properties)
	                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                            if (properties[keys[i]] != null)
	                                this[keys[i]] = properties[keys[i]];
	                }

	                /**
	                 * ProducerConfig producerName.
	                 * @member {string} producerName
	                 * @memberof perfetto.protos.TraceConfig.ProducerConfig
	                 * @instance
	                 */
	                ProducerConfig.prototype.producerName = "";

	                /**
	                 * ProducerConfig shmSizeKb.
	                 * @member {number} shmSizeKb
	                 * @memberof perfetto.protos.TraceConfig.ProducerConfig
	                 * @instance
	                 */
	                ProducerConfig.prototype.shmSizeKb = 0;

	                /**
	                 * ProducerConfig pageSizeKb.
	                 * @member {number} pageSizeKb
	                 * @memberof perfetto.protos.TraceConfig.ProducerConfig
	                 * @instance
	                 */
	                ProducerConfig.prototype.pageSizeKb = 0;

	                /**
	                 * Creates a new ProducerConfig instance using the specified properties.
	                 * @function create
	                 * @memberof perfetto.protos.TraceConfig.ProducerConfig
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.IProducerConfig=} [properties] Properties to set
	                 * @returns {perfetto.protos.TraceConfig.ProducerConfig} ProducerConfig instance
	                 */
	                ProducerConfig.create = function create(properties) {
	                    return new ProducerConfig(properties);
	                };

	                /**
	                 * Encodes the specified ProducerConfig message. Does not implicitly {@link perfetto.protos.TraceConfig.ProducerConfig.verify|verify} messages.
	                 * @function encode
	                 * @memberof perfetto.protos.TraceConfig.ProducerConfig
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.IProducerConfig} message ProducerConfig message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                ProducerConfig.encode = function encode(message, writer) {
	                    if (!writer)
	                        writer = $Writer.create();
	                    if (message.producerName != null && message.hasOwnProperty("producerName"))
	                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.producerName);
	                    if (message.shmSizeKb != null && message.hasOwnProperty("shmSizeKb"))
	                        writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.shmSizeKb);
	                    if (message.pageSizeKb != null && message.hasOwnProperty("pageSizeKb"))
	                        writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.pageSizeKb);
	                    return writer;
	                };

	                /**
	                 * Encodes the specified ProducerConfig message, length delimited. Does not implicitly {@link perfetto.protos.TraceConfig.ProducerConfig.verify|verify} messages.
	                 * @function encodeDelimited
	                 * @memberof perfetto.protos.TraceConfig.ProducerConfig
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.IProducerConfig} message ProducerConfig message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                ProducerConfig.encodeDelimited = function encodeDelimited(message, writer) {
	                    return this.encode(message, writer).ldelim();
	                };

	                /**
	                 * Decodes a ProducerConfig message from the specified reader or buffer.
	                 * @function decode
	                 * @memberof perfetto.protos.TraceConfig.ProducerConfig
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @param {number} [length] Message length if known beforehand
	                 * @returns {perfetto.protos.TraceConfig.ProducerConfig} ProducerConfig
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                ProducerConfig.decode = function decode(reader, length) {
	                    if (!(reader instanceof $Reader))
	                        reader = $Reader.create(reader);
	                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.TraceConfig.ProducerConfig();
	                    while (reader.pos < end) {
	                        var tag = reader.uint32();
	                        switch (tag >>> 3) {
	                        case 1:
	                            message.producerName = reader.string();
	                            break;
	                        case 2:
	                            message.shmSizeKb = reader.uint32();
	                            break;
	                        case 3:
	                            message.pageSizeKb = reader.uint32();
	                            break;
	                        default:
	                            reader.skipType(tag & 7);
	                            break;
	                        }
	                    }
	                    return message;
	                };

	                /**
	                 * Decodes a ProducerConfig message from the specified reader or buffer, length delimited.
	                 * @function decodeDelimited
	                 * @memberof perfetto.protos.TraceConfig.ProducerConfig
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @returns {perfetto.protos.TraceConfig.ProducerConfig} ProducerConfig
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                ProducerConfig.decodeDelimited = function decodeDelimited(reader) {
	                    if (!(reader instanceof $Reader))
	                        reader = new $Reader(reader);
	                    return this.decode(reader, reader.uint32());
	                };

	                /**
	                 * Verifies a ProducerConfig message.
	                 * @function verify
	                 * @memberof perfetto.protos.TraceConfig.ProducerConfig
	                 * @static
	                 * @param {Object.<string,*>} message Plain object to verify
	                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
	                 */
	                ProducerConfig.verify = function verify(message) {
	                    if (typeof message !== "object" || message === null)
	                        return "object expected";
	                    if (message.producerName != null && message.hasOwnProperty("producerName"))
	                        if (!$util.isString(message.producerName))
	                            return "producerName: string expected";
	                    if (message.shmSizeKb != null && message.hasOwnProperty("shmSizeKb"))
	                        if (!$util.isInteger(message.shmSizeKb))
	                            return "shmSizeKb: integer expected";
	                    if (message.pageSizeKb != null && message.hasOwnProperty("pageSizeKb"))
	                        if (!$util.isInteger(message.pageSizeKb))
	                            return "pageSizeKb: integer expected";
	                    return null;
	                };

	                /**
	                 * Creates a ProducerConfig message from a plain object. Also converts values to their respective internal types.
	                 * @function fromObject
	                 * @memberof perfetto.protos.TraceConfig.ProducerConfig
	                 * @static
	                 * @param {Object.<string,*>} object Plain object
	                 * @returns {perfetto.protos.TraceConfig.ProducerConfig} ProducerConfig
	                 */
	                ProducerConfig.fromObject = function fromObject(object) {
	                    if (object instanceof $root.perfetto.protos.TraceConfig.ProducerConfig)
	                        return object;
	                    var message = new $root.perfetto.protos.TraceConfig.ProducerConfig();
	                    if (object.producerName != null)
	                        message.producerName = String(object.producerName);
	                    if (object.shmSizeKb != null)
	                        message.shmSizeKb = object.shmSizeKb >>> 0;
	                    if (object.pageSizeKb != null)
	                        message.pageSizeKb = object.pageSizeKb >>> 0;
	                    return message;
	                };

	                /**
	                 * Creates a plain object from a ProducerConfig message. Also converts values to other types if specified.
	                 * @function toObject
	                 * @memberof perfetto.protos.TraceConfig.ProducerConfig
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.ProducerConfig} message ProducerConfig
	                 * @param {$protobuf.IConversionOptions} [options] Conversion options
	                 * @returns {Object.<string,*>} Plain object
	                 */
	                ProducerConfig.toObject = function toObject(message, options) {
	                    if (!options)
	                        options = {};
	                    var object = {};
	                    if (options.defaults) {
	                        object.producerName = "";
	                        object.shmSizeKb = 0;
	                        object.pageSizeKb = 0;
	                    }
	                    if (message.producerName != null && message.hasOwnProperty("producerName"))
	                        object.producerName = message.producerName;
	                    if (message.shmSizeKb != null && message.hasOwnProperty("shmSizeKb"))
	                        object.shmSizeKb = message.shmSizeKb;
	                    if (message.pageSizeKb != null && message.hasOwnProperty("pageSizeKb"))
	                        object.pageSizeKb = message.pageSizeKb;
	                    return object;
	                };

	                /**
	                 * Converts this ProducerConfig to JSON.
	                 * @function toJSON
	                 * @memberof perfetto.protos.TraceConfig.ProducerConfig
	                 * @instance
	                 * @returns {Object.<string,*>} JSON object
	                 */
	                ProducerConfig.prototype.toJSON = function toJSON() {
	                    return this.constructor.toObject(this, minimal$1.util.toJSONOptions);
	                };

	                return ProducerConfig;
	            })();

	            TraceConfig.StatsdMetadata = (function() {

	                /**
	                 * Properties of a StatsdMetadata.
	                 * @memberof perfetto.protos.TraceConfig
	                 * @interface IStatsdMetadata
	                 * @property {number|Long|null} [triggeringAlertId] StatsdMetadata triggeringAlertId
	                 * @property {number|null} [triggeringConfigUid] StatsdMetadata triggeringConfigUid
	                 * @property {number|Long|null} [triggeringConfigId] StatsdMetadata triggeringConfigId
	                 */

	                /**
	                 * Constructs a new StatsdMetadata.
	                 * @memberof perfetto.protos.TraceConfig
	                 * @classdesc Represents a StatsdMetadata.
	                 * @implements IStatsdMetadata
	                 * @constructor
	                 * @param {perfetto.protos.TraceConfig.IStatsdMetadata=} [properties] Properties to set
	                 */
	                function StatsdMetadata(properties) {
	                    if (properties)
	                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                            if (properties[keys[i]] != null)
	                                this[keys[i]] = properties[keys[i]];
	                }

	                /**
	                 * StatsdMetadata triggeringAlertId.
	                 * @member {number|Long} triggeringAlertId
	                 * @memberof perfetto.protos.TraceConfig.StatsdMetadata
	                 * @instance
	                 */
	                StatsdMetadata.prototype.triggeringAlertId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

	                /**
	                 * StatsdMetadata triggeringConfigUid.
	                 * @member {number} triggeringConfigUid
	                 * @memberof perfetto.protos.TraceConfig.StatsdMetadata
	                 * @instance
	                 */
	                StatsdMetadata.prototype.triggeringConfigUid = 0;

	                /**
	                 * StatsdMetadata triggeringConfigId.
	                 * @member {number|Long} triggeringConfigId
	                 * @memberof perfetto.protos.TraceConfig.StatsdMetadata
	                 * @instance
	                 */
	                StatsdMetadata.prototype.triggeringConfigId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

	                /**
	                 * Creates a new StatsdMetadata instance using the specified properties.
	                 * @function create
	                 * @memberof perfetto.protos.TraceConfig.StatsdMetadata
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.IStatsdMetadata=} [properties] Properties to set
	                 * @returns {perfetto.protos.TraceConfig.StatsdMetadata} StatsdMetadata instance
	                 */
	                StatsdMetadata.create = function create(properties) {
	                    return new StatsdMetadata(properties);
	                };

	                /**
	                 * Encodes the specified StatsdMetadata message. Does not implicitly {@link perfetto.protos.TraceConfig.StatsdMetadata.verify|verify} messages.
	                 * @function encode
	                 * @memberof perfetto.protos.TraceConfig.StatsdMetadata
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.IStatsdMetadata} message StatsdMetadata message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                StatsdMetadata.encode = function encode(message, writer) {
	                    if (!writer)
	                        writer = $Writer.create();
	                    if (message.triggeringAlertId != null && message.hasOwnProperty("triggeringAlertId"))
	                        writer.uint32(/* id 1, wireType 0 =*/8).int64(message.triggeringAlertId);
	                    if (message.triggeringConfigUid != null && message.hasOwnProperty("triggeringConfigUid"))
	                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.triggeringConfigUid);
	                    if (message.triggeringConfigId != null && message.hasOwnProperty("triggeringConfigId"))
	                        writer.uint32(/* id 3, wireType 0 =*/24).int64(message.triggeringConfigId);
	                    return writer;
	                };

	                /**
	                 * Encodes the specified StatsdMetadata message, length delimited. Does not implicitly {@link perfetto.protos.TraceConfig.StatsdMetadata.verify|verify} messages.
	                 * @function encodeDelimited
	                 * @memberof perfetto.protos.TraceConfig.StatsdMetadata
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.IStatsdMetadata} message StatsdMetadata message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                StatsdMetadata.encodeDelimited = function encodeDelimited(message, writer) {
	                    return this.encode(message, writer).ldelim();
	                };

	                /**
	                 * Decodes a StatsdMetadata message from the specified reader or buffer.
	                 * @function decode
	                 * @memberof perfetto.protos.TraceConfig.StatsdMetadata
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @param {number} [length] Message length if known beforehand
	                 * @returns {perfetto.protos.TraceConfig.StatsdMetadata} StatsdMetadata
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                StatsdMetadata.decode = function decode(reader, length) {
	                    if (!(reader instanceof $Reader))
	                        reader = $Reader.create(reader);
	                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.TraceConfig.StatsdMetadata();
	                    while (reader.pos < end) {
	                        var tag = reader.uint32();
	                        switch (tag >>> 3) {
	                        case 1:
	                            message.triggeringAlertId = reader.int64();
	                            break;
	                        case 2:
	                            message.triggeringConfigUid = reader.int32();
	                            break;
	                        case 3:
	                            message.triggeringConfigId = reader.int64();
	                            break;
	                        default:
	                            reader.skipType(tag & 7);
	                            break;
	                        }
	                    }
	                    return message;
	                };

	                /**
	                 * Decodes a StatsdMetadata message from the specified reader or buffer, length delimited.
	                 * @function decodeDelimited
	                 * @memberof perfetto.protos.TraceConfig.StatsdMetadata
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @returns {perfetto.protos.TraceConfig.StatsdMetadata} StatsdMetadata
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                StatsdMetadata.decodeDelimited = function decodeDelimited(reader) {
	                    if (!(reader instanceof $Reader))
	                        reader = new $Reader(reader);
	                    return this.decode(reader, reader.uint32());
	                };

	                /**
	                 * Verifies a StatsdMetadata message.
	                 * @function verify
	                 * @memberof perfetto.protos.TraceConfig.StatsdMetadata
	                 * @static
	                 * @param {Object.<string,*>} message Plain object to verify
	                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
	                 */
	                StatsdMetadata.verify = function verify(message) {
	                    if (typeof message !== "object" || message === null)
	                        return "object expected";
	                    if (message.triggeringAlertId != null && message.hasOwnProperty("triggeringAlertId"))
	                        if (!$util.isInteger(message.triggeringAlertId) && !(message.triggeringAlertId && $util.isInteger(message.triggeringAlertId.low) && $util.isInteger(message.triggeringAlertId.high)))
	                            return "triggeringAlertId: integer|Long expected";
	                    if (message.triggeringConfigUid != null && message.hasOwnProperty("triggeringConfigUid"))
	                        if (!$util.isInteger(message.triggeringConfigUid))
	                            return "triggeringConfigUid: integer expected";
	                    if (message.triggeringConfigId != null && message.hasOwnProperty("triggeringConfigId"))
	                        if (!$util.isInteger(message.triggeringConfigId) && !(message.triggeringConfigId && $util.isInteger(message.triggeringConfigId.low) && $util.isInteger(message.triggeringConfigId.high)))
	                            return "triggeringConfigId: integer|Long expected";
	                    return null;
	                };

	                /**
	                 * Creates a StatsdMetadata message from a plain object. Also converts values to their respective internal types.
	                 * @function fromObject
	                 * @memberof perfetto.protos.TraceConfig.StatsdMetadata
	                 * @static
	                 * @param {Object.<string,*>} object Plain object
	                 * @returns {perfetto.protos.TraceConfig.StatsdMetadata} StatsdMetadata
	                 */
	                StatsdMetadata.fromObject = function fromObject(object) {
	                    if (object instanceof $root.perfetto.protos.TraceConfig.StatsdMetadata)
	                        return object;
	                    var message = new $root.perfetto.protos.TraceConfig.StatsdMetadata();
	                    if (object.triggeringAlertId != null)
	                        if ($util.Long)
	                            (message.triggeringAlertId = $util.Long.fromValue(object.triggeringAlertId)).unsigned = false;
	                        else if (typeof object.triggeringAlertId === "string")
	                            message.triggeringAlertId = parseInt(object.triggeringAlertId, 10);
	                        else if (typeof object.triggeringAlertId === "number")
	                            message.triggeringAlertId = object.triggeringAlertId;
	                        else if (typeof object.triggeringAlertId === "object")
	                            message.triggeringAlertId = new $util.LongBits(object.triggeringAlertId.low >>> 0, object.triggeringAlertId.high >>> 0).toNumber();
	                    if (object.triggeringConfigUid != null)
	                        message.triggeringConfigUid = object.triggeringConfigUid | 0;
	                    if (object.triggeringConfigId != null)
	                        if ($util.Long)
	                            (message.triggeringConfigId = $util.Long.fromValue(object.triggeringConfigId)).unsigned = false;
	                        else if (typeof object.triggeringConfigId === "string")
	                            message.triggeringConfigId = parseInt(object.triggeringConfigId, 10);
	                        else if (typeof object.triggeringConfigId === "number")
	                            message.triggeringConfigId = object.triggeringConfigId;
	                        else if (typeof object.triggeringConfigId === "object")
	                            message.triggeringConfigId = new $util.LongBits(object.triggeringConfigId.low >>> 0, object.triggeringConfigId.high >>> 0).toNumber();
	                    return message;
	                };

	                /**
	                 * Creates a plain object from a StatsdMetadata message. Also converts values to other types if specified.
	                 * @function toObject
	                 * @memberof perfetto.protos.TraceConfig.StatsdMetadata
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.StatsdMetadata} message StatsdMetadata
	                 * @param {$protobuf.IConversionOptions} [options] Conversion options
	                 * @returns {Object.<string,*>} Plain object
	                 */
	                StatsdMetadata.toObject = function toObject(message, options) {
	                    if (!options)
	                        options = {};
	                    var object = {};
	                    if (options.defaults) {
	                        if ($util.Long) {
	                            var long = new $util.Long(0, 0, false);
	                            object.triggeringAlertId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
	                        } else
	                            object.triggeringAlertId = options.longs === String ? "0" : 0;
	                        object.triggeringConfigUid = 0;
	                        if ($util.Long) {
	                            var long = new $util.Long(0, 0, false);
	                            object.triggeringConfigId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
	                        } else
	                            object.triggeringConfigId = options.longs === String ? "0" : 0;
	                    }
	                    if (message.triggeringAlertId != null && message.hasOwnProperty("triggeringAlertId"))
	                        if (typeof message.triggeringAlertId === "number")
	                            object.triggeringAlertId = options.longs === String ? String(message.triggeringAlertId) : message.triggeringAlertId;
	                        else
	                            object.triggeringAlertId = options.longs === String ? $util.Long.prototype.toString.call(message.triggeringAlertId) : options.longs === Number ? new $util.LongBits(message.triggeringAlertId.low >>> 0, message.triggeringAlertId.high >>> 0).toNumber() : message.triggeringAlertId;
	                    if (message.triggeringConfigUid != null && message.hasOwnProperty("triggeringConfigUid"))
	                        object.triggeringConfigUid = message.triggeringConfigUid;
	                    if (message.triggeringConfigId != null && message.hasOwnProperty("triggeringConfigId"))
	                        if (typeof message.triggeringConfigId === "number")
	                            object.triggeringConfigId = options.longs === String ? String(message.triggeringConfigId) : message.triggeringConfigId;
	                        else
	                            object.triggeringConfigId = options.longs === String ? $util.Long.prototype.toString.call(message.triggeringConfigId) : options.longs === Number ? new $util.LongBits(message.triggeringConfigId.low >>> 0, message.triggeringConfigId.high >>> 0).toNumber() : message.triggeringConfigId;
	                    return object;
	                };

	                /**
	                 * Converts this StatsdMetadata to JSON.
	                 * @function toJSON
	                 * @memberof perfetto.protos.TraceConfig.StatsdMetadata
	                 * @instance
	                 * @returns {Object.<string,*>} JSON object
	                 */
	                StatsdMetadata.prototype.toJSON = function toJSON() {
	                    return this.constructor.toObject(this, minimal$1.util.toJSONOptions);
	                };

	                return StatsdMetadata;
	            })();

	            TraceConfig.GuardrailOverrides = (function() {

	                /**
	                 * Properties of a GuardrailOverrides.
	                 * @memberof perfetto.protos.TraceConfig
	                 * @interface IGuardrailOverrides
	                 * @property {number|Long|null} [maxUploadPerDayBytes] GuardrailOverrides maxUploadPerDayBytes
	                 */

	                /**
	                 * Constructs a new GuardrailOverrides.
	                 * @memberof perfetto.protos.TraceConfig
	                 * @classdesc Represents a GuardrailOverrides.
	                 * @implements IGuardrailOverrides
	                 * @constructor
	                 * @param {perfetto.protos.TraceConfig.IGuardrailOverrides=} [properties] Properties to set
	                 */
	                function GuardrailOverrides(properties) {
	                    if (properties)
	                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                            if (properties[keys[i]] != null)
	                                this[keys[i]] = properties[keys[i]];
	                }

	                /**
	                 * GuardrailOverrides maxUploadPerDayBytes.
	                 * @member {number|Long} maxUploadPerDayBytes
	                 * @memberof perfetto.protos.TraceConfig.GuardrailOverrides
	                 * @instance
	                 */
	                GuardrailOverrides.prototype.maxUploadPerDayBytes = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

	                /**
	                 * Creates a new GuardrailOverrides instance using the specified properties.
	                 * @function create
	                 * @memberof perfetto.protos.TraceConfig.GuardrailOverrides
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.IGuardrailOverrides=} [properties] Properties to set
	                 * @returns {perfetto.protos.TraceConfig.GuardrailOverrides} GuardrailOverrides instance
	                 */
	                GuardrailOverrides.create = function create(properties) {
	                    return new GuardrailOverrides(properties);
	                };

	                /**
	                 * Encodes the specified GuardrailOverrides message. Does not implicitly {@link perfetto.protos.TraceConfig.GuardrailOverrides.verify|verify} messages.
	                 * @function encode
	                 * @memberof perfetto.protos.TraceConfig.GuardrailOverrides
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.IGuardrailOverrides} message GuardrailOverrides message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                GuardrailOverrides.encode = function encode(message, writer) {
	                    if (!writer)
	                        writer = $Writer.create();
	                    if (message.maxUploadPerDayBytes != null && message.hasOwnProperty("maxUploadPerDayBytes"))
	                        writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.maxUploadPerDayBytes);
	                    return writer;
	                };

	                /**
	                 * Encodes the specified GuardrailOverrides message, length delimited. Does not implicitly {@link perfetto.protos.TraceConfig.GuardrailOverrides.verify|verify} messages.
	                 * @function encodeDelimited
	                 * @memberof perfetto.protos.TraceConfig.GuardrailOverrides
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.IGuardrailOverrides} message GuardrailOverrides message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                GuardrailOverrides.encodeDelimited = function encodeDelimited(message, writer) {
	                    return this.encode(message, writer).ldelim();
	                };

	                /**
	                 * Decodes a GuardrailOverrides message from the specified reader or buffer.
	                 * @function decode
	                 * @memberof perfetto.protos.TraceConfig.GuardrailOverrides
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @param {number} [length] Message length if known beforehand
	                 * @returns {perfetto.protos.TraceConfig.GuardrailOverrides} GuardrailOverrides
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                GuardrailOverrides.decode = function decode(reader, length) {
	                    if (!(reader instanceof $Reader))
	                        reader = $Reader.create(reader);
	                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.TraceConfig.GuardrailOverrides();
	                    while (reader.pos < end) {
	                        var tag = reader.uint32();
	                        switch (tag >>> 3) {
	                        case 1:
	                            message.maxUploadPerDayBytes = reader.uint64();
	                            break;
	                        default:
	                            reader.skipType(tag & 7);
	                            break;
	                        }
	                    }
	                    return message;
	                };

	                /**
	                 * Decodes a GuardrailOverrides message from the specified reader or buffer, length delimited.
	                 * @function decodeDelimited
	                 * @memberof perfetto.protos.TraceConfig.GuardrailOverrides
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @returns {perfetto.protos.TraceConfig.GuardrailOverrides} GuardrailOverrides
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                GuardrailOverrides.decodeDelimited = function decodeDelimited(reader) {
	                    if (!(reader instanceof $Reader))
	                        reader = new $Reader(reader);
	                    return this.decode(reader, reader.uint32());
	                };

	                /**
	                 * Verifies a GuardrailOverrides message.
	                 * @function verify
	                 * @memberof perfetto.protos.TraceConfig.GuardrailOverrides
	                 * @static
	                 * @param {Object.<string,*>} message Plain object to verify
	                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
	                 */
	                GuardrailOverrides.verify = function verify(message) {
	                    if (typeof message !== "object" || message === null)
	                        return "object expected";
	                    if (message.maxUploadPerDayBytes != null && message.hasOwnProperty("maxUploadPerDayBytes"))
	                        if (!$util.isInteger(message.maxUploadPerDayBytes) && !(message.maxUploadPerDayBytes && $util.isInteger(message.maxUploadPerDayBytes.low) && $util.isInteger(message.maxUploadPerDayBytes.high)))
	                            return "maxUploadPerDayBytes: integer|Long expected";
	                    return null;
	                };

	                /**
	                 * Creates a GuardrailOverrides message from a plain object. Also converts values to their respective internal types.
	                 * @function fromObject
	                 * @memberof perfetto.protos.TraceConfig.GuardrailOverrides
	                 * @static
	                 * @param {Object.<string,*>} object Plain object
	                 * @returns {perfetto.protos.TraceConfig.GuardrailOverrides} GuardrailOverrides
	                 */
	                GuardrailOverrides.fromObject = function fromObject(object) {
	                    if (object instanceof $root.perfetto.protos.TraceConfig.GuardrailOverrides)
	                        return object;
	                    var message = new $root.perfetto.protos.TraceConfig.GuardrailOverrides();
	                    if (object.maxUploadPerDayBytes != null)
	                        if ($util.Long)
	                            (message.maxUploadPerDayBytes = $util.Long.fromValue(object.maxUploadPerDayBytes)).unsigned = true;
	                        else if (typeof object.maxUploadPerDayBytes === "string")
	                            message.maxUploadPerDayBytes = parseInt(object.maxUploadPerDayBytes, 10);
	                        else if (typeof object.maxUploadPerDayBytes === "number")
	                            message.maxUploadPerDayBytes = object.maxUploadPerDayBytes;
	                        else if (typeof object.maxUploadPerDayBytes === "object")
	                            message.maxUploadPerDayBytes = new $util.LongBits(object.maxUploadPerDayBytes.low >>> 0, object.maxUploadPerDayBytes.high >>> 0).toNumber(true);
	                    return message;
	                };

	                /**
	                 * Creates a plain object from a GuardrailOverrides message. Also converts values to other types if specified.
	                 * @function toObject
	                 * @memberof perfetto.protos.TraceConfig.GuardrailOverrides
	                 * @static
	                 * @param {perfetto.protos.TraceConfig.GuardrailOverrides} message GuardrailOverrides
	                 * @param {$protobuf.IConversionOptions} [options] Conversion options
	                 * @returns {Object.<string,*>} Plain object
	                 */
	                GuardrailOverrides.toObject = function toObject(message, options) {
	                    if (!options)
	                        options = {};
	                    var object = {};
	                    if (options.defaults)
	                        if ($util.Long) {
	                            var long = new $util.Long(0, 0, true);
	                            object.maxUploadPerDayBytes = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
	                        } else
	                            object.maxUploadPerDayBytes = options.longs === String ? "0" : 0;
	                    if (message.maxUploadPerDayBytes != null && message.hasOwnProperty("maxUploadPerDayBytes"))
	                        if (typeof message.maxUploadPerDayBytes === "number")
	                            object.maxUploadPerDayBytes = options.longs === String ? String(message.maxUploadPerDayBytes) : message.maxUploadPerDayBytes;
	                        else
	                            object.maxUploadPerDayBytes = options.longs === String ? $util.Long.prototype.toString.call(message.maxUploadPerDayBytes) : options.longs === Number ? new $util.LongBits(message.maxUploadPerDayBytes.low >>> 0, message.maxUploadPerDayBytes.high >>> 0).toNumber(true) : message.maxUploadPerDayBytes;
	                    return object;
	                };

	                /**
	                 * Converts this GuardrailOverrides to JSON.
	                 * @function toJSON
	                 * @memberof perfetto.protos.TraceConfig.GuardrailOverrides
	                 * @instance
	                 * @returns {Object.<string,*>} JSON object
	                 */
	                GuardrailOverrides.prototype.toJSON = function toJSON() {
	                    return this.constructor.toObject(this, minimal$1.util.toJSONOptions);
	                };

	                return GuardrailOverrides;
	            })();

	            return TraceConfig;
	        })();

	        return protos;
	    })();

	    return perfetto;
	})();

	var protos = $root;

	var protos_1 = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });

	// Aliases protos to avoid the super nested namespaces.
	// See https://www.typescriptlang.org/docs/handbook/namespaces.html#aliases
	var TraceConfig = protos.perfetto.protos.TraceConfig;
	exports.TraceConfig = TraceConfig;
	var TraceProcessor = protos.perfetto.protos.TraceProcessor;
	exports.TraceProcessor = TraceProcessor;
	var RawQueryArgs = protos.perfetto.protos.RawQueryArgs;
	exports.RawQueryArgs = RawQueryArgs;
	var RawQueryResult = protos.perfetto.protos.RawQueryResult;
	exports.RawQueryResult = RawQueryResult;
	function getCell(result, column, row) {
	    const values = result.columns[column];
	    switch (result.columnDescriptors[column].type) {
	        case RawQueryResult.ColumnDesc.Type.LONG:
	            return +values.longValues[row];
	        case RawQueryResult.ColumnDesc.Type.DOUBLE:
	            return +values.doubleValues[row];
	        case RawQueryResult.ColumnDesc.Type.STRING:
	            return values.stringValues[row];
	        default:
	            throw new Error('Unhandled type!');
	    }
	}
	function rawQueryResultColumns(result) {
	    return result.columnDescriptors.map(d => d.name || '');
	}
	exports.rawQueryResultColumns = rawQueryResultColumns;
	function* rawQueryResultIter(result) {
	    const columns = rawQueryResultColumns(result).map((name, i) => [name, i]);
	    for (let rowNum = 0; rowNum < result.numRecords; rowNum++) {
	        const row = {};
	        for (const [name, colNum] of columns) {
	            row[name] = getCell(result, colNum, rowNum);
	        }
	        yield row;
	    }
	}
	exports.rawQueryResultIter = rawQueryResultIter;

	});

	unwrapExports(protos_1);
	var protos_2 = protos_1.TraceConfig;
	var protos_3 = protos_1.TraceProcessor;
	var protos_4 = protos_1.RawQueryArgs;
	var protos_5 = protos_1.RawQueryResult;
	var protos_6 = protos_1.rawQueryResultColumns;
	var protos_7 = protos_1.rawQueryResultIter;

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	/* global Reflect, Promise */

	var extendStatics = function(d, b) {
	    extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return extendStatics(d, b);
	};

	function __extends(d, b) {
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	var __assign = function() {
	    __assign = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};

	function __rest(s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
	            t[p[i]] = s[p[i]];
	    return t;
	}

	function __decorate(decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	}

	function __param(paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	}

	function __metadata(metadataKey, metadataValue) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
	}

	function __awaiter(thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	}

	function __generator(thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	}

	function __exportStar(m, exports) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}

	function __values(o) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
	    if (m) return m.call(o);
	    return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	}

	function __read(o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	}

	function __spread() {
	    for (var ar = [], i = 0; i < arguments.length; i++)
	        ar = ar.concat(__read(arguments[i]));
	    return ar;
	}

	function __await(v) {
	    return this instanceof __await ? (this.v = v, this) : new __await(v);
	}

	function __asyncGenerator(thisArg, _arguments, generator) {
	    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	    var g = generator.apply(thisArg, _arguments || []), i, q = [];
	    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
	    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
	    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
	    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
	    function fulfill(value) { resume("next", value); }
	    function reject(value) { resume("throw", value); }
	    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
	}

	function __asyncDelegator(o) {
	    var i, p;
	    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
	    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
	}

	function __asyncValues(o) {
	    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	    var m = o[Symbol.asyncIterator], i;
	    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
	    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
	    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
	}

	function __makeTemplateObject(cooked, raw) {
	    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
	    return cooked;
	}
	function __importStar(mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
	    result.default = mod;
	    return result;
	}

	function __importDefault(mod) {
	    return (mod && mod.__esModule) ? mod : { default: mod };
	}

	var tslib_es6 = /*#__PURE__*/Object.freeze({
		__extends: __extends,
		get __assign () { return __assign; },
		__rest: __rest,
		__decorate: __decorate,
		__param: __param,
		__metadata: __metadata,
		__awaiter: __awaiter,
		__generator: __generator,
		__exportStar: __exportStar,
		__values: __values,
		__read: __read,
		__spread: __spread,
		__await: __await,
		__asyncGenerator: __asyncGenerator,
		__asyncDelegator: __asyncDelegator,
		__asyncValues: __asyncValues,
		__makeTemplateObject: __makeTemplateObject,
		__importStar: __importStar,
		__importDefault: __importDefault
	});

	var engine = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });


	/**
	 * Abstract interface of a trace proccessor.
	 * This class is wrapper for multiple proto services defined in:
	 * //protos/perfetto/trace_processor/*
	 * For each service ("FooService") Engine will have abstract getter
	 * ("fooService") which returns a protobufjs rpc.Service object for
	 * the given service.
	 *
	 * Engine also defines helpers for the most common service methods
	 * (e.g. rawQuery).
	 */
	class Engine {
	    /**
	     * Send a raw SQL query to the engine.
	     */
	    rawQuery(args) {
	        return this.rpc.rawQuery(args);
	    }
	    rawQueryOneRow(sqlQuery) {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            const result = yield this.rawQuery({ sqlQuery });
	            const res = [];
	            result.columns.map(c => res.push(+c.longValues[0]));
	            return res;
	        });
	    }
	    // TODO(hjd): Maybe we should cache result? But then Engine must be
	    // streaming aware.
	    getNumberOfCpus() {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            const result = yield this.rawQuery({
	                sqlQuery: 'select count(distinct(cpu)) as cpuCount from sched;',
	            });
	            return +result.columns[0].longValues[0];
	        });
	    }
	    // TODO: This should live in code that's more specific to chrome, instead of
	    // in engine.
	    getNumberOfProcesses() {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            const result = yield this.rawQuery({
	                sqlQuery: 'select count(distinct(upid)) from thread;',
	            });
	            return +result.columns[0].longValues[0];
	        });
	    }
	    getTraceTimeBounds() {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            const maxQuery = 'select max(ts) from (select max(ts) as ts from sched ' +
	                'union all select max(ts) as ts from slices)';
	            const minQuery = 'select min(ts) from (select min(ts) as ts from sched ' +
	                'union all select min(ts) as ts from slices)';
	            const start = (yield this.rawQueryOneRow(minQuery))[0];
	            const end = (yield this.rawQueryOneRow(maxQuery))[0];
	            return new time.TimeSpan(start / 1e9, end / 1e9);
	        });
	    }
	}
	exports.Engine = Engine;

	});

	unwrapExports(engine);
	var engine_1 = engine.Engine;

	var wasm_engine_proxy = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });



	const activeWorkers = new Map();
	let warmWorker = null;
	function createWorker() {
	    const channel = new MessageChannel();
	    const worker = new Worker('engine_bundle.js');
	    // tslint:disable-next-line deprecation
	    worker.postMessage(channel.port1, [channel.port1]);
	    return { worker, port: channel.port2 };
	}
	// Take the warm engine and start creating a new WASM engine in the background
	// for the next call.
	function createWasmEngine(id) {
	    if (warmWorker === null) {
	        throw new Error('warmupWasmEngine() not called');
	    }
	    if (activeWorkers.has(id)) {
	        throw new Error(`Duplicate worker ID ${id}`);
	    }
	    const activeWorker = warmWorker;
	    warmWorker = createWorker();
	    activeWorkers.set(id, activeWorker);
	    return activeWorker.port;
	}
	exports.createWasmEngine = createWasmEngine;
	function destroyWasmEngine(id) {
	    if (!activeWorkers.has(id)) {
	        throw new Error(`Cannot find worker ID ${id}`);
	    }
	    activeWorkers.get(id).worker.terminate();
	    activeWorkers.delete(id);
	}
	exports.destroyWasmEngine = destroyWasmEngine;
	/**
	 * It's quite slow to compile WASM and (in Chrome) this happens every time
	 * a worker thread attempts to load a WASM module since there is no way to
	 * cache the compiled code currently. To mitigate this we can always keep a
	 * WASM backend 'ready to go' just waiting to be provided with a trace file.
	 * warmupWasmEngineWorker (together with getWasmEngineWorker)
	 * implement this behaviour.
	 */
	function warmupWasmEngine() {
	    if (warmWorker !== null) {
	        throw new Error('warmupWasmEngine() already called');
	    }
	    warmWorker = createWorker();
	}
	exports.warmupWasmEngine = warmupWasmEngine;
	/**
	 * This implementation of Engine uses a WASM backend hosted in a seperate
	 * worker thread.
	 */
	class WasmEngineProxy extends engine.Engine {
	    static create(args) {
	        return new WasmEngineProxy(args);
	    }
	    constructor(args) {
	        super();
	        this.nextRequestId = 0;
	        this.pendingCallbacks = new Map();
	        this.port = args.port;
	        this.id = args.id;
	        this.port.onmessage = this.onMessage.bind(this);
	        this.traceProcessor_ =
	            protos_1.TraceProcessor.create(this.rpcImpl.bind(this, 'trace_processor'));
	    }
	    get rpc() {
	        return this.traceProcessor_;
	    }
	    parse(data) {
	        const id = this.nextRequestId++;
	        const request = { id, serviceName: 'trace_processor', methodName: 'parse', data };
	        const promise = deferred.defer();
	        this.pendingCallbacks.set(id, () => promise.resolve());
	        this.port.postMessage(request);
	        return promise;
	    }
	    notifyEof() {
	        const id = this.nextRequestId++;
	        const data = Uint8Array.from([]);
	        const request = { id, serviceName: 'trace_processor', methodName: 'notifyEof', data };
	        const promise = deferred.defer();
	        this.pendingCallbacks.set(id, () => promise.resolve());
	        this.port.postMessage(request);
	        return promise;
	    }
	    onMessage(m) {
	        const response = m.data;
	        const callback = this.pendingCallbacks.get(response.id);
	        if (callback === undefined) {
	            throw new Error(`No such request: ${response.id}`);
	        }
	        this.pendingCallbacks.delete(response.id);
	        callback(null, response.data);
	    }
	    rpcImpl(serviceName, method, requestData, callback) {
	        const methodName = method.name;
	        const id = this.nextRequestId++;
	        this.pendingCallbacks.set(id, callback);
	        const request = {
	            id,
	            serviceName,
	            methodName,
	            data: requestData,
	        };
	        this.port.postMessage(request);
	    }
	}
	exports.WasmEngineProxy = WasmEngineProxy;

	});

	unwrapExports(wasm_engine_proxy);
	var wasm_engine_proxy_1 = wasm_engine_proxy.createWasmEngine;
	var wasm_engine_proxy_2 = wasm_engine_proxy.destroyWasmEngine;
	var wasm_engine_proxy_3 = wasm_engine_proxy.warmupWasmEngine;
	var wasm_engine_proxy_4 = wasm_engine_proxy.WasmEngineProxy;

	var sidebar = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });



	const EXAMPLE_TRACE_URL = 'https://storage.googleapis.com/perfetto-misc/example_trace_30s';
	const SECTIONS = [
	    {
	        title: 'Traces',
	        summary: 'Open or record a trace',
	        expanded: true,
	        items: [
	            { t: 'Open trace file', a: popupFileSelectionDialog, i: 'folder_open' },
	            { t: 'Open example trace', a: handleOpenTraceUrl, i: 'description' },
	            { t: 'Record new trace', a: navigateHome, i: 'fiber_smart_record' },
	            { t: 'Share current trace', a: dispatchCreatePermalink, i: 'share' },
	        ],
	    },
	    {
	        title: 'Workspaces',
	        summary: 'Custom and pre-arranged views',
	        items: [
	            { t: 'Big Picture', a: navigateHome, i: 'art_track' },
	            { t: 'Apps and process', a: navigateHome, i: 'apps' },
	            { t: 'Storage and I/O', a: navigateHome, i: 'storage' },
	            { t: 'Add custom...', a: navigateHome, i: 'library_add' },
	        ],
	    },
	    {
	        title: 'Tracks and views',
	        summary: 'Add new tracks to the workspace',
	        items: [
	            { t: 'User interactions', a: navigateHome, i: 'touch_app' },
	            { t: 'Device info', a: navigateHome, i: 'perm_device_information' },
	            { t: 'Scheduler trace', a: navigateHome, i: 'blur_linear' },
	            { t: 'Process list', a: navigateHome, i: 'equalizer' },
	            { t: 'Battery and power', a: navigateHome, i: 'battery_alert' },
	        ],
	    },
	    {
	        title: 'Metrics and auditors',
	        summary: 'Add new tracks to the workspace',
	        items: [
	            { t: 'CPU Usage breakdown', a: navigateHome, i: 'table_chart' },
	            { t: 'Memory breakdown', a: navigateHome, i: 'memory' },
	        ],
	    },
	];
	function popupFileSelectionDialog(e) {
	    e.preventDefault();
	    document.querySelector('input[type=file]').click();
	}
	function handleOpenTraceUrl(e) {
	    e.preventDefault();
	    globals.globals.dispatch(actions.openTraceFromUrl(EXAMPLE_TRACE_URL));
	}
	function onInputElementFileSelectionChanged(e) {
	    if (!(e.target instanceof HTMLInputElement)) {
	        throw new Error('Not an input element');
	    }
	    if (!e.target.files)
	        return;
	    globals.globals.dispatch(actions.openTraceFromFile(e.target.files[0]));
	}
	function navigateHome(_) {
	    globals.globals.dispatch(actions.navigate('/'));
	}
	function dispatchCreatePermalink(e) {
	    e.preventDefault();
	    globals.globals.dispatch(actions.createPermalink());
	}
	exports.Sidebar = {
	    view() {
	        const vdomSections = [];
	        for (const section of SECTIONS) {
	            const vdomItems = [];
	            for (const item of section.items) {
	                vdomItems.push(mithril('li', mithril(`a[href=#]`, { onclick: item.a }, mithril('i.material-icons', item.i), item.t)));
	            }
	            vdomSections.push(mithril(`section${section.expanded ? '.expanded' : ''}`, mithril('.section-header', {
	                onclick: () => {
	                    section.expanded = !section.expanded;
	                    globals.globals.rafScheduler.scheduleFullRedraw();
	                }
	            }, mithril('h1', section.title), mithril('h2', section.summary)), mithril('.section-content', mithril('ul', vdomItems))));
	        }
	        return mithril('nav.sidebar', mithril('header', 'Perfetto'), mithril('input[type=file]', { onchange: onInputElementFileSelectionChanged }), ...vdomSections);
	    },
	};

	});

	unwrapExports(sidebar);
	var sidebar_1 = sidebar.Sidebar;

	var topbar = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });



	const QUERY_ID = 'quicksearch';
	let selResult = 0;
	let numResults = 0;
	let mode = 'search';
	function clearOmniboxResults() {
	    globals.globals.queryResults.delete(QUERY_ID);
	    globals.globals.dispatch(actions.deleteQuery(QUERY_ID));
	}
	function onKeyDown(e) {
	    e.stopPropagation();
	    const key = e.key;
	    // Avoid that the global 'a', 'd', 'w', 's' handler sees these keystrokes.
	    // TODO: this seems a bug in the pan_and_zoom_handler.ts.
	    if (key === 'ArrowUp' || key === 'ArrowDown') {
	        e.preventDefault();
	        return;
	    }
	    const txt = e.target;
	    if (key === ':' && txt.value === '') {
	        mode = 'command';
	        globals.globals.rafScheduler.scheduleFullRedraw();
	        e.preventDefault();
	        return;
	    }
	    if (key === 'Escape' && mode === 'command') {
	        txt.value = '';
	        mode = 'search';
	        globals.globals.rafScheduler.scheduleFullRedraw();
	        return;
	    }
	    if (key === 'Backspace' && txt.value.length === 0 && mode === 'command') {
	        mode = 'search';
	        globals.globals.rafScheduler.scheduleFullRedraw();
	        return;
	    }
	}
	function onKeyUp(e) {
	    e.stopPropagation();
	    const key = e.key;
	    const txt = e.target;
	    if (key === 'ArrowUp' || key === 'ArrowDown') {
	        selResult += (key === 'ArrowUp') ? -1 : 1;
	        selResult = Math.max(selResult, 0);
	        selResult = Math.min(selResult, numResults - 1);
	        e.preventDefault();
	        globals.globals.rafScheduler.scheduleFullRedraw();
	        return;
	    }
	    if (txt.value.length <= 0 || key === 'Escape') {
	        clearOmniboxResults();
	        globals.globals.rafScheduler.scheduleFullRedraw();
	        return;
	    }
	    if (mode === 'search') {
	        const name = txt.value.replace(/'/g, '\\\'').replace(/[*]/g, '%');
	        const query = `select str from strings where str like '%${name}%' limit 10`;
	        globals.globals.dispatch(actions.executeQuery('0', QUERY_ID, query));
	    }
	    if (mode === 'command' && key === 'Enter') {
	        globals.globals.dispatch(actions.executeQuery('0', 'command', txt.value));
	    }
	}
	const Omnibox = {
	    oncreate(vnode) {
	        const txt = vnode.dom.querySelector('input');
	        txt.addEventListener('blur', clearOmniboxResults);
	        txt.addEventListener('keydown', onKeyDown);
	        txt.addEventListener('keyup', onKeyUp);
	    },
	    view() {
	        const msgTTL = globals.globals.state.status.timestamp + 3 - Date.now() / 1e3;
	        let enginesAreBusy = false;
	        for (const engine of Object.values(globals.globals.state.engines)) {
	            enginesAreBusy = enginesAreBusy || !engine.ready;
	        }
	        if (msgTTL > 0 || enginesAreBusy) {
	            setTimeout(() => globals.globals.rafScheduler.scheduleFullRedraw(), msgTTL * 1000);
	            return mithril(`.omnibox.message-mode`, mithril(`input[placeholder=${globals.globals.state.status.msg}][readonly]`));
	        }
	        // TODO(primiano): handle query results here.
	        const results = [];
	        const resp = globals.globals.queryResults.get(QUERY_ID);
	        if (resp !== undefined) {
	            numResults = resp.rows ? resp.rows.length : 0;
	            for (let i = 0; i < resp.rows.length; i++) {
	                const clazz = (i === selResult) ? '.selected' : '';
	                results.push(mithril(`div${clazz}`, resp.rows[i][resp.columns[0]]));
	            }
	        }
	        const placeholder = {
	            search: 'Search or type : to enter command mode',
	            command: 'e.g., select * from sched left join thread using(utid) limit 10'
	        };
	        const commandMode = mode === 'command';
	        return mithril(`.omnibox${commandMode ? '.command-mode' : ''}`, mithril(`input[placeholder=${placeholder[mode]}]`), mithril('.omnibox-results', results));
	    },
	};
	exports.Topbar = {
	    view() {
	        const progBar = [];
	        const engine = globals.globals.state.engines['0'];
	        if (globals.globals.state.queries[QUERY_ID] !== undefined ||
	            (engine !== undefined && !engine.ready)) {
	            progBar.push(mithril('.progress'));
	        }
	        return mithril('.topbar', mithril(Omnibox), ...progBar);
	    },
	};

	});

	unwrapExports(topbar);
	var topbar_1 = topbar.Topbar;

	var pages = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });




	function renderPermalink() {
	    if (!globals.globals.state.permalink.requestId)
	        return null;
	    const hash = globals.globals.state.permalink.hash;
	    const url = `${self.location.origin}#!/?s=${hash}`;
	    return mithril('.alert-permalink', hash ? ['Permalink: ', mithril(`a[href=${url}]`, url)] : 'Uploading...');
	}
	const Alerts = {
	    view() {
	        return mithril('.alerts', renderPermalink());
	    },
	};
	/**
	 * Wrap component with common UI elements (nav bar etc).
	 */
	function createPage(component) {
	    const pageComponent = {
	        view() {
	            return [
	                mithril(sidebar.Sidebar),
	                mithril(topbar.Topbar),
	                mithril(component),
	                mithril(Alerts),
	            ];
	        },
	    };
	    return pageComponent;
	}
	exports.createPage = createPage;

	});

	unwrapExports(pages);
	var pages_1 = pages.createPage;

	var home_page = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });


	exports.HomePage = pages.createPage({
	    view() {
	        return mithril('.page.home-page', mithril('.home-page-title', 'Perfetto'), mithril('img.logo[src=assets/logo-3d.png]'));
	    },
	});

	});

	unwrapExports(home_page);
	var home_page_1 = home_page.HomePage;

	var router = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });


	exports.ROUTE_PREFIX = '#!';
	class Router {
	    constructor(defaultRoute, routes, dispatch) {
	        this.defaultRoute = defaultRoute;
	        this.routes = routes;
	        this.dispatch = dispatch;
	        if (!(defaultRoute in routes)) {
	            throw Error('routes must define a component for defaultRoute.');
	        }
	        window.onhashchange = () => this.navigateToCurrentHash();
	    }
	    /**
	     * Parses and returns the current route string from |window.location.hash|.
	     * May return routes that are not defined in |this.routes|.
	     */
	    getRouteFromHash() {
	        const prefixLength = exports.ROUTE_PREFIX.length;
	        const hash = window.location.hash;
	        // Do not try to parse route if prefix doesn't match.
	        if (hash.substring(0, prefixLength) !== exports.ROUTE_PREFIX)
	            return '';
	        return hash.split('?')[0].substring(prefixLength);
	    }
	    /**
	     * Sets |route| on |window.location.hash|. If |route| if not defined in
	     * |this.routes|, dispatches a navigation to |this.defaultRoute|.
	     */
	    setRouteOnHash(route) {
	        history.pushState(undefined, undefined, exports.ROUTE_PREFIX + route);
	        if (!(route in this.routes)) {
	            // Redirect to default route.
	            this.dispatch(actions.navigate(this.defaultRoute));
	        }
	    }
	    /**
	     * Dispatches navigation action to |this.getRouteFromHash()| if that is
	     * defined in |this.routes|, otherwise to |this.defaultRoute|.
	     */
	    navigateToCurrentHash() {
	        const hashRoute = this.getRouteFromHash();
	        const newRoute = hashRoute in this.routes ? hashRoute : this.defaultRoute;
	        this.dispatch(actions.navigate(newRoute));
	        // TODO(dproy): Handle case when new route has a permalink.
	    }
	    /**
	     * Returns the component for given |route|. If |route| is not defined, returns
	     * component of |this.defaultRoute|.
	     */
	    resolve(route) {
	        if (!route || !(route in this.routes)) {
	            return this.routes[this.defaultRoute];
	        }
	        return this.routes[route];
	    }
	    param(key) {
	        const hash = window.location.hash;
	        const paramStart = hash.indexOf('?');
	        if (paramStart === -1)
	            return undefined;
	        return mithril.parseQueryString(hash.substring(paramStart))[key];
	    }
	}
	exports.Router = Router;

	});

	unwrapExports(router);
	var router_1 = router.ROUTE_PREFIX;
	var router_2 = router.Router;

	var panel = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });
	class Panel {
	}
	exports.Panel = Panel;
	function isPanelVNode(vnode) {
	    const tag = vnode.tag;
	    return (typeof tag === 'function' && 'prototype' in tag &&
	        tag.prototype instanceof Panel);
	}
	exports.isPanelVNode = isPanelVNode;

	});

	unwrapExports(panel);
	var panel_1 = panel.Panel;
	var panel_2 = panel.isPanelVNode;

	var flame_graph_panel = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });


	class FlameGraphPanel extends panel.Panel {
	    renderCanvas() { }
	    view() {
	        return [
	            mithril('header', 'Flame Graph'),
	            mithril('embed.flame-graph-panel', { type: 'image/svg+xml', src: '/assets/flamegraph.svg' })
	        ];
	    }
	}
	exports.FlameGraphPanel = FlameGraphPanel;

	});

	unwrapExports(flame_graph_panel);
	var flame_graph_panel_1 = flame_graph_panel.FlameGraphPanel;

	var header_panel = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });


	class HeaderPanel extends panel.Panel {
	    renderCanvas() { }
	    view({ attrs }) {
	        return mithril('header', attrs.title);
	    }
	}
	exports.HeaderPanel = HeaderPanel;

	});

	unwrapExports(header_panel);
	var header_panel_1 = header_panel.HeaderPanel;

	var drag_gesture_handler = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });
	class DragGestureHandler {
	    constructor(element, onDrag, onDragStarted = () => { }, onDragFinished = () => { }) {
	        this.element = element;
	        this.onDrag = onDrag;
	        this.onDragStarted = onDragStarted;
	        this.onDragFinished = onDragFinished;
	        this.boundOnMouseDown = this.onMouseDown.bind(this);
	        this.boundOnMouseMove = this.onMouseMove.bind(this);
	        this.boundOnMouseUp = this.onMouseUp.bind(this);
	        element.addEventListener('mousedown', this.boundOnMouseDown);
	    }
	    onMouseDown(e) {
	        document.body.addEventListener('mousemove', this.boundOnMouseMove);
	        document.body.addEventListener('mouseup', this.boundOnMouseUp);
	        this.clientRect = this.element.getBoundingClientRect();
	        this.onDragStarted(e.clientX - this.clientRect.left, e.clientY - this.clientRect.top);
	        // Prevent interactions with other DragGestureHandlers and event listeners
	        e.stopPropagation();
	    }
	    onMouseMove(e) {
	        this.onDrag(e.clientX - this.clientRect.left, e.clientY - this.clientRect.top);
	        e.stopPropagation();
	    }
	    onMouseUp(e) {
	        document.body.removeEventListener('mousemove', this.boundOnMouseMove);
	        document.body.removeEventListener('mouseup', this.boundOnMouseUp);
	        this.onDragFinished();
	        e.stopPropagation();
	    }
	}
	exports.DragGestureHandler = DragGestureHandler;

	});

	unwrapExports(drag_gesture_handler);
	var drag_gesture_handler_1 = drag_gesture_handler.DragGestureHandler;

	var overview_timeline_panel = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });







	class OverviewTimelinePanel extends panel.Panel {
	    constructor() {
	        super(...arguments);
	        this.width = 0;
	        this.dragStartPx = 0;
	        this.totTime = new time.TimeSpan(0, 0);
	    }
	    // Must explicitly type now; arguments types are no longer auto-inferred.
	    // https://github.com/Microsoft/TypeScript/issues/1373
	    onupdate({ dom }) {
	        this.width = dom.getBoundingClientRect().width;
	        this.totTime = new time.TimeSpan(globals.globals.state.traceTime.startSec, globals.globals.state.traceTime.endSec);
	        this.timeScale = new time_scale.TimeScale(this.totTime, [0, logging.assertExists(this.width)]);
	        if (this.gesture === undefined) {
	            this.gesture = new drag_gesture_handler.DragGestureHandler(dom, this.onDrag.bind(this), this.onDragStart.bind(this), this.onDragEnd.bind(this));
	        }
	    }
	    oncreate(vnode) {
	        this.onupdate(vnode);
	    }
	    view() {
	        return mithril('.overview-timeline');
	    }
	    renderCanvas(ctx, size) {
	        if (this.width === undefined)
	            return;
	        if (this.timeScale === undefined)
	            return;
	        const headerHeight = 25;
	        const tracksHeight = size.height - headerHeight;
	        // Draw time labels on the top header.
	        ctx.font = '10px Google Sans';
	        ctx.fillStyle = '#999';
	        for (let i = 0; i < 100; i++) {
	            const xPos = i * this.width / 100;
	            const t = this.timeScale.pxToTime(xPos);
	            if (xPos < 0)
	                continue;
	            if (xPos > this.width)
	                break;
	            if (i % 10 === 0) {
	                ctx.fillRect(xPos, 0, 1, headerHeight - 5);
	                ctx.fillText(time.timeToString(t - this.totTime.start), xPos + 5, 18);
	            }
	            else {
	                ctx.fillRect(xPos, 0, 1, 5);
	            }
	        }
	        // Draw mini-tracks with quanitzed density for each process.
	        if (globals.globals.overviewStore.size > 0) {
	            const numTracks = globals.globals.overviewStore.size;
	            let hue = 128;
	            let y = 0;
	            const trackHeight = (tracksHeight - 2) / numTracks;
	            for (const key of globals.globals.overviewStore.keys()) {
	                const loads = globals.globals.overviewStore.get(key);
	                for (let i = 0; i < loads.length; i++) {
	                    const xStart = this.timeScale.timeToPx(loads[i].startSec);
	                    const xEnd = this.timeScale.timeToPx(loads[i].endSec);
	                    const yOff = headerHeight + y * trackHeight;
	                    const lightness = Math.ceil((1 - loads[i].load * 0.7) * 100);
	                    ctx.fillStyle = `hsl(${hue}, 50%, ${lightness}%)`;
	                    ctx.fillRect(xStart, yOff, xEnd - xStart, trackHeight);
	                }
	                y++;
	                hue = (hue + 32) % 256;
	            }
	        }
	        // Draw bottom border.
	        ctx.fillStyle = 'hsl(219, 40%, 50%)';
	        ctx.fillRect(0, size.height - 2, this.width, 2);
	        // Draw semi-opaque rects that occlude the non-visible time range.
	        const vizTime = globals.globals.frontendLocalState.visibleWindowTime;
	        const vizStartPx = this.timeScale.timeToPx(vizTime.start);
	        const vizEndPx = this.timeScale.timeToPx(vizTime.end);
	        ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
	        ctx.fillRect(0, headerHeight, vizStartPx, tracksHeight);
	        ctx.fillRect(vizEndPx, headerHeight, this.width - vizEndPx, tracksHeight);
	        // Draw brushes.
	        const handleWidth = 3;
	        const handleHeight = 25;
	        const y = headerHeight + (tracksHeight - handleHeight) / 2;
	        ctx.fillStyle = '#333';
	        ctx.fillRect(vizStartPx, headerHeight, 1, tracksHeight);
	        ctx.fillRect(vizEndPx, headerHeight, 1, tracksHeight);
	        ctx.fillRect(vizStartPx - handleWidth, y, handleWidth, handleHeight);
	        ctx.fillRect(vizEndPx + 1, y, handleWidth, handleHeight);
	    }
	    onDrag(x) {
	        // Set visible time limits from selection.
	        if (this.timeScale === undefined)
	            return;
	        let tStart = this.timeScale.pxToTime(this.dragStartPx);
	        let tEnd = this.timeScale.pxToTime(x);
	        if (tStart > tEnd)
	            [tStart, tEnd] = [tEnd, tStart];
	        const vizTime = new time.TimeSpan(tStart, tEnd);
	        globals.globals.frontendLocalState.updateVisibleTime(vizTime);
	        globals.globals.rafScheduler.scheduleRedraw();
	    }
	    onDragStart(x) {
	        this.dragStartPx = x;
	    }
	    onDragEnd() {
	        this.dragStartPx = 0;
	    }
	}
	exports.OverviewTimelinePanel = OverviewTimelinePanel;

	});

	unwrapExports(overview_timeline_panel);
	var overview_timeline_panel_1 = overview_timeline_panel.OverviewTimelinePanel;

	var animation = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	class Animation {
	    constructor(onAnimationStep) {
	        this.onAnimationStep = onAnimationStep;
	        this.startMs = 0;
	        this.endMs = 0;
	        this.boundOnAnimationFrame = this.onAnimationFrame.bind(this);
	    }
	    start(durationMs) {
	        const nowMs = performance.now();
	        // If the animation is already happening, just update its end time.
	        if (nowMs <= this.endMs) {
	            this.endMs = nowMs + durationMs;
	            return;
	        }
	        this.startMs = nowMs;
	        this.endMs = nowMs + durationMs;
	        globals.globals.rafScheduler.start(this.boundOnAnimationFrame);
	    }
	    stop() {
	        this.endMs = 0;
	        globals.globals.rafScheduler.stop(this.boundOnAnimationFrame);
	    }
	    get startTimeMs() {
	        return this.startMs;
	    }
	    onAnimationFrame(nowMs) {
	        if (nowMs >= this.endMs) {
	            globals.globals.rafScheduler.stop(this.boundOnAnimationFrame);
	            return;
	        }
	        this.onAnimationStep(Math.max(Math.round(nowMs - this.startMs), 0));
	    }
	}
	exports.Animation = Animation;

	});

	unwrapExports(animation);
	var animation_1 = animation.Animation;

	var pan_and_zoom_handler = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });



	const ZOOM_RATIO_PER_FRAME = 0.008;
	const KEYBOARD_PAN_PX_PER_FRAME = 8;
	const HORIZONTAL_WHEEL_PAN_SPEED = 1;
	const WHEEL_ZOOM_SPEED = -0.02;
	// Usually, animations are cancelled on keyup. However, in case the keyup
	// event is not captured by the document, e.g. if it loses focus first, then
	// we want to stop the animation as soon as possible.
	const ANIMATION_AUTO_END_AFTER_INITIAL_KEYPRESS_MS = 700;
	const ANIMATION_AUTO_END_AFTER_KEYPRESS_MS = 80;
	// This defines the step size for an individual pan or zoom keyboard tap.
	const TAP_ANIMATION_TIME = 200;
	var Pan;
	(function (Pan) {
	    Pan[Pan["None"] = 0] = "None";
	    Pan[Pan["Left"] = -1] = "Left";
	    Pan[Pan["Right"] = 1] = "Right";
	})(Pan || (Pan = {}));
	function keyToPan(e) {
	    if (['a'].includes(e.key))
	        return Pan.Left;
	    if (['d'].includes(e.key))
	        return Pan.Right;
	    return Pan.None;
	}
	var Zoom;
	(function (Zoom) {
	    Zoom[Zoom["None"] = 0] = "None";
	    Zoom[Zoom["In"] = 1] = "In";
	    Zoom[Zoom["Out"] = -1] = "Out";
	})(Zoom || (Zoom = {}));
	function keyToZoom(e) {
	    if (['w'].includes(e.key))
	        return Zoom.In;
	    if (['s'].includes(e.key))
	        return Zoom.Out;
	    return Zoom.None;
	}
	/**
	 * Enables horizontal pan and zoom with mouse-based drag and WASD navigation.
	 */
	class PanAndZoomHandler {
	    constructor({ element, contentOffsetX, onPanned, onZoomed }) {
	        this.mousePositionX = null;
	        this.boundOnMouseMove = this.onMouseMove.bind(this);
	        this.boundOnWheel = this.onWheel.bind(this);
	        this.boundOnKeyDown = this.onKeyDown.bind(this);
	        this.boundOnKeyUp = this.onKeyUp.bind(this);
	        this.panning = Pan.None;
	        this.zooming = Zoom.None;
	        this.panAnimation = new animation.Animation(this.onPanAnimationStep.bind(this));
	        this.zoomAnimation = new animation.Animation(this.onZoomAnimationStep.bind(this));
	        this.element = element;
	        this.contentOffsetX = contentOffsetX;
	        this.onPanned = onPanned;
	        this.onZoomed = onZoomed;
	        document.body.addEventListener('keydown', this.boundOnKeyDown);
	        document.body.addEventListener('keyup', this.boundOnKeyUp);
	        this.element.addEventListener('mousemove', this.boundOnMouseMove);
	        this.element.addEventListener('wheel', this.boundOnWheel, { passive: true });
	        let lastX = -1;
	        new drag_gesture_handler.DragGestureHandler(this.element, x => {
	            this.onPanned(lastX - x);
	            lastX = x;
	        }, x => lastX = x);
	    }
	    shutdown() {
	        document.body.removeEventListener('keydown', this.boundOnKeyDown);
	        document.body.removeEventListener('keyup', this.boundOnKeyUp);
	        this.element.removeEventListener('mousemove', this.boundOnMouseMove);
	        this.element.removeEventListener('wheel', this.boundOnWheel);
	    }
	    onPanAnimationStep(msSinceStartOfAnimation) {
	        if (this.panning === Pan.None)
	            return;
	        let offset = this.panning * KEYBOARD_PAN_PX_PER_FRAME;
	        offset *= Math.max(msSinceStartOfAnimation / 40, 1);
	        this.onPanned(offset);
	    }
	    onZoomAnimationStep(msSinceStartOfAnimation) {
	        if (this.zooming === Zoom.None || this.mousePositionX === null)
	            return;
	        let zoomRatio = this.zooming * ZOOM_RATIO_PER_FRAME;
	        zoomRatio *= Math.max(msSinceStartOfAnimation / 40, 1);
	        this.onZoomed(this.mousePositionX, zoomRatio);
	    }
	    onMouseMove(e) {
	        this.mousePositionX = e.clientX - this.contentOffsetX;
	    }
	    onWheel(e) {
	        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
	            this.onPanned(e.deltaX * HORIZONTAL_WHEEL_PAN_SPEED);
	            globals.globals.rafScheduler.scheduleRedraw();
	        }
	        else if (e.ctrlKey && this.mousePositionX) {
	            const sign = e.deltaY < 0 ? -1 : 1;
	            const deltaY = sign * Math.log2(1 + Math.abs(e.deltaY));
	            this.onZoomed(this.mousePositionX, deltaY * WHEEL_ZOOM_SPEED);
	            globals.globals.rafScheduler.scheduleRedraw();
	        }
	    }
	    onKeyDown(e) {
	        if (keyToPan(e) !== Pan.None) {
	            this.panning = keyToPan(e);
	            const animationTime = e.repeat ?
	                ANIMATION_AUTO_END_AFTER_KEYPRESS_MS :
	                ANIMATION_AUTO_END_AFTER_INITIAL_KEYPRESS_MS;
	            this.panAnimation.start(animationTime);
	            clearTimeout(this.cancelPanTimeout);
	        }
	        if (keyToZoom(e) !== Zoom.None) {
	            this.zooming = keyToZoom(e);
	            const animationTime = e.repeat ?
	                ANIMATION_AUTO_END_AFTER_KEYPRESS_MS :
	                ANIMATION_AUTO_END_AFTER_INITIAL_KEYPRESS_MS;
	            this.zoomAnimation.start(animationTime);
	            clearTimeout(this.cancelZoomTimeout);
	        }
	    }
	    onKeyUp(e) {
	        if (keyToPan(e) === this.panning) {
	            const minEndTime = this.panAnimation.startTimeMs + TAP_ANIMATION_TIME;
	            const t = minEndTime - performance.now();
	            this.cancelPanTimeout = setTimeout(() => this.panAnimation.stop(), t);
	        }
	        if (keyToZoom(e) === this.zooming) {
	            const minEndTime = this.zoomAnimation.startTimeMs + TAP_ANIMATION_TIME;
	            const t = minEndTime - performance.now();
	            this.cancelZoomTimeout = setTimeout(() => this.zoomAnimation.stop(), t);
	        }
	    }
	}
	exports.PanAndZoomHandler = PanAndZoomHandler;

	});

	unwrapExports(pan_and_zoom_handler);
	var pan_and_zoom_handler_1 = pan_and_zoom_handler.PanAndZoomHandler;

	var panel_container = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });




	/**
	 * If the panel container scrolls, the backing canvas height is
	 * SCROLLING_CANVAS_OVERDRAW_FACTOR * parent container height.
	 */
	const SCROLLING_CANVAS_OVERDRAW_FACTOR = 2;
	class PanelContainer {
	    constructor(vnode) {
	        // These values are updated with proper values in oncreate.
	        this.parentWidth = 0;
	        this.parentHeight = 0;
	        this.scrollTop = 0;
	        this.panelHeights = [];
	        this.totalPanelHeight = 0;
	        this.canvasHeight = 0;
	        this.onResize = () => { };
	        this.parentOnScroll = () => { };
	        this.canvasOverdrawFactor =
	            vnode.attrs.doesScroll ? SCROLLING_CANVAS_OVERDRAW_FACTOR : 1;
	        this.canvasRedrawer = () => this.redrawCanvas();
	        globals.globals.rafScheduler.addRedrawCallback(this.canvasRedrawer);
	    }
	    oncreate(vnodeDom) {
	        const attrs = vnodeDom.attrs;
	        // Save the canvas context in the state.
	        const canvas = vnodeDom.dom.querySelector('.main-canvas');
	        const ctx = canvas.getContext('2d');
	        if (!ctx) {
	            throw Error('Cannot create canvas context');
	        }
	        this.ctx = ctx;
	        const clientRect = logging.assertExists(vnodeDom.dom.parentElement).getBoundingClientRect();
	        this.parentWidth = clientRect.width;
	        this.parentHeight = clientRect.height;
	        this.updatePanelHeightsFromDom(vnodeDom);
	        vnodeDom.dom.style.height = `${this.totalPanelHeight}px`;
	        this.canvasHeight = this.getCanvasHeight(attrs.doesScroll);
	        this.updateCanvasDimensions(vnodeDom);
	        // Save the resize handler in the state so we can remove it later.
	        // TODO: Encapsulate resize handling better.
	        this.onResize = () => {
	            const clientRect = logging.assertExists(vnodeDom.dom.parentElement).getBoundingClientRect();
	            this.parentWidth = clientRect.width;
	            this.parentHeight = clientRect.height;
	            this.canvasHeight = this.getCanvasHeight(attrs.doesScroll);
	            this.updateCanvasDimensions(vnodeDom);
	            globals.globals.rafScheduler.scheduleFullRedraw();
	        };
	        // Once ResizeObservers are out, we can stop accessing the window here.
	        window.addEventListener('resize', this.onResize);
	        // TODO(dproy): Handle change in doesScroll attribute.
	        if (vnodeDom.attrs.doesScroll) {
	            this.parentOnScroll = () => {
	                this.scrollTop = vnodeDom.dom.parentElement.scrollTop;
	                this.repositionCanvas(vnodeDom);
	                globals.globals.rafScheduler.scheduleRedraw();
	            };
	            vnodeDom.dom.parentElement.addEventListener('scroll', this.parentOnScroll, { passive: true });
	        }
	    }
	    onremove({ attrs, dom }) {
	        window.removeEventListener('resize', this.onResize);
	        globals.globals.rafScheduler.removeRedrawCallback(this.canvasRedrawer);
	        if (attrs.doesScroll) {
	            dom.parentElement.removeEventListener('scroll', this.parentOnScroll);
	        }
	    }
	    view({ attrs }) {
	        // We receive a new vnode object with new attrs on every mithril redraw. We
	        // store the latest attrs so redrawCanvas can use it.
	        this.attrs = attrs;
	        return mithril('.scroll-limiter', mithril('canvas.main-canvas'), attrs.panels.map(panel$$1 => mithril('.panel', panel$$1)));
	    }
	    onupdate(vnodeDom) {
	        this.repositionCanvas(vnodeDom);
	        if (this.updatePanelHeightsFromDom(vnodeDom)) {
	            vnodeDom.dom.style.height = `${this.totalPanelHeight}px`;
	        }
	        // In non-scrolling case, canvas height can change if panel heights changed.
	        const canvasHeight = this.getCanvasHeight(vnodeDom.attrs.doesScroll);
	        if (this.canvasHeight !== canvasHeight) {
	            this.canvasHeight = canvasHeight;
	            this.updateCanvasDimensions(vnodeDom);
	        }
	    }
	    updateCanvasDimensions(vnodeDom) {
	        const canvas = logging.assertExists(vnodeDom.dom.querySelector('canvas.main-canvas'));
	        const ctx = logging.assertExists(this.ctx);
	        canvas.style.height = `${this.canvasHeight}px`;
	        const dpr = window.devicePixelRatio;
	        ctx.canvas.width = this.parentWidth * dpr;
	        ctx.canvas.height = this.canvasHeight * dpr;
	        ctx.scale(dpr, dpr);
	    }
	    updatePanelHeightsFromDom(vnodeDom) {
	        const prevHeight = this.totalPanelHeight;
	        this.panelHeights = [];
	        this.totalPanelHeight = 0;
	        const panels = vnodeDom.dom.querySelectorAll('.panel');
	        logging.assertTrue(panels.length === vnodeDom.attrs.panels.length);
	        for (let i = 0; i < panels.length; i++) {
	            const height = panels[i].getBoundingClientRect().height;
	            this.panelHeights[i] = height;
	            this.totalPanelHeight += height;
	        }
	        return this.totalPanelHeight !== prevHeight;
	    }
	    getCanvasHeight(doesScroll) {
	        return doesScroll ? this.parentHeight * this.canvasOverdrawFactor :
	            this.totalPanelHeight;
	    }
	    repositionCanvas(vnodeDom) {
	        const canvas = logging.assertExists(vnodeDom.dom.querySelector('canvas.main-canvas'));
	        const canvasYStart = this.scrollTop - this.getCanvasOverdrawHeightPerSide();
	        canvas.style.transform = `translateY(${canvasYStart}px)`;
	    }
	    overlapsCanvas(yStart, yEnd) {
	        return yEnd > 0 && yStart < this.canvasHeight;
	    }
	    redrawCanvas() {
	        if (!this.ctx)
	            return;
	        this.ctx.clearRect(0, 0, this.parentWidth, this.canvasHeight);
	        const canvasYStart = this.scrollTop - this.getCanvasOverdrawHeightPerSide();
	        let panelYStart = 0;
	        const panels = logging.assertExists(this.attrs).panels;
	        logging.assertTrue(panels.length === this.panelHeights.length);
	        for (let i = 0; i < panels.length; i++) {
	            const panel$$1 = panels[i];
	            const panelHeight = this.panelHeights[i];
	            const yStartOnCanvas = panelYStart - canvasYStart;
	            if (!this.overlapsCanvas(yStartOnCanvas, yStartOnCanvas + panelHeight)) {
	                panelYStart += panelHeight;
	                continue;
	            }
	            if (!panel.isPanelVNode(panel$$1)) {
	                throw Error('Vnode passed to panel container is not a panel');
	            }
	            this.ctx.save();
	            this.ctx.translate(0, yStartOnCanvas);
	            const clipRect = new Path2D();
	            const size = { width: this.parentWidth, height: panelHeight };
	            clipRect.rect(0, 0, size.width, size.height);
	            this.ctx.clip(clipRect);
	            panel$$1.state.renderCanvas(this.ctx, size, panel$$1);
	            this.ctx.restore();
	            panelYStart += panelHeight;
	        }
	    }
	    getCanvasOverdrawHeightPerSide() {
	        const overdrawHeight = (this.canvasOverdrawFactor - 1) * this.parentHeight;
	        return overdrawHeight / 2;
	    }
	}
	exports.PanelContainer = PanelContainer;

	});

	unwrapExports(panel_container);
	var panel_container_1 = panel_container.PanelContainer;

	var gridline_helper = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DESIRED_PX_PER_STEP = 80;
	function drawGridLines(ctx, x, timeSpan, height) {
	    const width = x.deltaTimeToPx(timeSpan.duration);
	    const desiredSteps = width / exports.DESIRED_PX_PER_STEP;
	    const step = getGridStepSize(timeSpan.duration, desiredSteps);
	    const start = Math.round(timeSpan.start / step) * step;
	    ctx.strokeStyle = '#999999';
	    ctx.lineWidth = 1;
	    for (let sec = start; sec < timeSpan.end; sec += step) {
	        const xPos = Math.floor(x.timeToPx(sec)) + 0.5;
	        if (xPos >= 0 && xPos <= width) {
	            ctx.beginPath();
	            ctx.moveTo(xPos, 0);
	            ctx.lineTo(xPos, height);
	            ctx.stroke();
	        }
	    }
	}
	exports.drawGridLines = drawGridLines;
	/**
	 * Returns the step size of a grid line in seconds.
	 * The returned step size has two properties:
	 * (1) It is 1, 2, or 5, multiplied by some integer power of 10.
	 * (2) The number steps in |range| produced by |stepSize| is as close as
	 *     possible to |desiredSteps|.
	 */
	function getGridStepSize(range, desiredSteps) {
	    // First, get the largest possible power of 10 that is smaller than the
	    // desired step size, and set it to the current step size.
	    // For example, if the range is 2345ms and the desired steps is 10, then the
	    // desired step size is 234.5 and the step size will be set to 100.
	    const desiredStepSize = range / desiredSteps;
	    const zeros = Math.floor(Math.log10(desiredStepSize));
	    const initialStepSize = Math.pow(10, zeros);
	    // This function first calculates how many steps within the range a certain
	    // stepSize will produce, and returns the difference between that and
	    // desiredSteps.
	    const distToDesired = (evaluatedStepSize) => Math.abs(range / evaluatedStepSize - desiredSteps);
	    // We know that |initialStepSize| is a power of 10, and
	    // initialStepSize <= desiredStepSize <= 10 * initialStepSize. There are four
	    // possible candidates for final step size: 1, 2, 5 or 10 * initialStepSize.
	    // We pick the candidate that minimizes distToDesired(stepSize).
	    const stepSizeMultipliers = [2, 5, 10];
	    let minimalDistance = distToDesired(initialStepSize);
	    let minimizingStepSize = initialStepSize;
	    for (const multiplier of stepSizeMultipliers) {
	        const newStepSize = multiplier * initialStepSize;
	        const newDistance = distToDesired(newStepSize);
	        if (newDistance < minimalDistance) {
	            minimalDistance = newDistance;
	            minimizingStepSize = newStepSize;
	        }
	    }
	    return minimizingStepSize;
	}
	exports.getGridStepSize = getGridStepSize;

	});

	unwrapExports(gridline_helper);
	var gridline_helper_1 = gridline_helper.DESIRED_PX_PER_STEP;
	var gridline_helper_2 = gridline_helper.drawGridLines;
	var gridline_helper_3 = gridline_helper.getGridStepSize;

	var track_panel = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });






	// TODO(hjd): We should remove the constant where possible.
	// If any uses can't be removed we should read this constant from CSS.
	exports.TRACK_SHELL_WIDTH = 300;
	const TrackShell = {
	    view({ attrs }) {
	        return mithril('.track-shell', mithril('h1', attrs.trackState.name), mithril(TrackMoveButton, {
	            direction: 'up',
	            trackId: attrs.trackState.id,
	        }), mithril(TrackMoveButton, {
	            direction: 'down',
	            trackId: attrs.trackState.id,
	        }));
	    },
	};
	const TrackContent = {
	    view({ attrs }) {
	        return mithril('.track-content', {
	            onmousemove: (e) => {
	                attrs.track.onMouseMove({ x: e.layerX, y: e.layerY });
	                globals.globals.rafScheduler.scheduleRedraw();
	            },
	            onmouseout: () => {
	                attrs.track.onMouseOut();
	                globals.globals.rafScheduler.scheduleRedraw();
	            },
	        });
	    }
	};
	const TrackComponent = {
	    view({ attrs }) {
	        return mithril('.track', [
	            mithril(TrackShell, { trackState: attrs.trackState }),
	            mithril(TrackContent, { track: attrs.track })
	        ]);
	    }
	};
	const TrackMoveButton = {
	    view({ attrs }) {
	        return mithril('i.material-icons.track-move-icons', {
	            onclick: () => globals.globals.dispatch(actions.moveTrack(attrs.trackId, attrs.direction)),
	        }, attrs.direction === 'up' ? 'arrow_upward_alt' : 'arrow_downward_alt');
	    }
	};
	class TrackPanel extends panel.Panel {
	    constructor(vnode) {
	        super();
	        this.trackState = globals.globals.state.tracks[vnode.attrs.id];
	        const trackCreator = track_registry.trackRegistry.get(this.trackState.kind);
	        this.track = trackCreator.create(this.trackState);
	    }
	    view() {
	        return mithril('.track', {
	            style: {
	                height: `${this.track.getHeight()}px`,
	            }
	        }, [
	            mithril(TrackShell, { trackState: this.trackState }),
	            mithril(TrackContent, { track: this.track })
	        ]);
	        return mithril(TrackComponent, { trackState: this.trackState, track: this.track });
	    }
	    renderCanvas(ctx, size) {
	        ctx.translate(exports.TRACK_SHELL_WIDTH, 0);
	        gridline_helper.drawGridLines(ctx, globals.globals.frontendLocalState.timeScale, globals.globals.frontendLocalState.visibleWindowTime, size.height);
	        this.track.renderCanvas(ctx);
	    }
	}
	exports.TrackPanel = TrackPanel;

	});

	unwrapExports(track_panel);
	var track_panel_1 = track_panel.TRACK_SHELL_WIDTH;
	var track_panel_2 = track_panel.TrackPanel;

	var time_axis_panel = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use size file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });






	class TimeAxisPanel extends panel.Panel {
	    view() {
	        return mithril('.time-axis-panel');
	    }
	    renderCanvas(ctx, size) {
	        const timeScale = globals.globals.frontendLocalState.timeScale;
	        ctx.font = '10px Google Sans';
	        ctx.fillStyle = '#999';
	        const range = globals.globals.frontendLocalState.visibleWindowTime;
	        const desiredSteps = size.width / gridline_helper.DESIRED_PX_PER_STEP;
	        const step = gridline_helper.getGridStepSize(range.duration, desiredSteps);
	        const start = Math.round(range.start / step) * step;
	        for (let s = start; s < range.end; s += step) {
	            let xPos = track_panel.TRACK_SHELL_WIDTH;
	            xPos += Math.floor(timeScale.timeToPx(s));
	            if (xPos < 0)
	                continue;
	            if (xPos > size.width)
	                break;
	            ctx.fillRect(xPos, 0, 1, size.height);
	            ctx.fillText(time.timeToString(s - range.start), xPos + 5, 10);
	        }
	    }
	}
	exports.TimeAxisPanel = TimeAxisPanel;

	});

	unwrapExports(time_axis_panel);
	var time_axis_panel_1 = time_axis_panel.TimeAxisPanel;

	var viewer_page = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });











	const track_panel_2 = track_panel;
	const MAX_ZOOM_SPAN_SEC = 1e-4; // 0.1 ms.
	const QueryTable = {
	    view() {
	        const resp = globals.globals.queryResults.get('command');
	        if (resp === undefined) {
	            return mithril('');
	        }
	        const cols = [];
	        for (const col of resp.columns) {
	            cols.push(mithril('td', col));
	        }
	        const header = mithril('tr', cols);
	        const rows = [];
	        for (let i = 0; i < resp.rows.length; i++) {
	            const cells = [];
	            for (const col of resp.columns) {
	                cells.push(mithril('td', resp.rows[i][col]));
	            }
	            rows.push(mithril('tr', cells));
	        }
	        return mithril('div', mithril('header.overview', `Query result - ${Math.round(resp.durationMs)} ms`, mithril('span.code', resp.query)), resp.error ?
	            mithril('.query-error', `SQL error: ${resp.error}`) :
	            mithril('table.query-table', mithril('thead', header), mithril('tbody', rows)));
	    },
	};
	/**
	 * Top-most level component for the viewer page. Holds tracks, brush timeline,
	 * panels, and everything else that's part of the main trace viewer page.
	 */
	const TraceViewer = {
	    oninit() {
	        this.width = 0;
	    },
	    oncreate(vnode) {
	        const frontendLocalState = globals.globals.frontendLocalState;
	        const updateDimensions = () => {
	            const rect = vnode.dom.getBoundingClientRect();
	            this.width = rect.width;
	            frontendLocalState.timeScale.setLimitsPx(0, this.width - track_panel.TRACK_SHELL_WIDTH);
	        };
	        updateDimensions();
	        // TODO: Do resize handling better.
	        this.onResize = () => {
	            updateDimensions();
	            globals.globals.rafScheduler.scheduleFullRedraw();
	        };
	        // Once ResizeObservers are out, we can stop accessing the window here.
	        window.addEventListener('resize', this.onResize);
	        const panZoomEl = vnode.dom.querySelector('.pan-and-zoom-content');
	        this.zoomContent = new pan_and_zoom_handler.PanAndZoomHandler({
	            element: panZoomEl,
	            contentOffsetX: track_panel.TRACK_SHELL_WIDTH,
	            onPanned: (pannedPx) => {
	                const traceTime = globals.globals.state.traceTime;
	                const vizTime = globals.globals.frontendLocalState.visibleWindowTime;
	                const origDelta = vizTime.duration;
	                const tDelta = frontendLocalState.timeScale.deltaPxToDuration(pannedPx);
	                let tStart = vizTime.start + tDelta;
	                let tEnd = vizTime.end + tDelta;
	                if (tStart < traceTime.startSec) {
	                    tStart = traceTime.startSec;
	                    tEnd = tStart + origDelta;
	                }
	                else if (tEnd > traceTime.endSec) {
	                    tEnd = traceTime.endSec;
	                    tStart = tEnd - origDelta;
	                }
	                frontendLocalState.updateVisibleTime(new time.TimeSpan(tStart, tEnd));
	            },
	            onZoomed: (_, zoomRatio) => {
	                const vizTime = frontendLocalState.visibleWindowTime;
	                const curSpanSec = vizTime.duration;
	                const newSpanSec = Math.max(curSpanSec - curSpanSec * zoomRatio, MAX_ZOOM_SPAN_SEC);
	                const deltaSec = (curSpanSec - newSpanSec) / 2;
	                const newStartSec = vizTime.start + deltaSec;
	                const newEndSec = vizTime.end - deltaSec;
	                frontendLocalState.updateVisibleTime(new time.TimeSpan(newStartSec, newEndSec));
	            }
	        });
	    },
	    onremove() {
	        window.removeEventListener('resize', this.onResize);
	        this.zoomContent.shutdown();
	    },
	    view() {
	        const scrollingPanels = globals.globals.state.displayedTrackIds.length > 0 ?
	            [
	                mithril(header_panel.HeaderPanel, { title: 'Tracks' }),
	                ...globals.globals.state.displayedTrackIds.map(id => mithril(track_panel_2.TrackPanel, { id })),
	                mithril(flame_graph_panel.FlameGraphPanel),
	            ] :
	            [];
	        return mithril('.page', mithril(QueryTable), 
	        // TODO: Pan and zoom logic should be in its own mithril component.
	        mithril('.pan-and-zoom-content', mithril('.pinned-panel-container', mithril(panel_container.PanelContainer, {
	            doesScroll: false,
	            panels: [
	                mithril(overview_timeline_panel.OverviewTimelinePanel),
	                mithril(time_axis_panel.TimeAxisPanel),
	            ],
	        })), mithril('.scrolling-panel-container', mithril(panel_container.PanelContainer, {
	            doesScroll: true,
	            panels: scrollingPanels,
	        }))));
	    },
	};
	exports.ViewerPage = pages.createPage({
	    view() {
	        return mithril(TraceViewer);
	    }
	});

	});

	unwrapExports(viewer_page);
	var viewer_page_1 = viewer_page.ViewerPage;

	var frontend$6 = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });










	/**
	 * The API the main thread exposes to the controller.
	 */
	class FrontendApi {
	    constructor(router$$1) {
	        this.router = router$$1;
	    }
	    updateState(state) {
	        globals.globals.state = state;
	        // If the visible time in the global state has been updated more recently
	        // than the visible time handled by the frontend @ 60fps, update it. This
	        // typically happens when restoring the state from a permalink.
	        const vizTraceTime = globals.globals.state.visibleTraceTime;
	        if (vizTraceTime.lastUpdate >
	            globals.globals.frontendLocalState.visibleTimeLastUpdate) {
	            globals.globals.frontendLocalState.updateVisibleTime(new time.TimeSpan(vizTraceTime.startSec, vizTraceTime.endSec));
	        }
	        this.redraw();
	    }
	    // TODO: we can't have a publish method for each batch of data that we don't
	    // want to keep in the global state. Figure out a more generic and type-safe
	    // mechanism to achieve this.
	    publishOverviewData(data) {
	        for (const key of Object.keys(data)) {
	            if (!globals.globals.overviewStore.has(key)) {
	                globals.globals.overviewStore.set(key, []);
	            }
	            globals.globals.overviewStore.get(key).push(data[key]);
	        }
	        globals.globals.rafScheduler.scheduleRedraw();
	    }
	    publishTrackData(args) {
	        globals.globals.trackDataStore.set(args.id, args.data);
	        globals.globals.rafScheduler.scheduleRedraw();
	    }
	    publishQueryResult(args) {
	        globals.globals.queryResults.set(args.id, args.data);
	        this.redraw();
	    }
	    publishThreads(data) {
	        globals.globals.threads.clear();
	        data.forEach(thread => {
	            globals.globals.threads.set(thread.utid, thread);
	        });
	        this.redraw();
	    }
	    /**
	     * Creates a new trace processor wasm engine (backed by a worker running
	     * engine_bundle.js) and returns a MessagePort for talking to it.
	     * This indirection is due to workers not being able create workers in
	     * Chrome which is tracked at: crbug.com/31666
	     * TODO(hjd): Remove this once the fix has landed.
	     */
	    createEngine() {
	        const id = new Date().toUTCString();
	        return { id, port: wasm_engine_proxy.createWasmEngine(id) };
	    }
	    destroyEngine(id) {
	        wasm_engine_proxy.destroyWasmEngine(id);
	    }
	    redraw() {
	        if (globals.globals.state.route &&
	            globals.globals.state.route !== this.router.getRouteFromHash()) {
	            this.router.setRouteOnHash(globals.globals.state.route);
	        }
	        globals.globals.rafScheduler.scheduleFullRedraw();
	    }
	}
	function main() {
	    const controller = new Worker('controller_bundle.js');
	    controller.onerror = e => {
	        console.error(e);
	    };
	    const channel = new MessageChannel();
	    controller.postMessage(channel.port1, [channel.port1]);
	    const dispatch = controller.postMessage.bind(controller);
	    const router$$1 = new router.Router('/', {
	        '/': home_page.HomePage,
	        '/viewer': viewer_page.ViewerPage,
	    }, dispatch);
	    remote.forwardRemoteCalls(channel.port2, new FrontendApi(router$$1));
	    globals.globals.initialize(dispatch);
	    globals.globals.rafScheduler.domRedraw = () => mithril.render(document.body, mithril(router$$1.resolve(globals.globals.state.route)));
	    wasm_engine_proxy.warmupWasmEngine();
	    // Put these variables in the global scope for better debugging.
	    window.m = mithril;
	    window.globals = globals.globals;
	    // /?s=xxxx for permalinks.
	    const stateHash = router$$1.param('s');
	    if (stateHash) {
	        globals.globals.dispatch(actions.loadPermalink(stateHash));
	    }
	    // Prevent pinch zoom.
	    document.body.addEventListener('wheel', (e) => {
	        if (e.ctrlKey)
	            e.preventDefault();
	    });
	    router$$1.navigateToCurrentHash();
	}
	main();

	});

	var index = unwrapExports(frontend$6);

	return index;

}());
//# sourceMappingURL=frontend_bundle.js.map
