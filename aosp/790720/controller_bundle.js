var perfetto = (function () {
	'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

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

	var controller = createCommonjsModule(function (module, exports) {
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
	function Child(id, factory, args) {
	    return { id, factory, args };
	}
	exports.Child = Child;
	class Controller {
	    constructor(initialState) {
	        // This is about the local FSM state, has nothing to do with the global
	        // app state.
	        this._stateChanged = false;
	        this._inRunner = false;
	        this._children = new Map();
	        this._state = initialState;
	    }
	    onDestroy() { }
	    // Invokes the current controller subtree, recursing into children.
	    // While doing so handles lifecycle of child controllers.
	    // This method should be called only by the runControllers() method in
	    // globals.ts. Exposed publicly for testing.
	    invoke() {
	        if (this._inRunner)
	            throw new Error('Reentrancy in Controller');
	        this._stateChanged = false;
	        this._inRunner = true;
	        const resArray = this.run();
	        let triggerAnotherRun = this._stateChanged;
	        this._stateChanged = false;
	        const nextChildren = new Map();
	        if (resArray !== undefined) {
	            for (const childConfig of resArray) {
	                if (nextChildren.has(childConfig.id)) {
	                    throw new Error(`Duplicate children controller ${childConfig.id}`);
	                }
	                nextChildren.set(childConfig.id, childConfig);
	            }
	        }
	        const dtors = new Array();
	        const runners = new Array();
	        for (const key of this._children.keys()) {
	            if (nextChildren.has(key))
	                continue;
	            const instance = this._children.get(key);
	            this._children.delete(key);
	            dtors.push(() => instance.onDestroy());
	        }
	        for (const nextChild of nextChildren.values()) {
	            if (!this._children.has(nextChild.id)) {
	                const instance = new nextChild.factory(nextChild.args);
	                this._children.set(nextChild.id, instance);
	            }
	            const instance = this._children.get(nextChild.id);
	            runners.push(() => instance.invoke());
	        }
	        for (const dtor of dtors)
	            dtor(); // Invoke all onDestroy()s.
	        // Invoke all runner()s.
	        for (const runner of runners) {
	            const recursiveRes = runner();
	            triggerAnotherRun = triggerAnotherRun || recursiveRes;
	        }
	        this._inRunner = false;
	        return triggerAnotherRun;
	    }
	    setState(state) {
	        if (!this._inRunner) {
	            throw new Error('Cannot setState() outside of the run() method');
	        }
	        this._stateChanged = state !== this._state;
	        this._state = state;
	    }
	    get state() {
	        return this._state;
	    }
	}
	exports.Controller = Controller;

	});

	unwrapExports(controller);
	var controller_1 = controller.Child;
	var controller_2 = controller.Controller;

	function generatePatches(state, basepath, patches, inversePatches, baseValue, resultValue) {
	    if (patches) if (Array.isArray(baseValue)) generateArrayPatches(state, basepath, patches, inversePatches, baseValue, resultValue);else generateObjectPatches(state, basepath, patches, inversePatches, baseValue, resultValue);
	}

	function generateArrayPatches(state, basepath, patches, inversePatches, baseValue, resultValue) {
	    var shared = Math.min(baseValue.length, resultValue.length);
	    for (var i = 0; i < shared; i++) {
	        if (state.assigned[i] && baseValue[i] !== resultValue[i]) {
	            var path = basepath.concat(i);
	            patches.push({ op: "replace", path: path, value: resultValue[i] });
	            inversePatches.push({ op: "replace", path: path, value: baseValue[i] });
	        }
	    }
	    if (shared < resultValue.length) {
	        // stuff was added
	        for (var _i = shared; _i < resultValue.length; _i++) {
	            var _path = basepath.concat(_i);
	            patches.push({ op: "add", path: _path, value: resultValue[_i] });
	        }
	        inversePatches.push({
	            op: "replace",
	            path: basepath.concat("length"),
	            value: baseValue.length
	        });
	    } else if (shared < baseValue.length) {
	        // stuff was removed
	        patches.push({
	            op: "replace",
	            path: basepath.concat("length"),
	            value: resultValue.length
	        });
	        for (var _i2 = shared; _i2 < baseValue.length; _i2++) {
	            var _path2 = basepath.concat(_i2);
	            inversePatches.push({ op: "add", path: _path2, value: baseValue[_i2] });
	        }
	    }
	}

	function generateObjectPatches(state, basepath, patches, inversePatches, baseValue, resultValue) {
	    each(state.assigned, function (key, assignedValue) {
	        var origValue = baseValue[key];
	        var value = resultValue[key];
	        var op = !assignedValue ? "remove" : key in baseValue ? "replace" : "add";
	        if (origValue === baseValue && op === "replace") return;
	        var path = basepath.concat(key);
	        patches.push(op === "remove" ? { op: op, path: path } : { op: op, path: path, value: value });
	        inversePatches.push(op === "add" ? { op: "remove", path: path } : op === "remove" ? { op: "add", path: path, value: origValue } : { op: "replace", path: path, value: origValue });
	    });
	}

	function applyPatches(draft, patches) {
	    var _loop = function _loop(i) {
	        var patch = patches[i];
	        if (patch.path.length === 0 && patch.op === "replace") {
	            draft = patch.value;
	        } else {
	            var path = patch.path.slice();
	            var key = path.pop();
	            var base = path.reduce(function (current, part) {
	                if (!current) throw new Error("Cannot apply patch, path doesn't resolve: " + patch.path.join("/"));
	                return current[part];
	            }, draft);
	            if (!base) throw new Error("Cannot apply patch, path doesn't resolve: " + patch.path.join("/"));
	            switch (patch.op) {
	                case "replace":
	                case "add":
	                    // TODO: add support is not extensive, it does not support insertion or `-` atm!
	                    base[key] = patch.value;
	                    break;
	                case "remove":
	                    if (Array.isArray(base)) {
	                        if (key === base.length - 1) base.length -= 1;else throw new Error("Remove can only remove the last key of an array, index: " + key + ", length: " + base.length);
	                    } else delete base[key];
	                    break;
	                default:
	                    throw new Error("Unsupported patch operation: " + patch.op);
	            }
	        }
	    };

	    for (var i = 0; i < patches.length; i++) {
	        _loop(i);
	    }
	    return draft;
	}

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};



















	var defineProperty = function (obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	};

	var NOTHING = typeof Symbol !== "undefined" ? Symbol("immer-nothing") : defineProperty({}, "immer-nothing", true);

	var PROXY_STATE = typeof Symbol !== "undefined" ? Symbol("immer-proxy-state") : "__$immer_state";

	var RETURNED_AND_MODIFIED_ERROR = "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.";

	function verifyMinified() {}

	var inProduction = typeof process !== "undefined" && process.env.NODE_ENV === "production" || verifyMinified.name !== "verifyMinified";

	var autoFreeze = !inProduction;
	var useProxies = typeof Proxy !== "undefined";

	/**
	 * Automatically freezes any state trees generated by immer.
	 * This protects against accidental modifications of the state tree outside of an immer function.
	 * This comes with a performance impact, so it is recommended to disable this option in production.
	 * It is by default enabled.
	 *
	 * @returns {void}
	 */
	function setAutoFreeze(enableAutoFreeze) {
	    autoFreeze = enableAutoFreeze;
	}

	function setUseProxies(value) {
	    useProxies = value;
	}

	function getUseProxies() {
	    return useProxies;
	}

	function isProxy(value) {
	    return !!value && !!value[PROXY_STATE];
	}

	function isProxyable(value) {
	    if (!value) return false;
	    if ((typeof value === "undefined" ? "undefined" : _typeof(value)) !== "object") return false;
	    if (Array.isArray(value)) return true;
	    var proto = Object.getPrototypeOf(value);
	    return proto === null || proto === Object.prototype;
	}

	function freeze(value) {
	    if (autoFreeze) {
	        Object.freeze(value);
	    }
	    return value;
	}

	function original(value) {
	    if (value && value[PROXY_STATE]) {
	        return value[PROXY_STATE].base;
	    }
	    // otherwise return undefined
	}

	var assign = Object.assign || function assign(target, value) {
	    for (var key in value) {
	        if (has(value, key)) {
	            target[key] = value[key];
	        }
	    }
	    return target;
	};

	function shallowCopy(value) {
	    if (Array.isArray(value)) return value.slice();
	    var target = value.__proto__ === undefined ? Object.create(null) : {};
	    return assign(target, value);
	}

	function each(value, cb) {
	    if (Array.isArray(value)) {
	        for (var i = 0; i < value.length; i++) {
	            cb(i, value[i]);
	        }
	    } else {
	        for (var key in value) {
	            cb(key, value[key]);
	        }
	    }
	}

	function has(thing, prop) {
	    return Object.prototype.hasOwnProperty.call(thing, prop);
	}

	// given a base object, returns it if unmodified, or return the changed cloned if modified
	function finalize(base, path, patches, inversePatches) {
	    if (isProxy(base)) {
	        var state = base[PROXY_STATE];
	        if (state.modified === true) {
	            if (state.finalized === true) return state.copy;
	            state.finalized = true;
	            var result = finalizeObject(useProxies ? state.copy : state.copy = shallowCopy(base), state, path, patches, inversePatches);
	            generatePatches(state, path, patches, inversePatches, state.base, result);
	            return result;
	        } else {
	            return state.base;
	        }
	    }
	    finalizeNonProxiedObject(base);
	    return base;
	}

	function finalizeObject(copy, state, path, patches, inversePatches) {
	    var base = state.base;
	    each(copy, function (prop, value) {
	        if (value !== base[prop]) {
	            // if there was an assignment on this property, we don't need to generate
	            // patches for the subtree
	            var _generatePatches = patches && !has(state.assigned, prop);
	            copy[prop] = finalize(value, _generatePatches && path.concat(prop), _generatePatches && patches, inversePatches);
	        }
	    });
	    return freeze(copy);
	}

	function finalizeNonProxiedObject(parent) {
	    // If finalize is called on an object that was not a proxy, it means that it is an object that was not there in the original
	    // tree and it could contain proxies at arbitrarily places. Let's find and finalize them as well
	    if (!isProxyable(parent)) return;
	    if (Object.isFrozen(parent)) return;
	    each(parent, function (i, child) {
	        if (isProxy(child)) {
	            parent[i] = finalize(child);
	        } else finalizeNonProxiedObject(child);
	    });
	    // always freeze completely new data
	    freeze(parent);
	}



	function is(x, y) {
	    // From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
	    if (x === y) {
	        return x !== 0 || 1 / x === 1 / y;
	    } else {
	        return x !== x && y !== y;
	    }
	}

	// @ts-check

	var proxies = null;

	var objectTraps = {
	    get: get$1,
	    has: function has$$1(target, prop) {
	        return prop in source(target);
	    },
	    ownKeys: function ownKeys(target) {
	        return Reflect.ownKeys(source(target));
	    },

	    set: set$1,
	    deleteProperty: deleteProperty,
	    getOwnPropertyDescriptor: getOwnPropertyDescriptor,
	    defineProperty: defineProperty$1,
	    setPrototypeOf: function setPrototypeOf() {
	        throw new Error("Immer does not support `setPrototypeOf()`.");
	    }
	};

	var arrayTraps = {};
	each(objectTraps, function (key, fn) {
	    arrayTraps[key] = function () {
	        arguments[0] = arguments[0][0];
	        return fn.apply(this, arguments);
	    };
	});
	arrayTraps.deleteProperty = function (state, prop) {
	    if (isNaN(parseInt(prop))) throw new Error("Immer does not support deleting properties from arrays: " + prop);
	    return objectTraps.deleteProperty.call(this, state[0], prop);
	};
	arrayTraps.set = function (state, prop, value) {
	    if (prop !== "length" && isNaN(parseInt(prop))) throw new Error("Immer does not support setting non-numeric properties on arrays: " + prop);
	    return objectTraps.set.call(this, state[0], prop, value);
	};

	function createState(parent, base) {
	    return {
	        modified: false, // this tree is modified (either this object or one of it's children)
	        assigned: {}, // true: value was assigned to these props, false: was removed
	        finalized: false,
	        parent: parent,
	        base: base,
	        copy: undefined,
	        proxies: {}
	    };
	}

	function source(state) {
	    return state.modified === true ? state.copy : state.base;
	}

	function get$1(state, prop) {
	    if (prop === PROXY_STATE) return state;
	    if (state.modified) {
	        var value = state.copy[prop];
	        if (value === state.base[prop] && isProxyable(value))
	            // only create proxy if it is not yet a proxy, and not a new object
	            // (new objects don't need proxying, they will be processed in finalize anyway)
	            return state.copy[prop] = createProxy(state, value);
	        return value;
	    } else {
	        if (has(state.proxies, prop)) return state.proxies[prop];
	        var _value = state.base[prop];
	        if (!isProxy(_value) && isProxyable(_value)) return state.proxies[prop] = createProxy(state, _value);
	        return _value;
	    }
	}

	function set$1(state, prop, value) {
	    // TODO: optimize
	    state.assigned[prop] = true;
	    if (!state.modified) {
	        if (prop in state.base && is(state.base[prop], value) || has(state.proxies, prop) && state.proxies[prop] === value) return true;
	        markChanged(state);
	    }
	    state.copy[prop] = value;
	    return true;
	}

	function deleteProperty(state, prop) {
	    state.assigned[prop] = false;
	    markChanged(state);
	    delete state.copy[prop];
	    return true;
	}

	function getOwnPropertyDescriptor(state, prop) {
	    var owner = state.modified ? state.copy : has(state.proxies, prop) ? state.proxies : state.base;
	    var descriptor = Reflect.getOwnPropertyDescriptor(owner, prop);
	    if (descriptor && !(Array.isArray(owner) && prop === "length")) descriptor.configurable = true;
	    return descriptor;
	}

	function defineProperty$1() {
	    throw new Error("Immer does not support defining properties on draft objects.");
	}

	function markChanged(state) {
	    if (!state.modified) {
	        state.modified = true;
	        state.copy = shallowCopy(state.base);
	        // copy the proxies over the base-copy
	        Object.assign(state.copy, state.proxies); // yup that works for arrays as well
	        if (state.parent) markChanged(state.parent);
	    }
	}

	// creates a proxy for plain objects / arrays
	function createProxy(parentState, base, key) {
	    if (isProxy(base)) throw new Error("Immer bug. Plz report.");
	    var state = createState(parentState, base, key);
	    var proxy = Array.isArray(base) ? Proxy.revocable([state], arrayTraps) : Proxy.revocable(state, objectTraps);
	    proxies.push(proxy);
	    return proxy.proxy;
	}

	function produceProxy(baseState, producer, patchListener) {
	    if (isProxy(baseState)) {
	        // See #100, don't nest producers
	        var returnValue = producer.call(baseState, baseState);
	        return returnValue === undefined ? baseState : returnValue;
	    }
	    var previousProxies = proxies;
	    proxies = [];
	    var patches = patchListener && [];
	    var inversePatches = patchListener && [];
	    try {
	        // create proxy for root
	        var rootProxy = createProxy(undefined, baseState);
	        // execute the thunk
	        var _returnValue = producer.call(rootProxy, rootProxy);
	        // and finalize the modified proxy
	        var result = void 0;
	        // check whether the draft was modified and/or a value was returned
	        if (_returnValue !== undefined && _returnValue !== rootProxy) {
	            // something was returned, and it wasn't the proxy itself
	            if (rootProxy[PROXY_STATE].modified) throw new Error(RETURNED_AND_MODIFIED_ERROR);

	            // See #117
	            // Should we just throw when returning a proxy which is not the root, but a subset of the original state?
	            // Looks like a wrongly modeled reducer
	            result = finalize(_returnValue);
	            if (patches) {
	                patches.push({ op: "replace", path: [], value: result });
	                inversePatches.push({ op: "replace", path: [], value: baseState });
	            }
	        } else {
	            result = finalize(rootProxy, [], patches, inversePatches);
	        }
	        // revoke all proxies
	        each(proxies, function (_, p) {
	            return p.revoke();
	        });
	        patchListener && patchListener(patches, inversePatches);
	        return result;
	    } finally {
	        proxies = previousProxies;
	    }
	}

	// @ts-check

	var descriptors = {};
	var states = null;

	function createState$1(parent, proxy, base) {
	    return {
	        modified: false,
	        assigned: {}, // true: value was assigned to these props, false: was removed
	        hasCopy: false,
	        parent: parent,
	        base: base,
	        proxy: proxy,
	        copy: undefined,
	        finished: false,
	        finalizing: false,
	        finalized: false
	    };
	}

	function source$1(state) {
	    return state.hasCopy ? state.copy : state.base;
	}

	function _get(state, prop) {
	    assertUnfinished(state);
	    var value = source$1(state)[prop];
	    if (!state.finalizing && value === state.base[prop] && isProxyable(value)) {
	        // only create a proxy if the value is proxyable, and the value was in the base state
	        // if it wasn't in the base state, the object is already modified and we will process it in finalize
	        prepareCopy(state);
	        return state.copy[prop] = createProxy$1(state, value);
	    }
	    return value;
	}

	function _set(state, prop, value) {
	    assertUnfinished(state);
	    state.assigned[prop] = true; // optimization; skip this if there is no listener
	    if (!state.modified) {
	        if (is(source$1(state)[prop], value)) return;
	        markChanged$1(state);
	        prepareCopy(state);
	    }
	    state.copy[prop] = value;
	}

	function markChanged$1(state) {
	    if (!state.modified) {
	        state.modified = true;
	        if (state.parent) markChanged$1(state.parent);
	    }
	}

	function prepareCopy(state) {
	    if (state.hasCopy) return;
	    state.hasCopy = true;
	    state.copy = shallowCopy(state.base);
	}

	// creates a proxy for plain objects / arrays
	function createProxy$1(parent, base) {
	    var proxy = shallowCopy(base);
	    each(base, function (i) {
	        Object.defineProperty(proxy, "" + i, createPropertyProxy("" + i));
	    });
	    var state = createState$1(parent, proxy, base);
	    createHiddenProperty(proxy, PROXY_STATE, state);
	    states.push(state);
	    return proxy;
	}

	function createPropertyProxy(prop) {
	    return descriptors[prop] || (descriptors[prop] = {
	        configurable: true,
	        enumerable: true,
	        get: function get$$1() {
	            return _get(this[PROXY_STATE], prop);
	        },
	        set: function set$$1(value) {
	            _set(this[PROXY_STATE], prop, value);
	        }
	    });
	}

	function assertUnfinished(state) {
	    if (state.finished === true) throw new Error("Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + JSON.stringify(state.copy || state.base));
	}

	// this sounds very expensive, but actually it is not that expensive in practice
	// as it will only visit proxies, and only do key-based change detection for objects for
	// which it is not already know that they are changed (that is, only object for which no known key was changed)
	function markChangesSweep() {
	    // intentionally we process the proxies in reverse order;
	    // ideally we start by processing leafs in the tree, because if a child has changed, we don't have to check the parent anymore
	    // reverse order of proxy creation approximates this
	    for (var i = states.length - 1; i >= 0; i--) {
	        var state = states[i];
	        if (state.modified === false) {
	            if (Array.isArray(state.base)) {
	                if (hasArrayChanges(state)) markChanged$1(state);
	            } else if (hasObjectChanges(state)) markChanged$1(state);
	        }
	    }
	}

	function markChangesRecursively(object) {
	    if (!object || (typeof object === "undefined" ? "undefined" : _typeof(object)) !== "object") return;
	    var state = object[PROXY_STATE];
	    if (!state) return;
	    var proxy = state.proxy,
	        base = state.base;

	    if (Array.isArray(object)) {
	        if (hasArrayChanges(state)) {
	            markChanged$1(state);
	            state.assigned.length = true;
	            if (proxy.length < base.length) for (var i = proxy.length; i < base.length; i++) {
	                state.assigned[i] = false;
	            } else for (var _i = base.length; _i < proxy.length; _i++) {
	                state.assigned[_i] = true;
	            }each(proxy, function (index, child) {
	                if (!state.assigned[index]) markChangesRecursively(child);
	            });
	        }
	    } else {
	        var _diffKeys = diffKeys(base, proxy),
	            added = _diffKeys.added,
	            removed = _diffKeys.removed;

	        if (added.length > 0 || removed.length > 0) markChanged$1(state);
	        each(added, function (_, key) {
	            state.assigned[key] = true;
	        });
	        each(removed, function (_, key) {
	            state.assigned[key] = false;
	        });
	        each(proxy, function (key, child) {
	            if (!state.assigned[key]) markChangesRecursively(child);
	        });
	    }
	}

	function diffKeys(from, to) {
	    // TODO: optimize
	    var a = Object.keys(from);
	    var b = Object.keys(to);
	    return {
	        added: b.filter(function (key) {
	            return a.indexOf(key) === -1;
	        }),
	        removed: a.filter(function (key) {
	            return b.indexOf(key) === -1;
	        })
	    };
	}

	function hasObjectChanges(state) {
	    var baseKeys = Object.keys(state.base);
	    var keys = Object.keys(state.proxy);
	    return !shallowEqual(baseKeys, keys);
	}

	function hasArrayChanges(state) {
	    var proxy = state.proxy;

	    if (proxy.length !== state.base.length) return true;
	    // See #116
	    // If we first shorten the length, our array interceptors will be removed.
	    // If after that new items are added, result in the same original length,
	    // those last items will have no intercepting property.
	    // So if there is no own descriptor on the last position, we know that items were removed and added
	    // N.B.: splice, unshift, etc only shift values around, but not prop descriptors, so we only have to check
	    // the last one
	    var descriptor = Object.getOwnPropertyDescriptor(proxy, proxy.length - 1);
	    // descriptor can be null, but only for newly created sparse arrays, eg. new Array(10)
	    if (descriptor && !descriptor.get) return true;
	    // For all other cases, we don't have to compare, as they would have been picked up by the index setters
	    return false;
	}

	function produceEs5(baseState, producer, patchListener) {
	    if (isProxy(baseState)) {
	        // See #100, don't nest producers
	        var returnValue = producer.call(baseState, baseState);
	        return returnValue === undefined ? baseState : returnValue;
	    }
	    var prevStates = states;
	    states = [];
	    var patches = patchListener && [];
	    var inversePatches = patchListener && [];
	    try {
	        // create proxy for root
	        var rootProxy = createProxy$1(undefined, baseState);
	        // execute the thunk
	        var _returnValue = producer.call(rootProxy, rootProxy);
	        // and finalize the modified proxy
	        each(states, function (_, state) {
	            state.finalizing = true;
	        });
	        var result = void 0;
	        // check whether the draft was modified and/or a value was returned
	        if (_returnValue !== undefined && _returnValue !== rootProxy) {
	            // something was returned, and it wasn't the proxy itself
	            if (rootProxy[PROXY_STATE].modified) throw new Error(RETURNED_AND_MODIFIED_ERROR);
	            result = finalize(_returnValue);
	            if (patches) {
	                patches.push({ op: "replace", path: [], value: result });
	                inversePatches.push({ op: "replace", path: [], value: baseState });
	            }
	        } else {
	            if (patchListener) markChangesRecursively(rootProxy);
	            markChangesSweep(); // this one is more efficient if we don't need to know which attributes have changed
	            result = finalize(rootProxy, [], patches, inversePatches);
	        }
	        // make sure all proxies become unusable
	        each(states, function (_, state) {
	            state.finished = true;
	        });
	        patchListener && patchListener(patches, inversePatches);
	        return result;
	    } finally {
	        states = prevStates;
	    }
	}

	function shallowEqual(objA, objB) {
	    //From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
	    if (is(objA, objB)) return true;
	    if ((typeof objA === "undefined" ? "undefined" : _typeof(objA)) !== "object" || objA === null || (typeof objB === "undefined" ? "undefined" : _typeof(objB)) !== "object" || objB === null) {
	        return false;
	    }
	    var keysA = Object.keys(objA);
	    var keysB = Object.keys(objB);
	    if (keysA.length !== keysB.length) return false;
	    for (var i = 0; i < keysA.length; i++) {
	        if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
	            return false;
	        }
	    }
	    return true;
	}

	function createHiddenProperty(target, prop, value) {
	    Object.defineProperty(target, prop, {
	        value: value,
	        enumerable: false,
	        writable: true
	    });
	}

	/**
	 * produce takes a state, and runs a function against it.
	 * That function can freely mutate the state, as it will create copies-on-write.
	 * This means that the original state will stay unchanged, and once the function finishes, the modified state is returned
	 *
	 * @export
	 * @param {any} baseState - the state to start with
	 * @param {Function} producer - function that receives a proxy of the base state as first argument and which can be freely modified
	 * @param {Function} patchListener - optional function that will be called with all the patches produced here
	 * @returns {any} a new state, or the base state if nothing was modified
	 */
	function produce(baseState, producer, patchListener) {
	    // prettier-ignore
	    if (arguments.length < 1 || arguments.length > 3) throw new Error("produce expects 1 to 3 arguments, got " + arguments.length);

	    // curried invocation
	    if (typeof baseState === "function") {
	        // prettier-ignore
	        if (typeof producer === "function") throw new Error("if first argument is a function (curried invocation), the second argument to produce cannot be a function");

	        var initialState = producer;
	        var recipe = baseState;

	        return function () {
	            var args = arguments;

	            var currentState = args[0] === undefined && initialState !== undefined ? initialState : args[0];

	            return produce(currentState, function (draft) {
	                args[0] = draft; // blegh!
	                return recipe.apply(draft, args);
	            });
	        };
	    }

	    // prettier-ignore
	    {
	        if (typeof producer !== "function") throw new Error("if first argument is not a function, the second argument to produce should be a function");
	        if (patchListener !== undefined && typeof patchListener !== "function") throw new Error("the third argument of a producer should not be set or a function");
	    }

	    // if state is a primitive, don't bother proxying at all
	    if ((typeof baseState === "undefined" ? "undefined" : _typeof(baseState)) !== "object" || baseState === null) {
	        var returnValue = producer(baseState);
	        return returnValue === undefined ? baseState : normalizeResult(returnValue);
	    }

	    if (!isProxyable(baseState)) throw new Error("the first argument to an immer producer should be a primitive, plain object or array, got " + (typeof baseState === "undefined" ? "undefined" : _typeof(baseState)) + ": \"" + baseState + "\"");
	    return normalizeResult(getUseProxies() ? produceProxy(baseState, producer, patchListener) : produceEs5(baseState, producer, patchListener));
	}

	function normalizeResult(result) {
	    return result === NOTHING ? undefined : result;
	}

	var applyPatches$1 = produce(applyPatches);

	var nothing = NOTHING;

	var immer_module = /*#__PURE__*/Object.freeze({
		produce: produce,
		applyPatches: applyPatches$1,
		nothing: nothing,
		setAutoFreeze: setAutoFreeze,
		setUseProxies: setUseProxies,
		original: original,
		default: produce
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
	             * @property {number|Long|null} [executionTimeNs] RawQueryResult executionTimeNs
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
	             * RawQueryResult executionTimeNs.
	             * @member {number|Long} executionTimeNs
	             * @memberof perfetto.protos.RawQueryResult
	             * @instance
	             */
	            RawQueryResult.prototype.executionTimeNs = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

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
	                if (message.executionTimeNs != null && message.hasOwnProperty("executionTimeNs"))
	                    writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.executionTimeNs);
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
	                    case 5:
	                        message.executionTimeNs = reader.uint64();
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
	                if (message.executionTimeNs != null && message.hasOwnProperty("executionTimeNs"))
	                    if (!$util.isInteger(message.executionTimeNs) && !(message.executionTimeNs && $util.isInteger(message.executionTimeNs.low) && $util.isInteger(message.executionTimeNs.high)))
	                        return "executionTimeNs: integer|Long expected";
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
	                if (object.executionTimeNs != null)
	                    if ($util.Long)
	                        (message.executionTimeNs = $util.Long.fromValue(object.executionTimeNs)).unsigned = true;
	                    else if (typeof object.executionTimeNs === "string")
	                        message.executionTimeNs = parseInt(object.executionTimeNs, 10);
	                    else if (typeof object.executionTimeNs === "number")
	                        message.executionTimeNs = object.executionTimeNs;
	                    else if (typeof object.executionTimeNs === "object")
	                        message.executionTimeNs = new $util.LongBits(object.executionTimeNs.low >>> 0, object.executionTimeNs.high >>> 0).toNumber(true);
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
	                    if ($util.Long) {
	                        var long = new $util.Long(0, 0, true);
	                        object.executionTimeNs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
	                    } else
	                        object.executionTimeNs = options.longs === String ? "0" : 0;
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
	                if (message.executionTimeNs != null && message.hasOwnProperty("executionTimeNs"))
	                    if (typeof message.executionTimeNs === "number")
	                        object.executionTimeNs = options.longs === String ? String(message.executionTimeNs) : message.executionTimeNs;
	                    else
	                        object.executionTimeNs = options.longs === String ? $util.Long.prototype.toString.call(message.executionTimeNs) : options.longs === Number ? new $util.LongBits(message.executionTimeNs.low >>> 0, message.executionTimeNs.high >>> 0).toNumber(true) : message.executionTimeNs;
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

	        /**
	         * MeminfoCounters enum.
	         * @name perfetto.protos.MeminfoCounters
	         * @enum {string}
	         * @property {number} MEMINFO_UNSPECIFIED=0 MEMINFO_UNSPECIFIED value
	         * @property {number} MEMINFO_MEM_TOTAL=1 MEMINFO_MEM_TOTAL value
	         * @property {number} MEMINFO_MEM_FREE=2 MEMINFO_MEM_FREE value
	         * @property {number} MEMINFO_MEM_AVAILABLE=3 MEMINFO_MEM_AVAILABLE value
	         * @property {number} MEMINFO_BUFFERS=4 MEMINFO_BUFFERS value
	         * @property {number} MEMINFO_CACHED=5 MEMINFO_CACHED value
	         * @property {number} MEMINFO_SWAP_CACHED=6 MEMINFO_SWAP_CACHED value
	         * @property {number} MEMINFO_ACTIVE=7 MEMINFO_ACTIVE value
	         * @property {number} MEMINFO_INACTIVE=8 MEMINFO_INACTIVE value
	         * @property {number} MEMINFO_ACTIVE_ANON=9 MEMINFO_ACTIVE_ANON value
	         * @property {number} MEMINFO_INACTIVE_ANON=10 MEMINFO_INACTIVE_ANON value
	         * @property {number} MEMINFO_ACTIVE_FILE=11 MEMINFO_ACTIVE_FILE value
	         * @property {number} MEMINFO_INACTIVE_FILE=12 MEMINFO_INACTIVE_FILE value
	         * @property {number} MEMINFO_UNEVICTABLE=13 MEMINFO_UNEVICTABLE value
	         * @property {number} MEMINFO_MLOCKED=14 MEMINFO_MLOCKED value
	         * @property {number} MEMINFO_SWAP_TOTAL=15 MEMINFO_SWAP_TOTAL value
	         * @property {number} MEMINFO_SWAP_FREE=16 MEMINFO_SWAP_FREE value
	         * @property {number} MEMINFO_DIRTY=17 MEMINFO_DIRTY value
	         * @property {number} MEMINFO_WRITEBACK=18 MEMINFO_WRITEBACK value
	         * @property {number} MEMINFO_ANON_PAGES=19 MEMINFO_ANON_PAGES value
	         * @property {number} MEMINFO_MAPPED=20 MEMINFO_MAPPED value
	         * @property {number} MEMINFO_SHMEM=21 MEMINFO_SHMEM value
	         * @property {number} MEMINFO_SLAB=22 MEMINFO_SLAB value
	         * @property {number} MEMINFO_SLAB_RECLAIMABLE=23 MEMINFO_SLAB_RECLAIMABLE value
	         * @property {number} MEMINFO_SLAB_UNRECLAIMABLE=24 MEMINFO_SLAB_UNRECLAIMABLE value
	         * @property {number} MEMINFO_KERNEL_STACK=25 MEMINFO_KERNEL_STACK value
	         * @property {number} MEMINFO_PAGE_TABLES=26 MEMINFO_PAGE_TABLES value
	         * @property {number} MEMINFO_COMMIT_LIMIT=27 MEMINFO_COMMIT_LIMIT value
	         * @property {number} MEMINFO_COMMITED_AS=28 MEMINFO_COMMITED_AS value
	         * @property {number} MEMINFO_VMALLOC_TOTAL=29 MEMINFO_VMALLOC_TOTAL value
	         * @property {number} MEMINFO_VMALLOC_USED=30 MEMINFO_VMALLOC_USED value
	         * @property {number} MEMINFO_VMALLOC_CHUNK=31 MEMINFO_VMALLOC_CHUNK value
	         * @property {number} MEMINFO_CMA_TOTAL=32 MEMINFO_CMA_TOTAL value
	         * @property {number} MEMINFO_CMA_FREE=33 MEMINFO_CMA_FREE value
	         */
	        protos.MeminfoCounters = (function() {
	            var valuesById = {}, values = Object.create(valuesById);
	            values[valuesById[0] = "MEMINFO_UNSPECIFIED"] = 0;
	            values[valuesById[1] = "MEMINFO_MEM_TOTAL"] = 1;
	            values[valuesById[2] = "MEMINFO_MEM_FREE"] = 2;
	            values[valuesById[3] = "MEMINFO_MEM_AVAILABLE"] = 3;
	            values[valuesById[4] = "MEMINFO_BUFFERS"] = 4;
	            values[valuesById[5] = "MEMINFO_CACHED"] = 5;
	            values[valuesById[6] = "MEMINFO_SWAP_CACHED"] = 6;
	            values[valuesById[7] = "MEMINFO_ACTIVE"] = 7;
	            values[valuesById[8] = "MEMINFO_INACTIVE"] = 8;
	            values[valuesById[9] = "MEMINFO_ACTIVE_ANON"] = 9;
	            values[valuesById[10] = "MEMINFO_INACTIVE_ANON"] = 10;
	            values[valuesById[11] = "MEMINFO_ACTIVE_FILE"] = 11;
	            values[valuesById[12] = "MEMINFO_INACTIVE_FILE"] = 12;
	            values[valuesById[13] = "MEMINFO_UNEVICTABLE"] = 13;
	            values[valuesById[14] = "MEMINFO_MLOCKED"] = 14;
	            values[valuesById[15] = "MEMINFO_SWAP_TOTAL"] = 15;
	            values[valuesById[16] = "MEMINFO_SWAP_FREE"] = 16;
	            values[valuesById[17] = "MEMINFO_DIRTY"] = 17;
	            values[valuesById[18] = "MEMINFO_WRITEBACK"] = 18;
	            values[valuesById[19] = "MEMINFO_ANON_PAGES"] = 19;
	            values[valuesById[20] = "MEMINFO_MAPPED"] = 20;
	            values[valuesById[21] = "MEMINFO_SHMEM"] = 21;
	            values[valuesById[22] = "MEMINFO_SLAB"] = 22;
	            values[valuesById[23] = "MEMINFO_SLAB_RECLAIMABLE"] = 23;
	            values[valuesById[24] = "MEMINFO_SLAB_UNRECLAIMABLE"] = 24;
	            values[valuesById[25] = "MEMINFO_KERNEL_STACK"] = 25;
	            values[valuesById[26] = "MEMINFO_PAGE_TABLES"] = 26;
	            values[valuesById[27] = "MEMINFO_COMMIT_LIMIT"] = 27;
	            values[valuesById[28] = "MEMINFO_COMMITED_AS"] = 28;
	            values[valuesById[29] = "MEMINFO_VMALLOC_TOTAL"] = 29;
	            values[valuesById[30] = "MEMINFO_VMALLOC_USED"] = 30;
	            values[valuesById[31] = "MEMINFO_VMALLOC_CHUNK"] = 31;
	            values[valuesById[32] = "MEMINFO_CMA_TOTAL"] = 32;
	            values[valuesById[33] = "MEMINFO_CMA_FREE"] = 33;
	            return values;
	        })();

	        /**
	         * VmstatCounters enum.
	         * @name perfetto.protos.VmstatCounters
	         * @enum {string}
	         * @property {number} VMSTAT_UNSPECIFIED=0 VMSTAT_UNSPECIFIED value
	         * @property {number} VMSTAT_NR_FREE_PAGES=1 VMSTAT_NR_FREE_PAGES value
	         * @property {number} VMSTAT_NR_ALLOC_BATCH=2 VMSTAT_NR_ALLOC_BATCH value
	         * @property {number} VMSTAT_NR_INACTIVE_ANON=3 VMSTAT_NR_INACTIVE_ANON value
	         * @property {number} VMSTAT_NR_ACTIVE_ANON=4 VMSTAT_NR_ACTIVE_ANON value
	         * @property {number} VMSTAT_NR_INACTIVE_FILE=5 VMSTAT_NR_INACTIVE_FILE value
	         * @property {number} VMSTAT_NR_ACTIVE_FILE=6 VMSTAT_NR_ACTIVE_FILE value
	         * @property {number} VMSTAT_NR_UNEVICTABLE=7 VMSTAT_NR_UNEVICTABLE value
	         * @property {number} VMSTAT_NR_MLOCK=8 VMSTAT_NR_MLOCK value
	         * @property {number} VMSTAT_NR_ANON_PAGES=9 VMSTAT_NR_ANON_PAGES value
	         * @property {number} VMSTAT_NR_MAPPED=10 VMSTAT_NR_MAPPED value
	         * @property {number} VMSTAT_NR_FILE_PAGES=11 VMSTAT_NR_FILE_PAGES value
	         * @property {number} VMSTAT_NR_DIRTY=12 VMSTAT_NR_DIRTY value
	         * @property {number} VMSTAT_NR_WRITEBACK=13 VMSTAT_NR_WRITEBACK value
	         * @property {number} VMSTAT_NR_SLAB_RECLAIMABLE=14 VMSTAT_NR_SLAB_RECLAIMABLE value
	         * @property {number} VMSTAT_NR_SLAB_UNRECLAIMABLE=15 VMSTAT_NR_SLAB_UNRECLAIMABLE value
	         * @property {number} VMSTAT_NR_PAGE_TABLE_PAGES=16 VMSTAT_NR_PAGE_TABLE_PAGES value
	         * @property {number} VMSTAT_NR_KERNEL_STACK=17 VMSTAT_NR_KERNEL_STACK value
	         * @property {number} VMSTAT_NR_OVERHEAD=18 VMSTAT_NR_OVERHEAD value
	         * @property {number} VMSTAT_NR_UNSTABLE=19 VMSTAT_NR_UNSTABLE value
	         * @property {number} VMSTAT_NR_BOUNCE=20 VMSTAT_NR_BOUNCE value
	         * @property {number} VMSTAT_NR_VMSCAN_WRITE=21 VMSTAT_NR_VMSCAN_WRITE value
	         * @property {number} VMSTAT_NR_VMSCAN_IMMEDIATE_RECLAIM=22 VMSTAT_NR_VMSCAN_IMMEDIATE_RECLAIM value
	         * @property {number} VMSTAT_NR_WRITEBACK_TEMP=23 VMSTAT_NR_WRITEBACK_TEMP value
	         * @property {number} VMSTAT_NR_ISOLATED_ANON=24 VMSTAT_NR_ISOLATED_ANON value
	         * @property {number} VMSTAT_NR_ISOLATED_FILE=25 VMSTAT_NR_ISOLATED_FILE value
	         * @property {number} VMSTAT_NR_SHMEM=26 VMSTAT_NR_SHMEM value
	         * @property {number} VMSTAT_NR_DIRTIED=27 VMSTAT_NR_DIRTIED value
	         * @property {number} VMSTAT_NR_WRITTEN=28 VMSTAT_NR_WRITTEN value
	         * @property {number} VMSTAT_NR_PAGES_SCANNED=29 VMSTAT_NR_PAGES_SCANNED value
	         * @property {number} VMSTAT_WORKINGSET_REFAULT=30 VMSTAT_WORKINGSET_REFAULT value
	         * @property {number} VMSTAT_WORKINGSET_ACTIVATE=31 VMSTAT_WORKINGSET_ACTIVATE value
	         * @property {number} VMSTAT_WORKINGSET_NODERECLAIM=32 VMSTAT_WORKINGSET_NODERECLAIM value
	         * @property {number} VMSTAT_NR_ANON_TRANSPARENT_HUGEPAGES=33 VMSTAT_NR_ANON_TRANSPARENT_HUGEPAGES value
	         * @property {number} VMSTAT_NR_FREE_CMA=34 VMSTAT_NR_FREE_CMA value
	         * @property {number} VMSTAT_NR_SWAPCACHE=35 VMSTAT_NR_SWAPCACHE value
	         * @property {number} VMSTAT_NR_DIRTY_THRESHOLD=36 VMSTAT_NR_DIRTY_THRESHOLD value
	         * @property {number} VMSTAT_NR_DIRTY_BACKGROUND_THRESHOLD=37 VMSTAT_NR_DIRTY_BACKGROUND_THRESHOLD value
	         * @property {number} VMSTAT_PGPGIN=38 VMSTAT_PGPGIN value
	         * @property {number} VMSTAT_PGPGOUT=39 VMSTAT_PGPGOUT value
	         * @property {number} VMSTAT_PGPGOUTCLEAN=40 VMSTAT_PGPGOUTCLEAN value
	         * @property {number} VMSTAT_PSWPIN=41 VMSTAT_PSWPIN value
	         * @property {number} VMSTAT_PSWPOUT=42 VMSTAT_PSWPOUT value
	         * @property {number} VMSTAT_PGALLOC_DMA=43 VMSTAT_PGALLOC_DMA value
	         * @property {number} VMSTAT_PGALLOC_NORMAL=44 VMSTAT_PGALLOC_NORMAL value
	         * @property {number} VMSTAT_PGALLOC_MOVABLE=45 VMSTAT_PGALLOC_MOVABLE value
	         * @property {number} VMSTAT_PGFREE=46 VMSTAT_PGFREE value
	         * @property {number} VMSTAT_PGACTIVATE=47 VMSTAT_PGACTIVATE value
	         * @property {number} VMSTAT_PGDEACTIVATE=48 VMSTAT_PGDEACTIVATE value
	         * @property {number} VMSTAT_PGFAULT=49 VMSTAT_PGFAULT value
	         * @property {number} VMSTAT_PGMAJFAULT=50 VMSTAT_PGMAJFAULT value
	         * @property {number} VMSTAT_PGREFILL_DMA=51 VMSTAT_PGREFILL_DMA value
	         * @property {number} VMSTAT_PGREFILL_NORMAL=52 VMSTAT_PGREFILL_NORMAL value
	         * @property {number} VMSTAT_PGREFILL_MOVABLE=53 VMSTAT_PGREFILL_MOVABLE value
	         * @property {number} VMSTAT_PGSTEAL_KSWAPD_DMA=54 VMSTAT_PGSTEAL_KSWAPD_DMA value
	         * @property {number} VMSTAT_PGSTEAL_KSWAPD_NORMAL=55 VMSTAT_PGSTEAL_KSWAPD_NORMAL value
	         * @property {number} VMSTAT_PGSTEAL_KSWAPD_MOVABLE=56 VMSTAT_PGSTEAL_KSWAPD_MOVABLE value
	         * @property {number} VMSTAT_PGSTEAL_DIRECT_DMA=57 VMSTAT_PGSTEAL_DIRECT_DMA value
	         * @property {number} VMSTAT_PGSTEAL_DIRECT_NORMAL=58 VMSTAT_PGSTEAL_DIRECT_NORMAL value
	         * @property {number} VMSTAT_PGSTEAL_DIRECT_MOVABLE=59 VMSTAT_PGSTEAL_DIRECT_MOVABLE value
	         * @property {number} VMSTAT_PGSCAN_KSWAPD_DMA=60 VMSTAT_PGSCAN_KSWAPD_DMA value
	         * @property {number} VMSTAT_PGSCAN_KSWAPD_NORMAL=61 VMSTAT_PGSCAN_KSWAPD_NORMAL value
	         * @property {number} VMSTAT_PGSCAN_KSWAPD_MOVABLE=62 VMSTAT_PGSCAN_KSWAPD_MOVABLE value
	         * @property {number} VMSTAT_PGSCAN_DIRECT_DMA=63 VMSTAT_PGSCAN_DIRECT_DMA value
	         * @property {number} VMSTAT_PGSCAN_DIRECT_NORMAL=64 VMSTAT_PGSCAN_DIRECT_NORMAL value
	         * @property {number} VMSTAT_PGSCAN_DIRECT_MOVABLE=65 VMSTAT_PGSCAN_DIRECT_MOVABLE value
	         * @property {number} VMSTAT_PGSCAN_DIRECT_THROTTLE=66 VMSTAT_PGSCAN_DIRECT_THROTTLE value
	         * @property {number} VMSTAT_PGINODESTEAL=67 VMSTAT_PGINODESTEAL value
	         * @property {number} VMSTAT_SLABS_SCANNED=68 VMSTAT_SLABS_SCANNED value
	         * @property {number} VMSTAT_KSWAPD_INODESTEAL=69 VMSTAT_KSWAPD_INODESTEAL value
	         * @property {number} VMSTAT_KSWAPD_LOW_WMARK_HIT_QUICKLY=70 VMSTAT_KSWAPD_LOW_WMARK_HIT_QUICKLY value
	         * @property {number} VMSTAT_KSWAPD_HIGH_WMARK_HIT_QUICKLY=71 VMSTAT_KSWAPD_HIGH_WMARK_HIT_QUICKLY value
	         * @property {number} VMSTAT_PAGEOUTRUN=72 VMSTAT_PAGEOUTRUN value
	         * @property {number} VMSTAT_ALLOCSTALL=73 VMSTAT_ALLOCSTALL value
	         * @property {number} VMSTAT_PGROTATED=74 VMSTAT_PGROTATED value
	         * @property {number} VMSTAT_DROP_PAGECACHE=75 VMSTAT_DROP_PAGECACHE value
	         * @property {number} VMSTAT_DROP_SLAB=76 VMSTAT_DROP_SLAB value
	         * @property {number} VMSTAT_PGMIGRATE_SUCCESS=77 VMSTAT_PGMIGRATE_SUCCESS value
	         * @property {number} VMSTAT_PGMIGRATE_FAIL=78 VMSTAT_PGMIGRATE_FAIL value
	         * @property {number} VMSTAT_COMPACT_MIGRATE_SCANNED=79 VMSTAT_COMPACT_MIGRATE_SCANNED value
	         * @property {number} VMSTAT_COMPACT_FREE_SCANNED=80 VMSTAT_COMPACT_FREE_SCANNED value
	         * @property {number} VMSTAT_COMPACT_ISOLATED=81 VMSTAT_COMPACT_ISOLATED value
	         * @property {number} VMSTAT_COMPACT_STALL=82 VMSTAT_COMPACT_STALL value
	         * @property {number} VMSTAT_COMPACT_FAIL=83 VMSTAT_COMPACT_FAIL value
	         * @property {number} VMSTAT_COMPACT_SUCCESS=84 VMSTAT_COMPACT_SUCCESS value
	         * @property {number} VMSTAT_COMPACT_DAEMON_WAKE=85 VMSTAT_COMPACT_DAEMON_WAKE value
	         * @property {number} VMSTAT_UNEVICTABLE_PGS_CULLED=86 VMSTAT_UNEVICTABLE_PGS_CULLED value
	         * @property {number} VMSTAT_UNEVICTABLE_PGS_SCANNED=87 VMSTAT_UNEVICTABLE_PGS_SCANNED value
	         * @property {number} VMSTAT_UNEVICTABLE_PGS_RESCUED=88 VMSTAT_UNEVICTABLE_PGS_RESCUED value
	         * @property {number} VMSTAT_UNEVICTABLE_PGS_MLOCKED=89 VMSTAT_UNEVICTABLE_PGS_MLOCKED value
	         * @property {number} VMSTAT_UNEVICTABLE_PGS_MUNLOCKED=90 VMSTAT_UNEVICTABLE_PGS_MUNLOCKED value
	         * @property {number} VMSTAT_UNEVICTABLE_PGS_CLEARED=91 VMSTAT_UNEVICTABLE_PGS_CLEARED value
	         * @property {number} VMSTAT_UNEVICTABLE_PGS_STRANDED=92 VMSTAT_UNEVICTABLE_PGS_STRANDED value
	         */
	        protos.VmstatCounters = (function() {
	            var valuesById = {}, values = Object.create(valuesById);
	            values[valuesById[0] = "VMSTAT_UNSPECIFIED"] = 0;
	            values[valuesById[1] = "VMSTAT_NR_FREE_PAGES"] = 1;
	            values[valuesById[2] = "VMSTAT_NR_ALLOC_BATCH"] = 2;
	            values[valuesById[3] = "VMSTAT_NR_INACTIVE_ANON"] = 3;
	            values[valuesById[4] = "VMSTAT_NR_ACTIVE_ANON"] = 4;
	            values[valuesById[5] = "VMSTAT_NR_INACTIVE_FILE"] = 5;
	            values[valuesById[6] = "VMSTAT_NR_ACTIVE_FILE"] = 6;
	            values[valuesById[7] = "VMSTAT_NR_UNEVICTABLE"] = 7;
	            values[valuesById[8] = "VMSTAT_NR_MLOCK"] = 8;
	            values[valuesById[9] = "VMSTAT_NR_ANON_PAGES"] = 9;
	            values[valuesById[10] = "VMSTAT_NR_MAPPED"] = 10;
	            values[valuesById[11] = "VMSTAT_NR_FILE_PAGES"] = 11;
	            values[valuesById[12] = "VMSTAT_NR_DIRTY"] = 12;
	            values[valuesById[13] = "VMSTAT_NR_WRITEBACK"] = 13;
	            values[valuesById[14] = "VMSTAT_NR_SLAB_RECLAIMABLE"] = 14;
	            values[valuesById[15] = "VMSTAT_NR_SLAB_UNRECLAIMABLE"] = 15;
	            values[valuesById[16] = "VMSTAT_NR_PAGE_TABLE_PAGES"] = 16;
	            values[valuesById[17] = "VMSTAT_NR_KERNEL_STACK"] = 17;
	            values[valuesById[18] = "VMSTAT_NR_OVERHEAD"] = 18;
	            values[valuesById[19] = "VMSTAT_NR_UNSTABLE"] = 19;
	            values[valuesById[20] = "VMSTAT_NR_BOUNCE"] = 20;
	            values[valuesById[21] = "VMSTAT_NR_VMSCAN_WRITE"] = 21;
	            values[valuesById[22] = "VMSTAT_NR_VMSCAN_IMMEDIATE_RECLAIM"] = 22;
	            values[valuesById[23] = "VMSTAT_NR_WRITEBACK_TEMP"] = 23;
	            values[valuesById[24] = "VMSTAT_NR_ISOLATED_ANON"] = 24;
	            values[valuesById[25] = "VMSTAT_NR_ISOLATED_FILE"] = 25;
	            values[valuesById[26] = "VMSTAT_NR_SHMEM"] = 26;
	            values[valuesById[27] = "VMSTAT_NR_DIRTIED"] = 27;
	            values[valuesById[28] = "VMSTAT_NR_WRITTEN"] = 28;
	            values[valuesById[29] = "VMSTAT_NR_PAGES_SCANNED"] = 29;
	            values[valuesById[30] = "VMSTAT_WORKINGSET_REFAULT"] = 30;
	            values[valuesById[31] = "VMSTAT_WORKINGSET_ACTIVATE"] = 31;
	            values[valuesById[32] = "VMSTAT_WORKINGSET_NODERECLAIM"] = 32;
	            values[valuesById[33] = "VMSTAT_NR_ANON_TRANSPARENT_HUGEPAGES"] = 33;
	            values[valuesById[34] = "VMSTAT_NR_FREE_CMA"] = 34;
	            values[valuesById[35] = "VMSTAT_NR_SWAPCACHE"] = 35;
	            values[valuesById[36] = "VMSTAT_NR_DIRTY_THRESHOLD"] = 36;
	            values[valuesById[37] = "VMSTAT_NR_DIRTY_BACKGROUND_THRESHOLD"] = 37;
	            values[valuesById[38] = "VMSTAT_PGPGIN"] = 38;
	            values[valuesById[39] = "VMSTAT_PGPGOUT"] = 39;
	            values[valuesById[40] = "VMSTAT_PGPGOUTCLEAN"] = 40;
	            values[valuesById[41] = "VMSTAT_PSWPIN"] = 41;
	            values[valuesById[42] = "VMSTAT_PSWPOUT"] = 42;
	            values[valuesById[43] = "VMSTAT_PGALLOC_DMA"] = 43;
	            values[valuesById[44] = "VMSTAT_PGALLOC_NORMAL"] = 44;
	            values[valuesById[45] = "VMSTAT_PGALLOC_MOVABLE"] = 45;
	            values[valuesById[46] = "VMSTAT_PGFREE"] = 46;
	            values[valuesById[47] = "VMSTAT_PGACTIVATE"] = 47;
	            values[valuesById[48] = "VMSTAT_PGDEACTIVATE"] = 48;
	            values[valuesById[49] = "VMSTAT_PGFAULT"] = 49;
	            values[valuesById[50] = "VMSTAT_PGMAJFAULT"] = 50;
	            values[valuesById[51] = "VMSTAT_PGREFILL_DMA"] = 51;
	            values[valuesById[52] = "VMSTAT_PGREFILL_NORMAL"] = 52;
	            values[valuesById[53] = "VMSTAT_PGREFILL_MOVABLE"] = 53;
	            values[valuesById[54] = "VMSTAT_PGSTEAL_KSWAPD_DMA"] = 54;
	            values[valuesById[55] = "VMSTAT_PGSTEAL_KSWAPD_NORMAL"] = 55;
	            values[valuesById[56] = "VMSTAT_PGSTEAL_KSWAPD_MOVABLE"] = 56;
	            values[valuesById[57] = "VMSTAT_PGSTEAL_DIRECT_DMA"] = 57;
	            values[valuesById[58] = "VMSTAT_PGSTEAL_DIRECT_NORMAL"] = 58;
	            values[valuesById[59] = "VMSTAT_PGSTEAL_DIRECT_MOVABLE"] = 59;
	            values[valuesById[60] = "VMSTAT_PGSCAN_KSWAPD_DMA"] = 60;
	            values[valuesById[61] = "VMSTAT_PGSCAN_KSWAPD_NORMAL"] = 61;
	            values[valuesById[62] = "VMSTAT_PGSCAN_KSWAPD_MOVABLE"] = 62;
	            values[valuesById[63] = "VMSTAT_PGSCAN_DIRECT_DMA"] = 63;
	            values[valuesById[64] = "VMSTAT_PGSCAN_DIRECT_NORMAL"] = 64;
	            values[valuesById[65] = "VMSTAT_PGSCAN_DIRECT_MOVABLE"] = 65;
	            values[valuesById[66] = "VMSTAT_PGSCAN_DIRECT_THROTTLE"] = 66;
	            values[valuesById[67] = "VMSTAT_PGINODESTEAL"] = 67;
	            values[valuesById[68] = "VMSTAT_SLABS_SCANNED"] = 68;
	            values[valuesById[69] = "VMSTAT_KSWAPD_INODESTEAL"] = 69;
	            values[valuesById[70] = "VMSTAT_KSWAPD_LOW_WMARK_HIT_QUICKLY"] = 70;
	            values[valuesById[71] = "VMSTAT_KSWAPD_HIGH_WMARK_HIT_QUICKLY"] = 71;
	            values[valuesById[72] = "VMSTAT_PAGEOUTRUN"] = 72;
	            values[valuesById[73] = "VMSTAT_ALLOCSTALL"] = 73;
	            values[valuesById[74] = "VMSTAT_PGROTATED"] = 74;
	            values[valuesById[75] = "VMSTAT_DROP_PAGECACHE"] = 75;
	            values[valuesById[76] = "VMSTAT_DROP_SLAB"] = 76;
	            values[valuesById[77] = "VMSTAT_PGMIGRATE_SUCCESS"] = 77;
	            values[valuesById[78] = "VMSTAT_PGMIGRATE_FAIL"] = 78;
	            values[valuesById[79] = "VMSTAT_COMPACT_MIGRATE_SCANNED"] = 79;
	            values[valuesById[80] = "VMSTAT_COMPACT_FREE_SCANNED"] = 80;
	            values[valuesById[81] = "VMSTAT_COMPACT_ISOLATED"] = 81;
	            values[valuesById[82] = "VMSTAT_COMPACT_STALL"] = 82;
	            values[valuesById[83] = "VMSTAT_COMPACT_FAIL"] = 83;
	            values[valuesById[84] = "VMSTAT_COMPACT_SUCCESS"] = 84;
	            values[valuesById[85] = "VMSTAT_COMPACT_DAEMON_WAKE"] = 85;
	            values[valuesById[86] = "VMSTAT_UNEVICTABLE_PGS_CULLED"] = 86;
	            values[valuesById[87] = "VMSTAT_UNEVICTABLE_PGS_SCANNED"] = 87;
	            values[valuesById[88] = "VMSTAT_UNEVICTABLE_PGS_RESCUED"] = 88;
	            values[valuesById[89] = "VMSTAT_UNEVICTABLE_PGS_MLOCKED"] = 89;
	            values[valuesById[90] = "VMSTAT_UNEVICTABLE_PGS_MUNLOCKED"] = 90;
	            values[valuesById[91] = "VMSTAT_UNEVICTABLE_PGS_CLEARED"] = 91;
	            values[valuesById[92] = "VMSTAT_UNEVICTABLE_PGS_STRANDED"] = 92;
	            return values;
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
	             * @property {perfetto.protos.ISysStatsConfig|null} [sysStatsConfig] DataSourceConfig sysStatsConfig
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
	             * DataSourceConfig sysStatsConfig.
	             * @member {perfetto.protos.ISysStatsConfig|null|undefined} sysStatsConfig
	             * @memberof perfetto.protos.DataSourceConfig
	             * @instance
	             */
	            DataSourceConfig.prototype.sysStatsConfig = null;

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
	                if (message.sysStatsConfig != null && message.hasOwnProperty("sysStatsConfig"))
	                    $root.perfetto.protos.SysStatsConfig.encode(message.sysStatsConfig, writer.uint32(/* id 104, wireType 2 =*/834).fork()).ldelim();
	                if (message.legacyConfig != null && message.hasOwnProperty("legacyConfig"))
	                    writer.uint32(/* id 1000, wireType 2 =*/8002).string(message.legacyConfig);
	                if (message.forTesting != null && message.hasOwnProperty("forTesting"))
	                    $root.perfetto.protos.TestConfig.encode(message.forTesting, writer.uint32(/* id 268435455, wireType 2 =*/2147483642).fork()).ldelim();
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
	                    case 104:
	                        message.sysStatsConfig = $root.perfetto.protos.SysStatsConfig.decode(reader, reader.uint32());
	                        break;
	                    case 1000:
	                        message.legacyConfig = reader.string();
	                        break;
	                    case 268435455:
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
	                if (message.sysStatsConfig != null && message.hasOwnProperty("sysStatsConfig")) {
	                    var error = $root.perfetto.protos.SysStatsConfig.verify(message.sysStatsConfig);
	                    if (error)
	                        return "sysStatsConfig." + error;
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
	                if (object.sysStatsConfig != null) {
	                    if (typeof object.sysStatsConfig !== "object")
	                        throw TypeError(".perfetto.protos.DataSourceConfig.sysStatsConfig: object expected");
	                    message.sysStatsConfig = $root.perfetto.protos.SysStatsConfig.fromObject(object.sysStatsConfig);
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
	                    object.sysStatsConfig = null;
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
	                if (message.sysStatsConfig != null && message.hasOwnProperty("sysStatsConfig"))
	                    object.sysStatsConfig = $root.perfetto.protos.SysStatsConfig.toObject(message.sysStatsConfig, options);
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

	        protos.SysStatsConfig = (function() {

	            /**
	             * Properties of a SysStatsConfig.
	             * @memberof perfetto.protos
	             * @interface ISysStatsConfig
	             * @property {number|null} [meminfoPeriodMs] SysStatsConfig meminfoPeriodMs
	             * @property {Array.<perfetto.protos.MeminfoCounters>|null} [meminfoCounters] SysStatsConfig meminfoCounters
	             * @property {number|null} [vmstatPeriodMs] SysStatsConfig vmstatPeriodMs
	             * @property {Array.<perfetto.protos.VmstatCounters>|null} [vmstatCounters] SysStatsConfig vmstatCounters
	             * @property {number|null} [statPeriodMs] SysStatsConfig statPeriodMs
	             * @property {Array.<perfetto.protos.SysStatsConfig.StatCounters>|null} [statCounters] SysStatsConfig statCounters
	             */

	            /**
	             * Constructs a new SysStatsConfig.
	             * @memberof perfetto.protos
	             * @classdesc Represents a SysStatsConfig.
	             * @implements ISysStatsConfig
	             * @constructor
	             * @param {perfetto.protos.ISysStatsConfig=} [properties] Properties to set
	             */
	            function SysStatsConfig(properties) {
	                this.meminfoCounters = [];
	                this.vmstatCounters = [];
	                this.statCounters = [];
	                if (properties)
	                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                        if (properties[keys[i]] != null)
	                            this[keys[i]] = properties[keys[i]];
	            }

	            /**
	             * SysStatsConfig meminfoPeriodMs.
	             * @member {number} meminfoPeriodMs
	             * @memberof perfetto.protos.SysStatsConfig
	             * @instance
	             */
	            SysStatsConfig.prototype.meminfoPeriodMs = 0;

	            /**
	             * SysStatsConfig meminfoCounters.
	             * @member {Array.<perfetto.protos.MeminfoCounters>} meminfoCounters
	             * @memberof perfetto.protos.SysStatsConfig
	             * @instance
	             */
	            SysStatsConfig.prototype.meminfoCounters = $util.emptyArray;

	            /**
	             * SysStatsConfig vmstatPeriodMs.
	             * @member {number} vmstatPeriodMs
	             * @memberof perfetto.protos.SysStatsConfig
	             * @instance
	             */
	            SysStatsConfig.prototype.vmstatPeriodMs = 0;

	            /**
	             * SysStatsConfig vmstatCounters.
	             * @member {Array.<perfetto.protos.VmstatCounters>} vmstatCounters
	             * @memberof perfetto.protos.SysStatsConfig
	             * @instance
	             */
	            SysStatsConfig.prototype.vmstatCounters = $util.emptyArray;

	            /**
	             * SysStatsConfig statPeriodMs.
	             * @member {number} statPeriodMs
	             * @memberof perfetto.protos.SysStatsConfig
	             * @instance
	             */
	            SysStatsConfig.prototype.statPeriodMs = 0;

	            /**
	             * SysStatsConfig statCounters.
	             * @member {Array.<perfetto.protos.SysStatsConfig.StatCounters>} statCounters
	             * @memberof perfetto.protos.SysStatsConfig
	             * @instance
	             */
	            SysStatsConfig.prototype.statCounters = $util.emptyArray;

	            /**
	             * Creates a new SysStatsConfig instance using the specified properties.
	             * @function create
	             * @memberof perfetto.protos.SysStatsConfig
	             * @static
	             * @param {perfetto.protos.ISysStatsConfig=} [properties] Properties to set
	             * @returns {perfetto.protos.SysStatsConfig} SysStatsConfig instance
	             */
	            SysStatsConfig.create = function create(properties) {
	                return new SysStatsConfig(properties);
	            };

	            /**
	             * Encodes the specified SysStatsConfig message. Does not implicitly {@link perfetto.protos.SysStatsConfig.verify|verify} messages.
	             * @function encode
	             * @memberof perfetto.protos.SysStatsConfig
	             * @static
	             * @param {perfetto.protos.ISysStatsConfig} message SysStatsConfig message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            SysStatsConfig.encode = function encode(message, writer) {
	                if (!writer)
	                    writer = $Writer.create();
	                if (message.meminfoPeriodMs != null && message.hasOwnProperty("meminfoPeriodMs"))
	                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.meminfoPeriodMs);
	                if (message.meminfoCounters != null && message.meminfoCounters.length)
	                    for (var i = 0; i < message.meminfoCounters.length; ++i)
	                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.meminfoCounters[i]);
	                if (message.vmstatPeriodMs != null && message.hasOwnProperty("vmstatPeriodMs"))
	                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.vmstatPeriodMs);
	                if (message.vmstatCounters != null && message.vmstatCounters.length)
	                    for (var i = 0; i < message.vmstatCounters.length; ++i)
	                        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.vmstatCounters[i]);
	                if (message.statPeriodMs != null && message.hasOwnProperty("statPeriodMs"))
	                    writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.statPeriodMs);
	                if (message.statCounters != null && message.statCounters.length)
	                    for (var i = 0; i < message.statCounters.length; ++i)
	                        writer.uint32(/* id 6, wireType 0 =*/48).int32(message.statCounters[i]);
	                return writer;
	            };

	            /**
	             * Encodes the specified SysStatsConfig message, length delimited. Does not implicitly {@link perfetto.protos.SysStatsConfig.verify|verify} messages.
	             * @function encodeDelimited
	             * @memberof perfetto.protos.SysStatsConfig
	             * @static
	             * @param {perfetto.protos.ISysStatsConfig} message SysStatsConfig message or plain object to encode
	             * @param {$protobuf.Writer} [writer] Writer to encode to
	             * @returns {$protobuf.Writer} Writer
	             */
	            SysStatsConfig.encodeDelimited = function encodeDelimited(message, writer) {
	                return this.encode(message, writer).ldelim();
	            };

	            /**
	             * Decodes a SysStatsConfig message from the specified reader or buffer.
	             * @function decode
	             * @memberof perfetto.protos.SysStatsConfig
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @param {number} [length] Message length if known beforehand
	             * @returns {perfetto.protos.SysStatsConfig} SysStatsConfig
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            SysStatsConfig.decode = function decode(reader, length) {
	                if (!(reader instanceof $Reader))
	                    reader = $Reader.create(reader);
	                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.SysStatsConfig();
	                while (reader.pos < end) {
	                    var tag = reader.uint32();
	                    switch (tag >>> 3) {
	                    case 1:
	                        message.meminfoPeriodMs = reader.uint32();
	                        break;
	                    case 2:
	                        if (!(message.meminfoCounters && message.meminfoCounters.length))
	                            message.meminfoCounters = [];
	                        if ((tag & 7) === 2) {
	                            var end2 = reader.uint32() + reader.pos;
	                            while (reader.pos < end2)
	                                message.meminfoCounters.push(reader.int32());
	                        } else
	                            message.meminfoCounters.push(reader.int32());
	                        break;
	                    case 3:
	                        message.vmstatPeriodMs = reader.uint32();
	                        break;
	                    case 4:
	                        if (!(message.vmstatCounters && message.vmstatCounters.length))
	                            message.vmstatCounters = [];
	                        if ((tag & 7) === 2) {
	                            var end2 = reader.uint32() + reader.pos;
	                            while (reader.pos < end2)
	                                message.vmstatCounters.push(reader.int32());
	                        } else
	                            message.vmstatCounters.push(reader.int32());
	                        break;
	                    case 5:
	                        message.statPeriodMs = reader.uint32();
	                        break;
	                    case 6:
	                        if (!(message.statCounters && message.statCounters.length))
	                            message.statCounters = [];
	                        if ((tag & 7) === 2) {
	                            var end2 = reader.uint32() + reader.pos;
	                            while (reader.pos < end2)
	                                message.statCounters.push(reader.int32());
	                        } else
	                            message.statCounters.push(reader.int32());
	                        break;
	                    default:
	                        reader.skipType(tag & 7);
	                        break;
	                    }
	                }
	                return message;
	            };

	            /**
	             * Decodes a SysStatsConfig message from the specified reader or buffer, length delimited.
	             * @function decodeDelimited
	             * @memberof perfetto.protos.SysStatsConfig
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @returns {perfetto.protos.SysStatsConfig} SysStatsConfig
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            SysStatsConfig.decodeDelimited = function decodeDelimited(reader) {
	                if (!(reader instanceof $Reader))
	                    reader = new $Reader(reader);
	                return this.decode(reader, reader.uint32());
	            };

	            /**
	             * Verifies a SysStatsConfig message.
	             * @function verify
	             * @memberof perfetto.protos.SysStatsConfig
	             * @static
	             * @param {Object.<string,*>} message Plain object to verify
	             * @returns {string|null} `null` if valid, otherwise the reason why it is not
	             */
	            SysStatsConfig.verify = function verify(message) {
	                if (typeof message !== "object" || message === null)
	                    return "object expected";
	                if (message.meminfoPeriodMs != null && message.hasOwnProperty("meminfoPeriodMs"))
	                    if (!$util.isInteger(message.meminfoPeriodMs))
	                        return "meminfoPeriodMs: integer expected";
	                if (message.meminfoCounters != null && message.hasOwnProperty("meminfoCounters")) {
	                    if (!Array.isArray(message.meminfoCounters))
	                        return "meminfoCounters: array expected";
	                    for (var i = 0; i < message.meminfoCounters.length; ++i)
	                        switch (message.meminfoCounters[i]) {
	                        default:
	                            return "meminfoCounters: enum value[] expected";
	                        case 0:
	                        case 1:
	                        case 2:
	                        case 3:
	                        case 4:
	                        case 5:
	                        case 6:
	                        case 7:
	                        case 8:
	                        case 9:
	                        case 10:
	                        case 11:
	                        case 12:
	                        case 13:
	                        case 14:
	                        case 15:
	                        case 16:
	                        case 17:
	                        case 18:
	                        case 19:
	                        case 20:
	                        case 21:
	                        case 22:
	                        case 23:
	                        case 24:
	                        case 25:
	                        case 26:
	                        case 27:
	                        case 28:
	                        case 29:
	                        case 30:
	                        case 31:
	                        case 32:
	                        case 33:
	                            break;
	                        }
	                }
	                if (message.vmstatPeriodMs != null && message.hasOwnProperty("vmstatPeriodMs"))
	                    if (!$util.isInteger(message.vmstatPeriodMs))
	                        return "vmstatPeriodMs: integer expected";
	                if (message.vmstatCounters != null && message.hasOwnProperty("vmstatCounters")) {
	                    if (!Array.isArray(message.vmstatCounters))
	                        return "vmstatCounters: array expected";
	                    for (var i = 0; i < message.vmstatCounters.length; ++i)
	                        switch (message.vmstatCounters[i]) {
	                        default:
	                            return "vmstatCounters: enum value[] expected";
	                        case 0:
	                        case 1:
	                        case 2:
	                        case 3:
	                        case 4:
	                        case 5:
	                        case 6:
	                        case 7:
	                        case 8:
	                        case 9:
	                        case 10:
	                        case 11:
	                        case 12:
	                        case 13:
	                        case 14:
	                        case 15:
	                        case 16:
	                        case 17:
	                        case 18:
	                        case 19:
	                        case 20:
	                        case 21:
	                        case 22:
	                        case 23:
	                        case 24:
	                        case 25:
	                        case 26:
	                        case 27:
	                        case 28:
	                        case 29:
	                        case 30:
	                        case 31:
	                        case 32:
	                        case 33:
	                        case 34:
	                        case 35:
	                        case 36:
	                        case 37:
	                        case 38:
	                        case 39:
	                        case 40:
	                        case 41:
	                        case 42:
	                        case 43:
	                        case 44:
	                        case 45:
	                        case 46:
	                        case 47:
	                        case 48:
	                        case 49:
	                        case 50:
	                        case 51:
	                        case 52:
	                        case 53:
	                        case 54:
	                        case 55:
	                        case 56:
	                        case 57:
	                        case 58:
	                        case 59:
	                        case 60:
	                        case 61:
	                        case 62:
	                        case 63:
	                        case 64:
	                        case 65:
	                        case 66:
	                        case 67:
	                        case 68:
	                        case 69:
	                        case 70:
	                        case 71:
	                        case 72:
	                        case 73:
	                        case 74:
	                        case 75:
	                        case 76:
	                        case 77:
	                        case 78:
	                        case 79:
	                        case 80:
	                        case 81:
	                        case 82:
	                        case 83:
	                        case 84:
	                        case 85:
	                        case 86:
	                        case 87:
	                        case 88:
	                        case 89:
	                        case 90:
	                        case 91:
	                        case 92:
	                            break;
	                        }
	                }
	                if (message.statPeriodMs != null && message.hasOwnProperty("statPeriodMs"))
	                    if (!$util.isInteger(message.statPeriodMs))
	                        return "statPeriodMs: integer expected";
	                if (message.statCounters != null && message.hasOwnProperty("statCounters")) {
	                    if (!Array.isArray(message.statCounters))
	                        return "statCounters: array expected";
	                    for (var i = 0; i < message.statCounters.length; ++i)
	                        switch (message.statCounters[i]) {
	                        default:
	                            return "statCounters: enum value[] expected";
	                        case 0:
	                        case 1:
	                        case 2:
	                        case 3:
	                        case 4:
	                            break;
	                        }
	                }
	                return null;
	            };

	            /**
	             * Creates a SysStatsConfig message from a plain object. Also converts values to their respective internal types.
	             * @function fromObject
	             * @memberof perfetto.protos.SysStatsConfig
	             * @static
	             * @param {Object.<string,*>} object Plain object
	             * @returns {perfetto.protos.SysStatsConfig} SysStatsConfig
	             */
	            SysStatsConfig.fromObject = function fromObject(object) {
	                if (object instanceof $root.perfetto.protos.SysStatsConfig)
	                    return object;
	                var message = new $root.perfetto.protos.SysStatsConfig();
	                if (object.meminfoPeriodMs != null)
	                    message.meminfoPeriodMs = object.meminfoPeriodMs >>> 0;
	                if (object.meminfoCounters) {
	                    if (!Array.isArray(object.meminfoCounters))
	                        throw TypeError(".perfetto.protos.SysStatsConfig.meminfoCounters: array expected");
	                    message.meminfoCounters = [];
	                    for (var i = 0; i < object.meminfoCounters.length; ++i)
	                        switch (object.meminfoCounters[i]) {
	                        default:
	                        case "MEMINFO_UNSPECIFIED":
	                        case 0:
	                            message.meminfoCounters[i] = 0;
	                            break;
	                        case "MEMINFO_MEM_TOTAL":
	                        case 1:
	                            message.meminfoCounters[i] = 1;
	                            break;
	                        case "MEMINFO_MEM_FREE":
	                        case 2:
	                            message.meminfoCounters[i] = 2;
	                            break;
	                        case "MEMINFO_MEM_AVAILABLE":
	                        case 3:
	                            message.meminfoCounters[i] = 3;
	                            break;
	                        case "MEMINFO_BUFFERS":
	                        case 4:
	                            message.meminfoCounters[i] = 4;
	                            break;
	                        case "MEMINFO_CACHED":
	                        case 5:
	                            message.meminfoCounters[i] = 5;
	                            break;
	                        case "MEMINFO_SWAP_CACHED":
	                        case 6:
	                            message.meminfoCounters[i] = 6;
	                            break;
	                        case "MEMINFO_ACTIVE":
	                        case 7:
	                            message.meminfoCounters[i] = 7;
	                            break;
	                        case "MEMINFO_INACTIVE":
	                        case 8:
	                            message.meminfoCounters[i] = 8;
	                            break;
	                        case "MEMINFO_ACTIVE_ANON":
	                        case 9:
	                            message.meminfoCounters[i] = 9;
	                            break;
	                        case "MEMINFO_INACTIVE_ANON":
	                        case 10:
	                            message.meminfoCounters[i] = 10;
	                            break;
	                        case "MEMINFO_ACTIVE_FILE":
	                        case 11:
	                            message.meminfoCounters[i] = 11;
	                            break;
	                        case "MEMINFO_INACTIVE_FILE":
	                        case 12:
	                            message.meminfoCounters[i] = 12;
	                            break;
	                        case "MEMINFO_UNEVICTABLE":
	                        case 13:
	                            message.meminfoCounters[i] = 13;
	                            break;
	                        case "MEMINFO_MLOCKED":
	                        case 14:
	                            message.meminfoCounters[i] = 14;
	                            break;
	                        case "MEMINFO_SWAP_TOTAL":
	                        case 15:
	                            message.meminfoCounters[i] = 15;
	                            break;
	                        case "MEMINFO_SWAP_FREE":
	                        case 16:
	                            message.meminfoCounters[i] = 16;
	                            break;
	                        case "MEMINFO_DIRTY":
	                        case 17:
	                            message.meminfoCounters[i] = 17;
	                            break;
	                        case "MEMINFO_WRITEBACK":
	                        case 18:
	                            message.meminfoCounters[i] = 18;
	                            break;
	                        case "MEMINFO_ANON_PAGES":
	                        case 19:
	                            message.meminfoCounters[i] = 19;
	                            break;
	                        case "MEMINFO_MAPPED":
	                        case 20:
	                            message.meminfoCounters[i] = 20;
	                            break;
	                        case "MEMINFO_SHMEM":
	                        case 21:
	                            message.meminfoCounters[i] = 21;
	                            break;
	                        case "MEMINFO_SLAB":
	                        case 22:
	                            message.meminfoCounters[i] = 22;
	                            break;
	                        case "MEMINFO_SLAB_RECLAIMABLE":
	                        case 23:
	                            message.meminfoCounters[i] = 23;
	                            break;
	                        case "MEMINFO_SLAB_UNRECLAIMABLE":
	                        case 24:
	                            message.meminfoCounters[i] = 24;
	                            break;
	                        case "MEMINFO_KERNEL_STACK":
	                        case 25:
	                            message.meminfoCounters[i] = 25;
	                            break;
	                        case "MEMINFO_PAGE_TABLES":
	                        case 26:
	                            message.meminfoCounters[i] = 26;
	                            break;
	                        case "MEMINFO_COMMIT_LIMIT":
	                        case 27:
	                            message.meminfoCounters[i] = 27;
	                            break;
	                        case "MEMINFO_COMMITED_AS":
	                        case 28:
	                            message.meminfoCounters[i] = 28;
	                            break;
	                        case "MEMINFO_VMALLOC_TOTAL":
	                        case 29:
	                            message.meminfoCounters[i] = 29;
	                            break;
	                        case "MEMINFO_VMALLOC_USED":
	                        case 30:
	                            message.meminfoCounters[i] = 30;
	                            break;
	                        case "MEMINFO_VMALLOC_CHUNK":
	                        case 31:
	                            message.meminfoCounters[i] = 31;
	                            break;
	                        case "MEMINFO_CMA_TOTAL":
	                        case 32:
	                            message.meminfoCounters[i] = 32;
	                            break;
	                        case "MEMINFO_CMA_FREE":
	                        case 33:
	                            message.meminfoCounters[i] = 33;
	                            break;
	                        }
	                }
	                if (object.vmstatPeriodMs != null)
	                    message.vmstatPeriodMs = object.vmstatPeriodMs >>> 0;
	                if (object.vmstatCounters) {
	                    if (!Array.isArray(object.vmstatCounters))
	                        throw TypeError(".perfetto.protos.SysStatsConfig.vmstatCounters: array expected");
	                    message.vmstatCounters = [];
	                    for (var i = 0; i < object.vmstatCounters.length; ++i)
	                        switch (object.vmstatCounters[i]) {
	                        default:
	                        case "VMSTAT_UNSPECIFIED":
	                        case 0:
	                            message.vmstatCounters[i] = 0;
	                            break;
	                        case "VMSTAT_NR_FREE_PAGES":
	                        case 1:
	                            message.vmstatCounters[i] = 1;
	                            break;
	                        case "VMSTAT_NR_ALLOC_BATCH":
	                        case 2:
	                            message.vmstatCounters[i] = 2;
	                            break;
	                        case "VMSTAT_NR_INACTIVE_ANON":
	                        case 3:
	                            message.vmstatCounters[i] = 3;
	                            break;
	                        case "VMSTAT_NR_ACTIVE_ANON":
	                        case 4:
	                            message.vmstatCounters[i] = 4;
	                            break;
	                        case "VMSTAT_NR_INACTIVE_FILE":
	                        case 5:
	                            message.vmstatCounters[i] = 5;
	                            break;
	                        case "VMSTAT_NR_ACTIVE_FILE":
	                        case 6:
	                            message.vmstatCounters[i] = 6;
	                            break;
	                        case "VMSTAT_NR_UNEVICTABLE":
	                        case 7:
	                            message.vmstatCounters[i] = 7;
	                            break;
	                        case "VMSTAT_NR_MLOCK":
	                        case 8:
	                            message.vmstatCounters[i] = 8;
	                            break;
	                        case "VMSTAT_NR_ANON_PAGES":
	                        case 9:
	                            message.vmstatCounters[i] = 9;
	                            break;
	                        case "VMSTAT_NR_MAPPED":
	                        case 10:
	                            message.vmstatCounters[i] = 10;
	                            break;
	                        case "VMSTAT_NR_FILE_PAGES":
	                        case 11:
	                            message.vmstatCounters[i] = 11;
	                            break;
	                        case "VMSTAT_NR_DIRTY":
	                        case 12:
	                            message.vmstatCounters[i] = 12;
	                            break;
	                        case "VMSTAT_NR_WRITEBACK":
	                        case 13:
	                            message.vmstatCounters[i] = 13;
	                            break;
	                        case "VMSTAT_NR_SLAB_RECLAIMABLE":
	                        case 14:
	                            message.vmstatCounters[i] = 14;
	                            break;
	                        case "VMSTAT_NR_SLAB_UNRECLAIMABLE":
	                        case 15:
	                            message.vmstatCounters[i] = 15;
	                            break;
	                        case "VMSTAT_NR_PAGE_TABLE_PAGES":
	                        case 16:
	                            message.vmstatCounters[i] = 16;
	                            break;
	                        case "VMSTAT_NR_KERNEL_STACK":
	                        case 17:
	                            message.vmstatCounters[i] = 17;
	                            break;
	                        case "VMSTAT_NR_OVERHEAD":
	                        case 18:
	                            message.vmstatCounters[i] = 18;
	                            break;
	                        case "VMSTAT_NR_UNSTABLE":
	                        case 19:
	                            message.vmstatCounters[i] = 19;
	                            break;
	                        case "VMSTAT_NR_BOUNCE":
	                        case 20:
	                            message.vmstatCounters[i] = 20;
	                            break;
	                        case "VMSTAT_NR_VMSCAN_WRITE":
	                        case 21:
	                            message.vmstatCounters[i] = 21;
	                            break;
	                        case "VMSTAT_NR_VMSCAN_IMMEDIATE_RECLAIM":
	                        case 22:
	                            message.vmstatCounters[i] = 22;
	                            break;
	                        case "VMSTAT_NR_WRITEBACK_TEMP":
	                        case 23:
	                            message.vmstatCounters[i] = 23;
	                            break;
	                        case "VMSTAT_NR_ISOLATED_ANON":
	                        case 24:
	                            message.vmstatCounters[i] = 24;
	                            break;
	                        case "VMSTAT_NR_ISOLATED_FILE":
	                        case 25:
	                            message.vmstatCounters[i] = 25;
	                            break;
	                        case "VMSTAT_NR_SHMEM":
	                        case 26:
	                            message.vmstatCounters[i] = 26;
	                            break;
	                        case "VMSTAT_NR_DIRTIED":
	                        case 27:
	                            message.vmstatCounters[i] = 27;
	                            break;
	                        case "VMSTAT_NR_WRITTEN":
	                        case 28:
	                            message.vmstatCounters[i] = 28;
	                            break;
	                        case "VMSTAT_NR_PAGES_SCANNED":
	                        case 29:
	                            message.vmstatCounters[i] = 29;
	                            break;
	                        case "VMSTAT_WORKINGSET_REFAULT":
	                        case 30:
	                            message.vmstatCounters[i] = 30;
	                            break;
	                        case "VMSTAT_WORKINGSET_ACTIVATE":
	                        case 31:
	                            message.vmstatCounters[i] = 31;
	                            break;
	                        case "VMSTAT_WORKINGSET_NODERECLAIM":
	                        case 32:
	                            message.vmstatCounters[i] = 32;
	                            break;
	                        case "VMSTAT_NR_ANON_TRANSPARENT_HUGEPAGES":
	                        case 33:
	                            message.vmstatCounters[i] = 33;
	                            break;
	                        case "VMSTAT_NR_FREE_CMA":
	                        case 34:
	                            message.vmstatCounters[i] = 34;
	                            break;
	                        case "VMSTAT_NR_SWAPCACHE":
	                        case 35:
	                            message.vmstatCounters[i] = 35;
	                            break;
	                        case "VMSTAT_NR_DIRTY_THRESHOLD":
	                        case 36:
	                            message.vmstatCounters[i] = 36;
	                            break;
	                        case "VMSTAT_NR_DIRTY_BACKGROUND_THRESHOLD":
	                        case 37:
	                            message.vmstatCounters[i] = 37;
	                            break;
	                        case "VMSTAT_PGPGIN":
	                        case 38:
	                            message.vmstatCounters[i] = 38;
	                            break;
	                        case "VMSTAT_PGPGOUT":
	                        case 39:
	                            message.vmstatCounters[i] = 39;
	                            break;
	                        case "VMSTAT_PGPGOUTCLEAN":
	                        case 40:
	                            message.vmstatCounters[i] = 40;
	                            break;
	                        case "VMSTAT_PSWPIN":
	                        case 41:
	                            message.vmstatCounters[i] = 41;
	                            break;
	                        case "VMSTAT_PSWPOUT":
	                        case 42:
	                            message.vmstatCounters[i] = 42;
	                            break;
	                        case "VMSTAT_PGALLOC_DMA":
	                        case 43:
	                            message.vmstatCounters[i] = 43;
	                            break;
	                        case "VMSTAT_PGALLOC_NORMAL":
	                        case 44:
	                            message.vmstatCounters[i] = 44;
	                            break;
	                        case "VMSTAT_PGALLOC_MOVABLE":
	                        case 45:
	                            message.vmstatCounters[i] = 45;
	                            break;
	                        case "VMSTAT_PGFREE":
	                        case 46:
	                            message.vmstatCounters[i] = 46;
	                            break;
	                        case "VMSTAT_PGACTIVATE":
	                        case 47:
	                            message.vmstatCounters[i] = 47;
	                            break;
	                        case "VMSTAT_PGDEACTIVATE":
	                        case 48:
	                            message.vmstatCounters[i] = 48;
	                            break;
	                        case "VMSTAT_PGFAULT":
	                        case 49:
	                            message.vmstatCounters[i] = 49;
	                            break;
	                        case "VMSTAT_PGMAJFAULT":
	                        case 50:
	                            message.vmstatCounters[i] = 50;
	                            break;
	                        case "VMSTAT_PGREFILL_DMA":
	                        case 51:
	                            message.vmstatCounters[i] = 51;
	                            break;
	                        case "VMSTAT_PGREFILL_NORMAL":
	                        case 52:
	                            message.vmstatCounters[i] = 52;
	                            break;
	                        case "VMSTAT_PGREFILL_MOVABLE":
	                        case 53:
	                            message.vmstatCounters[i] = 53;
	                            break;
	                        case "VMSTAT_PGSTEAL_KSWAPD_DMA":
	                        case 54:
	                            message.vmstatCounters[i] = 54;
	                            break;
	                        case "VMSTAT_PGSTEAL_KSWAPD_NORMAL":
	                        case 55:
	                            message.vmstatCounters[i] = 55;
	                            break;
	                        case "VMSTAT_PGSTEAL_KSWAPD_MOVABLE":
	                        case 56:
	                            message.vmstatCounters[i] = 56;
	                            break;
	                        case "VMSTAT_PGSTEAL_DIRECT_DMA":
	                        case 57:
	                            message.vmstatCounters[i] = 57;
	                            break;
	                        case "VMSTAT_PGSTEAL_DIRECT_NORMAL":
	                        case 58:
	                            message.vmstatCounters[i] = 58;
	                            break;
	                        case "VMSTAT_PGSTEAL_DIRECT_MOVABLE":
	                        case 59:
	                            message.vmstatCounters[i] = 59;
	                            break;
	                        case "VMSTAT_PGSCAN_KSWAPD_DMA":
	                        case 60:
	                            message.vmstatCounters[i] = 60;
	                            break;
	                        case "VMSTAT_PGSCAN_KSWAPD_NORMAL":
	                        case 61:
	                            message.vmstatCounters[i] = 61;
	                            break;
	                        case "VMSTAT_PGSCAN_KSWAPD_MOVABLE":
	                        case 62:
	                            message.vmstatCounters[i] = 62;
	                            break;
	                        case "VMSTAT_PGSCAN_DIRECT_DMA":
	                        case 63:
	                            message.vmstatCounters[i] = 63;
	                            break;
	                        case "VMSTAT_PGSCAN_DIRECT_NORMAL":
	                        case 64:
	                            message.vmstatCounters[i] = 64;
	                            break;
	                        case "VMSTAT_PGSCAN_DIRECT_MOVABLE":
	                        case 65:
	                            message.vmstatCounters[i] = 65;
	                            break;
	                        case "VMSTAT_PGSCAN_DIRECT_THROTTLE":
	                        case 66:
	                            message.vmstatCounters[i] = 66;
	                            break;
	                        case "VMSTAT_PGINODESTEAL":
	                        case 67:
	                            message.vmstatCounters[i] = 67;
	                            break;
	                        case "VMSTAT_SLABS_SCANNED":
	                        case 68:
	                            message.vmstatCounters[i] = 68;
	                            break;
	                        case "VMSTAT_KSWAPD_INODESTEAL":
	                        case 69:
	                            message.vmstatCounters[i] = 69;
	                            break;
	                        case "VMSTAT_KSWAPD_LOW_WMARK_HIT_QUICKLY":
	                        case 70:
	                            message.vmstatCounters[i] = 70;
	                            break;
	                        case "VMSTAT_KSWAPD_HIGH_WMARK_HIT_QUICKLY":
	                        case 71:
	                            message.vmstatCounters[i] = 71;
	                            break;
	                        case "VMSTAT_PAGEOUTRUN":
	                        case 72:
	                            message.vmstatCounters[i] = 72;
	                            break;
	                        case "VMSTAT_ALLOCSTALL":
	                        case 73:
	                            message.vmstatCounters[i] = 73;
	                            break;
	                        case "VMSTAT_PGROTATED":
	                        case 74:
	                            message.vmstatCounters[i] = 74;
	                            break;
	                        case "VMSTAT_DROP_PAGECACHE":
	                        case 75:
	                            message.vmstatCounters[i] = 75;
	                            break;
	                        case "VMSTAT_DROP_SLAB":
	                        case 76:
	                            message.vmstatCounters[i] = 76;
	                            break;
	                        case "VMSTAT_PGMIGRATE_SUCCESS":
	                        case 77:
	                            message.vmstatCounters[i] = 77;
	                            break;
	                        case "VMSTAT_PGMIGRATE_FAIL":
	                        case 78:
	                            message.vmstatCounters[i] = 78;
	                            break;
	                        case "VMSTAT_COMPACT_MIGRATE_SCANNED":
	                        case 79:
	                            message.vmstatCounters[i] = 79;
	                            break;
	                        case "VMSTAT_COMPACT_FREE_SCANNED":
	                        case 80:
	                            message.vmstatCounters[i] = 80;
	                            break;
	                        case "VMSTAT_COMPACT_ISOLATED":
	                        case 81:
	                            message.vmstatCounters[i] = 81;
	                            break;
	                        case "VMSTAT_COMPACT_STALL":
	                        case 82:
	                            message.vmstatCounters[i] = 82;
	                            break;
	                        case "VMSTAT_COMPACT_FAIL":
	                        case 83:
	                            message.vmstatCounters[i] = 83;
	                            break;
	                        case "VMSTAT_COMPACT_SUCCESS":
	                        case 84:
	                            message.vmstatCounters[i] = 84;
	                            break;
	                        case "VMSTAT_COMPACT_DAEMON_WAKE":
	                        case 85:
	                            message.vmstatCounters[i] = 85;
	                            break;
	                        case "VMSTAT_UNEVICTABLE_PGS_CULLED":
	                        case 86:
	                            message.vmstatCounters[i] = 86;
	                            break;
	                        case "VMSTAT_UNEVICTABLE_PGS_SCANNED":
	                        case 87:
	                            message.vmstatCounters[i] = 87;
	                            break;
	                        case "VMSTAT_UNEVICTABLE_PGS_RESCUED":
	                        case 88:
	                            message.vmstatCounters[i] = 88;
	                            break;
	                        case "VMSTAT_UNEVICTABLE_PGS_MLOCKED":
	                        case 89:
	                            message.vmstatCounters[i] = 89;
	                            break;
	                        case "VMSTAT_UNEVICTABLE_PGS_MUNLOCKED":
	                        case 90:
	                            message.vmstatCounters[i] = 90;
	                            break;
	                        case "VMSTAT_UNEVICTABLE_PGS_CLEARED":
	                        case 91:
	                            message.vmstatCounters[i] = 91;
	                            break;
	                        case "VMSTAT_UNEVICTABLE_PGS_STRANDED":
	                        case 92:
	                            message.vmstatCounters[i] = 92;
	                            break;
	                        }
	                }
	                if (object.statPeriodMs != null)
	                    message.statPeriodMs = object.statPeriodMs >>> 0;
	                if (object.statCounters) {
	                    if (!Array.isArray(object.statCounters))
	                        throw TypeError(".perfetto.protos.SysStatsConfig.statCounters: array expected");
	                    message.statCounters = [];
	                    for (var i = 0; i < object.statCounters.length; ++i)
	                        switch (object.statCounters[i]) {
	                        default:
	                        case "STAT_UNSPECIFIED":
	                        case 0:
	                            message.statCounters[i] = 0;
	                            break;
	                        case "STAT_CPU_TIMES":
	                        case 1:
	                            message.statCounters[i] = 1;
	                            break;
	                        case "STAT_IRQ_COUNTS":
	                        case 2:
	                            message.statCounters[i] = 2;
	                            break;
	                        case "STAT_SOFTIRQ_COUNTS":
	                        case 3:
	                            message.statCounters[i] = 3;
	                            break;
	                        case "STAT_FORK_COUNT":
	                        case 4:
	                            message.statCounters[i] = 4;
	                            break;
	                        }
	                }
	                return message;
	            };

	            /**
	             * Creates a plain object from a SysStatsConfig message. Also converts values to other types if specified.
	             * @function toObject
	             * @memberof perfetto.protos.SysStatsConfig
	             * @static
	             * @param {perfetto.protos.SysStatsConfig} message SysStatsConfig
	             * @param {$protobuf.IConversionOptions} [options] Conversion options
	             * @returns {Object.<string,*>} Plain object
	             */
	            SysStatsConfig.toObject = function toObject(message, options) {
	                if (!options)
	                    options = {};
	                var object = {};
	                if (options.arrays || options.defaults) {
	                    object.meminfoCounters = [];
	                    object.vmstatCounters = [];
	                    object.statCounters = [];
	                }
	                if (options.defaults) {
	                    object.meminfoPeriodMs = 0;
	                    object.vmstatPeriodMs = 0;
	                    object.statPeriodMs = 0;
	                }
	                if (message.meminfoPeriodMs != null && message.hasOwnProperty("meminfoPeriodMs"))
	                    object.meminfoPeriodMs = message.meminfoPeriodMs;
	                if (message.meminfoCounters && message.meminfoCounters.length) {
	                    object.meminfoCounters = [];
	                    for (var j = 0; j < message.meminfoCounters.length; ++j)
	                        object.meminfoCounters[j] = options.enums === String ? $root.perfetto.protos.MeminfoCounters[message.meminfoCounters[j]] : message.meminfoCounters[j];
	                }
	                if (message.vmstatPeriodMs != null && message.hasOwnProperty("vmstatPeriodMs"))
	                    object.vmstatPeriodMs = message.vmstatPeriodMs;
	                if (message.vmstatCounters && message.vmstatCounters.length) {
	                    object.vmstatCounters = [];
	                    for (var j = 0; j < message.vmstatCounters.length; ++j)
	                        object.vmstatCounters[j] = options.enums === String ? $root.perfetto.protos.VmstatCounters[message.vmstatCounters[j]] : message.vmstatCounters[j];
	                }
	                if (message.statPeriodMs != null && message.hasOwnProperty("statPeriodMs"))
	                    object.statPeriodMs = message.statPeriodMs;
	                if (message.statCounters && message.statCounters.length) {
	                    object.statCounters = [];
	                    for (var j = 0; j < message.statCounters.length; ++j)
	                        object.statCounters[j] = options.enums === String ? $root.perfetto.protos.SysStatsConfig.StatCounters[message.statCounters[j]] : message.statCounters[j];
	                }
	                return object;
	            };

	            /**
	             * Converts this SysStatsConfig to JSON.
	             * @function toJSON
	             * @memberof perfetto.protos.SysStatsConfig
	             * @instance
	             * @returns {Object.<string,*>} JSON object
	             */
	            SysStatsConfig.prototype.toJSON = function toJSON() {
	                return this.constructor.toObject(this, minimal$1.util.toJSONOptions);
	            };

	            /**
	             * StatCounters enum.
	             * @name perfetto.protos.SysStatsConfig.StatCounters
	             * @enum {string}
	             * @property {number} STAT_UNSPECIFIED=0 STAT_UNSPECIFIED value
	             * @property {number} STAT_CPU_TIMES=1 STAT_CPU_TIMES value
	             * @property {number} STAT_IRQ_COUNTS=2 STAT_IRQ_COUNTS value
	             * @property {number} STAT_SOFTIRQ_COUNTS=3 STAT_SOFTIRQ_COUNTS value
	             * @property {number} STAT_FORK_COUNT=4 STAT_FORK_COUNT value
	             */
	            SysStatsConfig.StatCounters = (function() {
	                var valuesById = {}, values = Object.create(valuesById);
	                values[valuesById[0] = "STAT_UNSPECIFIED"] = 0;
	                values[valuesById[1] = "STAT_CPU_TIMES"] = 1;
	                values[valuesById[2] = "STAT_IRQ_COUNTS"] = 2;
	                values[valuesById[3] = "STAT_SOFTIRQ_COUNTS"] = 3;
	                values[valuesById[4] = "STAT_FORK_COUNT"] = 4;
	                return values;
	            })();

	            return SysStatsConfig;
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
	             * @property {boolean|null} [deferredStart] TraceConfig deferredStart
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
	             * TraceConfig deferredStart.
	             * @member {boolean} deferredStart
	             * @memberof perfetto.protos.TraceConfig
	             * @instance
	             */
	            TraceConfig.prototype.deferredStart = false;

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
	                if (message.deferredStart != null && message.hasOwnProperty("deferredStart"))
	                    writer.uint32(/* id 12, wireType 0 =*/96).bool(message.deferredStart);
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
	                    case 12:
	                        message.deferredStart = reader.bool();
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
	                if (message.deferredStart != null && message.hasOwnProperty("deferredStart"))
	                    if (typeof message.deferredStart !== "boolean")
	                        return "deferredStart: boolean expected";
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
	                if (object.deferredStart != null)
	                    message.deferredStart = Boolean(object.deferredStart);
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
	                    object.deferredStart = false;
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
	                if (message.deferredStart != null && message.hasOwnProperty("deferredStart"))
	                    object.deferredStart = message.deferredStart;
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
	 * (e.g. query).
	 */
	class Engine {
	    /**
	     * Shorthand for sending a SQL query to the engine.
	     * Exactly the same as engine.rpc.rawQuery({rawQuery});
	     */
	    query(sqlQuery) {
	        return this.rpc.rawQuery({ sqlQuery });
	    }
	    queryOneRow(query) {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            const result = yield this.query(query);
	            const res = [];
	            result.columns.map(c => res.push(+c.longValues[0]));
	            return res;
	        });
	    }
	    // TODO(hjd): Maybe we should cache result? But then Engine must be
	    // streaming aware.
	    getNumberOfCpus() {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            const result = yield this.query('select count(distinct(cpu)) as cpuCount from sched;');
	            return +result.columns[0].longValues[0];
	        });
	    }
	    // TODO: This should live in code that's more specific to chrome, instead of
	    // in engine.
	    getNumberOfProcesses() {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            const result = yield this.query('select count(*) from process;');
	            return +result.columns[0].longValues[0];
	        });
	    }
	    getTraceTimeBounds() {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            const maxQuery = 'select max(ts) from (select max(ts) as ts from sched ' +
	                'union all select max(ts) as ts from slices)';
	            const minQuery = 'select min(ts) from (select min(ts) as ts from sched ' +
	                'union all select min(ts) as ts from slices)';
	            const start = (yield this.queryOneRow(minQuery))[0];
	            const end = (yield this.queryOneRow(maxQuery))[0];
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
	    return new Worker('engine_bundle.js');
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
	    return activeWorker;
	}
	exports.createWasmEngine = createWasmEngine;
	function destroyWasmEngine(id) {
	    if (!activeWorkers.has(id)) {
	        throw new Error(`Cannot find worker ID ${id}`);
	    }
	    activeWorkers.get(id).terminate();
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
	    constructor(args) {
	        super();
	        this.nextRequestId = 0;
	        this.pendingCallbacks = new Map();
	        this.id = args.id;
	        this.worker = args.worker;
	        this.worker.onmessage = this.onMessage.bind(this);
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
	        this.worker.postMessage(request);
	        return promise;
	    }
	    notifyEof() {
	        const id = this.nextRequestId++;
	        const data = Uint8Array.from([]);
	        const request = { id, serviceName: 'trace_processor', methodName: 'notifyEof', data };
	        const promise = deferred.defer();
	        this.pendingCallbacks.set(id, () => promise.resolve());
	        this.worker.postMessage(request);
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
	        this.worker.postMessage(request);
	    }
	}
	exports.WasmEngineProxy = WasmEngineProxy;

	});

	unwrapExports(wasm_engine_proxy);
	var wasm_engine_proxy_1 = wasm_engine_proxy.createWasmEngine;
	var wasm_engine_proxy_2 = wasm_engine_proxy.destroyWasmEngine;
	var wasm_engine_proxy_3 = wasm_engine_proxy.warmupWasmEngine;
	var wasm_engine_proxy_4 = wasm_engine_proxy.WasmEngineProxy;

	var immer_1 = ( immer_module && produce ) || immer_module;

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





	const wasm_engine_proxy_2 = wasm_engine_proxy;
	/**
	 * Global accessors for state/dispatch in the controller.
	 */
	class Globals {
	    constructor() {
	        this._runningControllers = false;
	        this._queuedActions = new Array();
	    }
	    initialize(rootController, frontendProxy) {
	        this._rootController = rootController;
	        this._frontend = frontendProxy;
	        this._state = state.createEmptyState();
	    }
	    dispatch(action) {
	        this.dispatchMultiple([action]);
	    }
	    dispatchMultiple(actions$$1) {
	        this._queuedActions = this._queuedActions.concat(actions$$1);
	        // If we are in the middle of running the controllers, queue the actions
	        // and run them at the end of the run, so the state is atomically updated
	        // only at the end and all controllers see the same state.
	        if (this._runningControllers)
	            return;
	        this.runControllers();
	    }
	    runControllers() {
	        if (this._runningControllers)
	            throw new Error('Re-entrant call detected');
	        // Run controllers locally until all state machines reach quiescence.
	        let runAgain = false;
	        let summary = this._queuedActions.map(action => action.type).join(', ');
	        summary = `Controllers loop (${summary})`;
	        console.time(summary);
	        for (let iter = 0; runAgain || this._queuedActions.length > 0; iter++) {
	            if (iter > 100)
	                throw new Error('Controllers are stuck in a livelock');
	            const actions$$1 = this._queuedActions;
	            this._queuedActions = new Array();
	            for (const action of actions$$1) {
	                console.debug('Applying action', action);
	                this.applyAction(action);
	            }
	            this._runningControllers = true;
	            try {
	                runAgain = logging.assertExists(this._rootController).invoke();
	            }
	            finally {
	                this._runningControllers = false;
	            }
	        }
	        logging.assertExists(this._frontend).send('updateState', [this.state]);
	        console.timeEnd(summary);
	    }
	    createEngine() {
	        const id = new Date().toUTCString();
	        const portAndId = { id, worker: wasm_engine_proxy_2.createWasmEngine(id) };
	        return new wasm_engine_proxy.WasmEngineProxy(portAndId);
	    }
	    destroyEngine(id) {
	        wasm_engine_proxy_2.destroyWasmEngine(id);
	    }
	    // TODO: this needs to be cleaned up.
	    publish(what, data) {
	        logging.assertExists(this._frontend).send(`publish${what}`, [data]);
	    }
	    get state() {
	        return logging.assertExists(this._state);
	    }
	    applyAction(action) {
	        logging.assertExists(this._state);
	        // We need a special case for when we want to replace the whole tree.
	        if (action.type === 'setState') {
	            const args = action.args;
	            this._state = args.newState;
	            return;
	        }
	        // 'produce' creates a immer proxy which wraps the current state turning
	        // all imperative mutations of the state done in the callback into
	        // immutable changes to the returned state.
	        this._state = immer_1(this.state, draft => {
	            // tslint:disable-next-line no-any
	            actions.StateActions[action.type](draft, action.args);
	        });
	    }
	    resetForTesting() {
	        this._state = undefined;
	        this._rootController = undefined;
	    }
	}
	exports.globals = new Globals();

	});

	unwrapExports(globals);
	var globals_1 = globals.globals;

	var track_controller = createCommonjsModule(function (module, exports) {
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





	// TrackController is a base class overridden by track implementations (e.g.,
	// sched slices, nestable slices, counters).
	class TrackController extends controller.Controller {
	    constructor(args) {
	        super('main');
	        this.trackId = args.trackId;
	        this.engine = args.engine;
	    }
	    get trackState() {
	        return logging.assertExists(globals.globals.state.tracks[this.trackId]);
	    }
	    get config() {
	        return this.trackState.config;
	    }
	    publish(data) {
	        globals.globals.publish('TrackData', { id: this.trackId, data });
	    }
	    run() {
	        const dataReq = this.trackState.dataReq;
	        if (dataReq === undefined)
	            return;
	        globals.globals.dispatch(actions.Actions.clearTrackDataReq({ trackId: this.trackId }));
	        this.onBoundsChange(dataReq.start, dataReq.end, dataReq.resolution);
	    }
	}
	exports.TrackController = TrackController;
	exports.trackControllerRegistry = new registry.Registry();

	});

	unwrapExports(track_controller);
	var track_controller_1 = track_controller.TrackController;
	var track_controller_2 = track_controller.trackControllerRegistry;

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

	var controller$2 = createCommonjsModule(function (module, exports) {
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




	class CpuSliceTrackController extends track_controller.TrackController {
	    constructor() {
	        super(...arguments);
	        this.busy = false;
	        this.setup = false;
	    }
	    onBoundsChange(start, end, resolution) {
	        this.update(start, end, resolution);
	    }
	    update(start, end, resolution) {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            // TODO: we should really call TraceProcessor.Interrupt() at this point.
	            if (this.busy)
	                return;
	            const startNs = Math.round(start * 1e9);
	            const endNs = Math.round(end * 1e9);
	            this.busy = true;
	            if (this.setup === false) {
	                yield this.query(`create virtual table window_${this.trackState.id} using window;`);
	                yield this.query(`create virtual table span_${this.trackState.id}
                     using span(sched, window_${this.trackState.id}, cpu);`);
	                this.setup = true;
	            }
	            // |resolution| is in s/px (to nearest power of 10) asumming a display
	            // of ~1000px 0.001 is 1s.
	            const isQuantized = resolution >= 0.001;
	            // |resolution| is in s/px we want # ns for 10px window:
	            const bucketSizeNs = Math.round(resolution * 10 * 1e9);
	            let windowStartNs = startNs;
	            if (isQuantized) {
	                windowStartNs = Math.floor(windowStartNs / bucketSizeNs) * bucketSizeNs;
	            }
	            const windowDurNs = endNs - windowStartNs;
	            this.query(`update window_${this.trackState.id} set
      window_start=${windowStartNs},
      window_dur=${windowDurNs},
      quantum=${isQuantized ? bucketSizeNs : 0}
      where rowid = 0;`);
	            if (isQuantized) {
	                this.publish(yield this.computeSummary(time.fromNs(windowStartNs), end, resolution, bucketSizeNs));
	            }
	            else {
	                this.publish(yield this.computeSlices(time.fromNs(windowStartNs), end, resolution));
	            }
	            this.busy = false;
	        });
	    }
	    computeSummary(start, end, resolution, bucketSizeNs) {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            const startNs = Math.round(start * 1e9);
	            const endNs = Math.round(end * 1e9);
	            const numBuckets = Math.ceil((endNs - startNs) / bucketSizeNs);
	            const query = `select
        quantum_ts as bucket,
        sum(dur)/cast(${bucketSizeNs} as float) as utilization
        from span_${this.trackState.id}
        where cpu = ${this.config.cpu}
        and utid != 0
        group by quantum_ts`;
	            const rawResult = yield this.query(query);
	            const numRows = +rawResult.numRecords;
	            const summary = {
	                kind: 'summary',
	                start,
	                end,
	                resolution,
	                bucketSizeSeconds: time.fromNs(bucketSizeNs),
	                utilizations: new Float64Array(numBuckets),
	            };
	            const cols = rawResult.columns;
	            for (let row = 0; row < numRows; row++) {
	                const bucket = +cols[0].longValues[row];
	                summary.utilizations[bucket] = +cols[1].doubleValues[row];
	            }
	            return summary;
	        });
	    }
	    computeSlices(start, end, resolution) {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            // TODO(hjd): Remove LIMIT
	            const LIMIT = 10000;
	            const query = `select ts,dur,utid from span_${this.trackState.id}
        where cpu = ${this.config.cpu}
        and utid != 0
        limit ${LIMIT};`;
	            const rawResult = yield this.query(query);
	            const numRows = +rawResult.numRecords;
	            const slices = {
	                kind: 'slice',
	                start,
	                end,
	                resolution,
	                starts: new Float64Array(numRows),
	                ends: new Float64Array(numRows),
	                utids: new Uint32Array(numRows),
	            };
	            const cols = rawResult.columns;
	            for (let row = 0; row < numRows; row++) {
	                const startSec = time.fromNs(+cols[0].longValues[row]);
	                slices.starts[row] = startSec;
	                slices.ends[row] = startSec + time.fromNs(+cols[1].longValues[row]);
	                slices.utids[row] = +cols[2].longValues[row];
	            }
	            if (numRows === LIMIT) {
	                slices.end = slices.ends[slices.ends.length - 1];
	            }
	            return slices;
	        });
	    }
	    query(query) {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            const result = yield this.engine.query(query);
	            if (result.error) {
	                console.error(`Query error "${query}": ${result.error}`);
	                throw new Error(`Query error "${query}": ${result.error}`);
	            }
	            return result;
	        });
	    }
	    onDestroy() {
	        if (this.setup) {
	            this.query(`drop table window_${this.trackState.id}`);
	            this.query(`drop table span_${this.trackState.id}`);
	            this.setup = false;
	        }
	    }
	}
	CpuSliceTrackController.kind = common.CPU_SLICE_TRACK_KIND;
	track_controller.trackControllerRegistry.register(CpuSliceTrackController);

	});

	unwrapExports(controller$2);

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

	var controller$4 = createCommonjsModule(function (module, exports) {
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



	class ChromeSliceTrackController extends track_controller.TrackController {
	    constructor() {
	        super(...arguments);
	        this.busy = false;
	    }
	    onBoundsChange(start, end, resolution) {
	        // TODO: we should really call TraceProcessor.Interrupt() at this point.
	        if (this.busy)
	            return;
	        const LIMIT = 10000;
	        // TODO: "ts >= x - dur" below is inefficient because doesn't allow to use
	        // any index. We need to introduce ts_lower_bound also for the slices table
	        // (see sched table).
	        const query = `select ts,dur,depth,cat,name from slices ` +
	            `where utid = ${this.config.utid} ` +
	            `and ts >= ${Math.round(start * 1e9)} - dur ` +
	            `and ts <= ${Math.round(end * 1e9)} ` +
	            `and dur >= ${Math.round(resolution * 1e9)} ` +
	            `order by ts ` +
	            `limit ${LIMIT};`;
	        this.busy = true;
	        this.engine.query(query).then(rawResult => {
	            this.busy = false;
	            if (rawResult.error) {
	                throw new Error(`Query error "${query}": ${rawResult.error}`);
	            }
	            const numRows = +rawResult.numRecords;
	            const slices = {
	                start,
	                end,
	                resolution,
	                strings: [],
	                starts: new Float64Array(numRows),
	                ends: new Float64Array(numRows),
	                depths: new Uint16Array(numRows),
	                titles: new Uint16Array(numRows),
	                categories: new Uint16Array(numRows),
	            };
	            const stringIndexes = new Map();
	            function internString(str) {
	                let idx = stringIndexes.get(str);
	                if (idx !== undefined)
	                    return idx;
	                idx = slices.strings.length;
	                slices.strings.push(str);
	                stringIndexes.set(str, idx);
	                return idx;
	            }
	            for (let row = 0; row < numRows; row++) {
	                const cols = rawResult.columns;
	                const startSec = time.fromNs(+cols[0].longValues[row]);
	                slices.starts[row] = startSec;
	                slices.ends[row] = startSec + time.fromNs(+cols[1].longValues[row]);
	                slices.depths[row] = +cols[2].longValues[row];
	                slices.categories[row] = internString(cols[3].stringValues[row]);
	                slices.titles[row] = internString(cols[4].stringValues[row]);
	            }
	            if (numRows === LIMIT) {
	                slices.end = slices.ends[slices.ends.length - 1];
	            }
	            this.publish(slices);
	        });
	    }
	}
	ChromeSliceTrackController.kind = common$2.SLICE_TRACK_KIND;
	track_controller.trackControllerRegistry.register(ChromeSliceTrackController);

	});

	unwrapExports(controller$4);

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

	var controller$6 = createCommonjsModule(function (module, exports) {
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




	class VsyncTrackController extends track_controller.TrackController {
	    constructor() {
	        super(...arguments);
	        this.busy = false;
	        this.setup = false;
	    }
	    onBoundsChange(start, end, resolution) {
	        this.update(start, end, resolution);
	    }
	    update(start, end, resolution) {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            // TODO(hjd): we should really call TraceProcessor.Interrupt() here.
	            if (this.busy)
	                return;
	            this.busy = true;
	            if (this.setup === false) {
	                yield this.query(`create virtual table window_${this.trackState.id} using window;`);
	                yield this.query(`create virtual table span_${this.trackState.id}
                     using span(sched, window_${this.trackState.id}, cpu);`);
	                this.setup = true;
	            }
	            const rawResult = yield this.engine.query(`
      select ts from counters
        where name like "${this.config.counterName}%"
        order by ts;`);
	            this.busy = false;
	            const rowCount = +rawResult.numRecords;
	            const result = {
	                start,
	                end,
	                resolution,
	                vsyncs: new Float64Array(rowCount),
	            };
	            const cols = rawResult.columns;
	            for (let i = 0; i < rowCount; i++) {
	                const startSec = time.fromNs(+cols[0].longValues[i]);
	                result.vsyncs[i] = startSec;
	            }
	            this.publish(result);
	        });
	    }
	    query(query) {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            const result = yield this.engine.query(query);
	            if (result.error) {
	                console.error(`Query error "${query}": ${result.error}`);
	                throw new Error(`Query error "${query}": ${result.error}`);
	            }
	            return result;
	        });
	    }
	    onDestroy() {
	        if (this.setup) {
	            this.query(`drop table window_${this.trackState.id}`);
	            this.query(`drop table span_${this.trackState.id}`);
	            this.setup = false;
	        }
	    }
	}
	VsyncTrackController.kind = common$4.KIND;
	track_controller.trackControllerRegistry.register(VsyncTrackController);

	});

	unwrapExports(controller$6);

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

	var controller$8 = createCommonjsModule(function (module, exports) {
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




	class ProcessSummaryTrackController extends track_controller.TrackController {
	    constructor() {
	        super(...arguments);
	        this.busy = false;
	        this.setup = false;
	    }
	    onBoundsChange(start, end, resolution) {
	        this.update(start, end, resolution);
	    }
	    // Returns a track id representation valid for use in sql table names.
	    get sqlTrackId() {
	        // Track ID can be UUID but '-' is not valid for sql table name.
	        return this.trackId.split('-').join('_');
	    }
	    update(start, end, resolution) {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            // TODO: we should really call TraceProcessor.Interrupt() at this point.
	            if (this.busy)
	                return;
	            this.busy = true;
	            const startNs = Math.round(start * 1e9);
	            const endNs = Math.round(end * 1e9);
	            if (this.setup === false) {
	                yield this.query(`create virtual table window_${this.sqlTrackId} using window;`);
	                const threadQuery = yield this.query(`select utid from thread where upid=${this.config.upid}`);
	                const utids = threadQuery.columns[0].longValues;
	                const processSliceView = `process_slice_view_${this.sqlTrackId}`;
	                yield this.query(`create view ${processSliceView} as ` +
	                    // 0 as cpu is a dummy column to perform span join on.
	                    `select ts, dur/${utids.length} as dur, 0 as cpu ` +
	                    `from slices where depth = 0 and utid in ` +
	                    // TODO(dproy): This query is faster if we write it as x < utid < y.
	                    `(${utids.join(',')})`);
	                yield this.query(`create virtual table span_${this.sqlTrackId}
                     using span(${processSliceView}, window_${this.sqlTrackId}, cpu);`);
	                this.setup = true;
	            }
	            // |resolution| is in s/px we want # ns for 10px window:
	            const bucketSizeNs = Math.round(resolution * 10 * 1e9);
	            const windowStartNs = Math.floor(startNs / bucketSizeNs) * bucketSizeNs;
	            const windowDurNs = endNs - windowStartNs;
	            this.query(`update window_${this.sqlTrackId} set
      window_start=${windowStartNs},
      window_dur=${windowDurNs},
      quantum=${bucketSizeNs}
      where rowid = 0;`);
	            this.publish(yield this.computeSummary(time.fromNs(windowStartNs), end, resolution, bucketSizeNs));
	            this.busy = false;
	        });
	    }
	    computeSummary(start, end, resolution, bucketSizeNs) {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            const startNs = Math.round(start * 1e9);
	            const endNs = Math.round(end * 1e9);
	            const numBuckets = Math.ceil((endNs - startNs) / bucketSizeNs);
	            const query = `select
        quantum_ts as bucket,
        sum(dur)/cast(${bucketSizeNs} as float) as utilization
        from span_${this.sqlTrackId}
        group by quantum_ts`;
	            const before = performance.now();
	            const rawResult = yield this.query(query);
	            console.log('UTIL computeSUmmary took ', performance.now() - before);
	            const numRows = +rawResult.numRecords;
	            const summary = {
	                start,
	                end,
	                resolution,
	                bucketSizeSeconds: time.fromNs(bucketSizeNs),
	                utilizations: new Float64Array(numBuckets),
	            };
	            const cols = rawResult.columns;
	            for (let row = 0; row < numRows; row++) {
	                const bucket = +cols[0].longValues[row];
	                summary.utilizations[bucket] = +cols[1].doubleValues[row];
	            }
	            return summary;
	        });
	    }
	    // TODO(dproy); Dedup with other controllers.
	    query(query) {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            console.log('GROUP QUERY: ', query);
	            const result = yield this.engine.query(query);
	            if (result.error) {
	                console.error(`Query error "${query}": ${result.error}`);
	                throw new Error(`Query error "${query}": ${result.error}`);
	            }
	            return result;
	        });
	    }
	    onDestroy() {
	        console.log('Process summary being destroyed!');
	        if (this.setup) {
	            this.query(`drop table window_${this.sqlTrackId}`);
	            this.query(`drop table span_${this.sqlTrackId}`);
	            this.setup = false;
	        }
	    }
	}
	ProcessSummaryTrackController.kind = common$6.PROCESS_SUMMARY_TRACK;
	track_controller.trackControllerRegistry.register(ProcessSummaryTrackController);

	});

	unwrapExports(controller$8);

	var all_controller = createCommonjsModule(function (module, exports) {
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

	unwrapExports(all_controller);

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

	var rngBrowser = createCommonjsModule(function (module) {
	// Unique ID creation requires a high quality random # generator.  In the
	// browser this is a little complicated due to unknown quality of Math.random()
	// and inconsistent support for the `crypto` API.  We do the best we can via
	// feature-detection

	// getRandomValues needs to be invoked in a context where "this" is a Crypto
	// implementation. Also, find the complete implementation of crypto on IE11.
	var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
	                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

	if (getRandomValues) {
	  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
	  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

	  module.exports = function whatwgRNG() {
	    getRandomValues(rnds8);
	    return rnds8;
	  };
	} else {
	  // Math.random()-based (RNG)
	  //
	  // If all else fails, use Math.random().  It's fast, but is of unspecified
	  // quality.
	  var rnds = new Array(16);

	  module.exports = function mathRNG() {
	    for (var i = 0, r; i < 16; i++) {
	      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
	      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	    }

	    return rnds;
	  };
	}
	});

	/**
	 * Convert array of 16 byte values to UUID string format of the form:
	 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
	 */
	var byteToHex = [];
	for (var i = 0; i < 256; ++i) {
	  byteToHex[i] = (i + 0x100).toString(16).substr(1);
	}

	function bytesToUuid(buf, offset) {
	  var i = offset || 0;
	  var bth = byteToHex;
	  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
	  return ([bth[buf[i++]], bth[buf[i++]], 
		bth[buf[i++]], bth[buf[i++]], '-',
		bth[buf[i++]], bth[buf[i++]], '-',
		bth[buf[i++]], bth[buf[i++]], '-',
		bth[buf[i++]], bth[buf[i++]], '-',
		bth[buf[i++]], bth[buf[i++]],
		bth[buf[i++]], bth[buf[i++]],
		bth[buf[i++]], bth[buf[i++]]]).join('');
	}

	var bytesToUuid_1 = bytesToUuid;

	function v4(options, buf, offset) {
	  var i = buf && offset || 0;

	  if (typeof(options) == 'string') {
	    buf = options === 'binary' ? new Array(16) : null;
	    options = null;
	  }
	  options = options || {};

	  var rnds = options.random || (options.rng || rngBrowser)();

	  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	  rnds[6] = (rnds[6] & 0x0f) | 0x40;
	  rnds[8] = (rnds[8] & 0x3f) | 0x80;

	  // Copy bytes to buffer, if provided
	  if (buf) {
	    for (var ii = 0; ii < 16; ++ii) {
	      buf[i + ii] = rnds[ii];
	    }
	  }

	  return buf || bytesToUuid_1(rnds);
	}

	var v4_1 = v4;

	var permalink_controller = createCommonjsModule(function (module, exports) {
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






	exports.BUCKET_NAME = 'perfetto-ui-data';
	class PermalinkController extends controller.Controller {
	    constructor() {
	        super('main');
	    }
	    run() {
	        if (globals.globals.state.permalink.requestId === undefined ||
	            globals.globals.state.permalink.requestId === this.lastRequestId) {
	            return;
	        }
	        const requestId = logging.assertExists(globals.globals.state.permalink.requestId);
	        this.lastRequestId = requestId;
	        // if the |link| is not set, this is a request to create a permalink.
	        if (globals.globals.state.permalink.hash === undefined) {
	            PermalinkController.createPermalink().then(hash => {
	                globals.globals.dispatch(actions.Actions.setPermalink({ requestId, hash }));
	            });
	            return;
	        }
	        // Otherwise, this is a request to load the permalink.
	        PermalinkController.loadState(globals.globals.state.permalink.hash).then(state => {
	            globals.globals.dispatch(actions.Actions.setState({ newState: state }));
	            this.lastRequestId = state.permalink.requestId;
	        });
	    }
	    static createPermalink() {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            const state = Object.assign({}, globals.globals.state);
	            state.engines = Object.assign({}, state.engines);
	            for (const engine of Object.values(state.engines)) {
	                // If the trace was opened from a local file, upload it and store the
	                // url of the uploaded trace instead.
	                if (engine.source instanceof File) {
	                    const url = yield this.saveTrace(engine.source);
	                    engine.source = url;
	                }
	            }
	            const hash = yield this.saveState(state);
	            return hash;
	        });
	    }
	    static saveState(state) {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            const text = JSON.stringify(state);
	            const hash = yield this.toSha256(text);
	            const url = 'https://www.googleapis.com/upload/storage/v1/b/' +
	                `${exports.BUCKET_NAME}/o?uploadType=media` +
	                `&name=${hash}&predefinedAcl=publicRead`;
	            const response = yield fetch(url, {
	                method: 'post',
	                headers: {
	                    'Content-Type': 'application/json; charset=utf-8',
	                },
	                body: text,
	            });
	            yield response.json();
	            return hash;
	        });
	    }
	    static saveTrace(trace) {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            // TODO(hjd): This should probably also be a hash but that requires
	            // trace processor support.
	            const name = v4_1();
	            const url = 'https://www.googleapis.com/upload/storage/v1/b/' +
	                `${exports.BUCKET_NAME}/o?uploadType=media` +
	                `&name=${name}&predefinedAcl=publicRead`;
	            const response = yield fetch(url, {
	                method: 'post',
	                headers: { 'Content-Type': 'application/octet-stream;' },
	                body: trace,
	            });
	            yield response.json();
	            return `https://storage.googleapis.com/${exports.BUCKET_NAME}/${name}`;
	        });
	    }
	    static loadState(id) {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            const url = `https://storage.googleapis.com/${exports.BUCKET_NAME}/${id}`;
	            const response = yield fetch(url);
	            const text = yield response.text();
	            const stateHash = yield this.toSha256(text);
	            const state = JSON.parse(text);
	            if (stateHash !== id) {
	                throw new Error(`State hash does not match ${id} vs. ${stateHash}`);
	            }
	            return state;
	        });
	    }
	    static toSha256(str) {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            // TODO(hjd): TypeScript bug with definition of TextEncoder.
	            // tslint:disable-next-line no-any
	            const buffer = new TextEncoder('utf-8').encode(str);
	            const digest = yield crypto.subtle.digest('SHA-256', buffer);
	            return Array.from(new Uint8Array(digest)).map(x => x.toString(16)).join('');
	        });
	    }
	}
	exports.PermalinkController = PermalinkController;

	});

	unwrapExports(permalink_controller);
	var permalink_controller_1 = permalink_controller.BUCKET_NAME;
	var permalink_controller_2 = permalink_controller.PermalinkController;

	var record_controller = createCommonjsModule(function (module, exports) {
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


	function uint8ArrayToBase64(buffer) {
	    return btoa(String.fromCharCode.apply(null, buffer));
	}
	exports.uint8ArrayToBase64 = uint8ArrayToBase64;
	function encodeConfig(config) {
	    const sizeKb = config.bufferSizeMb * 1024;
	    const durationMs = config.durationSeconds * 1000;
	    const dataSources = [];
	    if (config.ftrace) {
	        dataSources.push({
	            config: {
	                name: 'linux.ftrace',
	                targetBuffer: 0,
	                ftraceConfig: {
	                    ftraceEvents: config.ftraceEvents,
	                    atraceApps: config.atraceApps,
	                    atraceCategories: config.atraceCategories,
	                },
	            },
	        });
	    }
	    if (config.processMetadata) {
	        dataSources.push({
	            config: {
	                name: 'linux.process_stats',
	                processStatsConfig: {
	                    scanAllProcessesOnStart: config.scanAllProcessesOnStart,
	                },
	                targetBuffer: 0,
	            },
	        });
	    }
	    const buffer = protos_1.TraceConfig
	        .encode({
	        buffers: [
	            {
	                sizeKb,
	            },
	        ],
	        dataSources,
	        durationMs,
	    })
	        .finish();
	    return buffer;
	}
	exports.encodeConfig = encodeConfig;
	function toPbtxt(configBuffer) {
	    const json = protos_1.TraceConfig.decode(configBuffer).toJSON();
	    function snakeCase(s) {
	        return s.replace(/[A-Z]/g, c => '_' + c.toLowerCase());
	    }
	    function* message(msg, indent) {
	        for (const [key, value] of Object.entries(msg)) {
	            const isRepeated = Array.isArray(value);
	            const isNested = typeof value === 'object' && !isRepeated;
	            for (const entry of (isRepeated ? value : [value])) {
	                yield ' '.repeat(indent) + `${snakeCase(key)}${isNested ? '' : ':'} `;
	                if (typeof entry === 'string') {
	                    yield `"${entry}"`;
	                }
	                else if (typeof entry === 'number') {
	                    yield entry.toString();
	                }
	                else if (typeof entry === 'boolean') {
	                    yield entry.toString();
	                }
	                else {
	                    yield '{\n';
	                    yield* message(entry, indent + 4);
	                    yield ' '.repeat(indent) + '}';
	                }
	                yield '\n';
	            }
	        }
	    }
	    return [...message(json, 0)].join('');
	}
	exports.toPbtxt = toPbtxt;
	class RecordController extends controller.Controller {
	    constructor(args) {
	        super('main');
	        this.config = null;
	        this.app = args.app;
	    }
	    run() {
	        if (this.app.state.recordConfig === this.config)
	            return;
	        this.config = this.app.state.recordConfig;
	        const configProto = encodeConfig(this.config);
	        const configProtoText = toPbtxt(configProto);
	        const commandline = `
      echo '${uint8ArrayToBase64(configProto)}' |
      base64 --decode |
      adb shell "perfetto -c - -o /data/misc/perfetto-traces/trace" &&
      adb pull /data/misc/perfetto-traces/trace /tmp/trace
    `;
	        // TODO(hjd): This should not be TrackData after we unify the stores.
	        this.app.publish('TrackData', {
	            id: 'config',
	            data: {
	                commandline,
	                pbtxt: configProtoText,
	            }
	        });
	    }
	}
	exports.RecordController = RecordController;

	});

	unwrapExports(record_controller);
	var record_controller_1 = record_controller.uint8ArrayToBase64;
	var record_controller_2 = record_controller.encodeConfig;
	var record_controller_3 = record_controller.toPbtxt;
	var record_controller_4 = record_controller.RecordController;

	var query_controller = createCommonjsModule(function (module, exports) {
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






	class QueryController extends controller.Controller {
	    constructor(args) {
	        super('init');
	        this.args = args;
	    }
	    run() {
	        switch (this.state) {
	            case 'init':
	                const config = logging.assertExists(globals.globals.state.queries[this.args.queryId]);
	                this.runQuery(config.query).then(result => {
	                    console.log(`Query ${config.query} took ${result.durationMs} ms`);
	                    globals.globals.publish('QueryResult', { id: this.args.queryId, data: result });
	                    globals.globals.dispatch(actions.Actions.deleteQuery({ queryId: this.args.queryId }));
	                });
	                this.setState('querying');
	                break;
	            case 'querying':
	                // Nothing to do here, as soon as the deleteQuery is dispatched this
	                // controller will be destroyed (by the TraceController).
	                break;
	            default:
	                throw new Error(`Unexpected state ${this.state}`);
	        }
	    }
	    runQuery(sqlQuery) {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            const startMs = performance.now();
	            const rawResult = yield this.args.engine.query(sqlQuery);
	            const durationMs = performance.now() - startMs;
	            const columns = protos_1.rawQueryResultColumns(rawResult);
	            const rows = QueryController.firstN(10000, protos_1.rawQueryResultIter(rawResult));
	            const result = {
	                id: this.args.queryId,
	                query: sqlQuery,
	                durationMs,
	                error: rawResult.error,
	                totalRowCount: +rawResult.numRecords,
	                columns,
	                rows,
	            };
	            return result;
	        });
	    }
	    static firstN(n, iter) {
	        const list = [];
	        for (let i = 0; i < n; i++) {
	            const { done, value } = iter.next();
	            if (done)
	                break;
	            list.push(value);
	        }
	        return list;
	    }
	}
	exports.QueryController = QueryController;

	});

	unwrapExports(query_controller);
	var query_controller_1 = query_controller.QueryController;

	var trace_controller = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	Object.defineProperty(exports, "__esModule", { value: true });

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












	// TraceController handles handshakes with the frontend for everything that
	// concerns a single trace. It owns the WASM trace processor engine, handles
	// tracks data and SQL queries. There is one TraceController instance for each
	// trace opened in the UI (for now only one trace is supported).
	class TraceController extends controller.Controller {
	    constructor(engineId) {
	        super('init');
	        this.engineId = engineId;
	    }
	    onDestroy() {
	        if (this.engine !== undefined)
	            globals.globals.destroyEngine(this.engine.id);
	    }
	    run() {
	        const engineCfg = logging.assertExists(globals.globals.state.engines[this.engineId]);
	        switch (this.state) {
	            case 'init':
	                globals.globals.dispatch(actions.Actions.setEngineReady({
	                    engineId: this.engineId,
	                    ready: false,
	                }));
	                this.loadTrace().then(() => {
	                    globals.globals.dispatch(actions.Actions.setEngineReady({
	                        engineId: this.engineId,
	                        ready: true,
	                    }));
	                });
	                this.updateStatus('Opening trace');
	                this.setState('loading_trace');
	                break;
	            case 'loading_trace':
	                // Stay in this state until loadTrace() returns and marks the engine as
	                // ready.
	                if (this.engine === undefined || !engineCfg.ready)
	                    return;
	                this.setState('ready');
	                break;
	            case 'ready':
	                // At this point we are ready to serve queries and handle tracks.
	                const engine = logging.assertExists(this.engine);
	                logging.assertTrue(engineCfg.ready);
	                const childControllers = [];
	                // Create a TrackController for each track.
	                for (const trackId of Object.keys(globals.globals.state.tracks)) {
	                    const trackCfg = globals.globals.state.tracks[trackId];
	                    if (trackCfg.engineId !== this.engineId)
	                        continue;
	                    if (!track_controller.trackControllerRegistry.has(trackCfg.kind))
	                        continue;
	                    const trackCtlFactory = track_controller.trackControllerRegistry.get(trackCfg.kind);
	                    const trackArgs = { trackId, engine };
	                    childControllers.push(controller.Child(trackId, trackCtlFactory, trackArgs));
	                }
	                // Create a QueryController for each query.
	                for (const queryId of Object.keys(globals.globals.state.queries)) {
	                    const queryArgs = { queryId, engine };
	                    childControllers.push(controller.Child(queryId, query_controller.QueryController, queryArgs));
	                }
	                return childControllers;
	            default:
	                throw new Error(`unknown state ${this.state}`);
	        }
	        return;
	    }
	    loadTrace() {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            this.updateStatus('Creating trace processor');
	            const engineCfg = logging.assertExists(globals.globals.state.engines[this.engineId]);
	            this.engine = globals.globals.createEngine();
	            const statusHeader = 'Opening trace';
	            if (engineCfg.source instanceof File) {
	                const blob = engineCfg.source;
	                const reader = new FileReaderSync();
	                const SLICE_SIZE = 1024 * 1024;
	                for (let off = 0; off < blob.size; off += SLICE_SIZE) {
	                    const slice = blob.slice(off, off + SLICE_SIZE);
	                    const arrBuf = reader.readAsArrayBuffer(slice);
	                    yield this.engine.parse(new Uint8Array(arrBuf));
	                    const progress = Math.round((off + slice.size) / blob.size * 100);
	                    this.updateStatus(`${statusHeader} ${progress} %`);
	                }
	            }
	            else {
	                const resp = yield fetch(engineCfg.source);
	                if (resp.status !== 200) {
	                    this.updateStatus(`HTTP error ${resp.status}`);
	                    throw new Error(`fetch() failed with HTTP error ${resp.status}`);
	                }
	                // tslint:disable-next-line no-any
	                const rd = resp.body.getReader();
	                const tStartMs = performance.now();
	                let tLastUpdateMs = 0;
	                for (let off = 0;;) {
	                    const readRes = yield rd.read();
	                    if (readRes.value !== undefined) {
	                        off += readRes.value.length;
	                        yield this.engine.parse(readRes.value);
	                    }
	                    // For traces loaded from the network there doesn't seem to be a
	                    // reliable way to compute the %. The content-length exposed by GCS is
	                    // before compression (which is handled transparently by the browser).
	                    const nowMs = performance.now();
	                    if (nowMs - tLastUpdateMs > 100) {
	                        tLastUpdateMs = nowMs;
	                        const mb = off / 1e6;
	                        const tElapsed = (nowMs - tStartMs) / 1e3;
	                        let status = `${statusHeader} ${mb.toFixed(1)} MB `;
	                        status += `(${(mb / tElapsed).toFixed(1)} MB/s)`;
	                        this.updateStatus(status);
	                    }
	                    if (readRes.done)
	                        break;
	                }
	            }
	            yield this.engine.notifyEof();
	            const traceTime = yield this.engine.getTraceTimeBounds();
	            const traceTimeState = {
	                startSec: traceTime.start,
	                endSec: traceTime.end,
	                lastUpdate: Date.now() / 1000,
	            };
	            const actions$$1 = [
	                actions.Actions.setTraceTime(traceTimeState),
	                actions.Actions.navigate({ route: '/viewer' }),
	            ];
	            if (globals.globals.state.visibleTraceTime.lastUpdate === 0) {
	                actions$$1.push(actions.Actions.setVisibleTraceTime(traceTimeState));
	            }
	            globals.globals.dispatchMultiple(actions$$1);
	            yield this.listTracks();
	            yield this.listThreads();
	            yield this.loadTimelineOverview(traceTime);
	        });
	    }
	    listTracks() {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            this.updateStatus('Loading tracks');
	            const engine = logging.assertExists(this.engine);
	            const addToTrackActions = [];
	            const numCpus = yield engine.getNumberOfCpus();
	            // TODO(hjd): Move this code out of TraceController.
	            for (const counterName of ['VSYNC-sf', 'VSYNC-app']) {
	                const hasVsync = !!(yield engine.query(`select ts from counters where name like "${counterName}" limit 1`))
	                    .numRecords;
	                if (!hasVsync)
	                    continue;
	                addToTrackActions.push(actions.Actions.addTrack({
	                    engineId: this.engineId,
	                    kind: 'VsyncTrack',
	                    name: `${counterName}`,
	                    config: {
	                        counterName,
	                    }
	                }));
	            }
	            for (let cpu = 0; cpu < numCpus; cpu++) {
	                addToTrackActions.push(actions.Actions.addTrack({
	                    engineId: this.engineId,
	                    kind: common.CPU_SLICE_TRACK_KIND,
	                    name: `Cpu ${cpu}`,
	                    trackGroup: state.SCROLLING_TRACK_GROUP,
	                    config: {
	                        cpu,
	                    }
	                }));
	            }
	            // Local experiments shows getting maxDepth separately is ~2x faster than
	            // joining with threads and processes.
	            const maxDepthQuery = yield engine.query('select utid, max(depth) from slices group by utid');
	            const utidToMaxDepth = new Map();
	            for (let i = 0; i < maxDepthQuery.numRecords; i++) {
	                const utid = maxDepthQuery.columns[0].longValues[i];
	                const maxDepth = maxDepthQuery.columns[1].longValues[i];
	                utidToMaxDepth.set(utid, maxDepth);
	            }
	            const threadQuery = yield engine.query('select utid, tid, upid, pid, thread.name, process.name ' +
	                'from thread inner join process using(upid)');
	            const upidToUuid = new Map();
	            const addSummaryTrackActions = [];
	            const addTrackGroupActions = [];
	            for (let i = 0; i < threadQuery.numRecords; i++) {
	                const utid = threadQuery.columns[0].longValues[i];
	                const maxDepth = utidToMaxDepth.get(utid);
	                if (maxDepth === undefined) {
	                    // This thread does not have stackable slices.
	                    continue;
	                }
	                const tid = threadQuery.columns[1].longValues[i];
	                const upid = threadQuery.columns[2].longValues[i];
	                const pid = threadQuery.columns[3].longValues[i];
	                const threadName = threadQuery.columns[4].stringValues[i];
	                const processName = threadQuery.columns[5].stringValues[i];
	                let pUuid = upidToUuid.get(upid);
	                if (pUuid === undefined) {
	                    pUuid = v4_1();
	                    const summaryTrackId = v4_1();
	                    upidToUuid.set(upid, pUuid);
	                    addSummaryTrackActions.push(actions.Actions.addTrack({
	                        id: summaryTrackId,
	                        engineId: this.engineId,
	                        kind: common$6.PROCESS_SUMMARY_TRACK,
	                        name: `${pid} summary`,
	                        config: { upid, pid, maxDepth, utid },
	                    }));
	                    addTrackGroupActions.push(actions.Actions.addTrackGroup({
	                        engineId: this.engineId,
	                        summaryTrack: summaryTrackId,
	                        name: `${processName} ${pid}`,
	                        id: pUuid,
	                        collapsed: true,
	                    }));
	                }
	                addToTrackActions.push(actions.Actions.addTrack({
	                    engineId: this.engineId,
	                    kind: common$2.SLICE_TRACK_KIND,
	                    name: threadName + `[${tid}]`,
	                    trackGroup: pUuid,
	                    config: { upid, utid, maxDepth },
	                }));
	            }
	            const allActions = addSummaryTrackActions.concat(addTrackGroupActions, addToTrackActions);
	            globals.globals.dispatchMultiple(allActions);
	        });
	    }
	    listThreads() {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            this.updateStatus('Reading thread list');
	            const sqlQuery = 'select utid, tid, pid, thread.name, process.name ' +
	                'from thread inner join process using(upid)';
	            const threadRows = yield logging.assertExists(this.engine).query(sqlQuery);
	            const threads = [];
	            for (let i = 0; i < threadRows.numRecords; i++) {
	                const utid = threadRows.columns[0].longValues[i];
	                const tid = threadRows.columns[1].longValues[i];
	                const pid = threadRows.columns[2].longValues[i];
	                const threadName = threadRows.columns[3].stringValues[i];
	                const procName = threadRows.columns[4].stringValues[i];
	                threads.push({ utid, tid, threadName, pid, procName });
	            } // for (record ...)
	            globals.globals.publish('Threads', threads);
	        });
	    }
	    loadTimelineOverview(traceTime) {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            const engine = logging.assertExists(this.engine);
	            const numSteps = 100;
	            const stepSec = traceTime.duration / numSteps;
	            for (let step = 0; step < numSteps; step++) {
	                this.updateStatus('Loading overview ' +
	                    `${Math.round((step + 1) / numSteps * 1000) / 10}%`);
	                const startSec = traceTime.start + step * stepSec;
	                const startNs = Math.floor(startSec * 1e9);
	                const endSec = startSec + stepSec;
	                const endNs = Math.ceil(endSec * 1e9);
	                // Sched overview.
	                const schedRows = yield engine.query(`select sum(dur)/${stepSec}/1e9, cpu from sched ` +
	                    `where ts >= ${startNs} and ts < ${endNs} and utid != 0 ` +
	                    'group by cpu order by cpu');
	                const schedData = {};
	                for (let i = 0; i < schedRows.numRecords; i++) {
	                    const load = schedRows.columns[0].doubleValues[i];
	                    const cpu = schedRows.columns[1].longValues[i];
	                    schedData[cpu] = { startSec, endSec, load };
	                } // for (record ...)
	                globals.globals.publish('OverviewData', schedData);
	                // Slices overview.
	                const slicesRows = yield engine.query(`select sum(dur)/${stepSec}/1e9, process.name, process.pid, upid ` +
	                    'from slices inner join thread using(utid) ' +
	                    'inner join process using(upid) where depth = 0 ' +
	                    `and ts >= ${startNs} and ts < ${endNs} ` +
	                    'group by upid');
	                const slicesData = {};
	                for (let i = 0; i < slicesRows.numRecords; i++) {
	                    const load = slicesRows.columns[0].doubleValues[i];
	                    let procName = slicesRows.columns[1].stringValues[i];
	                    const pid = slicesRows.columns[2].longValues[i];
	                    procName += ` [${pid}]`;
	                    slicesData[procName] = { startSec, endSec, load };
	                }
	                globals.globals.publish('OverviewData', slicesData);
	            } // for (step ...)
	        });
	    }
	    updateStatus(msg) {
	        globals.globals.dispatch(actions.Actions.updateStatus({
	            msg,
	            timestamp: Date.now() / 1000,
	        }));
	    }
	}
	exports.TraceController = TraceController;

	});

	unwrapExports(trace_controller);
	var trace_controller_1 = trace_controller.TraceController;

	var app_controller = createCommonjsModule(function (module, exports) {
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





	// The root controller for the entire app. It handles the lifetime of all
	// the other controllers (e.g., track and query controllers) according to the
	// global state.
	class AppController extends controller.Controller {
	    constructor() {
	        super('main');
	    }
	    // This is the root method that is called every time the controller tree is
	    // re-triggered. This can happen due to:
	    // - An action received from the frontend.
	    // - An internal promise of a nested controller being resolved and manually
	    //   re-triggering the controllers.
	    run() {
	        const childControllers = [
	            controller.Child('permalink', permalink_controller.PermalinkController, {}),
	            controller.Child('record', record_controller.RecordController, { app: globals.globals }),
	        ];
	        for (const engineCfg of Object.values(globals.globals.state.engines)) {
	            childControllers.push(controller.Child(engineCfg.id, trace_controller.TraceController, engineCfg.id));
	        }
	        return childControllers;
	    }
	}
	exports.AppController = AppController;

	});

	unwrapExports(app_controller);
	var app_controller_1 = app_controller.AppController;

	var controller$a = createCommonjsModule(function (module, exports) {
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





	function main(port) {
	    wasm_engine_proxy.warmupWasmEngine();
	    let receivedFrontendPort = false;
	    port.onmessage = ({ data }) => {
	        if (receivedFrontendPort) {
	            globals.globals.dispatch(data);
	            return;
	        }
	        const frontendPort = data;
	        const frontend = new remote.Remote(frontendPort);
	        globals.globals.initialize(new app_controller.AppController(), frontend);
	        receivedFrontendPort = true;
	    };
	}
	main(self);

	});

	var index = unwrapExports(controller$a);

	return index;

}());
//# sourceMappingURL=controller_bundle.js.map
