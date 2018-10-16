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
	exports.SCROLLING_TRACK_GROUP = 'ScrollingTracks';
	exports.defaultTraceTime = {
	    startSec: 0,
	    endSec: 10,
	    lastUpdate: 0
	};
	function createEmptyState() {
	    return {
	        route: null,
	        nextId: 0,
	        engines: {},
	        traceTime: Object.assign({}, exports.defaultTraceTime),
	        visibleTraceTime: Object.assign({}, exports.defaultTraceTime),
	        tracks: {},
	        trackGroups: {},
	        pinnedTracks: [],
	        scrollingTracks: [],
	        queries: {},
	        permalink: {},
	        recordConfig: createEmptyRecordConfig(),
	        status: { msg: '', timestamp: 0 },
	    };
	}
	exports.createEmptyState = createEmptyState;
	function createEmptyRecordConfig() {
	    return {
	        durationSeconds: 10.0,
	        bufferSizeMb: 10.0,
	        processMetadata: false,
	        scanAllProcessesOnStart: false,
	        ftrace: false,
	        ftraceEvents: [],
	        atraceApps: [],
	        atraceCategories: [],
	    };
	}
	exports.createEmptyRecordConfig = createEmptyRecordConfig;

	});

	unwrapExports(state);
	var state_1 = state.SCROLLING_TRACK_GROUP;
	var state_2 = state.defaultTraceTime;
	var state_3 = state.createEmptyState;
	var state_4 = state.createEmptyRecordConfig;

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


	function clearTraceState(state$$1) {
	    state$$1.traceTime = state.defaultTraceTime;
	    state$$1.visibleTraceTime = state.defaultTraceTime;
	    state$$1.pinnedTracks = [];
	    state$$1.scrollingTracks = [];
	}
	exports.StateActions = {
	    navigate(state$$1, args) {
	        state$$1.route = args.route;
	    },
	    openTraceFromFile(state$$1, args) {
	        clearTraceState(state$$1);
	        const id = `${state$$1.nextId++}`;
	        state$$1.engines[id] = {
	            id,
	            ready: false,
	            source: args.file,
	        };
	        state$$1.route = `/viewer`;
	    },
	    openTraceFromUrl(state$$1, args) {
	        clearTraceState(state$$1);
	        const id = `${state$$1.nextId++}`;
	        state$$1.engines[id] = {
	            id,
	            ready: false,
	            source: args.url,
	        };
	        state$$1.route = `/viewer`;
	    },
	    addTrack(state$$1, args) {
	        const id = args.id !== undefined ? args.id : `${state$$1.nextId++}`;
	        state$$1.tracks[id] = {
	            id,
	            engineId: args.engineId,
	            kind: args.kind,
	            name: args.name,
	            trackGroup: args.trackGroup,
	            config: args.config,
	        };
	        if (args.trackGroup === state.SCROLLING_TRACK_GROUP) {
	            state$$1.scrollingTracks.push(id);
	        }
	        else if (args.trackGroup !== undefined) {
	            logging.assertExists(state$$1.trackGroups[args.trackGroup]).tracks.push(id);
	        }
	    },
	    addTrackGroup(state$$1, 
	    // Define ID in action so a track group can be referred to without running
	    // the reducer.
	    args) {
	        state$$1.trackGroups[args.id] = Object.assign({}, args, { tracks: [] });
	    },
	    reqTrackData(state$$1, args) {
	        const id = args.trackId;
	        state$$1.tracks[id].dataReq = {
	            start: args.start,
	            end: args.end,
	            resolution: args.resolution
	        };
	    },
	    clearTrackDataReq(state$$1, args) {
	        const id = args.trackId;
	        state$$1.tracks[id].dataReq = undefined;
	    },
	    // TODO(dproy): Reduce duplication with reqTrackData.
	    reqTrackGroupData(state$$1, args) {
	        const id = args.trackGroupId;
	        state$$1.trackGroups[id].dataReq = {
	            start: args.start,
	            end: args.end,
	            resolution: args.resolution
	        };
	    },
	    // TODO(dproy): Reduce duplication with clearTrackDataReq.
	    clearTrackGroupDataReq(state$$1, args) {
	        const id = args.trackGroupId;
	        state$$1.trackGroups[id].dataReq = undefined;
	    },
	    executeQuery(state$$1, args) {
	        state$$1.queries[args.queryId] = {
	            id: args.queryId,
	            engineId: args.engineId,
	            query: args.query,
	        };
	    },
	    deleteQuery(state$$1, args) {
	        delete state$$1.queries[args.queryId];
	    },
	    moveTrack(state$$1, args) {
	        const id = args.trackId;
	        const isPinned = state$$1.pinnedTracks.includes(id);
	        const isScrolling = state$$1.scrollingTracks.includes(id);
	        if (!isScrolling && !isPinned) {
	            // TODO(dproy): Handle track moving within track groups.
	            return;
	        }
	        const tracks = isPinned ? state$$1.pinnedTracks : state$$1.scrollingTracks;
	        const oldIndex = tracks.indexOf(id);
	        const newIndex = args.direction === 'up' ? oldIndex - 1 : oldIndex + 1;
	        const swappedTrackId = tracks[newIndex];
	        if (isPinned && newIndex === state$$1.pinnedTracks.length) {
	            // Move from last element of pinned to first element of scrolling.
	            state$$1.scrollingTracks.unshift(state$$1.pinnedTracks.pop());
	        }
	        else if (isScrolling && newIndex === -1) {
	            // Move first element of scrolling to last element of pinned.
	            state$$1.pinnedTracks.push(state$$1.scrollingTracks.shift());
	        }
	        else if (swappedTrackId) {
	            tracks[newIndex] = id;
	            tracks[oldIndex] = swappedTrackId;
	        }
	    },
	    toggleTrackPinned(state$$1, args) {
	        const id = args.trackId;
	        const isPinned = state$$1.pinnedTracks.includes(id);
	        const trackGroup = logging.assertExists(state$$1.tracks[id]).trackGroup;
	        if (isPinned) {
	            state$$1.pinnedTracks.splice(state$$1.pinnedTracks.indexOf(id), 1);
	            if (trackGroup === undefined) {
	                state$$1.scrollingTracks.unshift(id);
	            }
	        }
	        else {
	            if (trackGroup === undefined) {
	                state$$1.scrollingTracks.splice(state$$1.scrollingTracks.indexOf(id), 1);
	            }
	            state$$1.pinnedTracks.push(id);
	        }
	    },
	    toggleTrackGroupCollapsed(state$$1, args) {
	        const id = args.trackGroupId;
	        const trackGroup = logging.assertExists(state$$1.trackGroups[id]);
	        trackGroup.collapsed = !trackGroup.collapsed;
	    },
	    setEngineReady(state$$1, args) {
	        state$$1.engines[args.engineId].ready = args.ready;
	    },
	    createPermalink(state$$1, args) {
	        state$$1.permalink = { requestId: args.requestId, hash: undefined };
	    },
	    setPermalink(state$$1, args) {
	        // Drop any links for old requests.
	        if (state$$1.permalink.requestId !== args.requestId)
	            return;
	        state$$1.permalink = args;
	    },
	    loadPermalink(state$$1, args) {
	        state$$1.permalink = args;
	    },
	    setTraceTime(state$$1, args) {
	        state$$1.traceTime = args;
	    },
	    setVisibleTraceTime(state$$1, args) {
	        state$$1.visibleTraceTime = args;
	    },
	    updateStatus(state$$1, args) {
	        state$$1.status = args;
	    },
	    // TODO(hjd): Remove setState - it causes problems due to reuse of ids.
	    setState(_state, _args) {
	        // This has to be handled at a higher level since we can't
	        // replace the whole tree here however we still need a method here
	        // so it appears on the proxy Actions class.
	        throw new Error('Called setState on StateActions.');
	    },
	    // TODO(hjd): Parametrize this to increase type safety. See comments on
	    // aosp/778194
	    setConfigControl(state$$1, args) {
	        const config = state$$1.recordConfig;
	        config[args.name] = args.value;
	    },
	    addConfigControl(state$$1, args) {
	        // tslint:disable-next-line no-any
	        const config = state$$1.recordConfig;
	        const options = config[args.name];
	        if (options.includes(args.option))
	            return;
	        options.push(args.option);
	    },
	    removeConfigControl(state$$1, args) {
	        // tslint:disable-next-line no-any
	        const config = state$$1.recordConfig;
	        const options = config[args.name];
	        const index = options.indexOf(args.option);
	        if (index === -1)
	            return;
	        options.splice(index, 1);
	    },
	};
	// Actions is an implementation of DeferredActions<typeof StateActions>.
	// (since StateActions is a variable not a type we have to do
	// 'typeof StateActions' to access the (unnamed) type of StateActions).
	// It's a Proxy such that any attribute access returns a function:
	// (args) => {return {type: ATTRIBUTE_NAME, args};}
	exports.Actions = 
	// tslint:disable-next-line no-any
	new Proxy({}, {
	    // tslint:disable-next-line no-any
	    get(_, prop, _2) {
	        return (args) => {
	            return {
	                type: prop,
	                args,
	            };
	        };
	    },
	});

	});

	unwrapExports(actions);
	var actions_1 = actions.StateActions;
	var actions_2 = actions.Actions;

	var checkerboard_1 = createCommonjsModule(function (module, exports) {
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
	// TODO(hjd): Dedupe these.
	const SLICE_HEIGHT = 30;
	const TRACK_PADDING = 5;
	/**
	 * Checker board the range [leftPx, rightPx].
	 */
	function checkerboard(ctx, leftPx, rightPx) {
	    const widthPx = rightPx - leftPx;
	    ctx.font = '12px Google Sans';
	    ctx.fillStyle = '#eee';
	    ctx.fillRect(leftPx, TRACK_PADDING, widthPx, SLICE_HEIGHT);
	    ctx.fillStyle = '#666';
	    ctx.fillText('loading...', leftPx + widthPx / 2, TRACK_PADDING + SLICE_HEIGHT / 2, widthPx);
	}
	exports.checkerboard = checkerboard;
	/**
	 * Checker board everything between [startPx, endPx] except [leftPx, rightPx].
	 */
	function checkerboardExcept(ctx, startPx, endPx, leftPx, rightPx) {
	    // [leftPx, rightPx] doesn't overlap [startPx, endPx] at all:
	    if (rightPx <= startPx || leftPx >= endPx) {
	        checkerboard(ctx, startPx, endPx);
	        return;
	    }
	    // Checkerboard [startPx, leftPx]:
	    if (leftPx > startPx) {
	        checkerboard(ctx, startPx, leftPx);
	    }
	    // Checkerboard [rightPx, endPx]:
	    if (rightPx < endPx) {
	        checkerboard(ctx, rightPx, endPx);
	    }
	}
	exports.checkerboardExcept = checkerboardExcept;

	});

	unwrapExports(checkerboard_1);
	var checkerboard_2 = checkerboard_1.checkerboard;
	var checkerboard_3 = checkerboard_1.checkerboardExcept;

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
	        this.perfDebug = false;
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
	            this._visibleTimeLastUpdate = Date.now() / 1000;
	            globals.globals.dispatch(actions.Actions.setVisibleTraceTime({
	                startSec: this.pendingGlobalTimeUpdate.start,
	                endSec: this.pendingGlobalTimeUpdate.end,
	                lastUpdate: this._visibleTimeLastUpdate,
	            }));
	            this.pendingGlobalTimeUpdate = undefined;
	        }, 100);
	    }
	    get visibleTimeLastUpdate() {
	        return this._visibleTimeLastUpdate;
	    }
	    togglePerfDebug() {
	        this.perfDebug = !this.perfDebug;
	        globals.globals.rafScheduler.scheduleFullRedraw();
	    }
	}
	exports.FrontendLocalState = FrontendLocalState;

	});

	unwrapExports(frontend_local_state);
	var frontend_local_state_1 = frontend_local_state.FrontendLocalState;

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

	var perf = createCommonjsModule(function (module, exports) {
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
	 * Shorthand for if globals perf debug mode is on.
	 */
	exports.perfDebug = () => globals.globals.frontendLocalState.perfDebug;
	/**
	 * Returns performance.now() if perfDebug is enabled, otherwise 0.
	 * This is needed because calling performance.now is generally expensive
	 * and should not be done for every frame.
	 */
	exports.debugNow = () => exports.perfDebug() ? performance.now() : 0;
	/**
	 * Returns execution time of |fn| if perf debug mode is on. Returns 0 otherwise.
	 */
	function measure(fn) {
	    const start = exports.debugNow();
	    fn();
	    return exports.debugNow() - start;
	}
	exports.measure = measure;
	/**
	 * Stores statistics about samples, and keeps a fixed size buffer of most recent
	 * samples.
	 */
	class RunningStatistics {
	    constructor(_maxBufferSize = 10) {
	        this._maxBufferSize = _maxBufferSize;
	        this._count = 0;
	        this._mean = 0;
	        this._lastValue = 0;
	        this.buffer = [];
	    }
	    addValue(value) {
	        this._lastValue = value;
	        this.buffer.push(value);
	        if (this.buffer.length > this._maxBufferSize) {
	            this.buffer.shift();
	        }
	        this._mean = (this._mean * this._count + value) / (this._count + 1);
	        this._count++;
	    }
	    get mean() {
	        return this._mean;
	    }
	    get count() {
	        return this._count;
	    }
	    get bufferMean() {
	        return this.buffer.reduce((sum, v) => sum + v, 0) / this.buffer.length;
	    }
	    get bufferSize() {
	        return this.buffer.length;
	    }
	    get maxBufferSize() {
	        return this._maxBufferSize;
	    }
	    get last() {
	        return this._lastValue;
	    }
	}
	exports.RunningStatistics = RunningStatistics;
	/**
	 * Returns a summary string representation of a RunningStatistics object.
	 */
	function runningStatStr(stat) {
	    return `Last: ${stat.last.toFixed(2)}ms | ` +
	        `Avg: ${stat.mean.toFixed(2)}ms | ` +
	        `Avg${stat.maxBufferSize}: ${stat.bufferMean.toFixed(2)}ms`;
	}
	exports.runningStatStr = runningStatStr;
	/**
	 * Globals singleton class that renders performance stats for the whole app.
	 */
	class PerfDisplay {
	    constructor() {
	        this.containers = [];
	    }
	    addContainer(container) {
	        this.containers.push(container);
	    }
	    removeContainer(container) {
	        const i = this.containers.indexOf(container);
	        this.containers.splice(i, 1);
	    }
	    renderPerfStats() {
	        if (!exports.perfDebug())
	            return;
	        const perfDisplayEl = this.getPerfDisplayEl();
	        if (!perfDisplayEl)
	            return;
	        mithril.render(perfDisplayEl, [
	            mithril('section', globals.globals.rafScheduler.renderPerfStats()),
	            this.containers.map((c, i) => mithril('section', c.renderPerfStats(i)))
	        ]);
	    }
	    getPerfDisplayEl() {
	        return document.querySelector('.perf-stats-content');
	    }
	}
	exports.perfDisplay = new PerfDisplay();

	});

	unwrapExports(perf);
	var perf_1 = perf.perfDebug;
	var perf_2 = perf.debugNow;
	var perf_3 = perf.measure;
	var perf_4 = perf.RunningStatistics;
	var perf_5 = perf.runningStatStr;
	var perf_6 = perf.perfDisplay;

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



	function statTableHeader() {
	    return mithril('tr', mithril('th', ''), mithril('th', 'Last (ms)'), mithril('th', 'Avg (ms)'), mithril('th', 'Avg-10 (ms)'));
	}
	function statTableRow(title, stat) {
	    return mithril('tr', mithril('td', title), mithril('td', stat.last.toFixed(2)), mithril('td', stat.mean.toFixed(2)), mithril('td', stat.bufferMean.toFixed(2)));
	}
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
	        this.perfStats = {
	            rafActions: new perf.RunningStatistics(),
	            rafCanvas: new perf.RunningStatistics(),
	            rafDom: new perf.RunningStatistics(),
	            rafTotal: new perf.RunningStatistics(),
	            domRedraw: new perf.RunningStatistics(),
	        };
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
	    syncDomRedraw(nowMs) {
	        const redrawStart = perf.debugNow();
	        this._syncDomRedraw(nowMs);
	        if (perf.perfDebug()) {
	            this.perfStats.domRedraw.addValue(perf.debugNow() - redrawStart);
	        }
	    }
	    syncCanvasRedraw(nowMs) {
	        const redrawStart = perf.debugNow();
	        if (this.isRedrawing)
	            return;
	        this.isRedrawing = true;
	        for (const redraw of this.canvasRedrawCallbacks)
	            redraw(nowMs);
	        this.isRedrawing = false;
	        if (perf.perfDebug()) {
	            this.perfStats.rafCanvas.addValue(perf.debugNow() - redrawStart);
	        }
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
	        const rafStart = perf.debugNow();
	        this.hasScheduledNextFrame = false;
	        const doFullRedraw = this.requestedFullRedraw;
	        this.requestedFullRedraw = false;
	        const actionTime = perf.measure(() => {
	            for (const action of this.actionCallbacks)
	                action(nowMs);
	        });
	        const domTime = perf.measure(() => {
	            if (doFullRedraw)
	                this.syncDomRedraw(nowMs);
	        });
	        const canvasTime = perf.measure(() => this.syncCanvasRedraw(nowMs));
	        const totalRafTime = perf.debugNow() - rafStart;
	        this.updatePerfStats(actionTime, domTime, canvasTime, totalRafTime);
	        perf.perfDisplay.renderPerfStats();
	        this.maybeScheduleAnimationFrame();
	    }
	    updatePerfStats(actionsTime, domTime, canvasTime, totalRafTime) {
	        if (!perf.perfDebug())
	            return;
	        this.perfStats.rafActions.addValue(actionsTime);
	        this.perfStats.rafDom.addValue(domTime);
	        this.perfStats.rafCanvas.addValue(canvasTime);
	        this.perfStats.rafTotal.addValue(totalRafTime);
	    }
	    renderPerfStats() {
	        logging.assertTrue(perf.perfDebug());
	        return mithril('div', mithril('div', [
	            mithril('button', { onclick: () => this.scheduleRedraw() }, 'Do Canvas Redraw'),
	            '   |   ',
	            mithril('button', { onclick: () => this.scheduleFullRedraw() }, 'Do Full Redraw'),
	        ]), mithril('div', 'Raf Timing ' +
	            '(Total may not add up due to imprecision)'), mithril('table', statTableHeader(), statTableRow('Actions', this.perfStats.rafActions), statTableRow('Dom', this.perfStats.rafDom), statTableRow('Canvas', this.perfStats.rafCanvas), statTableRow('Total', this.perfStats.rafTotal)), mithril('div', 'Dom redraw: ' +
	            `Count: ${this.perfStats.domRedraw.count} | ` +
	            perf.runningStatStr(this.perfStats.domRedraw)));
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
	        this._frontendLocalState = undefined;
	        this._rafScheduler = undefined;
	        // TODO(hjd): Unify trackDataStore, queryResults, overviewStore, threads.
	        this._trackDataStore = undefined;
	        this._queryResults = undefined;
	        this._overviewStore = undefined;
	        this._threadMap = undefined;
	    }
	    initialize(dispatch) {
	        this._dispatch = dispatch;
	        this._state = state.createEmptyState();
	        this._frontendLocalState = new frontend_local_state.FrontendLocalState();
	        this._rafScheduler = new raf_scheduler.RafScheduler();
	        // TODO(hjd): Unify trackDataStore, queryResults, overviewStore, threads.
	        this._trackDataStore = new Map();
	        this._queryResults = new Map();
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
	    get frontendLocalState() {
	        return logging.assertExists(this._frontendLocalState);
	    }
	    get rafScheduler() {
	        return logging.assertExists(this._rafScheduler);
	    }
	    // TODO(hjd): Unify trackDataStore, queryResults, overviewStore, threads.
	    get overviewStore() {
	        return logging.assertExists(this._overviewStore);
	    }
	    get trackDataStore() {
	        return logging.assertExists(this._trackDataStore);
	    }
	    get queryResults() {
	        return logging.assertExists(this._queryResults);
	    }
	    get threads() {
	        return logging.assertExists(this._threadMap);
	    }
	    resetForTesting() {
	        this._dispatch = undefined;
	        this._state = undefined;
	        this._frontendLocalState = undefined;
	        this._rafScheduler = undefined;
	        // TODO(hjd): Unify trackDataStore, queryResults, overviewStore, threads.
	        this._trackDataStore = undefined;
	        this._queryResults = undefined;
	        this._overviewStore = undefined;
	        this._threadMap = undefined;
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
	    constructor(trackState) {
	        this.trackState = trackState;
	    }
	    get config() {
	        return this.trackState.config;
	    }
	    data() {
	        return globals.globals.trackDataStore.get(this.trackState.id);
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
	exports.CPU_SLICE_TRACK_KIND = 'CpuSliceTrack';

	});

	unwrapExports(common);
	var common_1 = common.CPU_SLICE_TRACK_KIND;

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







	// 0.5 Makes the horizontal lines sharp.
	const MARGIN_TOP = 5.5;
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
	        // TODO: this needs to be kept in sync with the hue generation algorithm
	        // of overview_timeline_panel.ts
	        this.hue = (128 + (32 * this.config.cpu)) % 256;
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
	        globals.globals.dispatch(actions.Actions.reqTrackData({
	            trackId: this.trackState.id,
	            start: reqStart,
	            end: reqEnd,
	            resolution: reqRes
	        }));
	    }
	    renderCanvas(ctx) {
	        // TODO: fonts and colors should come from the CSS and not hardcoded here.
	        const { timeScale, visibleWindowTime } = globals.globals.frontendLocalState;
	        const data = this.data();
	        // If there aren't enough cached slices data in |data| request more to
	        // the controller.
	        const inRange = data !== undefined &&
	            (visibleWindowTime.start >= data.start &&
	                visibleWindowTime.end <= data.end);
	        if (!inRange || data === undefined ||
	            data.resolution !== getCurResolution()) {
	            if (!this.reqPending) {
	                this.reqPending = true;
	                setTimeout(() => this.reqDataDeferred(), 50);
	            }
	        }
	        if (data === undefined)
	            return; // Can't possibly draw anything.
	        // If the cached trace slices don't fully cover the visible time range,
	        // show a gray rectangle with a "Loading..." label.
	        checkerboard_1.checkerboardExcept(ctx, timeScale.timeToPx(visibleWindowTime.start), timeScale.timeToPx(visibleWindowTime.end), timeScale.timeToPx(data.start), timeScale.timeToPx(data.end));
	        if (data.kind === 'summary') {
	            this.renderSummary(ctx, data);
	        }
	        else if (data.kind === 'slice') {
	            this.renderSlices(ctx, data);
	        }
	    }
	    renderSummary(ctx, data) {
	        const { timeScale, visibleWindowTime } = globals.globals.frontendLocalState;
	        const startPx = Math.floor(timeScale.timeToPx(visibleWindowTime.start));
	        const bottomY = MARGIN_TOP + RECT_HEIGHT;
	        let lastX = startPx;
	        let lastY = bottomY;
	        ctx.fillStyle = `hsl(${this.hue}, 50%, 60%)`;
	        ctx.beginPath();
	        ctx.moveTo(lastX, lastY);
	        for (let i = 0; i < data.utilizations.length; i++) {
	            const utilization = data.utilizations[i];
	            const startTime = i * data.bucketSizeSeconds + data.start;
	            lastX = Math.floor(timeScale.timeToPx(startTime));
	            ctx.lineTo(lastX, lastY);
	            lastY = MARGIN_TOP + Math.round(RECT_HEIGHT * (1 - utilization));
	            ctx.lineTo(lastX, lastY);
	        }
	        ctx.lineTo(lastX, bottomY);
	        ctx.closePath();
	        ctx.fill();
	    }
	    renderSlices(ctx, data) {
	        const { timeScale, visibleWindowTime } = globals.globals.frontendLocalState;
	        logging.assertTrue(data.starts.length === data.ends.length);
	        logging.assertTrue(data.starts.length === data.utids.length);
	        ctx.textAlign = 'center';
	        ctx.font = '12px Google Sans';
	        const charWidth = ctx.measureText('dbpqaouk').width / 8;
	        for (let i = 0; i < data.starts.length; i++) {
	            const tStart = data.starts[i];
	            const tEnd = data.ends[i];
	            const utid = data.utids[i];
	            if (tEnd <= visibleWindowTime.start || tStart >= visibleWindowTime.end) {
	                continue;
	            }
	            const rectStart = timeScale.timeToPx(tStart);
	            const rectEnd = timeScale.timeToPx(tEnd);
	            const rectWidth = rectEnd - rectStart;
	            if (rectWidth < 0.1)
	                continue;
	            const hovered = this.hoveredUtid === utid;
	            ctx.fillStyle = `hsl(${this.hue}, 50%, ${hovered ? 25 : 60}%)`;
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
	            // Don't render text when we have less than 5px to play with.
	            if (rectWidth < 5)
	                continue;
	            title = cropText(title, charWidth, rectWidth);
	            subTitle = cropText(subTitle, charWidth, rectWidth);
	            const rectXCenter = rectStart + rectWidth / 2;
	            ctx.fillStyle = '#fff';
	            ctx.font = '12px Google Sans';
	            ctx.fillText(title, rectXCenter, MARGIN_TOP + RECT_HEIGHT / 2 - 3);
	            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
	            ctx.font = '10px Google Sans';
	            ctx.fillText(subTitle, rectXCenter, MARGIN_TOP + RECT_HEIGHT / 2 + 11);
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
	        const data = this.data();
	        this.mouseXpos = x;
	        if (data === undefined || data.kind === 'summary')
	            return;
	        const { timeScale } = globals.globals.frontendLocalState;
	        if (y < MARGIN_TOP || y > MARGIN_TOP + RECT_HEIGHT) {
	            this.hoveredUtid = -1;
	            return;
	        }
	        const t = timeScale.pxToTime(x);
	        this.hoveredUtid = -1;
	        for (let i = 0; i < data.starts.length; i++) {
	            const tStart = data.starts[i];
	            const tEnd = data.ends[i];
	            const utid = data.utids[i];
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
	}
	CpuSliceTrack.kind = common.CPU_SLICE_TRACK_KIND;
	track_registry.trackRegistry.register(CpuSliceTrack);

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
	exports.SLICE_TRACK_KIND = 'ChromeSliceTrack';

	});

	unwrapExports(common$2);
	var common_1$1 = common$2.SLICE_TRACK_KIND;

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
	        globals.globals.dispatch(actions.Actions.reqTrackData({
	            trackId: this.trackState.id,
	            start: reqStart,
	            end: reqEnd,
	            resolution: reqRes
	        }));
	    }
	    renderCanvas(ctx) {
	        // TODO: fonts and colors should come from the CSS and not hardcoded here.
	        const { timeScale, visibleWindowTime } = globals.globals.frontendLocalState;
	        const data = this.data();
	        // If there aren't enough cached slices data in |data| request more to
	        // the controller.
	        const inRange = data !== undefined &&
	            (visibleWindowTime.start >= data.start &&
	                visibleWindowTime.end <= data.end);
	        if (!inRange || data === undefined ||
	            data.resolution > getCurResolution()) {
	            if (!this.reqPending) {
	                this.reqPending = true;
	                setTimeout(() => this.reqDataDeferred(), 50);
	            }
	            if (data === undefined)
	                return; // Can't possibly draw anything.
	        }
	        // If the cached trace slices don't fully cover the visible time range,
	        // show a gray rectangle with a "Loading..." label.
	        checkerboard_1.checkerboardExcept(ctx, timeScale.timeToPx(visibleWindowTime.start), timeScale.timeToPx(visibleWindowTime.end), timeScale.timeToPx(data.start), timeScale.timeToPx(data.end));
	        ctx.font = '12px Google Sans';
	        ctx.textAlign = 'center';
	        // measuretext is expensive so we only use it once.
	        const charWidth = ctx.measureText('abcdefghij').width / 10;
	        const pxEnd = timeScale.timeToPx(visibleWindowTime.end);
	        for (let i = 0; i < data.starts.length; i++) {
	            const tStart = data.starts[i];
	            const tEnd = data.ends[i];
	            const depth = data.depths[i];
	            const cat = data.strings[data.categories[i]];
	            const titleId = data.titles[i];
	            const title = data.strings[titleId];
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
	        const data = this.data();
	        this.hoveredTitleId = -1;
	        if (data === undefined)
	            return;
	        const { timeScale } = globals.globals.frontendLocalState;
	        if (y < TRACK_PADDING)
	            return;
	        const t = timeScale.pxToTime(x);
	        const depth = Math.floor(y / SLICE_HEIGHT);
	        for (let i = 0; i < data.starts.length; i++) {
	            const tStart = data.starts[i];
	            const tEnd = data.ends[i];
	            const titleId = data.titles[i];
	            if (tStart <= t && t <= tEnd && depth === data.depths[i]) {
	                this.hoveredTitleId = titleId;
	                break;
	            }
	        }
	    }
	    onMouseOut() {
	        this.hoveredTitleId = -1;
	    }
	    getHeight() {
	        return SLICE_HEIGHT * (this.config.maxDepth + 1) + 2 * TRACK_PADDING;
	    }
	}
	ChromeSliceTrack.kind = common$2.SLICE_TRACK_KIND;
	track_registry.trackRegistry.register(ChromeSliceTrack);

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
	exports.KIND = 'VsyncTrack';

	});

	unwrapExports(common$4);
	var common_1$2 = common$4.KIND;

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






	// TODO(hjd): De-dupe this from ChromeSliceTrack, CpuSliceTrack and VsyncTrack.
	const MARGIN_TOP = 5.5;
	const RECT_HEIGHT = 30;
	function getCurResolution() {
	    // Truncate the resolution to the closest power of 10.
	    const resolution = globals.globals.frontendLocalState.timeScale.deltaPxToDuration(1);
	    return Math.pow(10, Math.floor(Math.log10(resolution)));
	}
	class VsyncTrack extends track.Track {
	    constructor(trackState) {
	        super(trackState);
	        this.reqPending = false;
	    }
	    static create(trackState) {
	        return new VsyncTrack(trackState);
	    }
	    reqDataDeferred() {
	        const { visibleWindowTime } = globals.globals.frontendLocalState;
	        const reqStart = visibleWindowTime.start - visibleWindowTime.duration;
	        const reqEnd = visibleWindowTime.end + visibleWindowTime.duration;
	        const reqRes = getCurResolution();
	        this.reqPending = false;
	        globals.globals.dispatch(actions.Actions.reqTrackData({
	            trackId: this.trackState.id,
	            start: reqStart,
	            end: reqEnd,
	            resolution: reqRes
	        }));
	    }
	    renderCanvas(ctx) {
	        const { timeScale, visibleWindowTime } = globals.globals.frontendLocalState;
	        const data = this.data();
	        const inRange = data !== undefined &&
	            (visibleWindowTime.start >= data.start &&
	                visibleWindowTime.end <= data.end);
	        if (!inRange || data === undefined ||
	            data.resolution !== getCurResolution()) {
	            if (!this.reqPending) {
	                this.reqPending = true;
	                setTimeout(() => this.reqDataDeferred(), 50);
	            }
	        }
	        if (data === undefined)
	            return; // Can't possibly draw anything.
	        const dataStartPx = timeScale.timeToPx(data.start);
	        const dataEndPx = timeScale.timeToPx(data.end);
	        const visibleStartPx = timeScale.timeToPx(visibleWindowTime.start);
	        const visibleEndPx = timeScale.timeToPx(visibleWindowTime.end);
	        checkerboard_1.checkerboardExcept(ctx, visibleStartPx, visibleEndPx, dataStartPx, dataEndPx);
	        const bgColor = '#5E909B';
	        const fgColor = '#323D48';
	        const startPx = Math.floor(Math.max(dataStartPx, visibleStartPx));
	        const endPx = Math.floor(Math.min(dataEndPx, visibleEndPx));
	        ctx.fillStyle = bgColor;
	        ctx.fillRect(startPx, MARGIN_TOP, endPx - startPx, RECT_HEIGHT);
	        ctx.fillStyle = fgColor;
	        for (let i = 0; i < data.vsyncs.length; i += 2) {
	            const leftPx = Math.floor(timeScale.timeToPx(data.vsyncs[i]));
	            const rightPx = Math.floor(timeScale.timeToPx(data.vsyncs[i + 1]));
	            if (rightPx < startPx)
	                continue;
	            // TODO(hjd): Do some thing better when very zoomed out.
	            if ((rightPx - leftPx) <= 1)
	                continue;
	            if (leftPx > endPx)
	                break;
	            ctx.fillRect(leftPx, MARGIN_TOP, rightPx - leftPx, RECT_HEIGHT);
	        }
	    }
	}
	VsyncTrack.kind = common$4.KIND;
	track_registry.trackRegistry.register(VsyncTrack);

	});

	unwrapExports(frontend$4);

	var common$6 = createCommonjsModule(function (module, exports) {
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
	exports.PROCESS_SUMMARY_TRACK = 'ProcessSummaryTrack';

	});

	unwrapExports(common$6);
	var common_1$3 = common$6.PROCESS_SUMMARY_TRACK;

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






	// 0.5 Makes the horizontal lines sharp.
	const MARGIN_TOP = 7.5;
	const RECT_HEIGHT = 30;
	function getCurResolution() {
	    // Truncate the resolution to the closest power of 10.
	    const resolution = globals.globals.frontendLocalState.timeScale.deltaPxToDuration(1);
	    return Math.pow(10, Math.floor(Math.log10(resolution)));
	}
	class ProcessSummaryTrack extends track.Track {
	    constructor(trackState) {
	        super(trackState);
	        this.reqPending = false;
	        this.hue = (128 + (32 * this.config.upid)) % 256;
	    }
	    static create(trackState) {
	        return new ProcessSummaryTrack(trackState);
	    }
	    // TODO(dproy): This code should be factored out.
	    reqDataDeferred() {
	        const { visibleWindowTime } = globals.globals.frontendLocalState;
	        const reqStart = visibleWindowTime.start - visibleWindowTime.duration;
	        const reqEnd = visibleWindowTime.end + visibleWindowTime.duration;
	        const reqRes = getCurResolution();
	        this.reqPending = false;
	        globals.globals.dispatch(actions.Actions.reqTrackData({
	            trackId: this.trackState.id,
	            start: reqStart,
	            end: reqEnd,
	            resolution: reqRes
	        }));
	    }
	    renderCanvas(ctx) {
	        const { timeScale, visibleWindowTime } = globals.globals.frontendLocalState;
	        const data = this.data();
	        // If there aren't enough cached slices data in |data| request more to
	        // the controller.
	        const inRange = data !== undefined &&
	            (visibleWindowTime.start >= data.start &&
	                visibleWindowTime.end <= data.end);
	        if (!inRange || data === undefined ||
	            data.resolution !== getCurResolution()) {
	            if (!this.reqPending) {
	                this.reqPending = true;
	                setTimeout(() => this.reqDataDeferred(), 50);
	            }
	        }
	        if (data === undefined)
	            return; // Can't possibly draw anything.
	        checkerboard_1.checkerboardExcept(ctx, timeScale.timeToPx(visibleWindowTime.start), timeScale.timeToPx(visibleWindowTime.end), timeScale.timeToPx(data.start), timeScale.timeToPx(data.end));
	        this.renderSummary(ctx, data);
	    }
	    // TODO(dproy): Dedup with CPU slices.
	    renderSummary(ctx, data) {
	        const { timeScale, visibleWindowTime } = globals.globals.frontendLocalState;
	        const startPx = Math.floor(timeScale.timeToPx(visibleWindowTime.start));
	        const bottomY = MARGIN_TOP + RECT_HEIGHT;
	        let lastX = startPx;
	        let lastY = bottomY;
	        ctx.fillStyle = `hsl(${this.hue}, 50%, 60%)`;
	        ctx.beginPath();
	        ctx.moveTo(lastX, lastY);
	        for (let i = 0; i < data.utilizations.length; i++) {
	            // TODO(dproy): Investigate why utilization is > 1 sometimes.
	            const utilization = Math.min(data.utilizations[i], 1);
	            const startTime = i * data.bucketSizeSeconds + data.start;
	            lastX = Math.floor(timeScale.timeToPx(startTime));
	            ctx.lineTo(lastX, lastY);
	            lastY = MARGIN_TOP + Math.round(RECT_HEIGHT * (1 - utilization));
	            ctx.lineTo(lastX, lastY);
	        }
	        ctx.lineTo(lastX, bottomY);
	        ctx.closePath();
	        ctx.fill();
	    }
	}
	ProcessSummaryTrack.kind = common$6.PROCESS_SUMMARY_TRACK;
	track_registry.trackRegistry.register(ProcessSummaryTrack);

	});

	unwrapExports(frontend$6);

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



	const ALL_PROCESSES_QUERY = 'select name, pid from process order by name;';
	const CPU_TIME_FOR_PROCESSES = `
select
  process.name,
  tot_proc/1e9 as cpu_sec
from
  (select
    upid,
    sum(tot_thd) as tot_proc
  from
    (select
      utid,
      sum(dur) as tot_thd
    from sched group by utid)
  join thread using(utid) group by upid)
join process using(upid)
order by cpu_sec desc limit 100;`;
	const CYCLES_PER_P_STATE_PER_CPU = `
select ref as cpu, value as freq, sum(dur * value)/1e6 as mcycles
from counters group by cpu, freq order by mcycles desc limit 20;`;
	const CPU_TIME_BY_CLUSTER_BY_PROCESS = `
select
thread.name as comm,
case when cpug = 0 then 'big' else 'little' end as core,
cpu_sec from
  (select cpu/4 cpug, utid, sum(dur)/1e9 as cpu_sec
  from sched group by utid, cpug order by cpu_sec desc)
left join thread using(utid)
limit 20;`;
	function createCannedQuery(query) {
	    return (e) => {
	        e.preventDefault();
	        globals.globals.dispatch(actions.Actions.executeQuery({
	            engineId: '0',
	            queryId: 'command',
	            query,
	        }));
	    };
	}
	const EXAMPLE_ANDROID_TRACE_URL = 'https://storage.googleapis.com/perfetto-misc/example_trace_30s';
	const EXAMPLE_CHROME_TRACE_URL = 'https://storage.googleapis.com/perfetto-misc/example_chrome_trace_10s.json';
	const SMALL_CHROME_TRACE_URL = 'https://deepanjan.me/previews/trace_small_chrome.json';
	const SECTIONS = [
	    {
	        title: 'Traces',
	        summary: 'Open or record a trace',
	        expanded: true,
	        items: [
	            { t: 'Open trace file', a: popupFileSelectionDialog, i: 'folder_open' },
	            {
	                t: 'Open Android example',
	                a: openTraceUrl(EXAMPLE_ANDROID_TRACE_URL),
	                i: 'description'
	            },
	            {
	                t: 'Open Chrome example',
	                a: openTraceUrl(EXAMPLE_CHROME_TRACE_URL),
	                i: 'description'
	            },
	            {
	                t: 'Open small chrome example',
	                a: openTraceUrl(SMALL_CHROME_TRACE_URL),
	                i: 'description'
	            },
	            { t: 'Record new trace', a: navigateRecord, i: 'fiber_smart_record' },
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
	            {
	                t: 'All Processes',
	                a: createCannedQuery(ALL_PROCESSES_QUERY),
	                i: 'search',
	            },
	            {
	                t: 'CPU Time by process',
	                a: createCannedQuery(CPU_TIME_FOR_PROCESSES),
	                i: 'search',
	            },
	            {
	                t: 'Cycles by p-state by CPU',
	                a: createCannedQuery(CYCLES_PER_P_STATE_PER_CPU),
	                i: 'search',
	            },
	            {
	                t: 'CPU Time by cluster by process',
	                a: createCannedQuery(CPU_TIME_BY_CLUSTER_BY_PROCESS),
	                i: 'search',
	            },
	        ],
	    },
	];
	function popupFileSelectionDialog(e) {
	    e.preventDefault();
	    document.querySelector('input[type=file]').click();
	}
	function openTraceUrl(url) {
	    return e => {
	        e.preventDefault();
	        globals.globals.dispatch(actions.Actions.openTraceFromUrl({ url }));
	    };
	}
	function onInputElementFileSelectionChanged(e) {
	    if (!(e.target instanceof HTMLInputElement)) {
	        throw new Error('Not an input element');
	    }
	    if (!e.target.files)
	        return;
	    globals.globals.dispatch(actions.Actions.openTraceFromFile({ file: e.target.files[0] }));
	}
	function navigateHome(e) {
	    e.preventDefault();
	    globals.globals.dispatch(actions.Actions.navigate({ route: '/' }));
	}
	function navigateRecord(e) {
	    e.preventDefault();
	    globals.globals.dispatch(actions.Actions.navigate({ route: '/record' }));
	}
	function dispatchCreatePermalink(e) {
	    e.preventDefault();
	    // TODO(hjd): Should requestId not be set to nextId++ in the controller?
	    globals.globals.dispatch(actions.Actions.createPermalink({
	        requestId: new Date().toISOString(),
	    }));
	}
	class Sidebar {
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
	    }
	}
	exports.Sidebar = Sidebar;

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
	    globals.globals.dispatch(actions.Actions.deleteQuery({ queryId: QUERY_ID }));
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
	        globals.globals.dispatch(actions.Actions.executeQuery({ engineId: '0', queryId: QUERY_ID, query }));
	    }
	    if (mode === 'command' && key === 'Enter') {
	        globals.globals.dispatch(actions.Actions.executeQuery({ engineId: '0', queryId: 'command', query: txt.value }));
	    }
	}
	class Omnibox {
	    oncreate(vnode) {
	        const txt = vnode.dom.querySelector('input');
	        txt.addEventListener('blur', clearOmniboxResults);
	        txt.addEventListener('keydown', onKeyDown);
	        txt.addEventListener('keyup', onKeyUp);
	    }
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
	    }
	}
	class Topbar {
	    view() {
	        const progBar = [];
	        const engine = globals.globals.state.engines['0'];
	        if (globals.globals.state.queries[QUERY_ID] !== undefined ||
	            (engine !== undefined && !engine.ready)) {
	            progBar.push(mithril('.progress'));
	        }
	        return mithril('.topbar', mithril(Omnibox), ...progBar);
	    }
	}
	exports.Topbar = Topbar;

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
	class Alerts {
	    view() {
	        return mithril('.alerts', renderPermalink());
	    }
	}
	const TogglePerfDebugButton = {
	    view() {
	        return mithril('.perf-monitor-button', mithril('button', {
	            onclick: () => globals.globals.frontendLocalState.togglePerfDebug(),
	        }, mithril('i.material-icons', {
	            title: 'Toggle Perf Debug Mode',
	        }, 'assessment')));
	    }
	};
	const PerfStats = {
	    view() {
	        const perfDebug = globals.globals.frontendLocalState.perfDebug;
	        const children = [mithril(TogglePerfDebugButton)];
	        if (perfDebug) {
	            children.unshift(mithril('.perf-stats-content'));
	        }
	        return mithril(`.perf-stats[expanded=${perfDebug}]`, children);
	    }
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
	                mithril(PerfStats),
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

	var clipboard = createCommonjsModule(function (module, exports) {
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

	function copyToClipboard(text) {
	    return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	        try {
	            // TODO(hjd): Fix typescript type for navigator.
	            // tslint:disable-next-line no-any
	            yield navigator.clipboard.writeText(text);
	        }
	        catch (err) {
	            console.error(`Failed to copy "${text}" to clipboard: ${err}`);
	        }
	    });
	}
	exports.copyToClipboard = copyToClipboard;

	});

	unwrapExports(clipboard);
	var clipboard_1 = clipboard.copyToClipboard;

	var record_page = createCommonjsModule(function (module, exports) {
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





	const CONFIG_PROTO_URL = `https://android.googlesource.com/platform/external/perfetto/+/master/protos/perfetto/config/perfetto_config.proto`;
	const FTRACE_EVENTS = [
	    'print',
	    'sched_switch',
	    'cpufreq_interactive_already',
	    'cpufreq_interactive_boost',
	    'cpufreq_interactive_notyet',
	    'cpufreq_interactive_setspeed',
	    'cpufreq_interactive_target',
	    'cpufreq_interactive_unboost',
	    'cpu_frequency',
	    'cpu_frequency_limits',
	    'cpu_idle',
	    'clock_enable',
	    'clock_disable',
	    'clock_set_rate',
	    'sched_wakeup',
	    'sched_blocked_reason',
	    'sched_cpu_hotplug',
	    'sched_waking',
	    'ipi_entry',
	    'ipi_exit',
	    'ipi_raise',
	    'softirq_entry',
	    'softirq_exit',
	    'softirq_raise',
	    'i2c_read',
	    'i2c_write',
	    'i2c_result',
	    'i2c_reply',
	    'smbus_read',
	    'smbus_write',
	    'smbus_result',
	    'smbus_reply',
	    'lowmemory_kill',
	    'irq_handler_entry',
	    'irq_handler_exit',
	    'sync_pt',
	    'sync_timeline',
	    'sync_wait',
	    'ext4_da_write_begin',
	    'ext4_da_write_end',
	    'ext4_sync_file_enter',
	    'ext4_sync_file_exit',
	    'block_rq_issue',
	    'mm_vmscan_direct_reclaim_begin',
	    'mm_vmscan_direct_reclaim_end',
	    'mm_vmscan_kswapd_wake',
	    'mm_vmscan_kswapd_sleep',
	    'binder_transaction',
	    'binder_transaction_received',
	    'binder_set_priority',
	    'binder_lock',
	    'binder_locked',
	    'binder_unlock',
	    'workqueue_activate_work',
	    'workqueue_execute_end',
	    'workqueue_execute_start',
	    'workqueue_queue_work',
	    'regulator_disable',
	    'regulator_disable_complete',
	    'regulator_enable',
	    'regulator_enable_complete',
	    'regulator_enable_delay',
	    'regulator_set_voltage',
	    'regulator_set_voltage_complete',
	    'cgroup_attach_task',
	    'cgroup_mkdir',
	    'cgroup_remount',
	    'cgroup_rmdir',
	    'cgroup_transfer_tasks',
	    'cgroup_destroy_root',
	    'cgroup_release',
	    'cgroup_rename',
	    'cgroup_setup_root',
	    'mdp_cmd_kickoff',
	    'mdp_commit',
	    'mdp_perf_set_ot',
	    'mdp_sspp_change',
	    'tracing_mark_write',
	    'mdp_cmd_pingpong_done',
	    'mdp_compare_bw',
	    'mdp_perf_set_panic_luts',
	    'mdp_sspp_set',
	    'mdp_cmd_readptr_done',
	    'mdp_misr_crc',
	    'mdp_perf_set_qos_luts',
	    'mdp_trace_counter',
	    'mdp_cmd_release_bw',
	    'mdp_mixer_update',
	    'mdp_perf_set_wm_levels',
	    'mdp_video_underrun_done',
	    'mdp_cmd_wait_pingpong',
	    'mdp_perf_prefill_calc',
	    'mdp_perf_update_bus',
	    'rotator_bw_ao_as_context',
	    'mm_filemap_add_to_page_cache',
	    'mm_filemap_delete_from_page_cache',
	    'mm_compaction_begin',
	    'mm_compaction_defer_compaction',
	    'mm_compaction_deferred',
	    'mm_compaction_defer_reset',
	    'mm_compaction_end',
	    'mm_compaction_finished',
	    'mm_compaction_isolate_freepages',
	    'mm_compaction_isolate_migratepages',
	    'mm_compaction_kcompactd_sleep',
	    'mm_compaction_kcompactd_wake',
	    'mm_compaction_migratepages',
	    'mm_compaction_suitable',
	    'mm_compaction_try_to_compact_pages',
	    'mm_compaction_wakeup_kcompactd',
	    'suspend_resume',
	    'sched_wakeup_new',
	    'block_bio_backmerge',
	    'block_bio_bounce',
	    'block_bio_complete',
	    'block_bio_frontmerge',
	    'block_bio_queue',
	    'block_bio_remap',
	    'block_dirty_buffer',
	    'block_getrq',
	    'block_plug',
	    'block_rq_abort',
	    'block_rq_complete',
	    'block_rq_insert',
	    '  removed',
	    'block_rq_remap',
	    'block_rq_requeue',
	    'block_sleeprq',
	    'block_split',
	    'block_touch_buffer',
	    'block_unplug',
	    'ext4_alloc_da_blocks',
	    'ext4_allocate_blocks',
	    'ext4_allocate_inode',
	    'ext4_begin_ordered_truncate',
	    'ext4_collapse_range',
	    'ext4_da_release_space',
	    'ext4_da_reserve_space',
	    'ext4_da_update_reserve_space',
	    'ext4_da_write_pages',
	    'ext4_da_write_pages_extent',
	    'ext4_direct_IO_enter',
	    'ext4_direct_IO_exit',
	    'ext4_discard_blocks',
	    'ext4_discard_preallocations',
	    'ext4_drop_inode',
	    'ext4_es_cache_extent',
	    'ext4_es_find_delayed_extent_range_enter',
	    'ext4_es_find_delayed_extent_range_exit',
	    'ext4_es_insert_extent',
	    'ext4_es_lookup_extent_enter',
	    'ext4_es_lookup_extent_exit',
	    'ext4_es_remove_extent',
	    'ext4_es_shrink',
	    'ext4_es_shrink_count',
	    'ext4_es_shrink_scan_enter',
	    'ext4_es_shrink_scan_exit',
	    'ext4_evict_inode',
	    'ext4_ext_convert_to_initialized_enter',
	    'ext4_ext_convert_to_initialized_fastpath',
	    'ext4_ext_handle_unwritten_extents',
	    'ext4_ext_in_cache',
	    'ext4_ext_load_extent',
	    'ext4_ext_map_blocks_enter',
	    'ext4_ext_map_blocks_exit',
	    'ext4_ext_put_in_cache',
	    'ext4_ext_remove_space',
	    'ext4_ext_remove_space_done',
	    'ext4_ext_rm_idx',
	    'ext4_ext_rm_leaf',
	    'ext4_ext_show_extent',
	    'ext4_fallocate_enter',
	    'ext4_fallocate_exit',
	    'ext4_find_delalloc_range',
	    'ext4_forget',
	    'ext4_free_blocks',
	    'ext4_free_inode',
	    'ext4_get_implied_cluster_alloc_exit',
	    'ext4_get_reserved_cluster_alloc',
	    'ext4_ind_map_blocks_enter',
	    'ext4_ind_map_blocks_exit',
	    'ext4_insert_range',
	    'ext4_invalidatepage',
	    'ext4_journal_start',
	    'ext4_journal_start_reserved',
	    'ext4_journalled_invalidatepage',
	    'ext4_journalled_write_end',
	    'ext4_load_inode',
	    'ext4_load_inode_bitmap',
	    'ext4_mark_inode_dirty',
	    'ext4_mb_bitmap_load',
	    'ext4_mb_buddy_bitmap_load',
	    'ext4_mb_discard_preallocations',
	    'ext4_mb_new_group_pa',
	    'ext4_mb_new_inode_pa',
	    'ext4_mb_release_group_pa',
	    'ext4_mb_release_inode_pa',
	    'ext4_mballoc_alloc',
	    'ext4_mballoc_discard',
	    'ext4_mballoc_free',
	    'ext4_mballoc_prealloc',
	    'ext4_other_inode_update_time',
	    'ext4_punch_hole',
	    'ext4_read_block_bitmap_load',
	    'ext4_readpage',
	    'ext4_releasepage',
	    'ext4_remove_blocks',
	    'ext4_request_blocks',
	    'ext4_request_inode',
	    'ext4_sync_fs',
	    'ext4_trim_all_free',
	    'ext4_trim_extent',
	    'ext4_truncate_enter',
	    'ext4_truncate_exit',
	    'ext4_unlink_enter',
	    'ext4_unlink_exit',
	    'ext4_write_begin',
	    'ext4_write_end',
	    'ext4_writepage',
	    'ext4_writepages',
	    'ext4_writepages_result',
	    'ext4_zero_range',
	    'task_newtask',
	    'task_rename',
	    'sched_process_exec',
	    'sched_process_exit',
	    'sched_process_fork',
	    'sched_process_free',
	    'sched_process_hang',
	    'sched_process_wait',
	    'f2fs_do_submit_bio',
	    'f2fs_evict_inode',
	    'f2fs_fallocate',
	    'f2fs_get_data_block',
	    'f2fs_get_victim',
	    'f2fs_iget',
	    'f2fs_iget_exit',
	    'f2fs_new_inode',
	    'f2fs_readpage',
	    'f2fs_reserve_new_block',
	    'f2fs_set_page_dirty',
	    'f2fs_submit_write_page',
	    'f2fs_sync_file_enter',
	    'f2fs_sync_file_exit',
	    'f2fs_sync_fs',
	    'f2fs_truncate',
	    'f2fs_truncate_blocks_enter',
	    'f2fs_truncate_blocks_exit',
	    'f2fs_truncate_data_blocks_range',
	    'f2fs_truncate_inode_blocks_enter',
	    'f2fs_truncate_inode_blocks_exit',
	    'f2fs_truncate_node',
	    'f2fs_truncate_nodes_enter',
	    'f2fs_truncate_nodes_exit',
	    'f2fs_truncate_partial_nodes',
	    'f2fs_unlink_enter',
	    'f2fs_unlink_exit',
	    'f2fs_vm_page_mkwrite',
	    'f2fs_write_begin',
	    'f2fs_write_checkpoint',
	    'f2fs_write_end',
	];
	const ATRACE_CATERGORIES = [
	    'gfx', 'input', 'view', 'webview', 'wm',
	    'am', 'sm', 'audio', 'video', 'camera',
	    'hal', 'res', 'dalvik', 'rs', 'bionic',
	    'power', 'pm', 'ss', 'database', 'network',
	    'adb', 'vibrator', 'aidl', 'nnapi', 'sched',
	    'irq', 'irqoff', 'preemptoff', 'i2c', 'freq',
	    'membus', 'idle', 'disk', 'mmc', 'load',
	    'sync', 'workq', 'memreclaim', 'regulators', 'binder_driver',
	    'binder_lock', 'pagecache',
	];
	const ATRACE_APPS = [
	    'com.android.chrome',
	    'com.android.bluetooth',
	    'com.android.chrome',
	    'com.android.nfc',
	    'com.android.phone',
	    'com.android.settings',
	    'com.android.systemui',
	    'com.android.vending',
	    'com.google.android.apps.messaging',
	    'com.google.android.apps.nexuslauncher',
	    'com.google.android.connectivitymonitor',
	    'com.google.android.contacts',
	    'com.google.android.gms',
	    'com.google.android.gms.learning',
	    'com.google.android.gms.persistent',
	    'com.google.android.gms.unstable',
	    'com.google.android.googlequicksearchbox',
	    'com.google.android.setupwizard',
	    'com.google.android.volta',
	];
	const DURATION_HELP = `Duration to trace for.`;
	const BUFFER_SIZE_HELP = `Size of the ring buffer which stores the trace.`;
	const PROCESS_METADATA_HELP = `Record process names and parent child relationships.`;
	const SCAN_ALL_PROCESSES_ON_START_HELP = `When tracing begins read metadata for all processes.`;
	function toId(label) {
	    return label.toLowerCase().replace(' ', '-');
	}
	class CodeSample {
	    view({ attrs }) {
	        return mithril('.example-code', mithril('code', {
	            style: {
	                'white-space': attrs.hardWhitespace ? 'pre' : null,
	            },
	        }, attrs.text), mithril('button', {
	            onclick: () => clipboard.copyToClipboard(attrs.text),
	        }, 'Copy to clipboard'));
	    }
	}
	class Toggle {
	    view({ attrs }) {
	        return mithril('label.checkbox', {
	            title: attrs.help,
	            class: attrs.enabled ? '' : 'disabled',
	        }, attrs.label, mithril('input[type="checkbox"]', {
	            onchange: mithril.withAttr('checked', attrs.onchange),
	            disabled: !attrs.enabled,
	            checked: attrs.value,
	        }));
	    }
	}
	class MultiSelect {
	    view({ attrs }) {
	        return mithril('label.multiselect', { class: attrs.enabled ? '' : 'disabled' }, attrs.label, mithril('input', {
	            list: toId(attrs.label),
	            disabled: !attrs.enabled,
	            onchange: (e) => {
	                const elem = e.target;
	                attrs.onadd(elem.value);
	                elem.value = '';
	            },
	        }), mithril('datalist', {
	            id: toId(attrs.label),
	        }, attrs.options.filter(option => !attrs.selected.includes(option))
	            .map(value => mithril('option', { value }))), mithril('.multiselect-selected', attrs.selected.map(selected => mithril('button.multiselect-selected', {
	            onclick: (_) => attrs.onsubtract(selected),
	        }, selected))));
	    }
	}
	class Numeric {
	    view({ attrs }) {
	        return mithril('label.range', {
	            'for': `range-${attrs.label}`,
	            'title': attrs.help,
	        }, attrs.label, mithril('.range-control', attrs.presets.map(p => mithril('button', {
	            class: attrs.value === p.value ? 'selected' : '',
	            onclick: () => attrs.onchange(p.value),
	        }, p.label)), mithril('input[type=number][min=0]', {
	            id: `range-${attrs.label}`,
	            value: attrs.value,
	            onchange: mithril.withAttr('value', attrs.onchange),
	        })), mithril('small', attrs.sublabel));
	    }
	}
	exports.RecordPage = pages.createPage({
	    view() {
	        const state = globals.globals.state.recordConfig;
	        const data = globals.globals.trackDataStore.get('config');
	        return mithril('.record-page', mithril('.text-column'), mithril('.text-column', `To collect a ${state.durationSeconds}
          second Perfetto trace from an Android phone run this command:`), mithril('.text-column', `A Perfetto config controls what and how much information is
        collected. It is encoded as a `, mithril('a', {
	            href: CONFIG_PROTO_URL,
	        }, 'proto'), '.'), mithril('.text-column', mithril(Numeric, {
	            label: 'Duration',
	            sublabel: 's',
	            value: state.durationSeconds,
	            help: DURATION_HELP,
	            onchange: (value) => {
	                globals.globals.dispatch(actions.Actions.setConfigControl({ name: 'durationSeconds', value }));
	            },
	            presets: [
	                { label: '10s', value: 10 },
	                { label: '1m', value: 60 },
	            ]
	        }), mithril(Numeric, {
	            label: 'Buffer size',
	            sublabel: 'mb',
	            help: BUFFER_SIZE_HELP,
	            value: state.bufferSizeMb,
	            onchange: (value) => {
	                globals.globals.dispatch(actions.Actions.setConfigControl({ name: 'bufferSizeMb', value }));
	            },
	            presets: [
	                { label: '1mb', value: 1 },
	                { label: '10mb', value: 10 },
	                { label: '20mb', value: 20 },
	            ]
	        }), mithril(Toggle, {
	            label: 'Process Metadata',
	            help: PROCESS_METADATA_HELP,
	            value: state.processMetadata,
	            enabled: true,
	            onchange: (value) => {
	                globals.globals.dispatch(actions.Actions.setConfigControl({ name: 'processMetadata', value }));
	            },
	        }), mithril('.control-group', mithril(Toggle, {
	            label: 'Scan all processes on start',
	            value: state.scanAllProcessesOnStart,
	            help: SCAN_ALL_PROCESSES_ON_START_HELP,
	            enabled: state.processMetadata,
	            onchange: (value) => {
	                globals.globals.dispatch(actions.Actions.setConfigControl({ name: 'scanAllProcessesOnStart', value }));
	            },
	        })), mithril(Toggle, {
	            label: 'Ftrace & Atrace',
	            value: state.ftrace,
	            enabled: true,
	            help: SCAN_ALL_PROCESSES_ON_START_HELP,
	            onchange: (value) => {
	                globals.globals.dispatch(actions.Actions.setConfigControl({ name: 'ftrace', value }));
	            },
	        }), mithril('.control-group', mithril(MultiSelect, {
	            label: 'Ftrace Events',
	            enabled: state.ftrace,
	            selected: state.ftraceEvents,
	            options: FTRACE_EVENTS,
	            onadd: (option) => {
	                globals.globals.dispatch(actions.Actions.addConfigControl({ name: 'ftraceEvents', option }));
	            },
	            onsubtract: (option) => {
	                globals.globals.dispatch(actions.Actions.removeConfigControl({ name: 'ftraceEvents', option }));
	            },
	        }), mithril(MultiSelect, {
	            label: 'Atrace Categories',
	            enabled: state.ftrace,
	            selected: state.atraceCategories,
	            options: ATRACE_CATERGORIES,
	            onadd: (option) => {
	                globals.globals.dispatch(actions.Actions.addConfigControl({ name: 'atraceCategories', option }));
	            },
	            onsubtract: (option) => {
	                globals.globals.dispatch(actions.Actions.removeConfigControl({ name: 'atraceCategories', option }));
	            },
	        }), mithril(MultiSelect, {
	            label: 'Atrace Apps',
	            enabled: state.ftrace,
	            selected: state.atraceApps,
	            options: ATRACE_APPS,
	            onadd: (option) => {
	                globals.globals.dispatch(actions.Actions.addConfigControl({ name: 'atraceApps', option }));
	            },
	            onsubtract: (option) => {
	                globals.globals.dispatch(actions.Actions.removeConfigControl({ name: 'atraceApps', option }));
	            },
	        }))), data ?
	            [
	                mithril('.text-column', mithril(CodeSample, { text: data.commandline }), 'Then click "Open trace file" in the menu to the left and select', ' "/tmp/trace".'),
	                mithril('.text-column', mithril(CodeSample, { text: data.pbtxt, hardWhitespace: true })),
	            ] :
	            null);
	    }
	});

	});

	unwrapExports(record_page);
	var record_page_1 = record_page.RecordPage;

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
	            console.info(`Route ${route} not known redirecting to ${this.defaultRoute}.`);
	            this.dispatch(actions.Actions.navigate({ route: this.defaultRoute }));
	        }
	    }
	    /**
	     * Dispatches navigation action to |this.getRouteFromHash()| if that is
	     * defined in |this.routes|, otherwise to |this.defaultRoute|.
	     */
	    navigateToCurrentHash() {
	        const hashRoute = this.getRouteFromHash();
	        const newRoute = hashRoute in this.routes ? hashRoute : this.defaultRoute;
	        this.dispatch(actions.Actions.navigate({ route: newRoute }));
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
	            mithril('embed.flame-graph-panel', { type: 'image/svg+xml', src: 'assets/flamegraph.svg' })
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
	// This value must be larger than the maximum delta between keydown repeat
	// events. Largest observed value so far: 86ms.
	const ANIMATION_AUTO_END_AFTER_KEYPRESS_MS = 100;
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
	        this.panelPerfStats = new WeakMap();
	        this.perfStats = {
	            totalPanels: 0,
	            panelsOnCanvas: 0,
	            renderStats: new perf.RunningStatistics(10),
	        };
	        this.onResize = () => { };
	        this.parentOnScroll = () => { };
	        this.attrs = vnode.attrs;
	        this.canvasRedrawer = () => this.redrawCanvas();
	        globals.globals.rafScheduler.addRedrawCallback(this.canvasRedrawer);
	        perf.perfDisplay.addContainer(this);
	    }
	    get canvasOverdrawFactor() {
	        return this.attrs.doesScroll ? SCROLLING_CANVAS_OVERDRAW_FACTOR : 1;
	    }
	    oncreate(vnodeDom) {
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
	        this.readPanelHeightsFromDom(vnodeDom.dom);
	        vnodeDom.dom.style.height = `${this.totalPanelHeight}px`;
	        this.updateCanvasDimensions();
	        this.repositionCanvas();
	        // Save the resize handler in the state so we can remove it later.
	        // TODO: Encapsulate resize handling better.
	        this.onResize = () => {
	            this.readParentSizeFromDom(vnodeDom.dom);
	            this.updateCanvasDimensions();
	            this.repositionCanvas();
	            globals.globals.rafScheduler.scheduleFullRedraw();
	        };
	        // Once ResizeObservers are out, we can stop accessing the window here.
	        window.addEventListener('resize', this.onResize);
	        // TODO(dproy): Handle change in doesScroll attribute.
	        if (this.attrs.doesScroll) {
	            this.parentOnScroll = () => {
	                this.scrollTop = logging.assertExists(vnodeDom.dom.parentElement).scrollTop;
	                this.repositionCanvas();
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
	        perf.perfDisplay.removeContainer(this);
	    }
	    view({ attrs }) {
	        this.attrs = attrs;
	        const renderPanel = (panel$$1) => perf.perfDebug() ?
	            mithril('.panel', panel$$1, mithril('.debug-panel-border')) :
	            mithril('.panel', panel$$1);
	        return mithril('.scroll-limiter', mithril('canvas.main-canvas'), attrs.panels.map(renderPanel));
	    }
	    onupdate(vnodeDom) {
	        const totalPanelHeightChanged = this.readPanelHeightsFromDom(vnodeDom.dom);
	        const parentSizeChanged = this.readParentSizeFromDom(vnodeDom.dom);
	        if (totalPanelHeightChanged) {
	            vnodeDom.dom.style.height = `${this.totalPanelHeight}px`;
	        }
	        const canvasSizeShouldChange = this.attrs.doesScroll ? parentSizeChanged : totalPanelHeightChanged;
	        if (canvasSizeShouldChange) {
	            this.updateCanvasDimensions();
	            this.repositionCanvas();
	        }
	    }
	    updateCanvasDimensions() {
	        this.canvasHeight = this.attrs.doesScroll ?
	            this.parentHeight * this.canvasOverdrawFactor :
	            this.totalPanelHeight;
	        const ctx = logging.assertExists(this.ctx);
	        const canvas = logging.assertExists(ctx.canvas);
	        canvas.style.height = `${this.canvasHeight}px`;
	        const dpr = window.devicePixelRatio;
	        ctx.canvas.width = this.parentWidth * dpr;
	        ctx.canvas.height = this.canvasHeight * dpr;
	        ctx.scale(dpr, dpr);
	    }
	    repositionCanvas() {
	        const canvas = logging.assertExists(logging.assertExists(this.ctx).canvas);
	        const canvasYStart = this.scrollTop - this.getCanvasOverdrawHeightPerSide();
	        canvas.style.transform = `translateY(${canvasYStart}px)`;
	    }
	    /**
	     * Reads dimensions of parent node. Returns true if read dimensions are
	     * different from what was cached in the state.
	     */
	    readParentSizeFromDom(dom) {
	        const oldWidth = this.parentWidth;
	        const oldHeight = this.parentHeight;
	        const clientRect = logging.assertExists(dom.parentElement).getBoundingClientRect();
	        this.parentWidth = clientRect.width;
	        this.parentHeight = clientRect.height;
	        return this.parentHeight !== oldHeight || this.parentWidth !== oldWidth;
	    }
	    /**
	     * Reads dimensions of panels. Returns true if total panel height is different
	     * from what was cached in state.
	     */
	    readPanelHeightsFromDom(dom) {
	        const prevHeight = this.totalPanelHeight;
	        this.panelHeights = [];
	        this.totalPanelHeight = 0;
	        const panels = dom.querySelectorAll('.panel');
	        logging.assertTrue(panels.length === this.attrs.panels.length);
	        for (let i = 0; i < panels.length; i++) {
	            const height = panels[i].getBoundingClientRect().height;
	            this.panelHeights[i] = height;
	            this.totalPanelHeight += height;
	        }
	        return this.totalPanelHeight !== prevHeight;
	    }
	    overlapsCanvas(yStart, yEnd) {
	        return yEnd > 0 && yStart < this.canvasHeight;
	    }
	    redrawCanvas() {
	        const redrawStart = perf.debugNow();
	        if (!this.ctx)
	            return;
	        this.ctx.clearRect(0, 0, this.parentWidth, this.canvasHeight);
	        const canvasYStart = this.scrollTop - this.getCanvasOverdrawHeightPerSide();
	        let panelYStart = 0;
	        const panels = logging.assertExists(this.attrs).panels;
	        logging.assertTrue(panels.length === this.panelHeights.length);
	        let totalOnCanvas = 0;
	        for (let i = 0; i < panels.length; i++) {
	            const panel$$1 = panels[i];
	            const panelHeight = this.panelHeights[i];
	            const yStartOnCanvas = panelYStart - canvasYStart;
	            if (!this.overlapsCanvas(yStartOnCanvas, yStartOnCanvas + panelHeight)) {
	                panelYStart += panelHeight;
	                continue;
	            }
	            totalOnCanvas++;
	            if (!panel.isPanelVNode(panel$$1)) {
	                throw Error('Vnode passed to panel container is not a panel');
	            }
	            this.ctx.save();
	            this.ctx.translate(0, yStartOnCanvas);
	            const clipRect = new Path2D();
	            const size = { width: this.parentWidth, height: panelHeight };
	            clipRect.rect(0, 0, size.width, size.height);
	            this.ctx.clip(clipRect);
	            const beforeRender = perf.debugNow();
	            panel$$1.state.renderCanvas(this.ctx, size, panel$$1);
	            this.updatePanelStats(i, panel$$1.state, perf.debugNow() - beforeRender, this.ctx, size);
	            this.ctx.restore();
	            panelYStart += panelHeight;
	        }
	        const redrawDur = perf.debugNow() - redrawStart;
	        this.updatePerfStats(redrawDur, panels.length, totalOnCanvas);
	    }
	    updatePanelStats(panelIndex, panel$$1, renderTime, ctx, size) {
	        if (!perf.perfDebug())
	            return;
	        let renderStats = this.panelPerfStats.get(panel$$1);
	        if (renderStats === undefined) {
	            renderStats = new perf.RunningStatistics();
	            this.panelPerfStats.set(panel$$1, renderStats);
	        }
	        renderStats.addValue(renderTime);
	        const statW = 300;
	        ctx.fillStyle = 'hsl(97, 100%, 96%)';
	        ctx.fillRect(size.width - statW, size.height - 20, statW, 20);
	        ctx.fillStyle = 'hsla(122, 77%, 22%)';
	        const statStr = `Panel ${panelIndex + 1} | ` + perf.runningStatStr(renderStats);
	        ctx.fillText(statStr, size.width - statW, size.height - 10);
	    }
	    updatePerfStats(renderTime, totalPanels, panelsOnCanvas) {
	        if (!perf.perfDebug())
	            return;
	        this.perfStats.renderStats.addValue(renderTime);
	        this.perfStats.totalPanels = totalPanels;
	        this.perfStats.panelsOnCanvas = panelsOnCanvas;
	    }
	    renderPerfStats(index) {
	        logging.assertTrue(perf.perfDebug());
	        return [mithril('section', mithril('div', `Panel Container ${index + 1}`), mithril('div', `${this.perfStats.totalPanels} panels, ` +
	                `${this.perfStats.panelsOnCanvas} on canvas.`), mithril('div', perf.runningStatStr(this.perfStats.renderStats)))];
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
	function isPinned(id) {
	    return globals.globals.state.pinnedTracks.indexOf(id) !== -1;
	}
	class TrackShell {
	    view({ attrs }) {
	        return mithril('.track-shell', mithril('h1', attrs.trackState.name), mithril(TrackButton, {
	            action: actions.Actions.moveTrack({ trackId: attrs.trackState.id, direction: 'up' }),
	            i: 'arrow_upward_alt',
	        }), mithril(TrackButton, {
	            action: actions.Actions.moveTrack({ trackId: attrs.trackState.id, direction: 'down' }),
	            i: 'arrow_downward_alt',
	        }), mithril(TrackButton, {
	            action: actions.Actions.toggleTrackPinned({ trackId: attrs.trackState.id }),
	            i: isPinned(attrs.trackState.id) ? 'star' : 'star_border',
	        }));
	    }
	}
	class TrackContent {
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
	}
	class TrackComponent {
	    view({ attrs }) {
	        return mithril('.track', [
	            mithril(TrackShell, { trackState: attrs.trackState }),
	            mithril(TrackContent, { track: attrs.track })
	        ]);
	    }
	}
	class TrackButton {
	    view({ attrs }) {
	        return mithril('i.material-icons.track-button', {
	            onclick: () => globals.globals.dispatch(attrs.action),
	        }, attrs.i);
	    }
	}
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
	        ctx.save();
	        ctx.translate(exports.TRACK_SHELL_WIDTH, 0);
	        gridline_helper.drawGridLines(ctx, globals.globals.frontendLocalState.timeScale, globals.globals.frontendLocalState.visibleWindowTime, size.height);
	        this.track.renderCanvas(ctx);
	        ctx.restore();
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

	var track_group_panel = createCommonjsModule(function (module, exports) {
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







	class TrackGroupPanel extends panel.Panel {
	    constructor({ attrs }) {
	        super();
	        this.shellWidth = 0;
	        this.trackGroupId = attrs.trackGroupId;
	        const trackCreator = track_registry.trackRegistry.get(this.summaryTrackState.kind);
	        this.summaryTrack = trackCreator.create(this.summaryTrackState);
	    }
	    get trackGroupState() {
	        return logging.assertExists(globals.globals.state.trackGroups[this.trackGroupId]);
	    }
	    get summaryTrackState() {
	        return logging.assertExists(globals.globals.state.tracks[this.trackGroupState.summaryTrack]);
	    }
	    view({ attrs }) {
	        const collapsed = this.trackGroupState.collapsed;
	        return mithril(`.process-panel[collapsed=${collapsed}]`, mithril('.shell', mithril('h1', `${this.trackGroupState.name}`), mithril('.fold-button', {
	            onclick: () => globals.globals.dispatch(actions.Actions.toggleTrackGroupCollapsed({
	                trackGroupId: attrs.trackGroupId,
	            })),
	        }, mithril('i.material-icons', this.trackGroupState.collapsed ? 'expand_more' :
	            'expand_less'))));
	    }
	    oncreate(vnode) {
	        this.onupdate(vnode);
	    }
	    onupdate({ dom }) {
	        const shell = logging.assertExists(dom.querySelector('.shell'));
	        this.shellWidth = shell.getBoundingClientRect().width;
	    }
	    renderCanvas(ctx, size) {
	        ctx.save();
	        ctx.translate(this.shellWidth, 0);
	        gridline_helper.drawGridLines(ctx, globals.globals.frontendLocalState.timeScale, globals.globals.frontendLocalState.visibleWindowTime, size.height);
	        // Do not show summary view if there are more than 10 track groups.
	        // Too slow now.
	        // TODO(dproy): Fix this.
	        if (Object.keys(globals.globals.state.trackGroups).length < 10) {
	            this.summaryTrack.renderCanvas(ctx);
	        }
	        ctx.restore();
	    }
	}
	exports.TrackGroupPanel = TrackGroupPanel;

	});

	unwrapExports(track_group_panel);
	var track_group_panel_1 = track_group_panel.TrackGroupPanel;

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
	class QueryTable extends panel.Panel {
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
	        return mithril('div', mithril('header.overview', mithril('span', `Query result - ${Math.round(resp.durationMs)} ms`, mithril('span.code', resp.query)), resp.error ? null :
	            mithril('button', {
	                onclick: () => {
	                    const lines = [];
	                    lines.push(resp.columns);
	                    for (const row of resp.rows) {
	                        const line = [];
	                        for (const col of resp.columns) {
	                            line.push(row[col].toString());
	                        }
	                        lines.push(line);
	                    }
	                    clipboard.copyToClipboard(lines.map(line => line.join('\t')).join('\n'));
	                },
	            }, 'Copy as .tsv')), resp.error ?
	            mithril('.query-error', `SQL error: ${resp.error}`) :
	            mithril('table.query-table', mithril('thead', header), mithril('tbody', rows)));
	    }
	    renderCanvas() { }
	}
	/**
	 * Top-most level component for the viewer page. Holds tracks, brush timeline,
	 * panels, and everything else that's part of the main trace viewer page.
	 */
	class TraceViewer {
	    constructor() {
	        this.onResize = () => { };
	    }
	    oncreate(vnode) {
	        const frontendLocalState = globals.globals.frontendLocalState;
	        const updateDimensions = () => {
	            const rect = vnode.dom.getBoundingClientRect();
	            frontendLocalState.timeScale.setLimitsPx(0, rect.width - track_panel.TRACK_SHELL_WIDTH);
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
	    }
	    onremove() {
	        window.removeEventListener('resize', this.onResize);
	        if (this.zoomContent)
	            this.zoomContent.shutdown();
	    }
	    view() {
	        const scrollingPanels = globals.globals.state.scrollingTracks.length > 0 ?
	            [
	                mithril(header_panel.HeaderPanel, { title: 'Tracks', key: 'tracksheader' }),
	                ...globals.globals.state.scrollingTracks.map(id => mithril(track_panel_2.TrackPanel, { key: id, id })),
	                mithril(flame_graph_panel.FlameGraphPanel, { key: 'flamegraph' }),
	            ] :
	            [];
	        for (const group of Object.values(globals.globals.state.trackGroups)) {
	            scrollingPanels.push(mithril(track_group_panel.TrackGroupPanel, {
	                trackGroupId: group.id,
	                key: `trackgroup-${group.id}`,
	            }));
	            if (group.collapsed)
	                continue;
	            for (const trackId of group.tracks) {
	                scrollingPanels.push(mithril(track_panel_2.TrackPanel, {
	                    key: `track-${group.id}-${trackId}`,
	                    id: trackId,
	                }));
	            }
	        }
	        scrollingPanels.unshift(mithril(QueryTable));
	        return mithril('.page', mithril('.pan-and-zoom-content', mithril('.pinned-panel-container', mithril(panel_container.PanelContainer, {
	            doesScroll: false,
	            panels: [
	                mithril(overview_timeline_panel.OverviewTimelinePanel, { key: 'overview' }),
	                mithril(time_axis_panel.TimeAxisPanel, { key: 'timeaxis' }),
	                ...globals.globals.state.pinnedTracks.map(id => mithril(track_panel_2.TrackPanel, { key: id, id })),
	            ],
	        })), mithril('.scrolling-panel-container', mithril(panel_container.PanelContainer, {
	            doesScroll: true,
	            panels: scrollingPanels,
	        }))));
	    }
	}
	exports.ViewerPage = pages.createPage({
	    view() {
	        return mithril(TraceViewer);
	    }
	});

	});

	unwrapExports(viewer_page);
	var viewer_page_1 = viewer_page.ViewerPage;

	var frontend$8 = createCommonjsModule(function (module, exports) {
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
	        '/record': record_page.RecordPage,
	    }, dispatch);
	    remote.forwardRemoteCalls(channel.port2, new FrontendApi(router$$1));
	    globals.globals.initialize(dispatch);
	    globals.globals.rafScheduler.domRedraw = () => mithril.render(document.body, mithril(router$$1.resolve(globals.globals.state.route)));
	    // Put these variables in the global scope for better debugging.
	    window.m = mithril;
	    window.globals = globals.globals;
	    // /?s=xxxx for permalinks.
	    const stateHash = router$$1.param('s');
	    if (stateHash) {
	        // TODO(hjd): Should requestId not be set to nextId++ in the controller?
	        globals.globals.dispatch(actions.Actions.loadPermalink({
	            requestId: new Date().toISOString(),
	            hash: stateHash,
	        }));
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

	var index = unwrapExports(frontend$8);

	return index;

}());
//# sourceMappingURL=frontend_bundle.js.map
