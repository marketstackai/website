!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
      ? define([], t)
      : "object" == typeof exports
        ? (exports.ExternalTracking = t())
        : (e.ExternalTracking = t());
})("undefined" != typeof self ? self : this, () =>
  (() => {
    "use strict";
    var e = {
        11: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.unsafeStringify = void 0);
          const n = r(746),
            i = [];
          for (let e = 0; e < 256; ++e) i.push((e + 256).toString(16).slice(1));
          function o(e, t = 0) {
            return (
              i[e[t + 0]] +
              i[e[t + 1]] +
              i[e[t + 2]] +
              i[e[t + 3]] +
              "-" +
              i[e[t + 4]] +
              i[e[t + 5]] +
              "-" +
              i[e[t + 6]] +
              i[e[t + 7]] +
              "-" +
              i[e[t + 8]] +
              i[e[t + 9]] +
              "-" +
              i[e[t + 10]] +
              i[e[t + 11]] +
              i[e[t + 12]] +
              i[e[t + 13]] +
              i[e[t + 14]] +
              i[e[t + 15]]
            ).toLowerCase();
          }
          (t.unsafeStringify = o),
            (t.default = function (e, t = 0) {
              const r = o(e, t);
              if (!(0, n.default)(r))
                throw TypeError("Stringified UUID is invalid");
              return r;
            });
        },
        24: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.startTimeTracking = t.TimeOnPageTracker = void 0);
          const n = r(910),
            i = r(266),
            o = r(976),
            a = r(867),
            s = r(244);
          var l = r(244);
          Object.defineProperty(t, "TimeOnPageTracker", {
            enumerable: !0,
            get: function () {
              return l.TimeOnPageTracker;
            },
          }),
            (t.startTimeTracking = (e) => {
              if (!e || "undefined" == typeof window) return;
              const t = window.setInterval(() => {
                try {
                  const r = (0, a.getTrackingContext)(e);
                  if (!r) return;
                  window.clearInterval(t);
                  const i = new s.TimeOnPageTracker((e) =>
                      (0, o.sendTimeSpentEvent)(e, r),
                    ),
                    l = window;
                  (l[n.GLOBAL_TRACKING_KEY] = l[n.GLOBAL_TRACKING_KEY] || {}),
                    (l[n.GLOBAL_TRACKING_KEY].timeTracker = i);
                } catch (e) {
                  i.logger.error("Error in time tracking", e),
                    window.clearInterval(t);
                }
              }, 300);
            });
        },
        67: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.cleanLabelText =
              t.getFieldsetLegend =
              t.getContainerLabel =
              t.getCombinedLabel =
              t.getSubLabel =
              t.getMainLabel =
              t.isCompoundField =
              t.isGravityFormsField =
                void 0);
          var n = r(780);
          Object.defineProperty(t, "isGravityFormsField", {
            enumerable: !0,
            get: function () {
              return n.isGravityFormsField;
            },
          }),
            Object.defineProperty(t, "isCompoundField", {
              enumerable: !0,
              get: function () {
                return n.isCompoundField;
              },
            }),
            Object.defineProperty(t, "getMainLabel", {
              enumerable: !0,
              get: function () {
                return n.getMainLabel;
              },
            }),
            Object.defineProperty(t, "getSubLabel", {
              enumerable: !0,
              get: function () {
                return n.getSubLabel;
              },
            }),
            Object.defineProperty(t, "getCombinedLabel", {
              enumerable: !0,
              get: function () {
                return n.getCombinedLabel;
              },
            }),
            Object.defineProperty(t, "getContainerLabel", {
              enumerable: !0,
              get: function () {
                return n.getContainerLabel;
              },
            }),
            Object.defineProperty(t, "getFieldsetLegend", {
              enumerable: !0,
              get: function () {
                return n.getFieldsetLegend;
              },
            }),
            Object.defineProperty(t, "cleanLabelText", {
              enumerable: !0,
              get: function () {
                return n.cleanLabelText;
              },
            });
        },
        110: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.ExternalTracker = void 0);
          const n = r(436),
            i = r(716),
            o = r(266),
            a = r(910);
          t.ExternalTracker = class {
            constructor(e) {
              if (
                ((this.state = { initialized: !1, trackingId: e.trackingId }),
                (this.apiClient = new n.ApiClient(e.trackingId, e.apiEndpoint)),
                e.debug)
              ) {
                const e = window;
                (e[a.GLOBAL_TRACKING_KEY] = e[a.GLOBAL_TRACKING_KEY] || {}),
                  (e[a.GLOBAL_TRACKING_KEY].debug = !0);
              }
              o.logger.log("ExternalTracker created with config:", e),
                this.init();
            }
            async init() {
              if (this.state.initialized)
                o.logger.warn("Tracker already initialized");
              else
                try {
                  const e = await this.apiClient.fetchLocationId();
                  (this.state.locationId = e),
                    (this.state.sessionId = (0, o.generateSessionId)()),
                    (0, o.storeSessionIdInCookie)(e, this.state.sessionId),
                    this.apiClient.setTrackingContext(this.state.sessionId, e),
                    (0, i.startPageTracking)(async (e) => {
                      (e.properties = {
                        ...e.properties,
                        sessionId: this.state.sessionId,
                      }),
                        await this.sendEvent(e);
                    }),
                    (0, i.startFormTracking)(async (e) => {
                      (e.properties = {
                        ...e.properties,
                        sessionId: this.state.sessionId,
                      }),
                        await this.apiClient.submitForm(e);
                    }),
                    (this.state.initialized = !0),
                    o.logger.log(
                      "Tracker initialized successfully with sessionId:",
                      this.state.sessionId,
                    );
                } catch (e) {
                  throw (o.logger.error("Failed to initialize tracker:", e), e);
                }
            }
            async sendEvent(e) {
              var t;
              this.state.userId &&
                (e.properties = {
                  ...e.properties,
                  userId: this.state.userId,
                  ...this.state.userProperties,
                });
              const r =
                (null === (t = null == e ? void 0 : e.properties) ||
                void 0 === t
                  ? void 0
                  : t.deviceType) || (0, o.getDeviceType)();
              (e.properties = {
                ...e.properties,
                sessionId: this.state.sessionId,
                locationId: this.state.locationId,
                deviceType: r,
              }),
                await this.apiClient.sendEvent(e);
            }
          };
        },
        129: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.createTracker = void 0);
          const n = r(110),
            i = r(266),
            o = r(479);
          t.createTracker = (e) => {
            if (!(0, o.validateConfig)(e)) {
              const e = new Error("Invalid tracking configuration provided");
              throw (i.logger.critical("Failed to create tracker:", e), e);
            }
            try {
              const t = new n.ExternalTracker(e);
              return (
                i.logger.log(
                  "Tracker created successfully with ID:",
                  e.trackingId,
                ),
                t
              );
            } catch (e) {
              throw (i.logger.critical("Error creating tracker:", e), e);
            }
          };
        },
        156: function (e, t, r) {
          var n =
              (this && this.__createBinding) ||
              (Object.create
                ? function (e, t, r, n) {
                    void 0 === n && (n = r);
                    var i = Object.getOwnPropertyDescriptor(t, r);
                    (i &&
                      !("get" in i
                        ? !t.__esModule
                        : i.writable || i.configurable)) ||
                      (i = {
                        enumerable: !0,
                        get: function () {
                          return t[r];
                        },
                      }),
                      Object.defineProperty(e, n, i);
                  }
                : function (e, t, r, n) {
                    void 0 === n && (n = r), (e[n] = t[r]);
                  }),
            i =
              (this && this.__exportStar) ||
              function (e, t) {
                for (var r in e)
                  "default" === r ||
                    Object.prototype.hasOwnProperty.call(t, r) ||
                    n(t, e, r);
              };
          Object.defineProperty(t, "__esModule", { value: !0 });
          const o = r(850),
            a = r(24),
            s = r(266);
          i(r(574), t),
            (() => {
              try {
                const e = (0, o.initializeFromScript)();
                e
                  ? (s.logger.log("Tracking initialized successfully"),
                    (0, a.startTimeTracking)(e))
                  : (s.logger.critical(
                      "External Tracking failed to initialize",
                    ),
                    s.logger.critical(
                      "Make sure to include data-tracking-id in your script tag",
                    ));
              } catch (e) {
                s.logger.critical("Initialization failed:", e);
              }
            })();
        },
        168: function (e, t, r) {
          var n,
            i =
              (this && this.__createBinding) ||
              (Object.create
                ? function (e, t, r, n) {
                    void 0 === n && (n = r);
                    var i = Object.getOwnPropertyDescriptor(t, r);
                    (i &&
                      !("get" in i
                        ? !t.__esModule
                        : i.writable || i.configurable)) ||
                      (i = {
                        enumerable: !0,
                        get: function () {
                          return t[r];
                        },
                      }),
                      Object.defineProperty(e, n, i);
                  }
                : function (e, t, r, n) {
                    void 0 === n && (n = r), (e[n] = t[r]);
                  }),
            o =
              (this && this.__setModuleDefault) ||
              (Object.create
                ? function (e, t) {
                    Object.defineProperty(e, "default", {
                      enumerable: !0,
                      value: t,
                    });
                  }
                : function (e, t) {
                    e.default = t;
                  }),
            a =
              (this && this.__importStar) ||
              ((n = function (e) {
                return (
                  (n =
                    Object.getOwnPropertyNames ||
                    function (e) {
                      var t = [];
                      for (var r in e)
                        Object.prototype.hasOwnProperty.call(e, r) &&
                          (t[t.length] = r);
                      return t;
                    }),
                  n(e)
                );
              }),
              function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                  for (var r = n(e), a = 0; a < r.length; a++)
                    "default" !== r[a] && i(t, e, r[a]);
                return o(t, e), t;
              });
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.cleanLabelText =
              t.isGravityFormsField =
              t.getGravityFormsCombinedLabel =
              t.GravityForms =
                void 0),
            (t.GravityForms = a(r(67)));
          var s = r(67);
          Object.defineProperty(t, "getGravityFormsCombinedLabel", {
            enumerable: !0,
            get: function () {
              return s.getCombinedLabel;
            },
          }),
            Object.defineProperty(t, "isGravityFormsField", {
              enumerable: !0,
              get: function () {
                return s.isGravityFormsField;
              },
            }),
            Object.defineProperty(t, "cleanLabelText", {
              enumerable: !0,
              get: function () {
                return s.cleanLabelText;
              },
            });
        },
        182: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.version =
              t.validate =
              t.v7 =
              t.v6ToV1 =
              t.v6 =
              t.v5 =
              t.v4 =
              t.v3 =
              t.v1ToV6 =
              t.v1 =
              t.stringify =
              t.parse =
              t.NIL =
              t.MAX =
                void 0);
          var n = r(196);
          Object.defineProperty(t, "MAX", {
            enumerable: !0,
            get: function () {
              return n.default;
            },
          });
          var i = r(465);
          Object.defineProperty(t, "NIL", {
            enumerable: !0,
            get: function () {
              return i.default;
            },
          });
          var o = r(797);
          Object.defineProperty(t, "parse", {
            enumerable: !0,
            get: function () {
              return o.default;
            },
          });
          var a = r(11);
          Object.defineProperty(t, "stringify", {
            enumerable: !0,
            get: function () {
              return a.default;
            },
          });
          var s = r(425);
          Object.defineProperty(t, "v1", {
            enumerable: !0,
            get: function () {
              return s.default;
            },
          });
          var l = r(568);
          Object.defineProperty(t, "v1ToV6", {
            enumerable: !0,
            get: function () {
              return l.default;
            },
          });
          var c = r(591);
          Object.defineProperty(t, "v3", {
            enumerable: !0,
            get: function () {
              return c.default;
            },
          });
          var d = r(286);
          Object.defineProperty(t, "v4", {
            enumerable: !0,
            get: function () {
              return d.default;
            },
          });
          var u = r(557);
          Object.defineProperty(t, "v5", {
            enumerable: !0,
            get: function () {
              return u.default;
            },
          });
          var f = r(356);
          Object.defineProperty(t, "v6", {
            enumerable: !0,
            get: function () {
              return f.default;
            },
          });
          var g = r(268);
          Object.defineProperty(t, "v6ToV1", {
            enumerable: !0,
            get: function () {
              return g.default;
            },
          });
          var m = r(299);
          Object.defineProperty(t, "v7", {
            enumerable: !0,
            get: function () {
              return m.default;
            },
          });
          var p = r(746);
          Object.defineProperty(t, "validate", {
            enumerable: !0,
            get: function () {
              return p.default;
            },
          });
          var v = r(770);
          Object.defineProperty(t, "version", {
            enumerable: !0,
            get: function () {
              return v.default;
            },
          });
        },
        196: (e, t) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.default = "ffffffff-ffff-ffff-ffff-ffffffffffff");
        },
        244: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.TimeOnPageTracker = void 0);
          const n = r(266),
            i = 18e5,
            o = [
              "pointerdown",
              "pointermove",
              "keydown",
              "scroll",
              "touchstart",
              "touchmove",
            ];
          t.TimeOnPageTracker = class {
            constructor(e) {
              (this.activeTimeMs = 0),
                (this.updateTimer = null),
                (this.isIdle = !1),
                (this.destroyed = !1),
                (this.flushed = !1),
                (this.sessionExpired = !1),
                (this.onActivity = () => {
                  if (this.destroyed) return;
                  const e = Date.now();
                  this.sessionExpired &&
                    ((this.sessionStart = e),
                    (this.lastTick = e),
                    (this.activeTimeMs = 0),
                    (this.flushed = !1),
                    (this.sessionExpired = !1)),
                    (this.lastActivityAt = e),
                    (this.isIdle = !1);
                }),
                (this.onVisibilityChange = () => {
                  document.hidden ? this.checkTimeout() : this.onActivity();
                }),
                (this.onUnload = () => {
                  this.destroyed || this.emitUpdate();
                }),
                (this.tick = () => {
                  if (this.destroyed) return;
                  const e = Date.now();
                  (this.isIdle = e - this.lastActivityAt >= i),
                    document.hidden ||
                      this.isIdle ||
                      (this.activeTimeMs += e - this.lastTick),
                    (this.lastTick = e),
                    this.checkTimeout();
                });
              const t = Date.now();
              (this.onSessionComplete = e),
                (this.sessionStart = t),
                (this.lastActivityAt = t),
                (this.lastTick = t),
                this.bind();
            }
            bind() {
              try {
                o.forEach((e) =>
                  window.addEventListener(e, this.onActivity, { passive: !0 }),
                ),
                  document.addEventListener(
                    "visibilitychange",
                    this.onVisibilityChange,
                  ),
                  window.addEventListener("beforeunload", this.onUnload, {
                    capture: !0,
                  }),
                  window.addEventListener("pagehide", this.onUnload, {
                    capture: !0,
                  }),
                  (this.updateTimer = window.setInterval(this.tick, 1e3));
              } catch (e) {
                n.logger.error("Failed to bind event listeners", e);
              }
            }
            checkTimeout() {
              Date.now() - this.lastActivityAt >= i &&
                (this.emitUpdate(), (this.sessionExpired = !0));
            }
            emitUpdate() {
              if (this.destroyed || this.flushed) return;
              this.flushed = !0;
              const e = Date.now();
              document.hidden ||
                this.isIdle ||
                (this.activeTimeMs += e - this.lastTick),
                (this.lastTick = e),
                this.onSessionComplete({
                  sessionStart: this.sessionStart,
                  sessionEnd: e,
                  timeSpentMs: Math.max(0, Math.round(this.activeTimeMs)),
                });
            }
            destroy() {
              this.destroyed ||
                ((this.destroyed = !0),
                o.forEach((e) =>
                  window.removeEventListener(e, this.onActivity),
                ),
                document.removeEventListener(
                  "visibilitychange",
                  this.onVisibilityChange,
                ),
                window.removeEventListener("beforeunload", this.onUnload),
                window.removeEventListener("pagehide", this.onUnload),
                this.updateTimer && window.clearInterval(this.updateTimer));
            }
          };
        },
        266: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.getFormIdentifier =
              t.getFormattedTimezone =
              t.getLocalTimeZoneOffset =
              t.getLocalTimeZone =
              t.getPageMetadata =
              t.getDeviceType =
              t.debounce =
              t.setInStorage =
              t.getFromStorage =
              t.getSessionIdFromCookie =
              t.storeSessionIdInCookie =
              t.getUserData =
              t.storeUserData =
              t.setCookie =
              t.getCookie =
              t.generateSessionId =
              t.isPasswordLikeField =
              t.containsPassword =
              t.parseFormData =
              t.logger =
                void 0);
          const n = r(182),
            i = r(628);
          var o = r(628);
          Object.defineProperty(t, "logger", {
            enumerable: !0,
            get: function () {
              return o.logger;
            },
          });
          var a = r(952);
          Object.defineProperty(t, "parseFormData", {
            enumerable: !0,
            get: function () {
              return a.parseFormData;
            },
          });
          var s = r(378);
          Object.defineProperty(t, "containsPassword", {
            enumerable: !0,
            get: function () {
              return s.containsPassword;
            },
          }),
            Object.defineProperty(t, "isPasswordLikeField", {
              enumerable: !0,
              get: function () {
                return s.isPasswordLikeField;
              },
            }),
            (t.generateSessionId = () => (0, n.v4)()),
            (t.getCookie = (e) => {
              var t;
              try {
                const r = `; ${document.cookie}`.split(`; ${e}=`);
                if (2 === r.length)
                  return (
                    (null === (t = r.pop()) || void 0 === t
                      ? void 0
                      : t.split(";").shift()) || null
                  );
              } catch (e) {
                i.logger.error("Error getting cookie:", e);
              }
              return null;
            }),
            (t.setCookie = (e, t, r) => {
              try {
                const n = new Date();
                n.setTime(n.getTime() + 24 * r * 60 * 60 * 1e3);
                const i = `expires=${n.toUTCString()}`;
                document.cookie = `${e}=${t};${i};path=/;SameSite=Lax`;
              } catch (e) {
                i.logger.error("Error setting cookie:", e);
              }
            }),
            (t.storeUserData = (e) => {
              try {
                "undefined" != typeof window &&
                  window.localStorage &&
                  window.localStorage.setItem("_ud", JSON.stringify(e));
              } catch (e) {
                i.logger.error("Error storing user data:", e);
              }
            }),
            (t.getUserData = () => {
              try {
                if ("undefined" != typeof window && window.localStorage) {
                  const e = window.localStorage.getItem("_ud");
                  if (!e) return null;
                  const t = JSON.parse(e);
                  if (t && "object" == typeof t && "customer_id" in t) {
                    const e = t.customer_id;
                    if (null != e) {
                      const r = String(e).trim();
                      r && (t.contactId = r);
                    }
                  }
                  return t;
                }
              } catch (e) {
                i.logger.error("Error getting user data:", e);
              }
              return null;
            }),
            (t.storeSessionIdInCookie = (e, r) => {
              const n = `lc_session_${e}`;
              if (((0, t.setCookie)(n, r, 1), (0, t.getCookie)(n) !== r))
                try {
                  "undefined" != typeof window &&
                    window.sessionStorage &&
                    (window.sessionStorage.setItem(n, r),
                    i.logger.api(
                      `SessionId stored in sessionStorage (cookie fallback): ${r}`,
                    ));
                } catch (e) {
                  i.logger.error(
                    "Both cookie and sessionStorage failed for sessionId storage",
                    e,
                  );
                }
              else i.logger.api(`SessionId stored in cookie: ${r}`);
            }),
            (t.getSessionIdFromCookie = (e) => {
              const r = `lc_session_${e}`,
                n = (0, t.getCookie)(r);
              if (n) return n;
              try {
                if ("undefined" != typeof window && window.sessionStorage) {
                  const e = window.sessionStorage.getItem(r);
                  if (e)
                    return (
                      i.logger.api(
                        `SessionId retrieved from sessionStorage (cookie fallback): ${e}`,
                      ),
                      e
                    );
                }
              } catch (e) {
                i.logger.error(
                  "Both cookie and sessionStorage failed for sessionId retrieval",
                  e,
                );
              }
              return null;
            }),
            (t.getFromStorage = (e) => {
              try {
                if ("undefined" != typeof window && window.localStorage)
                  return window.localStorage.getItem(e);
              } catch (e) {
                i.logger.error("Error getting from storage:", e);
              }
              return null;
            }),
            (t.setInStorage = (e, t) => {
              try {
                "undefined" != typeof window &&
                  window.localStorage &&
                  window.localStorage.setItem(e, t);
              } catch (e) {
                i.logger.error("Error setting in storage:", e);
              }
            }),
            (t.debounce = (e, t) => {
              let r;
              return function (...n) {
                clearTimeout(r),
                  (r = setTimeout(() => {
                    clearTimeout(r), e(...n);
                  }, t));
              };
            }),
            (t.getDeviceType = () => {
              const e = "undefined" != typeof navigator ? navigator : void 0,
                t = ((null == e ? void 0 : e.userAgent) || "").toLowerCase(),
                r = (null == e ? void 0 : e.maxTouchPoints) || 0,
                n = null == e ? void 0 : e.userAgentData,
                i = !0 === (null == n ? void 0 : n.mobile);
              return t.includes("ipad") ||
                t.includes("tablet") ||
                (t.includes("android") && !t.includes("mobile")) ||
                (t.includes("macintosh") && r > 1)
                ? "tablet"
                : i ||
                    t.includes("mobi") ||
                    t.includes("iphone") ||
                    t.includes("ipod") ||
                    (t.includes("android") && t.includes("mobile"))
                  ? "mobile"
                  : "desktop";
            }),
            (t.getPageMetadata = () => ({
              title: document.title,
              url: window.location.href,
              path: window.location.pathname,
              referrer: document.referrer,
              userAgent: navigator.userAgent,
            })),
            (t.getLocalTimeZone = () =>
              Intl.DateTimeFormat().resolvedOptions().timeZone),
            (t.getLocalTimeZoneOffset = () => {
              const e = new Date()
                .toString()
                .match(/([A-Z]+[\+-][0-9]{2})([0-9]{2})/);
              return e ? `(${e[1]}:${e[2]})` : "";
            }),
            (t.getFormattedTimezone = () =>
              `${(0, t.getLocalTimeZone)()} ${(0, t.getLocalTimeZoneOffset)()}`);
          const l = [
              ".gform_wrapper",
              ".gf_browser_chrome",
              ".wpcf7",
              ".wpcf7-form",
              ".with_frm_style",
              ".frm_forms_container",
              ".frm-show-form",
              '[id^="frm_form_"]',
              ".fluentform",
              ".ff-el-form--container",
              ".everest-forms",
              ".happyforms",
              ".happyforms-form",
              ".happyforms-form-wrap",
              ".nf-form-cont",
              ".ninja-forms-form-wrap",
              ".wpforms-container",
              ".wpforms-form-container",
              ".elementor-widget-form",
              ".elementor-form",
            ],
            c = (e, t) => {
              var r;
              return (
                (null === (r = e.getAttribute(t)) || void 0 === r
                  ? void 0
                  : r.trim()) || void 0
              );
            },
            d = (e) => {
              var t, r;
              const n = e.closest(".gform_wrapper, .gf_browser_chrome");
              if (n) {
                const e = n.querySelector(".gform_title"),
                  r =
                    null === (t = null == e ? void 0 : e.textContent) ||
                    void 0 === t
                      ? void 0
                      : t.trim();
                if (r) return r;
              }
              const i = e.querySelector("h1, h2, h3, h4, legend");
              if (
                null === (r = null == i ? void 0 : i.textContent) ||
                void 0 === r
                  ? void 0
                  : r.trim()
              )
                return i.textContent.trim();
              const o =
                e.getAttribute("data-title") || e.getAttribute("aria-label");
              return (null == o ? void 0 : o.trim()) ? o.trim() : void 0;
            };
          t.getFormIdentifier = (e) => {
            try {
              let r = null;
              if (
                ((r =
                  "undefined" != typeof HTMLFormElement &&
                  e instanceof HTMLFormElement
                    ? e
                    : e && "querySelector" in e
                      ? e.querySelector("form")
                      : document.querySelector("form")),
                !r)
              )
                return;
              if (((t = r), l.some((e) => !!t.closest(e)))) {
                return (
                  d(r) ||
                  ((e) =>
                    c(e, "name") ||
                    c(e, "id") ||
                    c(e, "data-formid") ||
                    c(e, "data-name"))(r) ||
                  "Unidentified Form"
                );
              }
              const n = ((e) =>
                c(e, "id") ||
                c(e, "name") ||
                c(e, "data-formid") ||
                c(e, "data-name"))(r);
              if (n) return n;
              return d(r) || "Unidentified Form";
            } catch (e) {
              return void i.logger.error("Error getting form identifier:", e);
            }
            var t;
          };
        },
        268: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(797),
            i = r(11);
          t.default = function (e) {
            const t =
              ((r = "string" == typeof e ? (0, n.default)(e) : e),
              Uint8Array.of(
                ((15 & r[3]) << 4) | ((r[4] >> 4) & 15),
                ((15 & r[4]) << 4) | ((240 & r[5]) >> 4),
                ((15 & r[5]) << 4) | (15 & r[6]),
                r[7],
                ((15 & r[1]) << 4) | ((240 & r[2]) >> 4),
                ((15 & r[2]) << 4) | ((240 & r[3]) >> 4),
                16 | ((240 & r[0]) >> 4),
                ((15 & r[0]) << 4) | ((240 & r[1]) >> 4),
                r[8],
                r[9],
                r[10],
                r[11],
                r[12],
                r[13],
                r[14],
                r[15],
              ));
            var r;
            return "string" == typeof e ? (0, i.unsafeStringify)(t) : t;
          };
        },
        286: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(779),
            i = r(291),
            o = r(11);
          t.default = function (e, t, r) {
            if (n.default.randomUUID && !t && !e) return n.default.randomUUID();
            const a = (e = e || {}).random ?? e.rng?.() ?? (0, i.default)();
            if (a.length < 16)
              throw new Error("Random bytes length must be >= 16");
            if (((a[6] = (15 & a[6]) | 64), (a[8] = (63 & a[8]) | 128), t)) {
              if ((r = r || 0) < 0 || r + 16 > t.length)
                throw new RangeError(
                  `UUID byte range ${r}:${r + 15} is out of buffer bounds`,
                );
              for (let e = 0; e < 16; ++e) t[r + e] = a[e];
              return t;
            }
            return (0, o.unsafeStringify)(a);
          };
        },
        291: (e, t) => {
          let r;
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = new Uint8Array(16);
          t.default = function () {
            if (!r) {
              if ("undefined" == typeof crypto || !crypto.getRandomValues)
                throw new Error(
                  "crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported",
                );
              r = crypto.getRandomValues.bind(crypto);
            }
            return r(n);
          };
        },
        299: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.updateV7State = void 0);
          const n = r(291),
            i = r(11),
            o = {};
          function a(e, t, r) {
            return (
              (e.msecs ??= -1 / 0),
              (e.seq ??= 0),
              t > e.msecs
                ? ((e.seq = (r[6] << 23) | (r[7] << 16) | (r[8] << 8) | r[9]),
                  (e.msecs = t))
                : ((e.seq = (e.seq + 1) | 0), 0 === e.seq && e.msecs++),
              e
            );
          }
          function s(e, t, r, n, i = 0) {
            if (e.length < 16)
              throw new Error("Random bytes length must be >= 16");
            if (n) {
              if (i < 0 || i + 16 > n.length)
                throw new RangeError(
                  `UUID byte range ${i}:${i + 15} is out of buffer bounds`,
                );
            } else (n = new Uint8Array(16)), (i = 0);
            return (
              (t ??= Date.now()),
              (r ??= ((127 * e[6]) << 24) | (e[7] << 16) | (e[8] << 8) | e[9]),
              (n[i++] = (t / 1099511627776) & 255),
              (n[i++] = (t / 4294967296) & 255),
              (n[i++] = (t / 16777216) & 255),
              (n[i++] = (t / 65536) & 255),
              (n[i++] = (t / 256) & 255),
              (n[i++] = 255 & t),
              (n[i++] = 112 | ((r >>> 28) & 15)),
              (n[i++] = (r >>> 20) & 255),
              (n[i++] = 128 | ((r >>> 14) & 63)),
              (n[i++] = (r >>> 6) & 255),
              (n[i++] = ((r << 2) & 255) | (3 & e[10])),
              (n[i++] = e[11]),
              (n[i++] = e[12]),
              (n[i++] = e[13]),
              (n[i++] = e[14]),
              (n[i++] = e[15]),
              n
            );
          }
          (t.updateV7State = a),
            (t.default = function (e, t, r) {
              let l;
              if (e)
                l = s(
                  e.random ?? e.rng?.() ?? (0, n.default)(),
                  e.msecs,
                  e.seq,
                  t,
                  r,
                );
              else {
                const e = Date.now(),
                  i = (0, n.default)();
                a(o, e, i), (l = s(i, o.msecs, o.seq, t, r));
              }
              return t ?? (0, i.unsafeStringify)(l);
            });
        },
        338: (e, t) => {
          function r(e) {
            return 14 + (((e + 64) >>> 9) << 4) + 1;
          }
          function n(e, t) {
            const r = (65535 & e) + (65535 & t);
            return (((e >> 16) + (t >> 16) + (r >> 16)) << 16) | (65535 & r);
          }
          function i(e, t, r, i, o, a) {
            return n(
              ((s = n(n(t, e), n(i, a))) << (l = o)) | (s >>> (32 - l)),
              r,
            );
            var s, l;
          }
          function o(e, t, r, n, o, a, s) {
            return i((t & r) | (~t & n), e, t, o, a, s);
          }
          function a(e, t, r, n, o, a, s) {
            return i((t & n) | (r & ~n), e, t, o, a, s);
          }
          function s(e, t, r, n, o, a, s) {
            return i(t ^ r ^ n, e, t, o, a, s);
          }
          function l(e, t, r, n, o, a, s) {
            return i(r ^ (t | ~n), e, t, o, a, s);
          }
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.default = function (e) {
              return (function (e) {
                const t = new Uint8Array(4 * e.length);
                for (let r = 0; r < 4 * e.length; r++)
                  t[r] = (e[r >> 2] >>> ((r % 4) * 8)) & 255;
                return t;
              })(
                (function (e, t) {
                  const i = new Uint32Array(r(t)).fill(0);
                  i.set(e),
                    (i[t >> 5] |= 128 << t % 32),
                    (i[i.length - 1] = t),
                    (e = i);
                  let c = 1732584193,
                    d = -271733879,
                    u = -1732584194,
                    f = 271733878;
                  for (let t = 0; t < e.length; t += 16) {
                    const r = c,
                      i = d,
                      g = u,
                      m = f;
                    (c = o(c, d, u, f, e[t], 7, -680876936)),
                      (f = o(f, c, d, u, e[t + 1], 12, -389564586)),
                      (u = o(u, f, c, d, e[t + 2], 17, 606105819)),
                      (d = o(d, u, f, c, e[t + 3], 22, -1044525330)),
                      (c = o(c, d, u, f, e[t + 4], 7, -176418897)),
                      (f = o(f, c, d, u, e[t + 5], 12, 1200080426)),
                      (u = o(u, f, c, d, e[t + 6], 17, -1473231341)),
                      (d = o(d, u, f, c, e[t + 7], 22, -45705983)),
                      (c = o(c, d, u, f, e[t + 8], 7, 1770035416)),
                      (f = o(f, c, d, u, e[t + 9], 12, -1958414417)),
                      (u = o(u, f, c, d, e[t + 10], 17, -42063)),
                      (d = o(d, u, f, c, e[t + 11], 22, -1990404162)),
                      (c = o(c, d, u, f, e[t + 12], 7, 1804603682)),
                      (f = o(f, c, d, u, e[t + 13], 12, -40341101)),
                      (u = o(u, f, c, d, e[t + 14], 17, -1502002290)),
                      (d = o(d, u, f, c, e[t + 15], 22, 1236535329)),
                      (c = a(c, d, u, f, e[t + 1], 5, -165796510)),
                      (f = a(f, c, d, u, e[t + 6], 9, -1069501632)),
                      (u = a(u, f, c, d, e[t + 11], 14, 643717713)),
                      (d = a(d, u, f, c, e[t], 20, -373897302)),
                      (c = a(c, d, u, f, e[t + 5], 5, -701558691)),
                      (f = a(f, c, d, u, e[t + 10], 9, 38016083)),
                      (u = a(u, f, c, d, e[t + 15], 14, -660478335)),
                      (d = a(d, u, f, c, e[t + 4], 20, -405537848)),
                      (c = a(c, d, u, f, e[t + 9], 5, 568446438)),
                      (f = a(f, c, d, u, e[t + 14], 9, -1019803690)),
                      (u = a(u, f, c, d, e[t + 3], 14, -187363961)),
                      (d = a(d, u, f, c, e[t + 8], 20, 1163531501)),
                      (c = a(c, d, u, f, e[t + 13], 5, -1444681467)),
                      (f = a(f, c, d, u, e[t + 2], 9, -51403784)),
                      (u = a(u, f, c, d, e[t + 7], 14, 1735328473)),
                      (d = a(d, u, f, c, e[t + 12], 20, -1926607734)),
                      (c = s(c, d, u, f, e[t + 5], 4, -378558)),
                      (f = s(f, c, d, u, e[t + 8], 11, -2022574463)),
                      (u = s(u, f, c, d, e[t + 11], 16, 1839030562)),
                      (d = s(d, u, f, c, e[t + 14], 23, -35309556)),
                      (c = s(c, d, u, f, e[t + 1], 4, -1530992060)),
                      (f = s(f, c, d, u, e[t + 4], 11, 1272893353)),
                      (u = s(u, f, c, d, e[t + 7], 16, -155497632)),
                      (d = s(d, u, f, c, e[t + 10], 23, -1094730640)),
                      (c = s(c, d, u, f, e[t + 13], 4, 681279174)),
                      (f = s(f, c, d, u, e[t], 11, -358537222)),
                      (u = s(u, f, c, d, e[t + 3], 16, -722521979)),
                      (d = s(d, u, f, c, e[t + 6], 23, 76029189)),
                      (c = s(c, d, u, f, e[t + 9], 4, -640364487)),
                      (f = s(f, c, d, u, e[t + 12], 11, -421815835)),
                      (u = s(u, f, c, d, e[t + 15], 16, 530742520)),
                      (d = s(d, u, f, c, e[t + 2], 23, -995338651)),
                      (c = l(c, d, u, f, e[t], 6, -198630844)),
                      (f = l(f, c, d, u, e[t + 7], 10, 1126891415)),
                      (u = l(u, f, c, d, e[t + 14], 15, -1416354905)),
                      (d = l(d, u, f, c, e[t + 5], 21, -57434055)),
                      (c = l(c, d, u, f, e[t + 12], 6, 1700485571)),
                      (f = l(f, c, d, u, e[t + 3], 10, -1894986606)),
                      (u = l(u, f, c, d, e[t + 10], 15, -1051523)),
                      (d = l(d, u, f, c, e[t + 1], 21, -2054922799)),
                      (c = l(c, d, u, f, e[t + 8], 6, 1873313359)),
                      (f = l(f, c, d, u, e[t + 15], 10, -30611744)),
                      (u = l(u, f, c, d, e[t + 6], 15, -1560198380)),
                      (d = l(d, u, f, c, e[t + 13], 21, 1309151649)),
                      (c = l(c, d, u, f, e[t + 4], 6, -145523070)),
                      (f = l(f, c, d, u, e[t + 11], 10, -1120210379)),
                      (u = l(u, f, c, d, e[t + 2], 15, 718787259)),
                      (d = l(d, u, f, c, e[t + 9], 21, -343485551)),
                      (c = n(c, r)),
                      (d = n(d, i)),
                      (u = n(u, g)),
                      (f = n(f, m));
                  }
                  return Uint32Array.of(c, d, u, f);
                })(
                  (function (e) {
                    if (0 === e.length) return new Uint32Array();
                    const t = new Uint32Array(r(8 * e.length)).fill(0);
                    for (let r = 0; r < e.length; r++)
                      t[r >> 2] |= (255 & e[r]) << ((r % 4) * 8);
                    return t;
                  })(e),
                  8 * e.length,
                ),
              );
            });
        },
        356: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(11),
            i = r(425),
            o = r(568);
          t.default = function (e, t, r) {
            (e ??= {}), (r ??= 0);
            let a = (0, i.default)({ ...e, _v6: !0 }, new Uint8Array(16));
            if (((a = (0, o.default)(a)), t)) {
              for (let e = 0; e < 16; e++) t[r + e] = a[e];
              return t;
            }
            return (0, n.unsafeStringify)(a);
          };
        },
        378: (e, t) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.isPasswordLikeField = t.containsPassword = void 0),
            (t.containsPassword = (e) => {
              var t, r, n;
              try {
                return !!(null ===
                  (n =
                    null === (t = null == e ? void 0 : e.toLowerCase) ||
                    void 0 === t
                      ? void 0
                      : (r = t.call(e)).includes) || void 0 === n
                  ? void 0
                  : n.call(r, "password"));
              } catch (e) {
                return !1;
              }
            }),
            (t.isPasswordLikeField = (e, r) =>
              (0, t.containsPassword)(null == e ? void 0 : e.type) ||
              (0, t.containsPassword)(null == e ? void 0 : e.name) ||
              (0, t.containsPassword)(null == e ? void 0 : e.id) ||
              (0, t.containsPassword)(null == e ? void 0 : e.placeholder) ||
              (0, t.containsPassword)(r));
        },
        425: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.updateV1State = void 0);
          const n = r(291),
            i = r(11),
            o = {};
          function a(e, t, r) {
            return (
              (e.msecs ??= -1 / 0),
              (e.nsecs ??= 0),
              t === e.msecs
                ? (e.nsecs++,
                  e.nsecs >= 1e4 && ((e.node = void 0), (e.nsecs = 0)))
                : t > e.msecs
                  ? (e.nsecs = 0)
                  : t < e.msecs && (e.node = void 0),
              e.node ||
                ((e.node = r.slice(10, 16)),
                (e.node[0] |= 1),
                (e.clockseq = 16383 & ((r[8] << 8) | r[9]))),
              (e.msecs = t),
              e
            );
          }
          function s(e, t, r, n, i, o, a = 0) {
            if (e.length < 16)
              throw new Error("Random bytes length must be >= 16");
            if (o) {
              if (a < 0 || a + 16 > o.length)
                throw new RangeError(
                  `UUID byte range ${a}:${a + 15} is out of buffer bounds`,
                );
            } else (o = new Uint8Array(16)), (a = 0);
            (t ??= Date.now()),
              (r ??= 0),
              (n ??= 16383 & ((e[8] << 8) | e[9])),
              (i ??= e.slice(10, 16));
            const s = (1e4 * (268435455 & (t += 122192928e5)) + r) % 4294967296;
            (o[a++] = (s >>> 24) & 255),
              (o[a++] = (s >>> 16) & 255),
              (o[a++] = (s >>> 8) & 255),
              (o[a++] = 255 & s);
            const l = ((t / 4294967296) * 1e4) & 268435455;
            (o[a++] = (l >>> 8) & 255),
              (o[a++] = 255 & l),
              (o[a++] = ((l >>> 24) & 15) | 16),
              (o[a++] = (l >>> 16) & 255),
              (o[a++] = (n >>> 8) | 128),
              (o[a++] = 255 & n);
            for (let e = 0; e < 6; ++e) o[a++] = i[e];
            return o;
          }
          (t.updateV1State = a),
            (t.default = function (e, t, r) {
              let l;
              const c = e?._v6 ?? !1;
              if (e) {
                const t = Object.keys(e);
                1 === t.length && "_v6" === t[0] && (e = void 0);
              }
              if (e)
                l = s(
                  e.random ?? e.rng?.() ?? (0, n.default)(),
                  e.msecs,
                  e.nsecs,
                  e.clockseq,
                  e.node,
                  t,
                  r,
                );
              else {
                const e = Date.now(),
                  i = (0, n.default)();
                a(o, e, i),
                  (l = s(
                    i,
                    o.msecs,
                    o.nsecs,
                    c ? void 0 : o.clockseq,
                    c ? void 0 : o.node,
                    t,
                    r,
                  ));
              }
              return t ?? (0, i.unsafeStringify)(l);
            });
        },
        436: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.ApiClient = void 0);
          const n = r(574),
            i = r(266),
            o = r(963),
            a = r(910);
          t.ApiClient = class {
            constructor(e, t) {
              (this.trackingId = e),
                (this.apiEndpoint = t || this.determineApiEndpoint());
              const r = {
                maxEventsPerSecond: 5,
                maxRetries: 3,
                retryDelayMs: 1e3,
                maxQueueSize: 100,
              };
              (this.eventQueue = new o.EventQueue(r)),
                this.eventQueue.setSender(async (e) => {
                  await this.sendEventDirectly(e);
                }),
                i.logger.log(
                  "ApiClient initialized with rate limit:",
                  r.maxEventsPerSecond,
                  "events per second",
                );
            }
            determineApiEndpoint() {
              try {
                const e = document.querySelector(
                  `script[src*="${a.SCRIPT_BASENAME}"]`,
                );
                if (null == e ? void 0 : e.src) {
                  const t = e.src;
                  return (
                    i.logger.api("Script source detected:", t),
                    t.includes("staging")
                      ? (i.logger.api(
                          "Staging environment detected, using staging API endpoint",
                        ),
                        a.API_ENDPOINTS.staging)
                      : t.includes("localhost")
                        ? (i.logger.api(
                            "Localhost environment detected, using localhost API endpoint",
                          ),
                          a.API_ENDPOINTS.local)
                        : (i.logger.api(
                            "Production environment detected, using production API endpoint",
                          ),
                          a.API_ENDPOINTS.production)
                  );
                }
                return (
                  i.logger.api(
                    "No script tag found, defaulting to production API endpoint",
                  ),
                  a.API_ENDPOINTS.production
                );
              } catch (e) {
                return (
                  i.logger.error("Error determining API endpoint:", e),
                  i.logger.api(
                    "Falling back to production API endpoint due to error",
                  ),
                  a.API_ENDPOINTS.production
                );
              }
            }
            setTrackingContext(e, t) {
              (this.sessionId = e), (this.locationId = t);
            }
            async fetchLocationId() {
              try {
                const e = await fetch(
                  `${this.apiEndpoint}/external-tracking/tracking/${this.trackingId}`,
                );
                if (!e.ok)
                  throw new Error(
                    `Failed to fetch location ID: ${e.statusText}`,
                  );
                const t = await e.json();
                return (
                  (this.locationId = t.locationId),
                  i.logger.api("Location ID fetched:", this.locationId),
                  this.locationId
                );
              } catch (e) {
                throw (i.logger.error("Error fetching location ID:", e), e);
              }
            }
            async sendEvent(e) {
              var t;
              this.locationId || (await this.fetchLocationId());
              try {
                e.properties = {
                  ...e.properties,
                  deviceType:
                    (null === (t = null == e ? void 0 : e.properties) ||
                    void 0 === t
                      ? void 0
                      : t.deviceType) || (0, i.getDeviceType)(),
                };
                const r =
                    this.sessionId ||
                    (0, i.getSessionIdFromCookie)(this.locationId || ""),
                  o = (0, i.getUserData)();
                let a = { ...e };
                if (e.type === n.EventType.FORM_SUBMISSION && "formData" in e) {
                  const t = e,
                    r = {
                      ...t,
                      formData: {
                        ...t.formData,
                        Timezone: (0, i.getFormattedTimezone)(),
                      },
                    };
                  (a = r),
                    i.logger.api("Enhanced form data with timezone:", {
                      timezone: r.formData.Timezone,
                    });
                }
                const s = {
                  ...a,
                  trackingId: this.trackingId,
                  locationId: this.locationId,
                  sessionId: r,
                  contactId: null == o ? void 0 : o.contactId,
                  userId: null == o ? void 0 : o.userId,
                };
                i.logger.api("Queueing event payload:", {
                  type: a.type,
                  sessionId: r,
                  trackingId: this.trackingId,
                }),
                  await this.eventQueue.enqueue(s),
                  i.logger.api("Event queued successfully:", a.type);
              } catch (e) {
                i.logger.error("Error queueing event:", e);
              }
            }
            async sendEventDirectly(e) {
              const t = `${this.apiEndpoint}/external-tracking/events`;
              if (e && e.files && "undefined" != typeof FormData)
                try {
                  const r = new FormData(),
                    { files: n, ...o } = e;
                  r.append("event", JSON.stringify(o)),
                    Object.keys(n).forEach((e) => {
                      const t = n[e];
                      (Array.isArray(t) ? t : [t]).forEach((t) => {
                        try {
                          t instanceof File && r.append(e, t);
                        } catch (e) {}
                      });
                    });
                  const a = await fetch(t, { method: "POST", body: r });
                  if (!a.ok)
                    throw new Error(`Failed to send event: ${a.statusText}`);
                  return void i.logger.api(
                    "Event sent successfully (multipart):",
                    e.type,
                  );
                } catch (e) {
                  i.logger.error(
                    "Error sending multipart event, falling back to JSON:",
                    e,
                  );
                }
              const r = await fetch(t, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(e),
              });
              if (!r.ok)
                throw new Error(`Failed to send event: ${r.statusText}`);
              i.logger.api("Event sent successfully:", e.type);
            }
            async submitForm(e) {
              this.locationId || (await this.fetchLocationId());
              try {
                i.logger.api("Form submission:", e.formData),
                  await this.sendEvent(e);
              } catch (e) {
                i.logger.error("Error submitting form:", e);
              }
            }
          };
        },
        465: (e, t) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.default = "00000000-0000-0000-0000-000000000000");
        },
        479: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.validateConfig = t.getConfigFromScriptAttributes = void 0);
          const n = r(266),
            i = r(910);
          (t.getConfigFromScriptAttributes = () => {
            try {
              const e =
                document.currentScript ||
                document.querySelector(`script[src*="${i.SCRIPT_BASENAME}"]`);
              if (!e)
                return (
                  n.logger.warn("Could not find script tag for configuration"),
                  null
                );
              const t = e.getAttribute("data-debug");
              if ("true" === t) {
                const e = window;
                (e[i.GLOBAL_TRACKING_KEY] = e[i.GLOBAL_TRACKING_KEY] || {}),
                  (e[i.GLOBAL_TRACKING_KEY].debug = !0);
              }
              const r = e.getAttribute("data-tracking-id");
              if (!r)
                return (
                  n.logger.critical(
                    "Required data-tracking-id attribute not found",
                  ),
                  n.logger.critical(
                    'Please add data-tracking-id="your-tracking-id" to the script tag',
                  ),
                  null
                );
              const o = { trackingId: r };
              "true" === t && (o.debug = !0);
              const a = e.getAttribute("data-api-endpoint");
              return (
                a && (o.apiEndpoint = a),
                n.logger.log("Configuration loaded from script attributes:", o),
                o
              );
            } catch (e) {
              return (
                n.logger.critical("Error reading script attributes:", e), null
              );
            }
          }),
            (t.validateConfig = (e) =>
              e && "object" == typeof e
                ? e.trackingId && "string" == typeof e.trackingId
                  ? e.apiEndpoint && "string" != typeof e.apiEndpoint
                    ? (n.logger.critical(
                        "Invalid configuration: apiEndpoint must be a string",
                      ),
                      !1)
                    : !e.debug ||
                      "boolean" == typeof e.debug ||
                      (n.logger.critical(
                        "Invalid configuration: debug must be a boolean",
                      ),
                      !1)
                  : (n.logger.critical(
                      "Invalid configuration: trackingId must be a non-empty string",
                    ),
                    !1)
                : (n.logger.critical(
                    "Invalid configuration: must be an object",
                  ),
                  !1));
        },
        557: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.URL = t.DNS = void 0);
          const n = r(829),
            i = r(988);
          var o = r(988);
          function a(e, t, r, o) {
            return (0, i.default)(80, n.default, e, t, r, o);
          }
          Object.defineProperty(t, "DNS", {
            enumerable: !0,
            get: function () {
              return o.DNS;
            },
          }),
            Object.defineProperty(t, "URL", {
              enumerable: !0,
              get: function () {
                return o.URL;
              },
            }),
            (a.DNS = i.DNS),
            (a.URL = i.URL),
            (t.default = a);
        },
        568: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(797),
            i = r(11);
          t.default = function (e) {
            const t =
              ((r = "string" == typeof e ? (0, n.default)(e) : e),
              Uint8Array.of(
                ((15 & r[6]) << 4) | ((r[7] >> 4) & 15),
                ((15 & r[7]) << 4) | ((240 & r[4]) >> 4),
                ((15 & r[4]) << 4) | ((240 & r[5]) >> 4),
                ((15 & r[5]) << 4) | ((240 & r[0]) >> 4),
                ((15 & r[0]) << 4) | ((240 & r[1]) >> 4),
                ((15 & r[1]) << 4) | ((240 & r[2]) >> 4),
                96 | (15 & r[2]),
                r[3],
                r[8],
                r[9],
                r[10],
                r[11],
                r[12],
                r[13],
                r[14],
                r[15],
              ));
            var r;
            return "string" == typeof e ? (0, i.unsafeStringify)(t) : t;
          };
        },
        574: (e, t) => {
          var r;
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.EventType = void 0),
            (function (e) {
              (e.SCRIPT_PAGE_VIEW = "external_script_page_view"),
                (e.FORM_SUBMISSION = "external_form_submission");
            })(r || (t.EventType = r = {}));
        },
        591: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.URL = t.DNS = void 0);
          const n = r(338),
            i = r(988);
          var o = r(988);
          function a(e, t, r, o) {
            return (0, i.default)(48, n.default, e, t, r, o);
          }
          Object.defineProperty(t, "DNS", {
            enumerable: !0,
            get: function () {
              return o.DNS;
            },
          }),
            Object.defineProperty(t, "URL", {
              enumerable: !0,
              get: function () {
                return o.URL;
              },
            }),
            (a.DNS = i.DNS),
            (a.URL = i.URL),
            (t.default = a);
        },
        628: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.logger = void 0);
          const n = r(910);
          t.logger = {
            api: (e, ...t) => {
              i() && console.log(`${n.LOGGER_PREFIX} ${e}`, ...t);
            },
            error: (e, ...t) => {
              i() && console.error(`${n.LOGGER_PREFIX} ${e}`, ...t);
            },
            critical: (e, ...t) => {
              console.error(`${n.LOGGER_ERROR_PREFIX} ${e}`, ...t);
            },
            log: (e, ...t) => {
              i() && console.log(`${n.LOGGER_PREFIX} ${e}`, ...t);
            },
            warn: (e, ...t) => {
              i() && console.warn(`${n.LOGGER_PREFIX} ${e}`, ...t);
            },
          };
          const i = () => {
            var e;
            if ("undefined" == typeof window) return !1;
            const t = window;
            return Boolean(
              null === (e = null == t ? void 0 : t[n.GLOBAL_TRACKING_KEY]) ||
                void 0 === e
                ? void 0
                : e.debug,
            );
          };
        },
        697: (e, t) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.default =
              /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i);
        },
        716: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.startFormTracking = t.startPageTracking = void 0);
          const n = r(574),
            i = r(266),
            o = new WeakSet();
          let a = null;
          (t.startPageTracking = (e) => {
            i.logger.log("Tracking initial page view");
            const t = (0, i.getPageMetadata)(),
              r = (0, i.getFormIdentifier)();
            e({
              type: n.EventType.SCRIPT_PAGE_VIEW,
              timestamp: Date.now(),
              ...t,
              ...(r ? { formId: r } : {}),
            });
          }),
            (t.startFormTracking = (e) => {
              i.logger.log("Starting form submission tracking");
              const t = (t) => {
                  if (o.has(t)) return;
                  let r = !1;
                  const n = () => {
                    r ||
                      ((r = !0),
                      i.logger.log("Form submit event captured"),
                      s(t, e),
                      setTimeout(() => {
                        r = !1;
                      }, 1e3));
                  };
                  t.addEventListener("submit", n, { capture: !0 });
                  const a = t.querySelectorAll(
                    'button[type="submit"], input[type="submit"], [data-submission-type="submit"]',
                  );
                  a.forEach((e) => {
                    e.addEventListener(
                      "click",
                      () => {
                        i.logger.log("Submit button click detected"),
                          setTimeout(n, 50);
                      },
                      { capture: !0 },
                    );
                  }),
                    o.add(t);
                  const l = (0, i.getFormIdentifier)(t) || "Unidentified Form";
                  i.logger.log(
                    "Tracking form:",
                    l,
                    `(${a.length} submit button(s))`,
                  );
                },
                r = (e) => {
                  const r = e.querySelectorAll("form");
                  i.logger.log(`Found ${r.length} form(s) in document`),
                    r.forEach((e) => t(e));
                },
                n = () => {
                  a ||
                    "undefined" == typeof MutationObserver ||
                    ((a = new MutationObserver((e) => {
                      e.forEach((e) => {
                        Array.from(e.addedNodes).forEach((e) => {
                          if (e instanceof Element)
                            return e instanceof HTMLFormElement
                              ? (i.logger.log(
                                  "Dynamic form detected via MutationObserver",
                                ),
                                void t(e))
                              : void e.querySelectorAll("form").forEach((e) => {
                                  i.logger.log(
                                    "Nested dynamic form detected via MutationObserver",
                                  ),
                                    t(e);
                                });
                        });
                      });
                    })),
                    a.observe(document.body, { childList: !0, subtree: !0 }),
                    i.logger.log(
                      "MutationObserver initialized for dynamic form detection",
                    ));
                };
              r(document),
                document.body
                  ? n()
                  : document.addEventListener("DOMContentLoaded", () => {
                      r(document), n();
                    });
            });
          const s = (e, t) => {
            try {
              const {
                  fieldData: r,
                  fieldLabels: o,
                  files: a,
                } = (0, i.parseFormData)(e),
                s = (0, i.getPageMetadata)(),
                l = {
                  type: n.EventType.FORM_SUBMISSION,
                  timestamp: Date.now(),
                  formId: (0, i.getFormIdentifier)(e) || "Unidentified Form",
                  formData: r,
                  formLabels: o,
                  ...(a && Object.keys(a).length ? { files: a } : {}),
                  ...s,
                };
              t(l), i.logger.log("Form submission tracked:", l.formId);
            } catch (e) {
              i.logger.error("Error tracking form submission:", e);
            }
          };
        },
        746: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(697);
          t.default = function (e) {
            return "string" == typeof e && n.default.test(e);
          };
        },
        770: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(746);
          t.default = function (e) {
            if (!(0, n.default)(e)) throw TypeError("Invalid UUID");
            return parseInt(e.slice(14, 15), 16);
          };
        },
        779: (e, t) => {
          Object.defineProperty(t, "__esModule", { value: !0 });
          const r =
            "undefined" != typeof crypto &&
            crypto.randomUUID &&
            crypto.randomUUID.bind(crypto);
          t.default = { randomUUID: r };
        },
        780: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.getFieldsetLegend =
              t.getContainerLabel =
              t.getCombinedLabel =
              t.isCompoundField =
              t.getSubLabel =
              t.getMainLabel =
              t.cleanLabelText =
              t.isGravityFormsField =
                void 0);
          const n = r(628),
            i = "gfield",
            o = "gfield_label",
            a = /\s*\(Required\)\s*/gi,
            s = /\s*\*\s*$/g;
          (t.isGravityFormsField = (e) => null !== e.closest(`.${i}`)),
            (t.cleanLabelText = (e) => e.replace(a, "").replace(s, "").trim()),
            (t.getMainLabel = (e) => {
              var r, a, s, l;
              try {
                const n = e.closest(`.${i}`);
                if (!n) return "";
                const c = e.closest("fieldset");
                if ((null == c ? void 0 : c.classList.contains(i)) && c) {
                  const e = c.querySelector("legend");
                  if (e)
                    return (0, t.cleanLabelText)(
                      null !==
                        (a =
                          null === (r = e.textContent) || void 0 === r
                            ? void 0
                            : r.trim()) && void 0 !== a
                        ? a
                        : "",
                    );
                }
                const d = n.querySelector(`label.${o}`);
                if (d)
                  return (0, t.cleanLabelText)(
                    null !==
                      (l =
                        null === (s = d.textContent) || void 0 === s
                          ? void 0
                          : s.trim()) && void 0 !== l
                      ? l
                      : "",
                  );
              } catch (e) {
                n.logger.error("Error extracting Gravity Forms main label:", e);
              }
              return "";
            }),
            (t.getSubLabel = (e, t) => {
              var r, i;
              if (!t.id) return "";
              try {
                const n = e.querySelector(`label[for="${t.id}"]`);
                if (n)
                  return null !==
                    (i =
                      null === (r = n.textContent) || void 0 === r
                        ? void 0
                        : r.trim()) && void 0 !== i
                    ? i
                    : "";
              } catch (e) {
                n.logger.error("Error extracting Gravity Forms sub-label:", e);
              }
              return "";
            }),
            (t.isCompoundField = (e) => {
              var t;
              const r = e.closest("fieldset");
              return (
                null !== (t = null == r ? void 0 : r.classList.contains(i)) &&
                void 0 !== t &&
                t
              );
            }),
            (t.getCombinedLabel = (e, r) => {
              if (!(0, t.isGravityFormsField)(r)) return "";
              if ((0, t.isCompoundField)(r)) {
                const n = (0, t.getSubLabel)(e, r);
                if (n) return n;
              }
              return (0, t.getMainLabel)(r);
            }),
            (t.getContainerLabel = (e) => {
              var r, a;
              try {
                const n = e.closest(`.${i}`);
                if (!n) return "";
                const s = n.querySelector(
                  `.${o}, .gform-field-label:not(.gform-field-label--type-sub)`,
                );
                if (s)
                  return (0, t.cleanLabelText)(
                    null !==
                      (a =
                        null === (r = s.textContent) || void 0 === r
                          ? void 0
                          : r.trim()) && void 0 !== a
                      ? a
                      : "",
                  );
              } catch (e) {
                n.logger.error(
                  "Error extracting Gravity Forms container label:",
                  e,
                );
              }
              return "";
            }),
            (t.getFieldsetLegend = (e) => {
              var r, i;
              try {
                const n = e.closest("fieldset");
                if (!n) return "";
                const o = n.querySelector("legend");
                if (o)
                  return (0, t.cleanLabelText)(
                    null !==
                      (i =
                        null === (r = o.textContent) || void 0 === r
                          ? void 0
                          : r.trim()) && void 0 !== i
                      ? i
                      : "",
                  );
              } catch (e) {
                n.logger.error("Error extracting fieldset legend:", e);
              }
              return "";
            });
        },
        797: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(746);
          t.default = function (e) {
            if (!(0, n.default)(e)) throw TypeError("Invalid UUID");
            let t;
            return Uint8Array.of(
              (t = parseInt(e.slice(0, 8), 16)) >>> 24,
              (t >>> 16) & 255,
              (t >>> 8) & 255,
              255 & t,
              (t = parseInt(e.slice(9, 13), 16)) >>> 8,
              255 & t,
              (t = parseInt(e.slice(14, 18), 16)) >>> 8,
              255 & t,
              (t = parseInt(e.slice(19, 23), 16)) >>> 8,
              255 & t,
              ((t = parseInt(e.slice(24, 36), 16)) / 1099511627776) & 255,
              (t / 4294967296) & 255,
              (t >>> 24) & 255,
              (t >>> 16) & 255,
              (t >>> 8) & 255,
              255 & t,
            );
          };
        },
        829: (e, t) => {
          function r(e, t, r, n) {
            switch (e) {
              case 0:
                return (t & r) ^ (~t & n);
              case 1:
              case 3:
                return t ^ r ^ n;
              case 2:
                return (t & r) ^ (t & n) ^ (r & n);
            }
          }
          function n(e, t) {
            return (e << t) | (e >>> (32 - t));
          }
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.default = function (e) {
              const t = [1518500249, 1859775393, 2400959708, 3395469782],
                i = [1732584193, 4023233417, 2562383102, 271733878, 3285377520],
                o = new Uint8Array(e.length + 1);
              o.set(e), (o[e.length] = 128);
              const a = (e = o).length / 4 + 2,
                s = Math.ceil(a / 16),
                l = new Array(s);
              for (let t = 0; t < s; ++t) {
                const r = new Uint32Array(16);
                for (let n = 0; n < 16; ++n)
                  r[n] =
                    (e[64 * t + 4 * n] << 24) |
                    (e[64 * t + 4 * n + 1] << 16) |
                    (e[64 * t + 4 * n + 2] << 8) |
                    e[64 * t + 4 * n + 3];
                l[t] = r;
              }
              (l[s - 1][14] = (8 * (e.length - 1)) / Math.pow(2, 32)),
                (l[s - 1][14] = Math.floor(l[s - 1][14])),
                (l[s - 1][15] = (8 * (e.length - 1)) & 4294967295);
              for (let e = 0; e < s; ++e) {
                const o = new Uint32Array(80);
                for (let t = 0; t < 16; ++t) o[t] = l[e][t];
                for (let e = 16; e < 80; ++e)
                  o[e] = n(o[e - 3] ^ o[e - 8] ^ o[e - 14] ^ o[e - 16], 1);
                let a = i[0],
                  s = i[1],
                  c = i[2],
                  d = i[3],
                  u = i[4];
                for (let e = 0; e < 80; ++e) {
                  const i = Math.floor(e / 20),
                    l = (n(a, 5) + r(i, s, c, d) + u + t[i] + o[e]) >>> 0;
                  (u = d), (d = c), (c = n(s, 30) >>> 0), (s = a), (a = l);
                }
                (i[0] = (i[0] + a) >>> 0),
                  (i[1] = (i[1] + s) >>> 0),
                  (i[2] = (i[2] + c) >>> 0),
                  (i[3] = (i[3] + d) >>> 0),
                  (i[4] = (i[4] + u) >>> 0);
              }
              return Uint8Array.of(
                i[0] >> 24,
                i[0] >> 16,
                i[0] >> 8,
                i[0],
                i[1] >> 24,
                i[1] >> 16,
                i[1] >> 8,
                i[1],
                i[2] >> 24,
                i[2] >> 16,
                i[2] >> 8,
                i[2],
                i[3] >> 24,
                i[3] >> 16,
                i[3] >> 8,
                i[3],
                i[4] >> 24,
                i[4] >> 16,
                i[4] >> 8,
                i[4],
              );
            });
        },
        850: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.initializeFromScript = void 0);
          const n = r(266),
            i = r(479),
            o = r(129),
            a = r(910);
          t.initializeFromScript = () => {
            try {
              const e = (0, i.getConfigFromScriptAttributes)();
              if (!e)
                return (
                  n.logger.critical(
                    "Failed to initialize: invalid or missing script attributes",
                  ),
                  null
                );
              n.logger.log("Initializing from script attributes");
              try {
                const t = (0, o.createTracker)(e),
                  r = window;
                return (
                  (r[a.GLOBAL_TRACKING_KEY] = r[a.GLOBAL_TRACKING_KEY] || {}),
                  (r[a.GLOBAL_TRACKING_KEY].tracker = t),
                  (r[a.GLOBAL_TRACKING_KEY].config = e),
                  n.logger.log("Tracker initialized successfully"),
                  t
                );
              } catch (e) {
                return n.logger.critical("Failed to create tracker:", e), null;
              }
            } catch (e) {
              return n.logger.critical("Error during initialization:", e), null;
            }
          };
        },
        867: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.getTrackingContext = void 0);
          const n = r(266);
          t.getTrackingContext = (e) => {
            try {
              const { state: t, apiClient: r } = e,
                i = (0, n.getUserData)();
              return (null == t ? void 0 : t.trackingId) &&
                (null == t ? void 0 : t.sessionId) &&
                (null == r ? void 0 : r.apiEndpoint)
                ? {
                    trackingId: t.trackingId,
                    sessionId: t.sessionId,
                    apiEndpoint: r.apiEndpoint,
                    locationId: t.locationId,
                    contactId: null == i ? void 0 : i.contactId,
                    userId: null == i ? void 0 : i.userId,
                  }
                : null;
            } catch (e) {
              return (
                n.logger.error("Failed to resolve tracking context", e), null
              );
            }
          };
        },
        910: (e, t) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.SCRIPT_BASENAME =
              t.GLOBAL_TRACKING_KEY =
              t.LOGGER_ERROR_PREFIX =
              t.LOGGER_PREFIX =
              t.API_ENDPOINTS =
                void 0),
            (t.API_ENDPOINTS = {
              production: "https://backend.leadconnectorhq.com",
              staging: "https://staging.backend.leadconnectorhq.com",
              local: "http://localhost:6100",
            }),
            (t.LOGGER_PREFIX = "[LC Tracking]"),
            (t.LOGGER_ERROR_PREFIX = "[LC Tracking ERROR]"),
            (t.GLOBAL_TRACKING_KEY = "_lcTracking"),
            (t.SCRIPT_BASENAME = "external-tracking");
        },
        952: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.parseFormData = void 0);
          const n = r(378),
            i = r(628),
            o = r(168);
          t.parseFormData = (e) => {
            var t, r;
            const o = new FormData(e),
              s = {},
              c = {},
              d = {},
              u = new Set();
            try {
              for (const e of (null === (r = (t = o).keys) || void 0 === r
                ? void 0
                : r.call(t)) || [])
                u.add(String(e));
            } catch (e) {
              i.logger.error(
                "Error iterating FormData keys; falling back to FormData.forEach",
                e,
              ),
                o.forEach((e, t) => u.add(t));
            }
            u.forEach((t) => {
              var r, n;
              const a = ((e) => {
                  var t, r;
                  try {
                    const n =
                      null === (r = (t = o).getAll) || void 0 === r
                        ? void 0
                        : r.call(t, e);
                    if (Array.isArray(n)) return n;
                  } catch (e) {
                    i.logger.error(
                      "Error calling FormData.getAll; falling back to manual collection",
                      e,
                    );
                  }
                  const n = [];
                  return (
                    o.forEach((t, r) => {
                      r === e && n.push(t);
                    }),
                    n
                  );
                })(t),
                l = `[name="${((e) => {
                  var t;
                  try {
                    return (
                      null === (t = window.CSS) || void 0 === t
                        ? void 0
                        : t.escape
                    )
                      ? window.CSS.escape(e)
                      : e.replace(/([#.;:!+\-\[\]\(\)\{\}])/g, "\\$1");
                  } catch (t) {
                    return (
                      i.logger.error(
                        "Error escaping CSS selector; using unescaped value",
                        t,
                      ),
                      e
                    );
                  }
                })(t)}"]`,
                c = e.querySelectorAll(l),
                u = c[0],
                f = ((null == u ? void 0 : u.tagName) || "").toLowerCase(),
                g =
                  (null ===
                    (n =
                      null === (r = null == u ? void 0 : u.type) || void 0 === r
                        ? void 0
                        : r.toLowerCase) || void 0 === n
                    ? void 0
                    : n.call(r)) || "",
                m = "select" === f && !0 === (null == u ? void 0 : u.multiple);
              if ("input" === f && "hidden" === g) return;
              const p = (t) => {
                  var r, n, o;
                  const a = String(t.value);
                  if (!/^\d+$/.test(a)) return a;
                  try {
                    const i = t.closest("label");
                    if (i) {
                      const e = i.cloneNode(!0);
                      e.querySelectorAll("input").forEach((e) => e.remove());
                      const t =
                        null === (r = e.textContent) || void 0 === r
                          ? void 0
                          : r.trim();
                      if (t) return t;
                    }
                    if (t.id) {
                      const r = e.querySelector(`label[for="${t.id}"]`);
                      if (
                        null === (n = null == r ? void 0 : r.textContent) ||
                        void 0 === n
                          ? void 0
                          : n.trim()
                      )
                        return r.textContent.trim();
                    }
                    const a = t.nextSibling;
                    if (
                      null === (o = null == a ? void 0 : a.textContent) ||
                      void 0 === o
                        ? void 0
                        : o.trim()
                    )
                      return a.textContent.trim();
                  } catch (e) {
                    i.logger.error("Error resolving option text from DOM", e);
                  }
                  return a;
                },
                v = (e, t) => {
                  var r;
                  if (!/^\d+$/.test(t)) return t;
                  const n = Array.from(e.options).find((e) => e.value === t);
                  return (
                    (null === (r = null == n ? void 0 : n.textContent) ||
                    void 0 === r
                      ? void 0
                      : r.trim()) || t
                  );
                };
              if ("input" !== f || "checkbox" !== g)
                if ("input" !== f || "radio" !== g)
                  if (m) {
                    const e = u;
                    s[t] = a.map((t) => v(e, String(t)));
                  } else if ("select" !== f) {
                    if ("input" === f && "file" === g) {
                      const e = [],
                        r = [];
                      return (
                        a.forEach((t) => {
                          try {
                            if (
                              "undefined" != typeof File &&
                              t instanceof File
                            ) {
                              const n = (t.name || "").trim(),
                                o = "number" == typeof t.size ? t.size : 0;
                              if (!n && 0 === o) return;
                              e.push(t),
                                r.push(
                                  ((e) => {
                                    try {
                                      if (
                                        "undefined" != typeof File &&
                                        e instanceof File
                                      )
                                        return {
                                          filename: e.name || "uploaded_file",
                                          size:
                                            "number" == typeof e.size
                                              ? e.size
                                              : void 0,
                                          type:
                                            (null == e ? void 0 : e.type) ||
                                            void 0,
                                        };
                                    } catch (e) {
                                      i.logger.error(
                                        "Error mapping file metadata",
                                        e,
                                      );
                                    }
                                    return e;
                                  })(t),
                                );
                            }
                          } catch (e) {
                            i.logger.error(
                              "Error processing file input value",
                              e,
                            );
                          }
                        }),
                        e.length && (d[t] = e),
                        void (r.length > 1 ? (s[t] = r) : (s[t] = r[0] || null))
                      );
                    }
                    if (a.length > 1) s[t] = a.map((e) => String(e));
                    else {
                      const e = a[0],
                        r = void 0 === e ? void 0 : String(e);
                      s[t] = "" === r ? null : r;
                    }
                  } else {
                    const e = u,
                      r = a[0];
                    s[t] = void 0 === r ? null : v(e, String(r));
                  }
                else {
                  const e = Array.from(c).find((e) => e.checked);
                  s[t] = e ? p(e) : void 0;
                }
              else {
                const e = Array.from(c).filter((e) => e.checked);
                e.length > 1
                  ? (s[t] = e.map((e) => p(e)))
                  : 1 === e.length
                    ? (s[t] = p(e[0]))
                    : (s[t] = a.length > 1 && []);
              }
            });
            try {
              const t = e.querySelectorAll('input[type="checkbox"][name]'),
                r = {};
              for (let e = 0; e < t.length; e++) {
                const n = t[e],
                  i = n.name;
                i && !n.disabled && (r[i] = (r[i] || 0) + 1);
              }
              Object.keys(r).forEach((e) => {
                e in s || (s[e] = r[e] > 1 && []);
              });
            } catch (e) {
              i.logger.error("Error normalizing unchecked checkbox values", e);
            }
            try {
              const t = e.querySelectorAll("select[multiple][name]");
              for (let e = 0; e < t.length; e++) {
                const r = t[e],
                  n = r.name;
                n && !r.disabled && (n in s || (s[n] = []));
              }
            } catch (e) {
              i.logger.error("Error normalizing empty multi-select values", e);
            }
            try {
              Object.keys(s).forEach((e) => {
                const t = s[e];
                if ("string" == typeof t && /signature/i.test(e)) {
                  const r = t.trim();
                  r.startsWith("data:image") &&
                    (s[e] = { type: "signature", dataUrl: r });
                }
              });
            } catch (e) {
              i.logger.error("Error normalizing signature fields", e);
            }
            const f = e.querySelectorAll("input, select, textarea");
            for (let t = 0; t < f.length; t++) {
              const r = f[t],
                i = r.name;
              if (!a(r, i, s)) continue;
              const o = l(e, r);
              (0, n.isPasswordLikeField)(r, o)
                ? i in s && delete s[i]
                : o && (c[i] = o);
            }
            try {
              if (
                "terms_and_conditions" in s &&
                !0 === s.terms_and_conditions
              ) {
                const e = c.terms_and_conditions;
                s.terms_and_conditions = e || !0;
              }
            } catch (e) {
              i.logger.error(
                "Error applying terms_and_conditions label mapping; falling back to raw value",
                e,
              );
            }
            return { fieldData: s, fieldLabels: c, files: d };
          };
          const a = (e, t, r) =>
              !!t && !e.disabled && "hidden" !== e.type && !!s(e) && t in r,
            s = (e) => {
              var t;
              try {
                const r = window.getComputedStyle(e);
                return !(
                  "none" === r.display ||
                  "hidden" === r.visibility ||
                  "0" === (null !== (t = r.opacity) && void 0 !== t ? t : "1")
                );
              } catch (e) {
                return (
                  i.logger.error("Error checking form field visibility", e), !0
                );
              }
            },
            l = (e, t) => {
              const r = (0, o.getGravityFormsCombinedLabel)(e, t);
              if (r) return r;
              const n = c(e, t);
              if (n) return (0, o.cleanLabelText)(n);
              const i = d(t);
              if (i) return (0, o.cleanLabelText)(i);
              const a = u(t);
              if (a) return (0, o.cleanLabelText)(a);
              const s = o.GravityForms.getContainerLabel(t);
              if (s) return s;
              return o.GravityForms.getFieldsetLegend(t) || "";
            },
            c = (e, t) => {
              var r;
              if (!t.id) return "";
              const n = e.querySelector(`label[for="${t.id}"]`);
              return (
                (n &&
                  (null === (r = n.textContent) || void 0 === r
                    ? void 0
                    : r.trim())) ||
                ""
              );
            },
            d = (e) => {
              var t;
              const r = e.closest("label");
              if (!r) return "";
              const n = r.cloneNode(!0),
                i = n.querySelectorAll("input, select, textarea");
              for (let e = 0; e < i.length; e++) i[e].remove();
              return (
                (null === (t = n.textContent) || void 0 === t
                  ? void 0
                  : t.trim()) || ""
              );
            },
            u = (e) => {
              var t;
              let r = e.previousElementSibling;
              for (; r; ) {
                if ("LABEL" === r.tagName)
                  return (
                    (null === (t = r.textContent) || void 0 === t
                      ? void 0
                      : t.trim()) || ""
                  );
                r = r.previousElementSibling;
              }
              return "";
            };
        },
        963: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.EventQueue = void 0);
          const n = r(266);
          t.EventQueue = class {
            constructor(e) {
              (this.queue = []),
                (this.processing = !1),
                (this.eventTimes = []),
                (this.eventIdCounter = 0),
                (this.config = {
                  maxEventsPerSecond: e.maxEventsPerSecond || 5,
                  maxRetries: e.maxRetries || 3,
                  retryDelayMs: e.retryDelayMs || 1e3,
                  maxQueueSize: e.maxQueueSize || 100,
                }),
                n.logger.log(
                  "EventQueue initialized with config:",
                  this.config,
                );
            }
            async enqueue(e, t = this.config.maxRetries) {
              return new Promise((r, i) => {
                this.queue.length >= this.config.maxQueueSize &&
                  (n.logger.warn("Queue is full, dropping oldest event"),
                  this.queue.shift());
                const o = {
                  id: "event_" + ++this.eventIdCounter,
                  payload: e,
                  timestamp: Date.now(),
                  retryCount: 0,
                  maxRetries: t,
                };
                (o.resolve = r),
                  (o.reject = i),
                  this.queue.push(o),
                  n.logger.log(
                    `Event ${o.id} added to queue. Queue length: ${this.queue.length}`,
                  ),
                  this.processing || this.processQueue();
              });
            }
            async processQueue() {
              var e, t;
              if (!this.processing && 0 !== this.queue.length) {
                for (
                  this.processing = !0,
                    n.logger.log("Starting queue processing");
                  this.queue.length > 0;

                ) {
                  const r = this.queue[0];
                  if (this.canSendEvent())
                    try {
                      this.queue.shift(),
                        this.recordEventTime(),
                        await this.sendEvent(r),
                        n.logger.log(`Event ${r.id} processed successfully`),
                        (null == r ? void 0 : r.resolve) && r.resolve();
                    } catch (i) {
                      n.logger.error(`Error processing event ${r.id}:`, i),
                        (null !== (e = null == r ? void 0 : r.retryCount) &&
                        void 0 !== e
                          ? e
                          : 0) <
                        (null !== (t = null == r ? void 0 : r.maxRetries) &&
                        void 0 !== t
                          ? t
                          : 0)
                          ? (r.retryCount++,
                            n.logger.log(
                              `Retrying event ${r.id} (attempt ${r.retryCount}/${r.maxRetries})`,
                            ),
                            setTimeout(() => {
                              this.queue.unshift(r),
                                this.processing || this.processQueue();
                            }, this.config.retryDelayMs * r.retryCount))
                          : (n.logger.error(
                              `Event ${r.id} failed after ${r.maxRetries} retries`,
                            ),
                            (null == r ? void 0 : r.reject) && r.reject(i));
                    }
                  else await this.waitForRateLimit();
                }
                (this.processing = !1),
                  n.logger.log("Queue processing completed");
              }
            }
            canSendEvent() {
              return (
                this.cleanupOldEventTimes(),
                this.eventTimes.length < this.config.maxEventsPerSecond
              );
            }
            recordEventTime() {
              this.eventTimes.push(Date.now());
            }
            cleanupOldEventTimes() {
              const e = Date.now() - 1e3;
              this.eventTimes = this.eventTimes.filter((t) => t > e);
            }
            async waitForRateLimit() {
              const e = this.calculateWaitTime();
              n.logger.log(`Rate limit reached, waiting ${e}ms`),
                await new Promise((t) => setTimeout(t, e));
            }
            calculateWaitTime() {
              if (0 === this.eventTimes.length) return 0;
              const e = this.eventTimes[0],
                t = Date.now() - e;
              return Math.max(0, 1e3 - t) + 10;
            }
            async sendEvent(e) {
              throw new Error("sendEvent method not implemented");
            }
            setSender(e) {
              this.sendEvent = async (t) => {
                await e(t.payload);
              };
            }
            getStatus() {
              return (
                this.cleanupOldEventTimes(),
                {
                  queueLength: this.queue.length,
                  processing: this.processing,
                  eventsInLastSecond: this.eventTimes.length,
                  maxEventsPerSecond: this.config.maxEventsPerSecond,
                }
              );
            }
            clear() {
              this.queue.forEach((e) => {
                (null == e ? void 0 : e.reject) &&
                  e.reject(new Error("Queue cleared"));
              }),
                (this.queue = []),
                (this.eventTimes = []),
                n.logger.log("Queue cleared");
            }
          };
        },
        976: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.sendTimeSpentEvent = void 0);
          const n = r(266);
          t.sendTimeSpentEvent = (e, t) => {
            try {
              const r = (0, n.getUserData)(),
                i = {
                  type: "external_page_time_spent",
                  timestamp: e.sessionEnd,
                  url: window.location.href,
                  referrer: document.referrer,
                  title: document.title,
                  path: window.location.pathname,
                  userAgent: navigator.userAgent,
                  sessionId: t.sessionId,
                  trackingId: t.trackingId,
                  locationId: t.locationId,
                  contactId: t.contactId || (null == r ? void 0 : r.contactId),
                  userId: t.userId || (null == r ? void 0 : r.userId),
                  properties: {
                    sessionStart: e.sessionStart,
                    sessionEnd: e.sessionEnd,
                    timeSpentMs: e.timeSpentMs,
                    formIdentifier: (0, n.getFormIdentifier)(),
                    deviceType: (0, n.getDeviceType)(),
                  },
                },
                o = `${t.apiEndpoint}/external-tracking/events`;
              fetch(o, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(i),
                keepalive: !0,
              }).catch((e) =>
                n.logger.error("Failed to send time spent event", e),
              );
            } catch (e) {
              n.logger.error("Failed to dispatch time spent event", e);
            }
          };
        },
        988: (e, t, r) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.URL = t.DNS = t.stringToBytes = void 0);
          const n = r(797),
            i = r(11);
          function o(e) {
            e = unescape(encodeURIComponent(e));
            const t = new Uint8Array(e.length);
            for (let r = 0; r < e.length; ++r) t[r] = e.charCodeAt(r);
            return t;
          }
          (t.stringToBytes = o),
            (t.DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8"),
            (t.URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8"),
            (t.default = function (e, t, r, a, s, l) {
              const c = "string" == typeof r ? o(r) : r,
                d = "string" == typeof a ? (0, n.default)(a) : a;
              if (
                ("string" == typeof a && (a = (0, n.default)(a)),
                16 !== a?.length)
              )
                throw TypeError(
                  "Namespace must be array-like (16 iterable integer values, 0-255)",
                );
              let u = new Uint8Array(16 + c.length);
              if (
                (u.set(d),
                u.set(c, d.length),
                (u = t(u)),
                (u[6] = (15 & u[6]) | e),
                (u[8] = (63 & u[8]) | 128),
                s)
              ) {
                l = l || 0;
                for (let e = 0; e < 16; ++e) s[l + e] = u[e];
                return s;
              }
              return (0, i.unsafeStringify)(u);
            });
        },
      },
      t = {},
      r = (function r(n) {
        var i = t[n];
        if (void 0 !== i) return i.exports;
        var o = (t[n] = { exports: {} });
        return e[n].call(o.exports, o, o.exports, r), o.exports;
      })(156);
    return r.default;
  })(),
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFHUixFQUFHQyxFQUFHTSxFQUFHWixFQUFFaFEsRUFBSSxHQUFJLEdBQUksWUFDcEM0USxFQUFJRCxFQUFNQyxFQUFHQyxFQUFHUixFQUFHQyxFQUFHTixFQUFFaFEsRUFBSSxHQUFJLElBQUssWUFDckNzUSxFQUFJSyxFQUFNTCxFQUFHTSxFQUFHQyxFQUFHUixFQUFHTCxFQUFFaFEsRUFBSSxHQUFJLElBQUssVUFDckNxUSxFQUFJTSxFQUFNTixFQUFHQyxFQUFHTSxFQUFHQyxFQUFHYixFQUFFaFEsRUFBSSxHQUFJLEVBQUcsWUFDbkM2USxFQUFJRixFQUFNRSxFQUFHUixFQUFHQyxFQUFHTSxFQUFHWixFQUFFaFEsRUFBSSxHQUFJLElBQUssWUFDckM0USxFQUFJRCxFQUFNQyxFQUFHQyxFQUFHUixFQUFHQyxFQUFHTixFQUFFaFEsRUFBSSxJQUFLLElBQUssT0FDdENzUSxFQUFJSyxFQUFNTCxFQUFHTSxFQUFHQyxFQUFHUixFQUFHTCxFQUFFaFEsRUFBSSxJQUFLLElBQUssWUFDdENxUSxFQUFJTSxFQUFNTixFQUFHQyxFQUFHTSxFQUFHQyxFQUFHYixFQUFFaFEsRUFBSSxJQUFLLEVBQUcsWUFDcEM2USxFQUFJRixFQUFNRSxFQUFHUixFQUFHQyxFQUFHTSxFQUFHWixFQUFFaFEsRUFBSSxJQUFLLElBQUssVUFDdEM0USxFQUFJRCxFQUFNQyxFQUFHQyxFQUFHUixFQUFHQyxFQUFHTixFQUFFaFEsRUFBSSxJQUFLLElBQUssWUFDdENzUSxFQUFJSyxFQUFNTCxFQUFHTSxFQUFHQyxFQUFHUixFQUFHTCxFQUFFaFEsRUFBSSxJQUFLLEdBQUksWUFDckNxUSxFQUFJUyxFQUFNVCxFQUFHQyxFQUFHTSxFQUFHQyxFQUFHYixFQUFFaFEsRUFBSSxHQUFJLEdBQUksV0FDcEM2USxFQUFJQyxFQUFNRCxFQUFHUixFQUFHQyxFQUFHTSxFQUFHWixFQUFFaFEsRUFBSSxHQUFJLEdBQUksWUFDcEM0USxFQUFJRSxFQUFNRixFQUFHQyxFQUFHUixFQUFHQyxFQUFHTixFQUFFaFEsRUFBSSxJQUFLLEdBQUksV0FDckNzUSxFQUFJUSxFQUFNUixFQUFHTSxFQUFHQyxFQUFHUixFQUFHTCxFQUFFaFEsR0FBSSxJQUFLLFdBQ2pDcVEsRUFBSVMsRUFBTVQsRUFBR0MsRUFBR00sRUFBR0MsRUFBR2IsRUFBRWhRLEVBQUksR0FBSSxHQUFJLFdBQ3BDNlEsRUFBSUMsRUFBTUQsRUFBR1IsRUFBR0MsRUFBR00sRUFBR1osRUFBRWhRLEVBQUksSUFBSyxFQUFHLFVBQ3BDNFEsRUFBSUUsRUFBTUYsRUFBR0MsRUFBR1IsRUFBR0MsRUFBR04sRUFBRWhRLEVBQUksSUFBSyxJQUFLLFdBQ3RDc1EsRUFBSVEsRUFBTVIsRUFBR00sRUFBR0MsRUFBR1IsRUFBR0wsRUFBRWhRLEVBQUksR0FBSSxJQUFLLFdBQ3JDcVEsRUFBSVMsRUFBTVQsRUFBR0MsRUFBR00sRUFBR0MsRUFBR2IsRUFBRWhRLEVBQUksR0FBSSxFQUFHLFdBQ25DNlEsRUFBSUMsRUFBTUQsRUFBR1IsRUFBR0MsRUFBR00sRUFBR1osRUFBRWhRLEVBQUksSUFBSyxHQUFJLFlBQ3JDNFEsRUFBSUUsRUFBTUYsRUFBR0MsRUFBR1IsRUFBR0MsRUFBR04sRUFBRWhRLEVBQUksR0FBSSxJQUFLLFdBQ3JDc1EsRUFBSVEsRUFBTVIsRUFBR00sRUFBR0MsRUFBR1IsRUFBR0wsRUFBRWhRLEVBQUksR0FBSSxHQUFJLFlBQ3BDcVEsRUFBSVMsRUFBTVQsRUFBR0MsRUFBR00sRUFBR0MsRUFBR2IsRUFBRWhRLEVBQUksSUFBSyxHQUFJLFlBQ3JDNlEsRUFBSUMsRUFBTUQsRUFBR1IsRUFBR0MsRUFBR00sRUFBR1osRUFBRWhRLEVBQUksR0FBSSxHQUFJLFVBQ3BDNFEsRUFBSUUsRUFBTUYsRUFBR0MsRUFBR1IsRUFBR0MsRUFBR04sRUFBRWhRLEVBQUksR0FBSSxHQUFJLFlBQ3BDc1EsRUFBSVEsRUFBTVIsRUFBR00sRUFBR0MsRUFBR1IsRUFBR0wsRUFBRWhRLEVBQUksSUFBSyxJQUFLLFlBQ3RDcVEsRUFBSVUsRUFBTVYsRUFBR0MsRUFBR00sRUFBR0MsRUFBR2IsRUFBRWhRLEVBQUksR0FBSSxHQUFJLFFBQ3BDNlEsRUFBSUUsRUFBTUYsRUFBR1IsRUFBR0MsRUFBR00sRUFBR1osRUFBRWhRLEVBQUksR0FBSSxJQUFLLFlBQ3JDNFEsRUFBSUcsRUFBTUgsRUFBR0MsRUFBR1IsRUFBR0MsRUFBR04sRUFBRWhRLEVBQUksSUFBSyxHQUFJLFlBQ3JDc1EsRUFBSVMsRUFBTVQsRUFBR00sRUFBR0MsRUFBR1IsRUFBR0wsRUFBRWhRLEVBQUksSUFBSyxJQUFLLFVBQ3RDcVEsRUFBSVUsRUFBTVYsRUFBR0MsRUFBR00sRUFBR0MsRUFBR2IsRUFBRWhRLEVBQUksR0FBSSxHQUFJLFlBQ3BDNlEsRUFBSUUsRUFBTUYsRUFBR1IsRUFBR0MsRUFBR00sRUFBR1osRUFBRWhRLEVBQUksR0FBSSxHQUFJLFlBQ3BDNFEsRUFBSUcsRUFBTUgsRUFBR0MsRUFBR1IsRUFBR0MsRUFBR04sRUFBRWhRLEVBQUksR0FBSSxJQUFLLFdBQ3JDc1EsRUFBSVMsRUFBTVQsRUFBR00sRUFBR0MsRUFBR1IsRUFBR0wsRUFBRWhRLEVBQUksSUFBSyxJQUFLLFlBQ3RDcVEsRUFBSVUsRUFBTVYsRUFBR0MsRUFBR00sRUFBR0MsRUFBR2IsRUFBRWhRLEVBQUksSUFBSyxFQUFHLFdBQ3BDNlEsRUFBSUUsRUFBTUYsRUFBR1IsRUFBR0MsRUFBR00sRUFBR1osRUFBRWhRLEdBQUksSUFBSyxXQUNqQzRRLEVBQUlHLEVBQU1ILEVBQUdDLEVBQUdSLEVBQUdDLEVBQUdOLEVBQUVoUSxFQUFJLEdBQUksSUFBSyxXQUNyQ3NRLEVBQUlTLEVBQU1ULEVBQUdNLEVBQUdDLEVBQUdSLEVBQUdMLEVBQUVoUSxFQUFJLEdBQUksR0FBSSxVQUNwQ3FRLEVBQUlVLEVBQU1WLEVBQUdDLEVBQUdNLEVBQUdDLEVBQUdiLEVBQUVoUSxFQUFJLEdBQUksR0FBSSxXQUNwQzZRLEVBQUlFLEVBQU1GLEVBQUdSLEVBQUdDLEVBQUdNLEVBQUdaLEVBQUVoUSxFQUFJLElBQUssSUFBSyxXQUN0QzRRLEVBQUlHLEVBQU1ILEVBQUdDLEVBQUdSLEVBQUdDLEVBQUdOLEVBQUVoUSxFQUFJLElBQUssR0FBSSxXQUNyQ3NRLEVBQUlTLEVBQU1ULEVBQUdNLEVBQUdDLEVBQUdSLEVBQUdMLEVBQUVoUSxFQUFJLEdBQUksSUFBSyxXQUNyQ3FRLEVBQUlXLEVBQU1YLEVBQUdDLEVBQUdNLEVBQUdDLEVBQUdiLEVBQUVoUSxHQUFJLEdBQUksV0FDaEM2USxFQUFJRyxFQUFNSCxFQUFHUixFQUFHQyxFQUFHTSxFQUFHWixFQUFFaFEsRUFBSSxHQUFJLEdBQUksWUFDcEM0USxFQUFJSSxFQUFNSixFQUFHQyxFQUFHUixFQUFHQyxFQUFHTixFQUFFaFEsRUFBSSxJQUFLLElBQUssWUFDdENzUSxFQUFJVSxFQUFNVixFQUFHTSxFQUFHQyxFQUFHUixFQUFHTCxFQUFFaFEsRUFBSSxHQUFJLElBQUssVUFDckNxUSxFQUFJVyxFQUFNWCxFQUFHQyxFQUFHTSxFQUFHQyxFQUFHYixFQUFFaFEsRUFBSSxJQUFLLEVBQUcsWUFDcEM2USxFQUFJRyxFQUFNSCxFQUFHUixFQUFHQyxFQUFHTSxFQUFHWixFQUFFaFEsRUFBSSxHQUFJLElBQUssWUFDckM0USxFQUFJSSxFQUFNSixFQUFHQyxFQUFHUixFQUFHQyxFQUFHTixFQUFFaFEsRUFBSSxJQUFLLElBQUssU0FDdENzUSxFQUFJVSxFQUFNVixFQUFHTSxFQUFHQyxFQUFHUixFQUFHTCxFQUFFaFEsRUFBSSxHQUFJLElBQUssWUFDckNxUSxFQUFJVyxFQUFNWCxFQUFHQyxFQUFHTSxFQUFHQyxFQUFHYixFQUFFaFEsRUFBSSxHQUFJLEVBQUcsWUFDbkM2USxFQUFJRyxFQUFNSCxFQUFHUixFQUFHQyxFQUFHTSxFQUFHWixFQUFFaFEsRUFBSSxJQUFLLElBQUssVUFDdEM0USxFQUFJSSxFQUFNSixFQUFHQyxFQUFHUixFQUFHQyxFQUFHTixFQUFFaFEsRUFBSSxHQUFJLElBQUssWUFDckNzUSxFQUFJVSxFQUFNVixFQUFHTSxFQUFHQyxFQUFHUixFQUFHTCxFQUFFaFEsRUFBSSxJQUFLLEdBQUksWUFDckNx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RyxFQUFROFIsRUFBSzlSLEdBQ2JBLEVBQU0sR0FBaUIsR0FBWEEsRUFBTSxHQUFhckwsRUFDL0JxTCxFQUFNLEdBQWlCLEdBQVhBLEVBQU0sR0FBYSxJQUMzQmQsRUFBSyxDQUNMek8sRUFBU0EsR0FBVSxFQUNuQixJQUFLLElBQUlMLEVBQUksRUFBR0EsRUFBSSxLQUFNQSxFQUN0QjhPLEVBQUl6TyxFQUFTTCxHQUFLNFAsRUFBTTVQLEdBRTVCLE9BQU84TyxDQUNYLENBQ0EsT0FBTyxFQUFJckosRUFBZTVGLGlCQUFpQitQLEVBQy9DLEMsR0N0Q0lpUyxFQUEyQixDQUFDLEVDRTVCQyxFRENKLFNBQVNDLEVBQW9CQyxHQUU1QixJQUFJQyxFQUFlSixFQUF5QkcsR0FDNUMsUUFBcUJ0VyxJQUFqQnVXLEVBQ0gsT0FBT0EsRUFBYTdpQixRQUdyQixJQUFJQyxFQUFTd2lCLEVBQXlCRyxHQUFZLENBR2pENWlCLFFBQVMsQ0FBQyxHQU9YLE9BSEE4aUIsRUFBb0JGLEdBQVVHLEtBQUs5aUIsRUFBT0QsUUFBU0MsRUFBUUEsRUFBT0QsUUFBUzJpQixHQUdwRTFpQixFQUFPRCxPQUNmLENDbkIwQjJpQixDQUFvQixLIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvY2pzLWJyb3dzZXIvc3RyaW5naWZ5LmpzIiwid2VicGFjazovL0V4dGVybmFsVHJhY2tpbmcvLi9zcmMvaGVscGVycy90aW1lLXRyYWNraW5nL2luZGV4LnRzIiwid2VicGFjazovL0V4dGVybmFsVHJhY2tpbmcvLi9zcmMvaGVscGVycy9mb3JtLWJ1aWxkZXJzL2dyYXZpdHktZm9ybXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL3NyYy9jb3JlL3RyYWNrZXIudHMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL3NyYy9jb25maWcvZmFjdG9yeS50cyIsIndlYnBhY2s6Ly9FeHRlcm5hbFRyYWNraW5nLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL0V4dGVybmFsVHJhY2tpbmcvLi9zcmMvaGVscGVycy9mb3JtLWJ1aWxkZXJzL2luZGV4LnRzIiwid2VicGFjazovL0V4dGVybmFsVHJhY2tpbmcvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2Nqcy1icm93c2VyL2luZGV4LmpzIiwid2VicGFjazovL0V4dGVybmFsVHJhY2tpbmcvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2Nqcy1icm93c2VyL21heC5qcyIsIndlYnBhY2s6Ly9FeHRlcm5hbFRyYWNraW5nLy4vc3JjL2hlbHBlcnMvdGltZS10cmFja2luZy90cmFja2VyLnRzIiwid2VicGFjazovL0V4dGVybmFsVHJhY2tpbmcvLi9zcmMvdXRpbHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvY2pzLWJyb3dzZXIvdjZUb1YxLmpzIiwid2VicGFjazovL0V4dGVybmFsVHJhY2tpbmcvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2Nqcy1icm93c2VyL3Y0LmpzIiwid2VicGFjazovL0V4dGVybmFsVHJhY2tpbmcvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2Nqcy1icm93c2VyL3JuZy5qcyIsIndlYnBhY2s6Ly9FeHRlcm5hbFRyYWNraW5nLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9janMtYnJvd3Nlci92Ny5qcyIsIndlYnBhY2s6Ly9FeHRlcm5hbFRyYWNraW5nLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9janMtYnJvd3Nlci9tZDUuanMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvY2pzLWJyb3dzZXIvdjYuanMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL3NyYy91dGlscy9maWVsZC11dGlscy50cyIsIndlYnBhY2s6Ly9FeHRlcm5hbFRyYWNraW5nLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9janMtYnJvd3Nlci92MS5qcyIsIndlYnBhY2s6Ly9FeHRlcm5hbFRyYWNraW5nLy4vc3JjL2FwaS9jbGllbnQudHMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvY2pzLWJyb3dzZXIvbmlsLmpzIiwid2VicGFjazovL0V4dGVybmFsVHJhY2tpbmcvLi9zcmMvY29uZmlnL3NjcmlwdC1jb25maWcudHMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvY2pzLWJyb3dzZXIvdjUuanMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvY2pzLWJyb3dzZXIvdjFUb1Y2LmpzIiwid2VicGFjazovL0V4dGVybmFsVHJhY2tpbmcvLi9zcmMvdHlwZXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvY2pzLWJyb3dzZXIvdjMuanMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL3NyYy91dGlscy9sb2dnZXIudHMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvY2pzLWJyb3dzZXIvcmVnZXguanMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL3NyYy9ldmVudHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvY2pzLWJyb3dzZXIvdmFsaWRhdGUuanMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvY2pzLWJyb3dzZXIvdmVyc2lvbi5qcyIsIndlYnBhY2s6Ly9FeHRlcm5hbFRyYWNraW5nLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9janMtYnJvd3Nlci9uYXRpdmUuanMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL3NyYy9oZWxwZXJzL2Zvcm0tYnVpbGRlcnMvZ3Jhdml0eS1mb3Jtcy9sYWJlbC1leHRyYWN0b3IudHMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvY2pzLWJyb3dzZXIvcGFyc2UuanMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvY2pzLWJyb3dzZXIvc2hhMS5qcyIsIndlYnBhY2s6Ly9FeHRlcm5hbFRyYWNraW5nLy4vc3JjL2NvcmUvYXV0by1pbml0LnRzIiwid2VicGFjazovL0V4dGVybmFsVHJhY2tpbmcvLi9zcmMvaGVscGVycy90aW1lLXRyYWNraW5nL2NvbnRleHQudHMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL3NyYy9jb25maWcvY29tbW9uLnRzIiwid2VicGFjazovL0V4dGVybmFsVHJhY2tpbmcvLi9zcmMvdXRpbHMvZm9ybS1wYXJzZXIudHMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL3NyYy9jb3JlL3F1ZXVlLXN5c3RlbS50cyIsIndlYnBhY2s6Ly9FeHRlcm5hbFRyYWNraW5nLy4vc3JjL2hlbHBlcnMvdGltZS10cmFja2luZy9hcGkudHMiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvY2pzLWJyb3dzZXIvdjM1LmpzIiwid2VicGFjazovL0V4dGVybmFsVHJhY2tpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vRXh0ZXJuYWxUcmFja2luZy93ZWJwYWNrL3N0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRXh0ZXJuYWxUcmFja2luZ1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJFeHRlcm5hbFRyYWNraW5nXCJdID0gZmFjdG9yeSgpO1xufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsICgpID0+IHtcbnJldHVybiAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudW5zYWZlU3RyaW5naWZ5ID0gdm9pZCAwO1xuY29uc3QgdmFsaWRhdGVfanNfMSA9IHJlcXVpcmUoXCIuL3ZhbGlkYXRlLmpzXCIpO1xuY29uc3QgYnl0ZVRvSGV4ID0gW107XG5mb3IgKGxldCBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gICAgYnl0ZVRvSGV4LnB1c2goKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnNsaWNlKDEpKTtcbn1cbmZ1bmN0aW9uIHVuc2FmZVN0cmluZ2lmeShhcnIsIG9mZnNldCA9IDApIHtcbiAgICByZXR1cm4gKGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMF1dICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxXV0gK1xuICAgICAgICBieXRlVG9IZXhbYXJyW29mZnNldCArIDJdXSArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgM11dICtcbiAgICAgICAgJy0nICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA0XV0gK1xuICAgICAgICBieXRlVG9IZXhbYXJyW29mZnNldCArIDVdXSArXG4gICAgICAgICctJyArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNl1dICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA3XV0gK1xuICAgICAgICAnLScgK1xuICAgICAgICBieXRlVG9IZXhbYXJyW29mZnNldCArIDhdXSArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOV1dICtcbiAgICAgICAgJy0nICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMF1dICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMV1dICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMl1dICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxM11dICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxNF1dICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxNV1dKS50b0xvd2VyQ2FzZSgpO1xufVxuZXhwb3J0cy51bnNhZmVTdHJpbmdpZnkgPSB1bnNhZmVTdHJpbmdpZnk7XG5mdW5jdGlvbiBzdHJpbmdpZnkoYXJyLCBvZmZzZXQgPSAwKSB7XG4gICAgY29uc3QgdXVpZCA9IHVuc2FmZVN0cmluZ2lmeShhcnIsIG9mZnNldCk7XG4gICAgaWYgKCEoMCwgdmFsaWRhdGVfanNfMS5kZWZhdWx0KSh1dWlkKSkge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ1N0cmluZ2lmaWVkIFVVSUQgaXMgaW52YWxpZCcpO1xuICAgIH1cbiAgICByZXR1cm4gdXVpZDtcbn1cbmV4cG9ydHMuZGVmYXVsdCA9IHN0cmluZ2lmeTtcbiIsImltcG9ydCB7IEdMT0JBTF9UUkFDS0lOR19LRVkgfSBmcm9tICcuLi8uLi9jb25maWcvY29tbW9uJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IHNlbmRUaW1lU3BlbnRFdmVudCB9IGZyb20gJy4vYXBpJztcbmltcG9ydCB7IGdldFRyYWNraW5nQ29udGV4dCB9IGZyb20gJy4vY29udGV4dCc7XG5pbXBvcnQgeyBUaW1lT25QYWdlVHJhY2tlciB9IGZyb20gJy4vdHJhY2tlcic7XG5cbmV4cG9ydCB0eXBlIHsgU2Vzc2lvblRpbWluZywgVHJhY2tpbmdDb250ZXh0IH0gZnJvbSAnLi90eXBlcyc7XG5leHBvcnQgeyBUaW1lT25QYWdlVHJhY2tlciB9IGZyb20gJy4vdHJhY2tlcic7XG5cbi8qKlxuICogU3RhcnRzIHRpbWUtb24tcGFnZSB0cmFja2luZyBmb3IgYSBnaXZlbiB0cmFja2VyIGluc3RhbmNlXG4gKi9cbmV4cG9ydCBjb25zdCBzdGFydFRpbWVUcmFja2luZyA9ICh0cmFja2VyOiB1bmtub3duKTogdm9pZCA9PiB7XG4gIGlmICghdHJhY2tlciB8fCB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xuXG4gIGNvbnN0IGludGVydmFsSWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjb250ZXh0ID0gZ2V0VHJhY2tpbmdDb250ZXh0KHRyYWNrZXIpO1xuICAgICAgaWYgKCFjb250ZXh0KSByZXR1cm47XG5cbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKGludGVydmFsSWQpO1xuXG4gICAgICBjb25zdCB0aW1lVHJhY2tlciA9IG5ldyBUaW1lT25QYWdlVHJhY2tlcigodGltaW5nKSA9PiBzZW5kVGltZVNwZW50RXZlbnQodGltaW5nLCBjb250ZXh0KSk7XG5cbiAgICAgIGNvbnN0IHcgPSB3aW5kb3cgYXMgYW55O1xuICAgICAgd1tHTE9CQUxfVFJBQ0tJTkdfS0VZXSA9IHdbR0xPQkFMX1RSQUNLSU5HX0tFWV0gfHwge307XG4gICAgICB3W0dMT0JBTF9UUkFDS0lOR19LRVldLnRpbWVUcmFja2VyID0gdGltZVRyYWNrZXI7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgaW4gdGltZSB0cmFja2luZycsIGVycm9yKTtcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKGludGVydmFsSWQpO1xuICAgIH1cbiAgfSwgMzAwKTtcbn07XG4iLCIvKipcbiAqIEdyYXZpdHkgRm9ybXMgTW9kdWxlXG4gKiBcbiAqIFByb3ZpZGVzIHV0aWxpdGllcyBmb3IgZXh0cmFjdGluZyBsYWJlbHMgZnJvbSBHcmF2aXR5IEZvcm1zIFdvcmRQcmVzcyBwbHVnaW4uXG4gKiBcbiAqIEBtb2R1bGUgZ3Jhdml0eS1mb3Jtc1xuICovXG5cbi8vIFR5cGVzXG5leHBvcnQgdHlwZSB7IEZvcm1JbnB1dEVsZW1lbnQgfSBmcm9tICcuL3R5cGVzJztcblxuLy8gTGFiZWwgZXh0cmFjdGlvbiB1dGlsaXRpZXNcbmV4cG9ydCB7XG4gIGlzR3Jhdml0eUZvcm1zRmllbGQsXG4gIGlzQ29tcG91bmRGaWVsZCxcbiAgZ2V0TWFpbkxhYmVsLFxuICBnZXRTdWJMYWJlbCxcbiAgZ2V0Q29tYmluZWRMYWJlbCxcbiAgZ2V0Q29udGFpbmVyTGFiZWwsXG4gIGdldEZpZWxkc2V0TGVnZW5kLFxuICBjbGVhbkxhYmVsVGV4dCxcbn0gZnJvbSAnLi9sYWJlbC1leHRyYWN0b3InO1xuIiwiaW1wb3J0IHsgXG4gIFRyYWNraW5nQ29uZmlnLCBcbiAgVHJhY2tpbmdTdGF0ZSwgXG4gIFRyYWNraW5nRXZlbnQsXG4gIFBhZ2VWaWV3RXZlbnQsXG4gIEZvcm1TdWJtaXNzaW9uRXZlbnRcbn0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgQXBpQ2xpZW50IH0gZnJvbSAnLi4vYXBpL2NsaWVudCc7XG5pbXBvcnQgeyBzdGFydFBhZ2VUcmFja2luZywgc3RhcnRGb3JtVHJhY2tpbmcgfSBmcm9tICcuLi9ldmVudHMnO1xuaW1wb3J0IHsgXG4gIGxvZ2dlciwgXG4gIGdlbmVyYXRlU2Vzc2lvbklkLFxuICBzdG9yZVNlc3Npb25JZEluQ29va2llLFxuICBnZXREZXZpY2VUeXBlXG59IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IEdMT0JBTF9UUkFDS0lOR19LRVkgfSBmcm9tICcuLi9jb25maWcvY29tbW9uJztcblxuLyoqXG4gKiBNYWluIGV4dGVybmFsIHRyYWNraW5nIGNsYXNzXG4gKi9cbmV4cG9ydCBjbGFzcyBFeHRlcm5hbFRyYWNrZXIge1xuICBwcml2YXRlIHN0YXRlOiBUcmFja2luZ1N0YXRlO1xuICBwcml2YXRlIGFwaUNsaWVudDogQXBpQ2xpZW50O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogVHJhY2tpbmdDb25maWcpIHtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaW5pdGlhbGl6ZWQ6IGZhbHNlLFxuICAgICAgdHJhY2tpbmdJZDogY29uZmlnLnRyYWNraW5nSWQsXG4gICAgfTtcbiAgICBcbiAgICB0aGlzLmFwaUNsaWVudCA9IG5ldyBBcGlDbGllbnQoY29uZmlnLnRyYWNraW5nSWQsIGNvbmZpZy5hcGlFbmRwb2ludCk7XG5cbiAgICAvLyBTZXQgZGVidWcgbW9kZVxuICAgIGlmIChjb25maWcuZGVidWcpIHtcbiAgICAgIGNvbnN0IHcgPSB3aW5kb3cgYXMgYW55O1xuICAgICAgd1tHTE9CQUxfVFJBQ0tJTkdfS0VZXSA9IHdbR0xPQkFMX1RSQUNLSU5HX0tFWV0gfHwge307XG4gICAgICB3W0dMT0JBTF9UUkFDS0lOR19LRVldLmRlYnVnID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBsb2dnZXIubG9nKCdFeHRlcm5hbFRyYWNrZXIgY3JlYXRlZCB3aXRoIGNvbmZpZzonLCBjb25maWcpO1xuICAgIFxuICAgIC8vIEF1dG8taW5pdGlhbGl6ZVxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIHRyYWNrZXJcbiAgICovXG4gIGFzeW5jIGluaXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMuc3RhdGUuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIGxvZ2dlci53YXJuKCdUcmFja2VyIGFscmVhZHkgaW5pdGlhbGl6ZWQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgLy8gRmV0Y2ggbG9jYXRpb24gSURcbiAgICAgIGNvbnN0IGxvY2F0aW9uSWQgPSBhd2FpdCB0aGlzLmFwaUNsaWVudC5mZXRjaExvY2F0aW9uSWQoKTtcbiAgICAgIHRoaXMuc3RhdGUubG9jYXRpb25JZCA9IGxvY2F0aW9uSWQ7XG4gICAgICBcbiAgICAgIC8vIEdlbmVyYXRlIG5ldyBzZXNzaW9uSWQgZm9yIGVhY2ggc2Vzc2lvbiBhbmQgc3RvcmUgaW4gY29va2llXG4gICAgICB0aGlzLnN0YXRlLnNlc3Npb25JZCA9IGdlbmVyYXRlU2Vzc2lvbklkKCk7XG4gICAgICBzdG9yZVNlc3Npb25JZEluQ29va2llKGxvY2F0aW9uSWQsIHRoaXMuc3RhdGUuc2Vzc2lvbklkKTtcbiAgICAgIFxuICAgICAgLy8gU2V0IHRyYWNraW5nIGNvbnRleHQgb24gQVBJIGNsaWVudCB3aXRoIHNlc3Npb25JZFxuICAgICAgdGhpcy5hcGlDbGllbnQuc2V0VHJhY2tpbmdDb250ZXh0KFxuICAgICAgICB0aGlzLnN0YXRlLnNlc3Npb25JZCxcbiAgICAgICAgbG9jYXRpb25JZFxuICAgICAgKTtcbiAgICAgIFxuICAgICAgLy8gU2V0dXAgYXV0b21hdGljIHRyYWNraW5nIChzdGFydHMgaW1tZWRpYXRlbHkgdXBvbiBmdW5jdGlvbiBjYWxsKVxuICAgICAgc3RhcnRQYWdlVHJhY2tpbmcoYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgICAgIC8vIEFkZCBzZXNzaW9uSWQgdG8gYWxsIGV2ZW50c1xuICAgICAgICBldmVudC5wcm9wZXJ0aWVzID0ge1xuICAgICAgICAgIC4uLmV2ZW50LnByb3BlcnRpZXMsXG4gICAgICAgICAgc2Vzc2lvbklkOiB0aGlzLnN0YXRlLnNlc3Npb25JZCxcbiAgICAgICAgfTtcbiAgICAgICAgYXdhaXQgdGhpcy5zZW5kRXZlbnQoZXZlbnQpO1xuICAgICAgfSk7XG5cbiAgICAgIHN0YXJ0Rm9ybVRyYWNraW5nKGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgICAvLyBBZGQgc2Vzc2lvbklkIHRvIGZvcm0gc3VibWlzc2lvbnNcbiAgICAgICAgZXZlbnQucHJvcGVydGllcyA9IHtcbiAgICAgICAgICAuLi5ldmVudC5wcm9wZXJ0aWVzLFxuICAgICAgICAgIHNlc3Npb25JZDogdGhpcy5zdGF0ZS5zZXNzaW9uSWQsXG4gICAgICAgIH07XG4gICAgICAgIGF3YWl0IHRoaXMuYXBpQ2xpZW50LnN1Ym1pdEZvcm0oZXZlbnQpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuc3RhdGUuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgbG9nZ2VyLmxvZygnVHJhY2tlciBpbml0aWFsaXplZCBzdWNjZXNzZnVsbHkgd2l0aCBzZXNzaW9uSWQ6JywgdGhpcy5zdGF0ZS5zZXNzaW9uSWQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoJ0ZhaWxlZCB0byBpbml0aWFsaXplIHRyYWNrZXI6JywgZXJyb3IpO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgZXZlbnQgdG8gQVBJXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIHNlbmRFdmVudChldmVudDogVHJhY2tpbmdFdmVudCB8IFBhZ2VWaWV3RXZlbnQgfCBGb3JtU3VibWlzc2lvbkV2ZW50KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgLy8gQWRkIHVzZXIgY29udGV4dCBpZiBhdmFpbGFibGVcbiAgICBpZiAodGhpcy5zdGF0ZS51c2VySWQpIHtcbiAgICAgIGV2ZW50LnByb3BlcnRpZXMgPSB7XG4gICAgICAgIC4uLmV2ZW50LnByb3BlcnRpZXMsXG4gICAgICAgIHVzZXJJZDogdGhpcy5zdGF0ZS51c2VySWQsXG4gICAgICAgIC4uLnRoaXMuc3RhdGUudXNlclByb3BlcnRpZXMsXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIEFwcGx5IGRldmljZSB0eXBlIHRvIGV2ZW50IHByb3BlcnRpZXMgZm9yIGRvd25zdHJlYW0gYW5hbHl0aWNzLlxuICAgIGNvbnN0IGRldmljZVR5cGUgPSBldmVudD8ucHJvcGVydGllcz8uZGV2aWNlVHlwZSB8fCBnZXREZXZpY2VUeXBlKCk7XG5cbiAgICAvLyBFbnN1cmUgc2Vzc2lvbklkIGlzIHNldFxuICAgIGV2ZW50LnByb3BlcnRpZXMgPSB7XG4gICAgICAuLi5ldmVudC5wcm9wZXJ0aWVzLFxuICAgICAgc2Vzc2lvbklkOiB0aGlzLnN0YXRlLnNlc3Npb25JZCxcbiAgICAgIGxvY2F0aW9uSWQ6IHRoaXMuc3RhdGUubG9jYXRpb25JZCxcbiAgICAgIGRldmljZVR5cGUsXG4gICAgfTtcblxuICAgIGF3YWl0IHRoaXMuYXBpQ2xpZW50LnNlbmRFdmVudChldmVudCk7XG4gIH1cbn0gXG4iLCJpbXBvcnQgeyBFeHRlcm5hbFRyYWNrZXIgfSBmcm9tICcuLi9jb3JlL3RyYWNrZXInO1xuaW1wb3J0IHsgVHJhY2tpbmdDb25maWcgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyB2YWxpZGF0ZUNvbmZpZyB9IGZyb20gJy4vc2NyaXB0LWNvbmZpZyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhbmQgaW5pdGlhbGl6ZXMgYSBuZXcgRXh0ZXJuYWxUcmFja2VyIGluc3RhbmNlXG4gKiBcbiAqIEBwYXJhbSBjb25maWcgLSBDb25maWd1cmF0aW9uIG9iamVjdCBmb3IgdGhlIHRyYWNrZXJcbiAqIEByZXR1cm5zIEV4dGVybmFsVHJhY2tlciBpbnN0YW5jZVxuICogQHRocm93cyBFcnJvciBpZiBjb25maWd1cmF0aW9uIGlzIGludmFsaWRcbiAqIFxuICogTG9naWMgZmxvdzpcbiAqIDEuIFZhbGlkYXRlIHRoZSBwcm92aWRlZCBjb25maWd1cmF0aW9uXG4gKiAyLiBDcmVhdGUgbmV3IEV4dGVybmFsVHJhY2tlciBpbnN0YW5jZVxuICogMy4gTG9nIHN1Y2Nlc3NmdWwgY3JlYXRpb25cbiAqIDQuIFJldHVybiB0aGUgdHJhY2tlciBpbnN0YW5jZVxuICovXG5leHBvcnQgY29uc3QgY3JlYXRlVHJhY2tlciA9IChjb25maWc6IFRyYWNraW5nQ29uZmlnKTogRXh0ZXJuYWxUcmFja2VyID0+IHtcbiAgLy8gVmFsaWRhdGUgY29uZmlndXJhdGlvbiBiZWZvcmUgY3JlYXRpbmcgdHJhY2tlclxuICBpZiAoIXZhbGlkYXRlQ29uZmlnKGNvbmZpZykpIHtcbiAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcignSW52YWxpZCB0cmFja2luZyBjb25maWd1cmF0aW9uIHByb3ZpZGVkJyk7XG4gICAgbG9nZ2VyLmNyaXRpY2FsKCdGYWlsZWQgdG8gY3JlYXRlIHRyYWNrZXI6JywgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyBDcmVhdGUgdHJhY2tlciBpbnN0YW5jZVxuICAgIGNvbnN0IHRyYWNrZXIgPSBuZXcgRXh0ZXJuYWxUcmFja2VyKGNvbmZpZyk7XG4gICAgXG4gICAgbG9nZ2VyLmxvZygnVHJhY2tlciBjcmVhdGVkIHN1Y2Nlc3NmdWxseSB3aXRoIElEOicsIGNvbmZpZy50cmFja2luZ0lkKTtcbiAgICByZXR1cm4gdHJhY2tlcjtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2dnZXIuY3JpdGljYWwoJ0Vycm9yIGNyZWF0aW5nIHRyYWNrZXI6JywgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG4gIiwiaW1wb3J0IHsgaW5pdGlhbGl6ZUZyb21TY3JpcHQgfSBmcm9tICcuL2NvcmUvYXV0by1pbml0JztcbmltcG9ydCB7IHN0YXJ0VGltZVRyYWNraW5nIH0gZnJvbSAnLi9oZWxwZXJzL3RpbWUtdHJhY2tpbmcnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vdHlwZXMnO1xuXG4vKipcbiAqIE1haW4gaW5pdGlhbGl6YXRpb24gb3JjaGVzdHJhdG9yXG4gKiBcbiAqIEluaXRpYWxpemVzIHRoZSBleHRlcm5hbCB0cmFja2luZyBzeXN0ZW0gZnJvbSBzY3JpcHQgYXR0cmlidXRlc1xuICogYW5kIHN0YXJ0cyB0aW1lLW9uLXBhZ2UgdHJhY2tpbmcgaWYgc3VjY2Vzc2Z1bC5cbiAqL1xuY29uc3QgaW5pdGlhbGl6ZSA9ICgpOiB2b2lkID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB0cmFja2VyID0gaW5pdGlhbGl6ZUZyb21TY3JpcHQoKTtcbiAgICBcbiAgICBpZiAodHJhY2tlcikge1xuICAgICAgbG9nZ2VyLmxvZygnVHJhY2tpbmcgaW5pdGlhbGl6ZWQgc3VjY2Vzc2Z1bGx5Jyk7XG4gICAgICBzdGFydFRpbWVUcmFja2luZyh0cmFja2VyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nZ2VyLmNyaXRpY2FsKCdFeHRlcm5hbCBUcmFja2luZyBmYWlsZWQgdG8gaW5pdGlhbGl6ZScpO1xuICAgICAgbG9nZ2VyLmNyaXRpY2FsKCdNYWtlIHN1cmUgdG8gaW5jbHVkZSBkYXRhLXRyYWNraW5nLWlkIGluIHlvdXIgc2NyaXB0IHRhZycpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2dnZXIuY3JpdGljYWwoJ0luaXRpYWxpemF0aW9uIGZhaWxlZDonLCBlcnJvcik7XG4gIH1cbn07XG5cbi8vIEV4ZWN1dGUgaW5pdGlhbGl6YXRpb25cbmluaXRpYWxpemUoKTtcblxuLy8gRXh0ZW5kIHdpbmRvdyBpbnRlcmZhY2UgZm9yIFR5cGVTY3JpcHRcbmRlY2xhcmUgZ2xvYmFsIHtcbiAgaW50ZXJmYWNlIFdpbmRvdyB7XG4gICAgW2tleTogc3RyaW5nXTogYW55O1xuICB9XG59IiwiLyoqXG4gKiBGb3JtIEJ1aWxkZXJzIE1vZHVsZVxuICogXG4gKiBQcm92aWRlcyB1dGlsaXRpZXMgZm9yIHdvcmtpbmcgd2l0aCB2YXJpb3VzIGZvcm0gYnVpbGRlciBwbHVnaW5zLlxuICogRWFjaCBmb3JtIGJ1aWxkZXIgaGFzIGl0cyBvd24gbW9kdWxlIHdpdGggc3BlY2lhbGl6ZWQgbGFiZWwgZXh0cmFjdGlvblxuICogYW5kIGZpZWxkIHRyYW5zZm9ybWF0aW9uIGxvZ2ljLlxuICogXG4gKiBTdXBwb3J0ZWQgRm9ybSBCdWlsZGVyczpcbiAqIC0gR3Jhdml0eSBGb3JtcyAoV29yZFByZXNzIHBsdWdpbilcbiAqIFxuICogQG1vZHVsZSBmb3JtLWJ1aWxkZXJzXG4gKi9cblxuLy8gR3Jhdml0eSBGb3Jtc1xuZXhwb3J0ICogYXMgR3Jhdml0eUZvcm1zIGZyb20gJy4vZ3Jhdml0eS1mb3Jtcyc7XG5cbi8vIFJlLWV4cG9ydCBjb21tb25seSB1c2VkIHV0aWxpdGllcyBmcm9tIEdyYXZpdHkgRm9ybXNcbmV4cG9ydCB7IFxuICBnZXRDb21iaW5lZExhYmVsIGFzIGdldEdyYXZpdHlGb3Jtc0NvbWJpbmVkTGFiZWwsXG4gIGlzR3Jhdml0eUZvcm1zRmllbGQsXG4gIGNsZWFuTGFiZWxUZXh0LFxufSBmcm9tICcuL2dyYXZpdHktZm9ybXMnO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnZlcnNpb24gPSBleHBvcnRzLnZhbGlkYXRlID0gZXhwb3J0cy52NyA9IGV4cG9ydHMudjZUb1YxID0gZXhwb3J0cy52NiA9IGV4cG9ydHMudjUgPSBleHBvcnRzLnY0ID0gZXhwb3J0cy52MyA9IGV4cG9ydHMudjFUb1Y2ID0gZXhwb3J0cy52MSA9IGV4cG9ydHMuc3RyaW5naWZ5ID0gZXhwb3J0cy5wYXJzZSA9IGV4cG9ydHMuTklMID0gZXhwb3J0cy5NQVggPSB2b2lkIDA7XG52YXIgbWF4X2pzXzEgPSByZXF1aXJlKFwiLi9tYXguanNcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJNQVhcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1heF9qc18xLmRlZmF1bHQ7IH0gfSk7XG52YXIgbmlsX2pzXzEgPSByZXF1aXJlKFwiLi9uaWwuanNcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJOSUxcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5pbF9qc18xLmRlZmF1bHQ7IH0gfSk7XG52YXIgcGFyc2VfanNfMSA9IHJlcXVpcmUoXCIuL3BhcnNlLmpzXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwicGFyc2VcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHBhcnNlX2pzXzEuZGVmYXVsdDsgfSB9KTtcbnZhciBzdHJpbmdpZnlfanNfMSA9IHJlcXVpcmUoXCIuL3N0cmluZ2lmeS5qc1wiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcInN0cmluZ2lmeVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gc3RyaW5naWZ5X2pzXzEuZGVmYXVsdDsgfSB9KTtcbnZhciB2MV9qc18xID0gcmVxdWlyZShcIi4vdjEuanNcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJ2MVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdjFfanNfMS5kZWZhdWx0OyB9IH0pO1xudmFyIHYxVG9WNl9qc18xID0gcmVxdWlyZShcIi4vdjFUb1Y2LmpzXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwidjFUb1Y2XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB2MVRvVjZfanNfMS5kZWZhdWx0OyB9IH0pO1xudmFyIHYzX2pzXzEgPSByZXF1aXJlKFwiLi92My5qc1wiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcInYzXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB2M19qc18xLmRlZmF1bHQ7IH0gfSk7XG52YXIgdjRfanNfMSA9IHJlcXVpcmUoXCIuL3Y0LmpzXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwidjRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHY0X2pzXzEuZGVmYXVsdDsgfSB9KTtcbnZhciB2NV9qc18xID0gcmVxdWlyZShcIi4vdjUuanNcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJ2NVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdjVfanNfMS5kZWZhdWx0OyB9IH0pO1xudmFyIHY2X2pzXzEgPSByZXF1aXJlKFwiLi92Ni5qc1wiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcInY2XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB2Nl9qc18xLmRlZmF1bHQ7IH0gfSk7XG52YXIgdjZUb1YxX2pzXzEgPSByZXF1aXJlKFwiLi92NlRvVjEuanNcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJ2NlRvVjFcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHY2VG9WMV9qc18xLmRlZmF1bHQ7IH0gfSk7XG52YXIgdjdfanNfMSA9IHJlcXVpcmUoXCIuL3Y3LmpzXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwidjdcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHY3X2pzXzEuZGVmYXVsdDsgfSB9KTtcbnZhciB2YWxpZGF0ZV9qc18xID0gcmVxdWlyZShcIi4vdmFsaWRhdGUuanNcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJ2YWxpZGF0ZVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFsaWRhdGVfanNfMS5kZWZhdWx0OyB9IH0pO1xudmFyIHZlcnNpb25fanNfMSA9IHJlcXVpcmUoXCIuL3ZlcnNpb24uanNcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJ2ZXJzaW9uXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB2ZXJzaW9uX2pzXzEuZGVmYXVsdDsgfSB9KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gJ2ZmZmZmZmZmLWZmZmYtZmZmZi1mZmZmLWZmZmZmZmZmZmZmZic7XG4iLCJpbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuLi8uLi91dGlscyc7XG5pbXBvcnQgdHlwZSB7IFNlc3Npb25UaW1pbmcgfSBmcm9tICcuL3R5cGVzJztcblxuY29uc3QgVVBEQVRFX0lOVEVSVkFMX01TID0gMTAwMDtcbmNvbnN0IElOQUNUSVZJVFlfTVMgPSAzMCAqIDYwICogMTAwMDtcbmNvbnN0IEFDVElWSVRZX0VWRU5UUyA9IFsncG9pbnRlcmRvd24nLCAncG9pbnRlcm1vdmUnLCAna2V5ZG93bicsICdzY3JvbGwnLCAndG91Y2hzdGFydCcsICd0b3VjaG1vdmUnXTtcblxuLyoqXG4gKiBMaWdodHdlaWdodCBlbmdhZ2VtZW50IHRyYWNrZXIgdG8gY2FwdHVyZSBhY3RpdmUgdGltZSBvbiBwYWdlXG4gKi9cbmV4cG9ydCBjbGFzcyBUaW1lT25QYWdlVHJhY2tlciB7XG4gIHByaXZhdGUgc2Vzc2lvblN0YXJ0OiBudW1iZXI7XG4gIHByaXZhdGUgbGFzdEFjdGl2aXR5QXQ6IG51bWJlcjtcbiAgcHJpdmF0ZSBsYXN0VGljazogbnVtYmVyO1xuICBwcml2YXRlIGFjdGl2ZVRpbWVNcyA9IDA7XG4gIHByaXZhdGUgdXBkYXRlVGltZXI6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGlzSWRsZSA9IGZhbHNlO1xuICBwcml2YXRlIGRlc3Ryb3llZCA9IGZhbHNlO1xuICBwcml2YXRlIGZsdXNoZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBzZXNzaW9uRXhwaXJlZCA9IGZhbHNlO1xuICBwcml2YXRlIG9uU2Vzc2lvbkNvbXBsZXRlOiAodGltaW5nOiBTZXNzaW9uVGltaW5nKSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKG9uQ29tcGxldGU6ICh0aW1pbmc6IFNlc3Npb25UaW1pbmcpID0+IHZvaWQpIHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMub25TZXNzaW9uQ29tcGxldGUgPSBvbkNvbXBsZXRlO1xuICAgIHRoaXMuc2Vzc2lvblN0YXJ0ID0gbm93O1xuICAgIHRoaXMubGFzdEFjdGl2aXR5QXQgPSBub3c7XG4gICAgdGhpcy5sYXN0VGljayA9IG5vdztcbiAgICB0aGlzLmJpbmQoKTtcbiAgfVxuXG4gIHByaXZhdGUgYmluZCgpOiB2b2lkIHtcbiAgICB0cnkge1xuICAgICAgQUNUSVZJVFlfRVZFTlRTLmZvckVhY2goKGV2dCkgPT5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZ0LCB0aGlzLm9uQWN0aXZpdHksIHsgcGFzc2l2ZTogdHJ1ZSB9KSxcbiAgICAgICk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgdGhpcy5vblZpc2liaWxpdHlDaGFuZ2UpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIHRoaXMub25VbmxvYWQsIHsgY2FwdHVyZTogdHJ1ZSB9KTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwYWdlaGlkZScsIHRoaXMub25VbmxvYWQsIHsgY2FwdHVyZTogdHJ1ZSB9KTtcbiAgICAgIHRoaXMudXBkYXRlVGltZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy50aWNrLCBVUERBVEVfSU5URVJWQUxfTVMpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoJ0ZhaWxlZCB0byBiaW5kIGV2ZW50IGxpc3RlbmVycycsIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uQWN0aXZpdHkgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKHRoaXMuZGVzdHJveWVkKSByZXR1cm47XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcblxuICAgIGlmICh0aGlzLnNlc3Npb25FeHBpcmVkKSB7XG4gICAgICB0aGlzLnNlc3Npb25TdGFydCA9IG5vdztcbiAgICAgIHRoaXMubGFzdFRpY2sgPSBub3c7XG4gICAgICB0aGlzLmFjdGl2ZVRpbWVNcyA9IDA7XG4gICAgICB0aGlzLmZsdXNoZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2Vzc2lvbkV4cGlyZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RBY3Rpdml0eUF0ID0gbm93O1xuICAgIHRoaXMuaXNJZGxlID0gZmFsc2U7XG4gIH07XG5cbiAgcHJpdmF0ZSBvblZpc2liaWxpdHlDaGFuZ2UgPSAoKTogdm9pZCA9PiB7XG4gICAgZG9jdW1lbnQuaGlkZGVuID8gdGhpcy5jaGVja1RpbWVvdXQoKSA6IHRoaXMub25BY3Rpdml0eSgpO1xuICB9O1xuXG4gIHByaXZhdGUgY2hlY2tUaW1lb3V0KCk6IHZvaWQge1xuICAgIGlmIChEYXRlLm5vdygpIC0gdGhpcy5sYXN0QWN0aXZpdHlBdCA+PSBJTkFDVElWSVRZX01TKSB7XG4gICAgICB0aGlzLmVtaXRVcGRhdGUoKTtcbiAgICAgIHRoaXMuc2Vzc2lvbkV4cGlyZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25VbmxvYWQgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCF0aGlzLmRlc3Ryb3llZCkgdGhpcy5lbWl0VXBkYXRlKCk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0aWNrID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICh0aGlzLmRlc3Ryb3llZCkgcmV0dXJuO1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG5cbiAgICB0aGlzLmlzSWRsZSA9IG5vdyAtIHRoaXMubGFzdEFjdGl2aXR5QXQgPj0gSU5BQ1RJVklUWV9NUztcblxuICAgIGlmICghZG9jdW1lbnQuaGlkZGVuICYmICF0aGlzLmlzSWRsZSkge1xuICAgICAgdGhpcy5hY3RpdmVUaW1lTXMgKz0gbm93IC0gdGhpcy5sYXN0VGljaztcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RUaWNrID0gbm93O1xuICAgIHRoaXMuY2hlY2tUaW1lb3V0KCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBlbWl0VXBkYXRlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRlc3Ryb3llZCB8fCB0aGlzLmZsdXNoZWQpIHJldHVybjtcbiAgICB0aGlzLmZsdXNoZWQgPSB0cnVlO1xuXG4gICAgY29uc3Qgc2Vzc2lvbkVuZCA9IERhdGUubm93KCk7XG5cbiAgICBpZiAoIWRvY3VtZW50LmhpZGRlbiAmJiAhdGhpcy5pc0lkbGUpIHtcbiAgICAgIHRoaXMuYWN0aXZlVGltZU1zICs9IHNlc3Npb25FbmQgLSB0aGlzLmxhc3RUaWNrO1xuICAgIH1cbiAgICB0aGlzLmxhc3RUaWNrID0gc2Vzc2lvbkVuZDtcblxuICAgIHRoaXMub25TZXNzaW9uQ29tcGxldGUoe1xuICAgICAgc2Vzc2lvblN0YXJ0OiB0aGlzLnNlc3Npb25TdGFydCxcbiAgICAgIHNlc3Npb25FbmQsXG4gICAgICB0aW1lU3BlbnRNczogTWF0aC5tYXgoMCwgTWF0aC5yb3VuZCh0aGlzLmFjdGl2ZVRpbWVNcykpLFxuICAgIH0pO1xuICB9XG5cbiAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHJldHVybjtcbiAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XG5cbiAgICBBQ1RJVklUWV9FVkVOVFMuZm9yRWFjaCgoZXZ0KSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihldnQsIHRoaXMub25BY3Rpdml0eSkpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCB0aGlzLm9uVmlzaWJpbGl0eUNoYW5nZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIHRoaXMub25VbmxvYWQpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwYWdlaGlkZScsIHRoaXMub25VbmxvYWQpO1xuICAgIGlmICh0aGlzLnVwZGF0ZVRpbWVyKSB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLnVwZGF0ZVRpbWVyKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuL2xvZ2dlcic7XG5cbi8vIFJlLWV4cG9ydCBmcm9tIHNwZWNpYWxpemVkIG1vZHVsZXNcbmV4cG9ydCB7IGxvZ2dlciB9IGZyb20gJy4vbG9nZ2VyJztcbmV4cG9ydCB7IHBhcnNlRm9ybURhdGEsIHR5cGUgRm9ybVBhcnNlUmVzdWx0IH0gZnJvbSAnLi9mb3JtLXBhcnNlcic7XG5leHBvcnQgeyBjb250YWluc1Bhc3N3b3JkLCBpc1Bhc3N3b3JkTGlrZUZpZWxkIH0gZnJvbSAnLi9maWVsZC11dGlscyc7XG5cbi8qKlxuICogR2VuZXJhdGUgYSBVVUlEIHY0IGZvciBzZXNzaW9uSWRcbiAqL1xuZXhwb3J0IGNvbnN0IGdlbmVyYXRlU2Vzc2lvbklkID0gKCk6IHN0cmluZyA9PiB7XG4gIHJldHVybiB1dWlkdjQoKTtcbn07XG5cbi8qKlxuICogR2V0IGNvb2tpZSB2YWx1ZVxuICovXG5leHBvcnQgY29uc3QgZ2V0Q29va2llID0gKG5hbWU6IHN0cmluZyk6IHN0cmluZyB8IG51bGwgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHZhbHVlID0gYDsgJHtkb2N1bWVudC5jb29raWV9YDtcbiAgICBjb25zdCBwYXJ0cyA9IHZhbHVlLnNwbGl0KGA7ICR7bmFtZX09YCk7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgcmV0dXJuIHBhcnRzLnBvcCgpPy5zcGxpdCgnOycpLnNoaWZ0KCkgfHwgbnVsbDtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGdldHRpbmcgY29va2llOicsIGUpO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuLyoqXG4gKiBTZXQgY29va2llIHZhbHVlXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRDb29raWUgPSAobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBkYXlzOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcbiAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyAoZGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApKTtcbiAgICBjb25zdCBleHBpcmVzID0gYGV4cGlyZXM9JHtkYXRlLnRvVVRDU3RyaW5nKCl9YDtcbiAgICBkb2N1bWVudC5jb29raWUgPSBgJHtuYW1lfT0ke3ZhbHVlfTske2V4cGlyZXN9O3BhdGg9LztTYW1lU2l0ZT1MYXhgO1xuICB9IGNhdGNoIChlKSB7XG4gICAgbG9nZ2VyLmVycm9yKCdFcnJvciBzZXR0aW5nIGNvb2tpZTonLCBlKTtcbiAgfVxufTtcblxuLyoqXG4gKiBTdG9yZSB1c2VyIGRhdGEgaW4gbG9jYWxTdG9yYWdlIChzaW1pbGFyIHRvIF91ZCBpbiBGb3JtQ29tcG9uZW50KVxuICovXG5leHBvcnQgY29uc3Qgc3RvcmVVc2VyRGF0YSA9IChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogdm9pZCA9PiB7XG4gIHRyeSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnX3VkJywgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGxvZ2dlci5lcnJvcignRXJyb3Igc3RvcmluZyB1c2VyIGRhdGE6JywgZSk7XG4gIH1cbn07XG5cbi8qKlxuICogR2V0IHVzZXIgZGF0YSBmcm9tIGxvY2FsU3RvcmFnZVxuICovXG5leHBvcnQgY29uc3QgZ2V0VXNlckRhdGEgPSAoKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwgPT4ge1xuICB0cnkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cubG9jYWxTdG9yYWdlKSB7XG4gICAgICBjb25zdCBkYXRhID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdWQnKTtcbiAgICAgIGlmICghZGF0YSkgcmV0dXJuIG51bGw7XG5cbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UoZGF0YSkgYXMgUmVjb3JkPHN0cmluZywgYW55PjtcblxuICAgICAgaWYgKHBhcnNlZCAmJiB0eXBlb2YgcGFyc2VkID09PSAnb2JqZWN0JyAmJiAnY3VzdG9tZXJfaWQnIGluIHBhcnNlZCkge1xuICAgICAgICBjb25zdCBjaWQgPSAocGFyc2VkIGFzIGFueSkuY3VzdG9tZXJfaWQ7XG4gICAgICAgIGlmIChjaWQgIT09IHVuZGVmaW5lZCAmJiBjaWQgIT09IG51bGwpIHtcbiAgICAgICAgICBjb25zdCBub3JtYWxpemVkID0gU3RyaW5nKGNpZCkudHJpbSgpO1xuICAgICAgICAgIGlmIChub3JtYWxpemVkKSB7XG4gICAgICAgICAgICAocGFyc2VkIGFzIGFueSkuY29udGFjdElkID0gbm9ybWFsaXplZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhcnNlZDtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGdldHRpbmcgdXNlciBkYXRhOicsIGUpO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuLyoqXG4gKiBTdG9yZSBzZXNzaW9uSWQgd2l0aCBjb29raWUgZmFsbGJhY2sgdG8gc2Vzc2lvblN0b3JhZ2VcbiAqL1xuZXhwb3J0IGNvbnN0IHN0b3JlU2Vzc2lvbklkSW5Db29raWUgPSAobG9jYXRpb25JZDogc3RyaW5nLCBzZXNzaW9uSWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICBjb25zdCBjb29raWVOYW1lID0gYGxjX3Nlc3Npb25fJHtsb2NhdGlvbklkfWA7XG4gIFxuICAvLyBUcnkgY29va2llIGZpcnN0XG4gIHNldENvb2tpZShjb29raWVOYW1lLCBzZXNzaW9uSWQsIDEpO1xuICBcbiAgLy8gVmVyaWZ5IGNvb2tpZSB3b3JrZWQsIGlmIG5vdCBmYWxsYmFjayB0byBzZXNzaW9uU3RvcmFnZVxuICBjb25zdCB2ZXJpZmljYXRpb24gPSBnZXRDb29raWUoY29va2llTmFtZSk7XG4gIGlmICh2ZXJpZmljYXRpb24gIT09IHNlc3Npb25JZCkge1xuICAgIC8vIENvb2tpZSBmYWlsZWQsIHVzZSBzZXNzaW9uU3RvcmFnZSBhcyBmYWxsYmFja1xuICAgIHRyeSB7XG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnNlc3Npb25TdG9yYWdlKSB7XG4gICAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGNvb2tpZU5hbWUsIHNlc3Npb25JZCk7XG4gICAgICAgIGxvZ2dlci5hcGkoYFNlc3Npb25JZCBzdG9yZWQgaW4gc2Vzc2lvblN0b3JhZ2UgKGNvb2tpZSBmYWxsYmFjayk6ICR7c2Vzc2lvbklkfWApO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGxvZ2dlci5lcnJvcignQm90aCBjb29raWUgYW5kIHNlc3Npb25TdG9yYWdlIGZhaWxlZCBmb3Igc2Vzc2lvbklkIHN0b3JhZ2UnLCBlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbG9nZ2VyLmFwaShgU2Vzc2lvbklkIHN0b3JlZCBpbiBjb29raWU6ICR7c2Vzc2lvbklkfWApO1xuICB9XG59O1xuXG4vKipcbiAqIEdldCBzZXNzaW9uSWQgZnJvbSBjb29raWUgd2l0aCBzZXNzaW9uU3RvcmFnZSBmYWxsYmFja1xuICovXG5leHBvcnQgY29uc3QgZ2V0U2Vzc2lvbklkRnJvbUNvb2tpZSA9IChsb2NhdGlvbklkOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgY29uc3QgY29va2llTmFtZSA9IGBsY19zZXNzaW9uXyR7bG9jYXRpb25JZH1gO1xuICBcbiAgLy8gVHJ5IGNvb2tpZSBmaXJzdFxuICBjb25zdCBjb29raWVSZXN1bHQgPSBnZXRDb29raWUoY29va2llTmFtZSk7XG4gIGlmIChjb29raWVSZXN1bHQpIHtcbiAgICByZXR1cm4gY29va2llUmVzdWx0O1xuICB9XG4gIFxuICAvLyBGYWxsYmFjayB0byBzZXNzaW9uU3RvcmFnZVxuICB0cnkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UpIHtcbiAgICAgIGNvbnN0IHNlc3Npb25TdG9yYWdlUmVzdWx0ID0gd2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oY29va2llTmFtZSk7XG4gICAgICBpZiAoc2Vzc2lvblN0b3JhZ2VSZXN1bHQpIHtcbiAgICAgICAgbG9nZ2VyLmFwaShgU2Vzc2lvbklkIHJldHJpZXZlZCBmcm9tIHNlc3Npb25TdG9yYWdlIChjb29raWUgZmFsbGJhY2spOiAke3Nlc3Npb25TdG9yYWdlUmVzdWx0fWApO1xuICAgICAgICByZXR1cm4gc2Vzc2lvblN0b3JhZ2VSZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgbG9nZ2VyLmVycm9yKCdCb3RoIGNvb2tpZSBhbmQgc2Vzc2lvblN0b3JhZ2UgZmFpbGVkIGZvciBzZXNzaW9uSWQgcmV0cmlldmFsJywgZSk7XG4gIH1cbiAgXG4gIHJldHVybiBudWxsO1xufTtcblxuLyoqXG4gKiBTYWZlIGxvY2FsU3RvcmFnZSBnZXR0ZXJcbiAqL1xuZXhwb3J0IGNvbnN0IGdldEZyb21TdG9yYWdlID0gKGtleTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gIHRyeSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcbiAgICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGdldHRpbmcgZnJvbSBzdG9yYWdlOicsIGUpO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuLyoqXG4gKiBTYWZlIGxvY2FsU3RvcmFnZSBzZXR0ZXJcbiAqL1xuZXhwb3J0IGNvbnN0IHNldEluU3RvcmFnZSA9IChrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICB0cnkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cubG9jYWxTdG9yYWdlKSB7XG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgbG9nZ2VyLmVycm9yKCdFcnJvciBzZXR0aW5nIGluIHN0b3JhZ2U6JywgZSk7XG4gIH1cbn07XG5cbi8qKlxuICogRGVib3VuY2UgZnVuY3Rpb24gZm9yIHBlcmZvcm1hbmNlXG4gKi9cbmV4cG9ydCBjb25zdCBkZWJvdW5jZSA9IDxUIGV4dGVuZHMgKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk+KFxuICBmdW5jOiBULFxuICB3YWl0OiBudW1iZXJcbik6ICgoLi4uYXJnczogUGFyYW1ldGVyczxUPikgPT4gdm9pZCkgPT4ge1xuICBsZXQgdGltZW91dDogTm9kZUpTLlRpbWVvdXQ7XG4gIFxuICByZXR1cm4gZnVuY3Rpb24gZXhlY3V0ZWRGdW5jdGlvbiguLi5hcmdzOiBQYXJhbWV0ZXJzPFQ+KSB7XG4gICAgY29uc3QgbGF0ZXIgPSAoKSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICBmdW5jKC4uLmFyZ3MpO1xuICAgIH07XG4gICAgXG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgfTtcbn07XG5cbi8qKlxuICogR2V0IGRldmljZSB0eXBlIGJhc2VkIG9uIHVzZXIgYWdlbnQgYW5kIGRldmljZSBjYXBhYmlsaXRpZXNcbiAqL1xuZXhwb3J0IGNvbnN0IGdldERldmljZVR5cGUgPSAoKTogc3RyaW5nID0+IHtcbiAgY29uc3QgbmF2ID0gdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgPyBuYXZpZ2F0b3IgOiB1bmRlZmluZWQ7XG4gIGNvbnN0IHVhID0gKG5hdj8udXNlckFnZW50IHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBtYXhUb3VjaFBvaW50cyA9IG5hdj8ubWF4VG91Y2hQb2ludHMgfHwgMDtcbiAgY29uc3QgdXNlckFnZW50RGF0YSA9IChuYXYgYXMgYW55KT8udXNlckFnZW50RGF0YTtcbiAgY29uc3QgaXNNb2JpbGVIaW50ID0gdXNlckFnZW50RGF0YT8ubW9iaWxlID09PSB0cnVlO1xuXG4gIGlmIChcbiAgICB1YS5pbmNsdWRlcygnaXBhZCcpIHx8XG4gICAgdWEuaW5jbHVkZXMoJ3RhYmxldCcpIHx8XG4gICAgKHVhLmluY2x1ZGVzKCdhbmRyb2lkJykgJiYgIXVhLmluY2x1ZGVzKCdtb2JpbGUnKSkgfHxcbiAgICAodWEuaW5jbHVkZXMoJ21hY2ludG9zaCcpICYmIG1heFRvdWNoUG9pbnRzID4gMSlcbiAgKSB7XG4gICAgcmV0dXJuICd0YWJsZXQnO1xuICB9XG5cbiAgaWYgKFxuICAgIGlzTW9iaWxlSGludCB8fFxuICAgIHVhLmluY2x1ZGVzKCdtb2JpJykgfHxcbiAgICB1YS5pbmNsdWRlcygnaXBob25lJykgfHxcbiAgICB1YS5pbmNsdWRlcygnaXBvZCcpIHx8XG4gICAgKHVhLmluY2x1ZGVzKCdhbmRyb2lkJykgJiYgdWEuaW5jbHVkZXMoJ21vYmlsZScpKVxuICApIHtcbiAgICByZXR1cm4gJ21vYmlsZSc7XG4gIH1cblxuICByZXR1cm4gJ2Rlc2t0b3AnO1xufTtcblxuLyoqXG4gKiBHZXQgcGFnZSBtZXRhZGF0YVxuICovXG5leHBvcnQgY29uc3QgZ2V0UGFnZU1ldGFkYXRhID0gKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHRpdGxlOiBkb2N1bWVudC50aXRsZSxcbiAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgIHBhdGg6IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSxcbiAgICByZWZlcnJlcjogZG9jdW1lbnQucmVmZXJyZXIsXG4gICAgdXNlckFnZW50OiBuYXZpZ2F0b3IudXNlckFnZW50LFxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGdldExvY2FsVGltZVpvbmUgPSAoKTogc3RyaW5nID0+IHtcbiAgcmV0dXJuIEludGwuRGF0ZVRpbWVGb3JtYXQoKS5yZXNvbHZlZE9wdGlvbnMoKS50aW1lWm9uZTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRMb2NhbFRpbWVab25lT2Zmc2V0ID0gKCk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IG1hdGNoID0gbmV3IERhdGUoKS50b1N0cmluZygpLm1hdGNoKC8oW0EtWl0rW1xcKy1dWzAtOV17Mn0pKFswLTldezJ9KS8pO1xuICByZXR1cm4gbWF0Y2ggPyBgKCR7bWF0Y2hbMV19OiR7bWF0Y2hbMl19KWAgOiAnJztcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRGb3JtYXR0ZWRUaW1lem9uZSA9ICgpOiBzdHJpbmcgPT4ge1xuICByZXR1cm4gYCR7Z2V0TG9jYWxUaW1lWm9uZSgpfSAke2dldExvY2FsVGltZVpvbmVPZmZzZXQoKX1gO1xufTtcblxuLyoqXG4gKiBGb3JtIGJ1aWxkZXJzIC8gd3JhcHBlcnMgd2hlcmUgd2Uga2VlcCB0aXRsZS1maXJzdCByZXNvbHV0aW9uIChoZWFkaW5ncywgcGx1Z2luIHRpdGxlcykuXG4gKiBQbGFpbiBgPGZvcm0gaWQ9XCIuLi5cIj5gIHdpdGhvdXQgdGhlc2UgYW5jZXN0b3JzIHVzZXMgaWQvbmFtZSBmaXJzdCBzbyBkZWZhdWx0IEhUTUxcbiAqIG1hdGNoZXMgcHJpb3IgZXhwZWN0YXRpb25zIGFuZCBpcyBub3Qgb3ZlcnJpZGRlbiBieSBhbiBpbm5lciBgPGgyPmAgZXRjLlxuICpcbiAqIFNlbGVjdG9ycyBhcmUgY2hvc2VuIGZyb20gZWFjaCBwbHVnaW7igJlzIHR5cGljYWwgZnJvbnQtZW5kIG1hcmt1cCAoc2hvcnRjb2RlL2Jsb2NrIG91dHB1dCkuXG4gKiBJZiBhIGJ1aWxkZXIgaXMgbWlzc2luZywgYWRkIGEgc3RhYmxlIHdyYXBwZXIgY2xhc3MgZnJvbSB0aGF0IHBsdWdpbuKAmXMgcmVuZGVyZWQgSFRNTC5cbiAqL1xuY29uc3QgQ1VTVE9NX0ZPUk1fQ09OVEVYVF9TRUxFQ1RPUlMgPSBbXG4gIC8vIEdyYXZpdHkgRm9ybXNcbiAgJy5nZm9ybV93cmFwcGVyJyxcbiAgJy5nZl9icm93c2VyX2Nocm9tZScsXG4gIC8vIENvbnRhY3QgRm9ybSA3XG4gICcud3BjZjcnLFxuICAnLndwY2Y3LWZvcm0nLFxuICAvLyBGb3JtaWRhYmxlIEZvcm1zICgud2l0aF9mcm1fc3R5bGUgLyBjb250YWluZXIgLyBmb3JtIGNsYXNzIGZyb20gdGhlaXIgZG9jcyAmIGRlZmF1bHQgSFRNTClcbiAgJy53aXRoX2ZybV9zdHlsZScsXG4gICcuZnJtX2Zvcm1zX2NvbnRhaW5lcicsXG4gICcuZnJtLXNob3ctZm9ybScsXG4gICdbaWRePVwiZnJtX2Zvcm1fXCJdJyxcbiAgLy8gRmx1ZW50IEZvcm1zXG4gICcuZmx1ZW50Zm9ybScsXG4gICcuZmYtZWwtZm9ybS0tY29udGFpbmVyJyxcbiAgLy8gRXZlcmVzdCBGb3JtcyAoZGVmYXVsdCBzaG9ydGNvZGUgd3JhcHBlciBwZXIgZGV2ZWxvcGVyLmV2ZXJlc3Rmb3Jtcy5uZXQpXG4gICcuZXZlcmVzdC1mb3JtcycsXG4gIC8vIEhhcHB5Rm9ybXMgKGNvbW1vbiBjbGFzc2VzIGluIHRoZW1lL3dpZGdldCB3cmFwcGVyczsgcGx1Z2luIHVzZXMgXCJoYXBweWZvcm1zXCIgaW4gbWFya3VwKVxuICAnLmhhcHB5Zm9ybXMnLFxuICAnLmhhcHB5Zm9ybXMtZm9ybScsXG4gICcuaGFwcHlmb3Jtcy1mb3JtLXdyYXAnLFxuICAvLyBOaW5qYSBGb3Jtc1xuICAnLm5mLWZvcm0tY29udCcsXG4gICcubmluamEtZm9ybXMtZm9ybS13cmFwJyxcbiAgLy8gV1BGb3Jtc1xuICAnLndwZm9ybXMtY29udGFpbmVyJyxcbiAgJy53cGZvcm1zLWZvcm0tY29udGFpbmVyJyxcbiAgLy8gRWxlbWVudG9yIGZvcm0gd2lkZ2V0c1xuICAnLmVsZW1lbnRvci13aWRnZXQtZm9ybScsXG4gICcuZWxlbWVudG9yLWZvcm0nLFxuXSBhcyBjb25zdDtcblxuY29uc3QgaXNDdXN0b21Gb3JtQ29udGV4dCA9IChmb3JtOiBFbGVtZW50KTogYm9vbGVhbiA9PlxuICBDVVNUT01fRk9STV9DT05URVhUX1NFTEVDVE9SUy5zb21lKChzZWwpID0+ICEhZm9ybS5jbG9zZXN0KHNlbCkpO1xuXG5jb25zdCBwaWNrRm9ybUF0dHIgPSAoZm9ybTogRWxlbWVudCwgYXR0cjogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcbiAgY29uc3QgdiA9IGZvcm0uZ2V0QXR0cmlidXRlKGF0dHIpPy50cmltKCk7XG4gIHJldHVybiB2IHx8IHVuZGVmaW5lZDtcbn07XG5cbi8qKiBDdXN0b20gYnVpbGRlcnM6IHVuY2hhbmdlZCBmYWxsYmFjayBvcmRlciAobmFtZSBiZWZvcmUgaWQpLiAqL1xuY29uc3QgZ2V0RXhwbGljaXRGb3JtQXR0cmlidXRlc05hbWVGaXJzdCA9IChmb3JtOiBFbGVtZW50KTogc3RyaW5nIHwgdW5kZWZpbmVkID0+XG4gIHBpY2tGb3JtQXR0cihmb3JtLCAnbmFtZScpIHx8XG4gIHBpY2tGb3JtQXR0cihmb3JtLCAnaWQnKSB8fFxuICBwaWNrRm9ybUF0dHIoZm9ybSwgJ2RhdGEtZm9ybWlkJykgfHxcbiAgcGlja0Zvcm1BdHRyKGZvcm0sICdkYXRhLW5hbWUnKTtcblxuLyoqIFBsYWluIEhUTUwgZm9ybXM6IHByZWZlciBpZCBsaWtlIGNsYXNzaWMgYmVoYXZpb3IsIHRoZW4gbmFtZS4gKi9cbmNvbnN0IGdldEV4cGxpY2l0Rm9ybUF0dHJpYnV0ZXNJZEZpcnN0ID0gKGZvcm06IEVsZW1lbnQpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT5cbiAgcGlja0Zvcm1BdHRyKGZvcm0sICdpZCcpIHx8XG4gIHBpY2tGb3JtQXR0cihmb3JtLCAnbmFtZScpIHx8XG4gIHBpY2tGb3JtQXR0cihmb3JtLCAnZGF0YS1mb3JtaWQnKSB8fFxuICBwaWNrRm9ybUF0dHIoZm9ybSwgJ2RhdGEtbmFtZScpO1xuXG4vKipcbiAqIERlcml2ZSBhIHN0YWJsZSBpZGVudGlmaWVyIGZvciBhIGZvcm0gZWxlbWVudC5cbiAqIFN1cHBvcnRzIHN0YW5kYXJkIGZvcm1zLCBHcmF2aXR5IEZvcm1zLCBhbmQgY29tbW9uIFdvcmRQcmVzcyBmb3JtIHBsdWdpbnMuXG4gKlxuICogTm90ZTogVXNlcyBnZXRBdHRyaWJ1dGUoKSBpbnN0ZWFkIG9mIGRpcmVjdCBwcm9wZXJ0eSBhY2Nlc3MgYmVjYXVzZVxuICogZm9ybSBlbGVtZW50cyB3aXRoIG5hbWU9XCJuYW1lXCIgb3IgbmFtZT1cImlkXCIgc2hhZG93IHRoZSBmb3JtJ3Mgb3duXG4gKiBuYW1lL2lkIHByb3BlcnRpZXMgKERPTSBxdWlyaykuXG4gKi9cbi8qKlxuICogRXh0cmFjdCBhIGh1bWFuLXJlYWRhYmxlIGZvcm0gdGl0bGUgZnJvbSB0aGUgRE9NIHN1cnJvdW5kaW5nIHRoZSBmb3JtIGVsZW1lbnQuXG4gKiBDaGVja3MgR3Jhdml0eSBGb3JtcyBgLmdmb3JtX3RpdGxlYCwgY29tbW9uIGhlYWRpbmcgcGF0dGVybnMsIGFuZCBkYXRhIGF0dHJpYnV0ZXMuXG4gKi9cbmNvbnN0IGV4dHJhY3RGb3JtVGl0bGUgPSAoZm9ybTogRWxlbWVudCk6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XG4gIGNvbnN0IHdyYXBwZXIgPSBmb3JtLmNsb3Nlc3QoJy5nZm9ybV93cmFwcGVyLCAuZ2ZfYnJvd3Nlcl9jaHJvbWUnKTtcbiAgaWYgKHdyYXBwZXIpIHtcbiAgICBjb25zdCB0aXRsZUVsID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuZ2Zvcm1fdGl0bGUnKTtcbiAgICBjb25zdCB0aXRsZSA9IHRpdGxlRWw/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgaWYgKHRpdGxlKSByZXR1cm4gdGl0bGU7XG4gIH1cblxuICBjb25zdCBpbnRlcm5hbEhlYWRpbmcgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ2gxLCBoMiwgaDMsIGg0LCBsZWdlbmQnKTtcbiAgaWYgKGludGVybmFsSGVhZGluZz8udGV4dENvbnRlbnQ/LnRyaW0oKSkge1xuICAgIHJldHVybiBpbnRlcm5hbEhlYWRpbmcudGV4dENvbnRlbnQudHJpbSgpO1xuICB9XG5cbiAgY29uc3QgZGF0YVRpdGxlID0gZm9ybS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSB8fCBmb3JtLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICBpZiAoZGF0YVRpdGxlPy50cmltKCkpIHJldHVybiBkYXRhVGl0bGUudHJpbSgpO1xuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Rm9ybUlkZW50aWZpZXIgPSAoXG4gIHJvb3Q/OiBEb2N1bWVudCB8IEVsZW1lbnQgfCBIVE1MRm9ybUVsZW1lbnRcbik6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XG4gIHRyeSB7XG4gICAgbGV0IHRhcmdldEZvcm06IEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAgIGlmICh0eXBlb2YgSFRNTEZvcm1FbGVtZW50ICE9PSAndW5kZWZpbmVkJyAmJiByb290IGluc3RhbmNlb2YgSFRNTEZvcm1FbGVtZW50KSB7XG4gICAgICB0YXJnZXRGb3JtID0gcm9vdCBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICAgfSBlbHNlIGlmIChyb290ICYmICdxdWVyeVNlbGVjdG9yJyBpbiAocm9vdCBhcyBhbnkpKSB7XG4gICAgICB0YXJnZXRGb3JtID0gKHJvb3QgYXMgRG9jdW1lbnQgfCBFbGVtZW50KS5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldEZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0YXJnZXRGb3JtKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgaWYgKGlzQ3VzdG9tRm9ybUNvbnRleHQodGFyZ2V0Rm9ybSkpIHtcbiAgICAgIGNvbnN0IGZvcm1UaXRsZSA9IGV4dHJhY3RGb3JtVGl0bGUodGFyZ2V0Rm9ybSk7XG4gICAgICBpZiAoZm9ybVRpdGxlKSByZXR1cm4gZm9ybVRpdGxlO1xuICAgICAgcmV0dXJuIGdldEV4cGxpY2l0Rm9ybUF0dHJpYnV0ZXNOYW1lRmlyc3QodGFyZ2V0Rm9ybSkgfHwgJ1VuaWRlbnRpZmllZCBGb3JtJztcbiAgICB9XG5cbiAgICAvLyBEZWZhdWx0IEhUTUwgZm9ybXM6IHByZWZlciBpZCAodGhlbiBuYW1lKSwgbm90IGFuIGlubmVyIGhlYWRpbmcsIHRoZW4gdGl0bGUgZmFsbGJhY2tcbiAgICBjb25zdCBleHBsaWNpdCA9IGdldEV4cGxpY2l0Rm9ybUF0dHJpYnV0ZXNJZEZpcnN0KHRhcmdldEZvcm0pO1xuICAgIGlmIChleHBsaWNpdCkgcmV0dXJuIGV4cGxpY2l0O1xuXG4gICAgY29uc3QgZm9ybVRpdGxlID0gZXh0cmFjdEZvcm1UaXRsZSh0YXJnZXRGb3JtKTtcbiAgICBpZiAoZm9ybVRpdGxlKSByZXR1cm4gZm9ybVRpdGxlO1xuXG4gICAgcmV0dXJuICdVbmlkZW50aWZpZWQgRm9ybSc7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGdldHRpbmcgZm9ybSBpZGVudGlmaWVyOicsIGUpO1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHBhcnNlX2pzXzEgPSByZXF1aXJlKFwiLi9wYXJzZS5qc1wiKTtcbmNvbnN0IHN0cmluZ2lmeV9qc18xID0gcmVxdWlyZShcIi4vc3RyaW5naWZ5LmpzXCIpO1xuZnVuY3Rpb24gdjZUb1YxKHV1aWQpIHtcbiAgICBjb25zdCB2NkJ5dGVzID0gdHlwZW9mIHV1aWQgPT09ICdzdHJpbmcnID8gKDAsIHBhcnNlX2pzXzEuZGVmYXVsdCkodXVpZCkgOiB1dWlkO1xuICAgIGNvbnN0IHYxQnl0ZXMgPSBfdjZUb1YxKHY2Qnl0ZXMpO1xuICAgIHJldHVybiB0eXBlb2YgdXVpZCA9PT0gJ3N0cmluZycgPyAoMCwgc3RyaW5naWZ5X2pzXzEudW5zYWZlU3RyaW5naWZ5KSh2MUJ5dGVzKSA6IHYxQnl0ZXM7XG59XG5leHBvcnRzLmRlZmF1bHQgPSB2NlRvVjE7XG5mdW5jdGlvbiBfdjZUb1YxKHY2Qnl0ZXMpIHtcbiAgICByZXR1cm4gVWludDhBcnJheS5vZigoKHY2Qnl0ZXNbM10gJiAweDBmKSA8PCA0KSB8ICgodjZCeXRlc1s0XSA+PiA0KSAmIDB4MGYpLCAoKHY2Qnl0ZXNbNF0gJiAweDBmKSA8PCA0KSB8ICgodjZCeXRlc1s1XSAmIDB4ZjApID4+IDQpLCAoKHY2Qnl0ZXNbNV0gJiAweDBmKSA8PCA0KSB8ICh2NkJ5dGVzWzZdICYgMHgwZiksIHY2Qnl0ZXNbN10sICgodjZCeXRlc1sxXSAmIDB4MGYpIDw8IDQpIHwgKCh2NkJ5dGVzWzJdICYgMHhmMCkgPj4gNCksICgodjZCeXRlc1syXSAmIDB4MGYpIDw8IDQpIHwgKCh2NkJ5dGVzWzNdICYgMHhmMCkgPj4gNCksIDB4MTAgfCAoKHY2Qnl0ZXNbMF0gJiAweGYwKSA+PiA0KSwgKCh2NkJ5dGVzWzBdICYgMHgwZikgPDwgNCkgfCAoKHY2Qnl0ZXNbMV0gJiAweGYwKSA+PiA0KSwgdjZCeXRlc1s4XSwgdjZCeXRlc1s5XSwgdjZCeXRlc1sxMF0sIHY2Qnl0ZXNbMTFdLCB2NkJ5dGVzWzEyXSwgdjZCeXRlc1sxM10sIHY2Qnl0ZXNbMTRdLCB2NkJ5dGVzWzE1XSk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IG5hdGl2ZV9qc18xID0gcmVxdWlyZShcIi4vbmF0aXZlLmpzXCIpO1xuY29uc3Qgcm5nX2pzXzEgPSByZXF1aXJlKFwiLi9ybmcuanNcIik7XG5jb25zdCBzdHJpbmdpZnlfanNfMSA9IHJlcXVpcmUoXCIuL3N0cmluZ2lmeS5qc1wiKTtcbmZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gICAgaWYgKG5hdGl2ZV9qc18xLmRlZmF1bHQucmFuZG9tVVVJRCAmJiAhYnVmICYmICFvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBuYXRpdmVfanNfMS5kZWZhdWx0LnJhbmRvbVVVSUQoKTtcbiAgICB9XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgY29uc3Qgcm5kcyA9IG9wdGlvbnMucmFuZG9tID8/IG9wdGlvbnMucm5nPy4oKSA/PyAoMCwgcm5nX2pzXzEuZGVmYXVsdCkoKTtcbiAgICBpZiAocm5kcy5sZW5ndGggPCAxNikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JhbmRvbSBieXRlcyBsZW5ndGggbXVzdCBiZSA+PSAxNicpO1xuICAgIH1cbiAgICBybmRzWzZdID0gKHJuZHNbNl0gJiAweDBmKSB8IDB4NDA7XG4gICAgcm5kc1s4XSA9IChybmRzWzhdICYgMHgzZikgfCAweDgwO1xuICAgIGlmIChidWYpIHtcbiAgICAgICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDA7XG4gICAgICAgIGlmIChvZmZzZXQgPCAwIHx8IG9mZnNldCArIDE2ID4gYnVmLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYFVVSUQgYnl0ZSByYW5nZSAke29mZnNldH06JHtvZmZzZXQgKyAxNX0gaXMgb3V0IG9mIGJ1ZmZlciBib3VuZHNgKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyArK2kpIHtcbiAgICAgICAgICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHJuZHNbaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJ1ZjtcbiAgICB9XG4gICAgcmV0dXJuICgwLCBzdHJpbmdpZnlfanNfMS51bnNhZmVTdHJpbmdpZnkpKHJuZHMpO1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gdjQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmxldCBnZXRSYW5kb21WYWx1ZXM7XG5jb25zdCBybmRzOCA9IG5ldyBVaW50OEFycmF5KDE2KTtcbmZ1bmN0aW9uIHJuZygpIHtcbiAgICBpZiAoIWdldFJhbmRvbVZhbHVlcykge1xuICAgICAgICBpZiAodHlwZW9mIGNyeXB0byA9PT0gJ3VuZGVmaW5lZCcgfHwgIWNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY3J5cHRvLmdldFJhbmRvbVZhbHVlcygpIG5vdCBzdXBwb3J0ZWQuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQjZ2V0cmFuZG9tdmFsdWVzLW5vdC1zdXBwb3J0ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBnZXRSYW5kb21WYWx1ZXMgPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKTtcbiAgICB9XG4gICAgcmV0dXJuIGdldFJhbmRvbVZhbHVlcyhybmRzOCk7XG59XG5leHBvcnRzLmRlZmF1bHQgPSBybmc7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudXBkYXRlVjdTdGF0ZSA9IHZvaWQgMDtcbmNvbnN0IHJuZ19qc18xID0gcmVxdWlyZShcIi4vcm5nLmpzXCIpO1xuY29uc3Qgc3RyaW5naWZ5X2pzXzEgPSByZXF1aXJlKFwiLi9zdHJpbmdpZnkuanNcIik7XG5jb25zdCBfc3RhdGUgPSB7fTtcbmZ1bmN0aW9uIHY3KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gICAgbGV0IGJ5dGVzO1xuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgIGJ5dGVzID0gdjdCeXRlcyhvcHRpb25zLnJhbmRvbSA/PyBvcHRpb25zLnJuZz8uKCkgPz8gKDAsIHJuZ19qc18xLmRlZmF1bHQpKCksIG9wdGlvbnMubXNlY3MsIG9wdGlvbnMuc2VxLCBidWYsIG9mZnNldCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICBjb25zdCBybmRzID0gKDAsIHJuZ19qc18xLmRlZmF1bHQpKCk7XG4gICAgICAgIHVwZGF0ZVY3U3RhdGUoX3N0YXRlLCBub3csIHJuZHMpO1xuICAgICAgICBieXRlcyA9IHY3Qnl0ZXMocm5kcywgX3N0YXRlLm1zZWNzLCBfc3RhdGUuc2VxLCBidWYsIG9mZnNldCk7XG4gICAgfVxuICAgIHJldHVybiBidWYgPz8gKDAsIHN0cmluZ2lmeV9qc18xLnVuc2FmZVN0cmluZ2lmeSkoYnl0ZXMpO1xufVxuZnVuY3Rpb24gdXBkYXRlVjdTdGF0ZShzdGF0ZSwgbm93LCBybmRzKSB7XG4gICAgc3RhdGUubXNlY3MgPz89IC1JbmZpbml0eTtcbiAgICBzdGF0ZS5zZXEgPz89IDA7XG4gICAgaWYgKG5vdyA+IHN0YXRlLm1zZWNzKSB7XG4gICAgICAgIHN0YXRlLnNlcSA9IChybmRzWzZdIDw8IDIzKSB8IChybmRzWzddIDw8IDE2KSB8IChybmRzWzhdIDw8IDgpIHwgcm5kc1s5XTtcbiAgICAgICAgc3RhdGUubXNlY3MgPSBub3c7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzdGF0ZS5zZXEgPSAoc3RhdGUuc2VxICsgMSkgfCAwO1xuICAgICAgICBpZiAoc3RhdGUuc2VxID09PSAwKSB7XG4gICAgICAgICAgICBzdGF0ZS5tc2VjcysrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdGF0ZTtcbn1cbmV4cG9ydHMudXBkYXRlVjdTdGF0ZSA9IHVwZGF0ZVY3U3RhdGU7XG5mdW5jdGlvbiB2N0J5dGVzKHJuZHMsIG1zZWNzLCBzZXEsIGJ1Ziwgb2Zmc2V0ID0gMCkge1xuICAgIGlmIChybmRzLmxlbmd0aCA8IDE2KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZG9tIGJ5dGVzIGxlbmd0aCBtdXN0IGJlID49IDE2Jyk7XG4gICAgfVxuICAgIGlmICghYnVmKSB7XG4gICAgICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KDE2KTtcbiAgICAgICAgb2Zmc2V0ID0gMDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChvZmZzZXQgPCAwIHx8IG9mZnNldCArIDE2ID4gYnVmLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYFVVSUQgYnl0ZSByYW5nZSAke29mZnNldH06JHtvZmZzZXQgKyAxNX0gaXMgb3V0IG9mIGJ1ZmZlciBib3VuZHNgKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBtc2VjcyA/Pz0gRGF0ZS5ub3coKTtcbiAgICBzZXEgPz89ICgocm5kc1s2XSAqIDB4N2YpIDw8IDI0KSB8IChybmRzWzddIDw8IDE2KSB8IChybmRzWzhdIDw8IDgpIHwgcm5kc1s5XTtcbiAgICBidWZbb2Zmc2V0KytdID0gKG1zZWNzIC8gMHgxMDAwMDAwMDAwMCkgJiAweGZmO1xuICAgIGJ1ZltvZmZzZXQrK10gPSAobXNlY3MgLyAweDEwMDAwMDAwMCkgJiAweGZmO1xuICAgIGJ1ZltvZmZzZXQrK10gPSAobXNlY3MgLyAweDEwMDAwMDApICYgMHhmZjtcbiAgICBidWZbb2Zmc2V0KytdID0gKG1zZWNzIC8gMHgxMDAwMCkgJiAweGZmO1xuICAgIGJ1ZltvZmZzZXQrK10gPSAobXNlY3MgLyAweDEwMCkgJiAweGZmO1xuICAgIGJ1ZltvZmZzZXQrK10gPSBtc2VjcyAmIDB4ZmY7XG4gICAgYnVmW29mZnNldCsrXSA9IDB4NzAgfCAoKHNlcSA+Pj4gMjgpICYgMHgwZik7XG4gICAgYnVmW29mZnNldCsrXSA9IChzZXEgPj4+IDIwKSAmIDB4ZmY7XG4gICAgYnVmW29mZnNldCsrXSA9IDB4ODAgfCAoKHNlcSA+Pj4gMTQpICYgMHgzZik7XG4gICAgYnVmW29mZnNldCsrXSA9IChzZXEgPj4+IDYpICYgMHhmZjtcbiAgICBidWZbb2Zmc2V0KytdID0gKChzZXEgPDwgMikgJiAweGZmKSB8IChybmRzWzEwXSAmIDB4MDMpO1xuICAgIGJ1ZltvZmZzZXQrK10gPSBybmRzWzExXTtcbiAgICBidWZbb2Zmc2V0KytdID0gcm5kc1sxMl07XG4gICAgYnVmW29mZnNldCsrXSA9IHJuZHNbMTNdO1xuICAgIGJ1ZltvZmZzZXQrK10gPSBybmRzWzE0XTtcbiAgICBidWZbb2Zmc2V0KytdID0gcm5kc1sxNV07XG4gICAgcmV0dXJuIGJ1Zjtcbn1cbmV4cG9ydHMuZGVmYXVsdCA9IHY3O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBtZDUoYnl0ZXMpIHtcbiAgICBjb25zdCB3b3JkcyA9IHVpbnQ4VG9VaW50MzIoYnl0ZXMpO1xuICAgIGNvbnN0IG1kNUJ5dGVzID0gd29yZHNUb01kNSh3b3JkcywgYnl0ZXMubGVuZ3RoICogOCk7XG4gICAgcmV0dXJuIHVpbnQzMlRvVWludDgobWQ1Qnl0ZXMpO1xufVxuZnVuY3Rpb24gdWludDMyVG9VaW50OChpbnB1dCkge1xuICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoaW5wdXQubGVuZ3RoICogNCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGggKiA0OyBpKyspIHtcbiAgICAgICAgYnl0ZXNbaV0gPSAoaW5wdXRbaSA+PiAyXSA+Pj4gKChpICUgNCkgKiA4KSkgJiAweGZmO1xuICAgIH1cbiAgICByZXR1cm4gYnl0ZXM7XG59XG5mdW5jdGlvbiBnZXRPdXRwdXRMZW5ndGgoaW5wdXRMZW5ndGg4KSB7XG4gICAgcmV0dXJuICgoKGlucHV0TGVuZ3RoOCArIDY0KSA+Pj4gOSkgPDwgNCkgKyAxNCArIDE7XG59XG5mdW5jdGlvbiB3b3Jkc1RvTWQ1KHgsIGxlbikge1xuICAgIGNvbnN0IHhwYWQgPSBuZXcgVWludDMyQXJyYXkoZ2V0T3V0cHV0TGVuZ3RoKGxlbikpLmZpbGwoMCk7XG4gICAgeHBhZC5zZXQoeCk7XG4gICAgeHBhZFtsZW4gPj4gNV0gfD0gMHg4MCA8PCBsZW4gJSAzMjtcbiAgICB4cGFkW3hwYWQubGVuZ3RoIC0gMV0gPSBsZW47XG4gICAgeCA9IHhwYWQ7XG4gICAgbGV0IGEgPSAxNzMyNTg0MTkzO1xuICAgIGxldCBiID0gLTI3MTczMzg3OTtcbiAgICBsZXQgYyA9IC0xNzMyNTg0MTk0O1xuICAgIGxldCBkID0gMjcxNzMzODc4O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkgKz0gMTYpIHtcbiAgICAgICAgY29uc3Qgb2xkYSA9IGE7XG4gICAgICAgIGNvbnN0IG9sZGIgPSBiO1xuICAgICAgICBjb25zdCBvbGRjID0gYztcbiAgICAgICAgY29uc3Qgb2xkZCA9IGQ7XG4gICAgICAgIGEgPSBtZDVmZihhLCBiLCBjLCBkLCB4W2ldLCA3LCAtNjgwODc2OTM2KTtcbiAgICAgICAgZCA9IG1kNWZmKGQsIGEsIGIsIGMsIHhbaSArIDFdLCAxMiwgLTM4OTU2NDU4Nik7XG4gICAgICAgIGMgPSBtZDVmZihjLCBkLCBhLCBiLCB4W2kgKyAyXSwgMTcsIDYwNjEwNTgxOSk7XG4gICAgICAgIGIgPSBtZDVmZihiLCBjLCBkLCBhLCB4W2kgKyAzXSwgMjIsIC0xMDQ0NTI1MzMwKTtcbiAgICAgICAgYSA9IG1kNWZmKGEsIGIsIGMsIGQsIHhbaSArIDRdLCA3LCAtMTc2NDE4ODk3KTtcbiAgICAgICAgZCA9IG1kNWZmKGQsIGEsIGIsIGMsIHhbaSArIDVdLCAxMiwgMTIwMDA4MDQyNik7XG4gICAgICAgIGMgPSBtZDVmZihjLCBkLCBhLCBiLCB4W2kgKyA2XSwgMTcsIC0xNDczMjMxMzQxKTtcbiAgICAgICAgYiA9IG1kNWZmKGIsIGMsIGQsIGEsIHhbaSArIDddLCAyMiwgLTQ1NzA1OTgzKTtcbiAgICAgICAgYSA9IG1kNWZmKGEsIGIsIGMsIGQsIHhbaSArIDhdLCA3LCAxNzcwMDM1NDE2KTtcbiAgICAgICAgZCA9IG1kNWZmKGQsIGEsIGIsIGMsIHhbaSArIDldLCAxMiwgLTE5NTg0MTQ0MTcpO1xuICAgICAgICBjID0gbWQ1ZmYoYywgZCwgYSwgYiwgeFtpICsgMTBdLCAxNywgLTQyMDYzKTtcbiAgICAgICAgYiA9IG1kNWZmKGIsIGMsIGQsIGEsIHhbaSArIDExXSwgMjIsIC0xOTkwNDA0MTYyKTtcbiAgICAgICAgYSA9IG1kNWZmKGEsIGIsIGMsIGQsIHhbaSArIDEyXSwgNywgMTgwNDYwMzY4Mik7XG4gICAgICAgIGQgPSBtZDVmZihkLCBhLCBiLCBjLCB4W2kgKyAxM10sIDEyLCAtNDAzNDExMDEpO1xuICAgICAgICBjID0gbWQ1ZmYoYywgZCwgYSwgYiwgeFtpICsgMTRdLCAxNywgLTE1MDIwMDIyOTApO1xuICAgICAgICBiID0gbWQ1ZmYoYiwgYywgZCwgYSwgeFtpICsgMTVdLCAyMiwgMTIzNjUzNTMyOSk7XG4gICAgICAgIGEgPSBtZDVnZyhhLCBiLCBjLCBkLCB4W2kgKyAxXSwgNSwgLTE2NTc5NjUxMCk7XG4gICAgICAgIGQgPSBtZDVnZyhkLCBhLCBiLCBjLCB4W2kgKyA2XSwgOSwgLTEwNjk1MDE2MzIpO1xuICAgICAgICBjID0gbWQ1Z2coYywgZCwgYSwgYiwgeFtpICsgMTFdLCAxNCwgNjQzNzE3NzEzKTtcbiAgICAgICAgYiA9IG1kNWdnKGIsIGMsIGQsIGEsIHhbaV0sIDIwLCAtMzczODk3MzAyKTtcbiAgICAgICAgYSA9IG1kNWdnKGEsIGIsIGMsIGQsIHhbaSArIDVdLCA1LCAtNzAxNTU4NjkxKTtcbiAgICAgICAgZCA9IG1kNWdnKGQsIGEsIGIsIGMsIHhbaSArIDEwXSwgOSwgMzgwMTYwODMpO1xuICAgICAgICBjID0gbWQ1Z2coYywgZCwgYSwgYiwgeFtpICsgMTVdLCAxNCwgLTY2MDQ3ODMzNSk7XG4gICAgICAgIGIgPSBtZDVnZyhiLCBjLCBkLCBhLCB4W2kgKyA0XSwgMjAsIC00MDU1Mzc4NDgpO1xuICAgICAgICBhID0gbWQ1Z2coYSwgYiwgYywgZCwgeFtpICsgOV0sIDUsIDU2ODQ0NjQzOCk7XG4gICAgICAgIGQgPSBtZDVnZyhkLCBhLCBiLCBjLCB4W2kgKyAxNF0sIDksIC0xMDE5ODAzNjkwKTtcbiAgICAgICAgYyA9IG1kNWdnKGMsIGQsIGEsIGIsIHhbaSArIDNdLCAxNCwgLTE4NzM2Mzk2MSk7XG4gICAgICAgIGIgPSBtZDVnZyhiLCBjLCBkLCBhLCB4W2kgKyA4XSwgMjAsIDExNjM1MzE1MDEpO1xuICAgICAgICBhID0gbWQ1Z2coYSwgYiwgYywgZCwgeFtpICsgMTNdLCA1LCAtMTQ0NDY4MTQ2Nyk7XG4gICAgICAgIGQgPSBtZDVnZyhkLCBhLCBiLCBjLCB4W2kgKyAyXSwgOSwgLTUxNDAzNzg0KTtcbiAgICAgICAgYyA9IG1kNWdnKGMsIGQsIGEsIGIsIHhbaSArIDddLCAxNCwgMTczNTMyODQ3Myk7XG4gICAgICAgIGIgPSBtZDVnZyhiLCBjLCBkLCBhLCB4W2kgKyAxMl0sIDIwLCAtMTkyNjYwNzczNCk7XG4gICAgICAgIGEgPSBtZDVoaChhLCBiLCBjLCBkLCB4W2kgKyA1XSwgNCwgLTM3ODU1OCk7XG4gICAgICAgIGQgPSBtZDVoaChkLCBhLCBiLCBjLCB4W2kgKyA4XSwgMTEsIC0yMDIyNTc0NDYzKTtcbiAgICAgICAgYyA9IG1kNWhoKGMsIGQsIGEsIGIsIHhbaSArIDExXSwgMTYsIDE4MzkwMzA1NjIpO1xuICAgICAgICBiID0gbWQ1aGgoYiwgYywgZCwgYSwgeFtpICsgMTRdLCAyMywgLTM1MzA5NTU2KTtcbiAgICAgICAgYSA9IG1kNWhoKGEsIGIsIGMsIGQsIHhbaSArIDFdLCA0LCAtMTUzMDk5MjA2MCk7XG4gICAgICAgIGQgPSBtZDVoaChkLCBhLCBiLCBjLCB4W2kgKyA0XSwgMTEsIDEyNzI4OTMzNTMpO1xuICAgICAgICBjID0gbWQ1aGgoYywgZCwgYSwgYiwgeFtpICsgN10sIDE2LCAtMTU1NDk3NjMyKTtcbiAgICAgICAgYiA9IG1kNWhoKGIsIGMsIGQsIGEsIHhbaSArIDEwXSwgMjMsIC0xMDk0NzMwNjQwKTtcbiAgICAgICAgYSA9IG1kNWhoKGEsIGIsIGMsIGQsIHhbaSArIDEzXSwgNCwgNjgxMjc5MTc0KTtcbiAgICAgICAgZCA9IG1kNWhoKGQsIGEsIGIsIGMsIHhbaV0sIDExLCAtMzU4NTM3MjIyKTtcbiAgICAgICAgYyA9IG1kNWhoKGMsIGQsIGEsIGIsIHhbaSArIDNdLCAxNiwgLTcyMjUyMTk3OSk7XG4gICAgICAgIGIgPSBtZDVoaChiLCBjLCBkLCBhLCB4W2kgKyA2XSwgMjMsIDc2MDI5MTg5KTtcbiAgICAgICAgYSA9IG1kNWhoKGEsIGIsIGMsIGQsIHhbaSArIDldLCA0LCAtNjQwMzY0NDg3KTtcbiAgICAgICAgZCA9IG1kNWhoKGQsIGEsIGIsIGMsIHhbaSArIDEyXSwgMTEsIC00MjE4MTU4MzUpO1xuICAgICAgICBjID0gbWQ1aGgoYywgZCwgYSwgYiwgeFtpICsgMTVdLCAxNiwgNTMwNzQyNTIwKTtcbiAgICAgICAgYiA9IG1kNWhoKGIsIGMsIGQsIGEsIHhbaSArIDJdLCAyMywgLTk5NTMzODY1MSk7XG4gICAgICAgIGEgPSBtZDVpaShhLCBiLCBjLCBkLCB4W2ldLCA2LCAtMTk4NjMwODQ0KTtcbiAgICAgICAgZCA9IG1kNWlpKGQsIGEsIGIsIGMsIHhbaSArIDddLCAxMCwgMTEyNjg5MTQxNSk7XG4gICAgICAgIGMgPSBtZDVpaShjLCBkLCBhLCBiLCB4W2kgKyAxNF0sIDE1LCAtMTQxNjM1NDkwNSk7XG4gICAgICAgIGIgPSBtZDVpaShiLCBjLCBkLCBhLCB4W2kgKyA1XSwgMjEsIC01NzQzNDA1NSk7XG4gICAgICAgIGEgPSBtZDVpaShhLCBiLCBjLCBkLCB4W2kgKyAxMl0sIDYsIDE3MDA0ODU1NzEpO1xuICAgICAgICBkID0gbWQ1aWkoZCwgYSwgYiwgYywgeFtpICsgM10sIDEwLCAtMTg5NDk4NjYwNik7XG4gICAgICAgIGMgPSBtZDVpaShjLCBkLCBhLCBiLCB4W2kgKyAxMF0sIDE1LCAtMTA1MTUyMyk7XG4gICAgICAgIGIgPSBtZDVpaShiLCBjLCBkLCBhLCB4W2kgKyAxXSwgMjEsIC0yMDU0OTIyNzk5KTtcbiAgICAgICAgYSA9IG1kNWlpKGEsIGIsIGMsIGQsIHhbaSArIDhdLCA2LCAxODczMzEzMzU5KTtcbiAgICAgICAgZCA9IG1kNWlpKGQsIGEsIGIsIGMsIHhbaSArIDE1XSwgMTAsIC0zMDYxMTc0NCk7XG4gICAgICAgIGMgPSBtZDVpaShjLCBkLCBhLCBiLCB4W2kgKyA2XSwgMTUsIC0xNTYwMTk4MzgwKTtcbiAgICAgICAgYiA9IG1kNWlpKGIsIGMsIGQsIGEsIHhbaSArIDEzXSwgMjEsIDEzMDkxNTE2NDkpO1xuICAgICAgICBhID0gbWQ1aWkoYSwgYiwgYywgZCwgeFtpICsgNF0sIDYsIC0xNDU1MjMwNzApO1xuICAgICAgICBkID0gbWQ1aWkoZCwgYSwgYiwgYywgeFtpICsgMTFdLCAxMCwgLTExMjAyMTAzNzkpO1xuICAgICAgICBjID0gbWQ1aWkoYywgZCwgYSwgYiwgeFtpICsgMl0sIDE1LCA3MTg3ODcyNTkpO1xuICAgICAgICBiID0gbWQ1aWkoYiwgYywgZCwgYSwgeFtpICsgOV0sIDIxLCAtMzQzNDg1NTUxKTtcbiAgICAgICAgYSA9IHNhZmVBZGQoYSwgb2xkYSk7XG4gICAgICAgIGIgPSBzYWZlQWRkKGIsIG9sZGIpO1xuICAgICAgICBjID0gc2FmZUFkZChjLCBvbGRjKTtcbiAgICAgICAgZCA9IHNhZmVBZGQoZCwgb2xkZCk7XG4gICAgfVxuICAgIHJldHVybiBVaW50MzJBcnJheS5vZihhLCBiLCBjLCBkKTtcbn1cbmZ1bmN0aW9uIHVpbnQ4VG9VaW50MzIoaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBuZXcgVWludDMyQXJyYXkoKTtcbiAgICB9XG4gICAgY29uc3Qgb3V0cHV0ID0gbmV3IFVpbnQzMkFycmF5KGdldE91dHB1dExlbmd0aChpbnB1dC5sZW5ndGggKiA4KSkuZmlsbCgwKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG91dHB1dFtpID4+IDJdIHw9IChpbnB1dFtpXSAmIDB4ZmYpIDw8ICgoaSAlIDQpICogOCk7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG59XG5mdW5jdGlvbiBzYWZlQWRkKHgsIHkpIHtcbiAgICBjb25zdCBsc3cgPSAoeCAmIDB4ZmZmZikgKyAoeSAmIDB4ZmZmZik7XG4gICAgY29uc3QgbXN3ID0gKHggPj4gMTYpICsgKHkgPj4gMTYpICsgKGxzdyA+PiAxNik7XG4gICAgcmV0dXJuIChtc3cgPDwgMTYpIHwgKGxzdyAmIDB4ZmZmZik7XG59XG5mdW5jdGlvbiBiaXRSb3RhdGVMZWZ0KG51bSwgY250KSB7XG4gICAgcmV0dXJuIChudW0gPDwgY250KSB8IChudW0gPj4+ICgzMiAtIGNudCkpO1xufVxuZnVuY3Rpb24gbWQ1Y21uKHEsIGEsIGIsIHgsIHMsIHQpIHtcbiAgICByZXR1cm4gc2FmZUFkZChiaXRSb3RhdGVMZWZ0KHNhZmVBZGQoc2FmZUFkZChhLCBxKSwgc2FmZUFkZCh4LCB0KSksIHMpLCBiKTtcbn1cbmZ1bmN0aW9uIG1kNWZmKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgICByZXR1cm4gbWQ1Y21uKChiICYgYykgfCAofmIgJiBkKSwgYSwgYiwgeCwgcywgdCk7XG59XG5mdW5jdGlvbiBtZDVnZyhhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XG4gICAgcmV0dXJuIG1kNWNtbigoYiAmIGQpIHwgKGMgJiB+ZCksIGEsIGIsIHgsIHMsIHQpO1xufVxuZnVuY3Rpb24gbWQ1aGgoYSwgYiwgYywgZCwgeCwgcywgdCkge1xuICAgIHJldHVybiBtZDVjbW4oYiBeIGMgXiBkLCBhLCBiLCB4LCBzLCB0KTtcbn1cbmZ1bmN0aW9uIG1kNWlpKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgICByZXR1cm4gbWQ1Y21uKGMgXiAoYiB8IH5kKSwgYSwgYiwgeCwgcywgdCk7XG59XG5leHBvcnRzLmRlZmF1bHQgPSBtZDU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHN0cmluZ2lmeV9qc18xID0gcmVxdWlyZShcIi4vc3RyaW5naWZ5LmpzXCIpO1xuY29uc3QgdjFfanNfMSA9IHJlcXVpcmUoXCIuL3YxLmpzXCIpO1xuY29uc3QgdjFUb1Y2X2pzXzEgPSByZXF1aXJlKFwiLi92MVRvVjYuanNcIik7XG5mdW5jdGlvbiB2NihvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICAgIG9wdGlvbnMgPz89IHt9O1xuICAgIG9mZnNldCA/Pz0gMDtcbiAgICBsZXQgYnl0ZXMgPSAoMCwgdjFfanNfMS5kZWZhdWx0KSh7IC4uLm9wdGlvbnMsIF92NjogdHJ1ZSB9LCBuZXcgVWludDhBcnJheSgxNikpO1xuICAgIGJ5dGVzID0gKDAsIHYxVG9WNl9qc18xLmRlZmF1bHQpKGJ5dGVzKTtcbiAgICBpZiAoYnVmKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7IGkrKykge1xuICAgICAgICAgICAgYnVmW29mZnNldCArIGldID0gYnl0ZXNbaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJ1ZjtcbiAgICB9XG4gICAgcmV0dXJuICgwLCBzdHJpbmdpZnlfanNfMS51bnNhZmVTdHJpbmdpZnkpKGJ5dGVzKTtcbn1cbmV4cG9ydHMuZGVmYXVsdCA9IHY2O1xuIiwiLyoqIFV0aWxpdHk6IGNhc2UtaW5zZW5zaXRpdmUgY2hlY2sgZm9yIHRoZSB3b3JkIFwicGFzc3dvcmRcIiB1c2luZyBvcHRpb25hbCBjaGFpbmluZyAqL1xuZXhwb3J0IGNvbnN0IGNvbnRhaW5zUGFzc3dvcmQgPSAodmFsPzogc3RyaW5nIHwgbnVsbCk6IGJvb2xlYW4gPT4ge1xuICB0cnkge1xuICAgIHJldHVybiAhIXZhbD8udG9Mb3dlckNhc2U/LigpLmluY2x1ZGVzPy4oJ3Bhc3N3b3JkJyk7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSBmaWVsZCBzaG91bGQgYmUgdHJlYXRlZCBhcyBwYXNzd29yZC1saWtlLlxuICogRXZhbHVhdGVzIGlucHV0LnR5cGUsIGlucHV0Lm5hbWUsIGlucHV0LmlkLCBpbnB1dC5wbGFjZWhvbGRlciBhbmQgb3B0aW9uYWwgbGFiZWwgdGV4dC5cbiAqL1xuZXhwb3J0IGNvbnN0IGlzUGFzc3dvcmRMaWtlRmllbGQgPSAoXG4gIGlucHV0OiBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50LFxuICBsYWJlbFRleHQ/OiBzdHJpbmcgfCBudWxsXG4pOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIChcbiAgICBjb250YWluc1Bhc3N3b3JkKChpbnB1dCBhcyBhbnkpPy50eXBlKSB8fFxuICAgIGNvbnRhaW5zUGFzc3dvcmQoKGlucHV0IGFzIGFueSk/Lm5hbWUpIHx8XG4gICAgY29udGFpbnNQYXNzd29yZCgoaW5wdXQgYXMgYW55KT8uaWQpIHx8XG4gICAgY29udGFpbnNQYXNzd29yZCgoaW5wdXQgYXMgYW55KT8ucGxhY2Vob2xkZXIpIHx8XG4gICAgY29udGFpbnNQYXNzd29yZChsYWJlbFRleHQpXG4gICk7XG59O1xuXG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudXBkYXRlVjFTdGF0ZSA9IHZvaWQgMDtcbmNvbnN0IHJuZ19qc18xID0gcmVxdWlyZShcIi4vcm5nLmpzXCIpO1xuY29uc3Qgc3RyaW5naWZ5X2pzXzEgPSByZXF1aXJlKFwiLi9zdHJpbmdpZnkuanNcIik7XG5jb25zdCBfc3RhdGUgPSB7fTtcbmZ1bmN0aW9uIHYxKG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gICAgbGV0IGJ5dGVzO1xuICAgIGNvbnN0IGlzVjYgPSBvcHRpb25zPy5fdjYgPz8gZmFsc2U7XG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uc0tleXMgPSBPYmplY3Qua2V5cyhvcHRpb25zKTtcbiAgICAgICAgaWYgKG9wdGlvbnNLZXlzLmxlbmd0aCA9PT0gMSAmJiBvcHRpb25zS2V5c1swXSA9PT0gJ192NicpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgYnl0ZXMgPSB2MUJ5dGVzKG9wdGlvbnMucmFuZG9tID8/IG9wdGlvbnMucm5nPy4oKSA/PyAoMCwgcm5nX2pzXzEuZGVmYXVsdCkoKSwgb3B0aW9ucy5tc2Vjcywgb3B0aW9ucy5uc2Vjcywgb3B0aW9ucy5jbG9ja3NlcSwgb3B0aW9ucy5ub2RlLCBidWYsIG9mZnNldCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICBjb25zdCBybmRzID0gKDAsIHJuZ19qc18xLmRlZmF1bHQpKCk7XG4gICAgICAgIHVwZGF0ZVYxU3RhdGUoX3N0YXRlLCBub3csIHJuZHMpO1xuICAgICAgICBieXRlcyA9IHYxQnl0ZXMocm5kcywgX3N0YXRlLm1zZWNzLCBfc3RhdGUubnNlY3MsIGlzVjYgPyB1bmRlZmluZWQgOiBfc3RhdGUuY2xvY2tzZXEsIGlzVjYgPyB1bmRlZmluZWQgOiBfc3RhdGUubm9kZSwgYnVmLCBvZmZzZXQpO1xuICAgIH1cbiAgICByZXR1cm4gYnVmID8/ICgwLCBzdHJpbmdpZnlfanNfMS51bnNhZmVTdHJpbmdpZnkpKGJ5dGVzKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZVYxU3RhdGUoc3RhdGUsIG5vdywgcm5kcykge1xuICAgIHN0YXRlLm1zZWNzID8/PSAtSW5maW5pdHk7XG4gICAgc3RhdGUubnNlY3MgPz89IDA7XG4gICAgaWYgKG5vdyA9PT0gc3RhdGUubXNlY3MpIHtcbiAgICAgICAgc3RhdGUubnNlY3MrKztcbiAgICAgICAgaWYgKHN0YXRlLm5zZWNzID49IDEwMDAwKSB7XG4gICAgICAgICAgICBzdGF0ZS5ub2RlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgc3RhdGUubnNlY3MgPSAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKG5vdyA+IHN0YXRlLm1zZWNzKSB7XG4gICAgICAgIHN0YXRlLm5zZWNzID0gMDtcbiAgICB9XG4gICAgZWxzZSBpZiAobm93IDwgc3RhdGUubXNlY3MpIHtcbiAgICAgICAgc3RhdGUubm9kZSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKCFzdGF0ZS5ub2RlKSB7XG4gICAgICAgIHN0YXRlLm5vZGUgPSBybmRzLnNsaWNlKDEwLCAxNik7XG4gICAgICAgIHN0YXRlLm5vZGVbMF0gfD0gMHgwMTtcbiAgICAgICAgc3RhdGUuY2xvY2tzZXEgPSAoKHJuZHNbOF0gPDwgOCkgfCBybmRzWzldKSAmIDB4M2ZmZjtcbiAgICB9XG4gICAgc3RhdGUubXNlY3MgPSBub3c7XG4gICAgcmV0dXJuIHN0YXRlO1xufVxuZXhwb3J0cy51cGRhdGVWMVN0YXRlID0gdXBkYXRlVjFTdGF0ZTtcbmZ1bmN0aW9uIHYxQnl0ZXMocm5kcywgbXNlY3MsIG5zZWNzLCBjbG9ja3NlcSwgbm9kZSwgYnVmLCBvZmZzZXQgPSAwKSB7XG4gICAgaWYgKHJuZHMubGVuZ3RoIDwgMTYpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSYW5kb20gYnl0ZXMgbGVuZ3RoIG11c3QgYmUgPj0gMTYnKTtcbiAgICB9XG4gICAgaWYgKCFidWYpIHtcbiAgICAgICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuICAgICAgICBvZmZzZXQgPSAwO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKG9mZnNldCA8IDAgfHwgb2Zmc2V0ICsgMTYgPiBidWYubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihgVVVJRCBieXRlIHJhbmdlICR7b2Zmc2V0fToke29mZnNldCArIDE1fSBpcyBvdXQgb2YgYnVmZmVyIGJvdW5kc2ApO1xuICAgICAgICB9XG4gICAgfVxuICAgIG1zZWNzID8/PSBEYXRlLm5vdygpO1xuICAgIG5zZWNzID8/PSAwO1xuICAgIGNsb2Nrc2VxID8/PSAoKHJuZHNbOF0gPDwgOCkgfCBybmRzWzldKSAmIDB4M2ZmZjtcbiAgICBub2RlID8/PSBybmRzLnNsaWNlKDEwLCAxNik7XG4gICAgbXNlY3MgKz0gMTIyMTkyOTI4MDAwMDA7XG4gICAgY29uc3QgdGwgPSAoKG1zZWNzICYgMHhmZmZmZmZmKSAqIDEwMDAwICsgbnNlY3MpICUgMHgxMDAwMDAwMDA7XG4gICAgYnVmW29mZnNldCsrXSA9ICh0bCA+Pj4gMjQpICYgMHhmZjtcbiAgICBidWZbb2Zmc2V0KytdID0gKHRsID4+PiAxNikgJiAweGZmO1xuICAgIGJ1ZltvZmZzZXQrK10gPSAodGwgPj4+IDgpICYgMHhmZjtcbiAgICBidWZbb2Zmc2V0KytdID0gdGwgJiAweGZmO1xuICAgIGNvbnN0IHRtaCA9ICgobXNlY3MgLyAweDEwMDAwMDAwMCkgKiAxMDAwMCkgJiAweGZmZmZmZmY7XG4gICAgYnVmW29mZnNldCsrXSA9ICh0bWggPj4+IDgpICYgMHhmZjtcbiAgICBidWZbb2Zmc2V0KytdID0gdG1oICYgMHhmZjtcbiAgICBidWZbb2Zmc2V0KytdID0gKCh0bWggPj4+IDI0KSAmIDB4ZikgfCAweDEwO1xuICAgIGJ1ZltvZmZzZXQrK10gPSAodG1oID4+PiAxNikgJiAweGZmO1xuICAgIGJ1ZltvZmZzZXQrK10gPSAoY2xvY2tzZXEgPj4+IDgpIHwgMHg4MDtcbiAgICBidWZbb2Zmc2V0KytdID0gY2xvY2tzZXEgJiAweGZmO1xuICAgIGZvciAobGV0IG4gPSAwOyBuIDwgNjsgKytuKSB7XG4gICAgICAgIGJ1ZltvZmZzZXQrK10gPSBub2RlW25dO1xuICAgIH1cbiAgICByZXR1cm4gYnVmO1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gdjE7XG4iLCJpbXBvcnQge1xuICBUcmFja2luZ0lkUmVzcG9uc2UsXG4gIFRyYWNraW5nRXZlbnQsXG4gIEZvcm1TdWJtaXNzaW9uRXZlbnQsXG4gIEV2ZW50VHlwZSxcbn0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQge1xuICBsb2dnZXIsXG4gIGdldFNlc3Npb25JZEZyb21Db29raWUsXG4gIGdldFVzZXJEYXRhLFxuICBnZXRGb3JtYXR0ZWRUaW1lem9uZSxcbiAgZ2V0RGV2aWNlVHlwZSxcbn0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbXBvcnQgeyBFdmVudFF1ZXVlLCBRdWV1ZUNvbmZpZyB9IGZyb20gXCIuLi9jb3JlL3F1ZXVlLXN5c3RlbVwiO1xuaW1wb3J0IHsgQVBJX0VORFBPSU5UUywgU0NSSVBUX0JBU0VOQU1FIH0gZnJvbSBcIi4uL2NvbmZpZy9jb21tb25cIjtcblxuLy8gQm90IHByZXZlbnRpb24gY29uc3RhbnRzXG5jb25zdCBSQVRFX0xJTUlUX0VWRU5UU19QRVJfU0VDT05EID0gNTtcblxuLyoqXG4gKiBBUEkgQ2xpZW50IGZvciBleHRlcm5hbCB0cmFja2luZ1xuICovXG5leHBvcnQgY2xhc3MgQXBpQ2xpZW50IHtcbiAgcHJpdmF0ZSBhcGlFbmRwb2ludDogc3RyaW5nO1xuICBwcml2YXRlIHRyYWNraW5nSWQ6IHN0cmluZztcbiAgcHJpdmF0ZSBsb2NhdGlvbklkPzogc3RyaW5nO1xuICBwcml2YXRlIHNlc3Npb25JZD86IHN0cmluZztcbiAgcHJpdmF0ZSBldmVudFF1ZXVlOiBFdmVudFF1ZXVlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHRyYWNraW5nSWQ6IHN0cmluZyxcbiAgICBhcGlFbmRwb2ludD86IHN0cmluZ1xuICApIHtcbiAgICB0aGlzLnRyYWNraW5nSWQgPSB0cmFja2luZ0lkO1xuICAgIHRoaXMuYXBpRW5kcG9pbnQgPSBhcGlFbmRwb2ludCB8fCB0aGlzLmRldGVybWluZUFwaUVuZHBvaW50KCk7XG4gICAgXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgZXZlbnQgcXVldWUgd2l0aCBib3QgcHJldmVudGlvblxuICAgIGNvbnN0IHF1ZXVlQ29uZmlnOiBRdWV1ZUNvbmZpZyA9IHtcbiAgICAgIG1heEV2ZW50c1BlclNlY29uZDogUkFURV9MSU1JVF9FVkVOVFNfUEVSX1NFQ09ORCxcbiAgICAgIG1heFJldHJpZXM6IDMsXG4gICAgICByZXRyeURlbGF5TXM6IDEwMDAsXG4gICAgICBtYXhRdWV1ZVNpemU6IDEwMCxcbiAgICB9O1xuICAgIFxuICAgIHRoaXMuZXZlbnRRdWV1ZSA9IG5ldyBFdmVudFF1ZXVlKHF1ZXVlQ29uZmlnKTtcbiAgICBcbiAgICAvLyBTZXQgdXAgdGhlIHF1ZXVlIHNlbmRlciB0byB1c2UgdGhlIGFjdHVhbCBBUEkgc2VuZGluZyBsb2dpY1xuICAgIHRoaXMuZXZlbnRRdWV1ZS5zZXRTZW5kZXIoYXN5bmMgKHBheWxvYWQ6IGFueSkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zZW5kRXZlbnREaXJlY3RseShwYXlsb2FkKTtcbiAgICB9KTtcbiAgICBcbiAgICBsb2dnZXIubG9nKCdBcGlDbGllbnQgaW5pdGlhbGl6ZWQgd2l0aCByYXRlIGxpbWl0OicsIHF1ZXVlQ29uZmlnLm1heEV2ZW50c1BlclNlY29uZCwgJ2V2ZW50cyBwZXIgc2Vjb25kJyk7XG4gIH1cblxuICBcblxuICAvKipcbiAgICogRGV0ZXJtaW5lIEFQSSBlbmRwb2ludCBiYXNlZCBvbiBzY3JpcHQgc291cmNlIFVSTFxuICAgKi9cbiAgcHJpdmF0ZSBkZXRlcm1pbmVBcGlFbmRwb2ludCgpOiBzdHJpbmcge1xuICAgIHRyeSB7XG4gICAgICAvLyBGaW5kIHRoZSBjdXJyZW50IHNjcmlwdCB0YWcgdGhhdCBsb2FkZWQgdGhpcyB0cmFja2luZyBzY3JpcHRcbiAgICAgIGNvbnN0IGN1cnJlbnRTY3JpcHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzY3JpcHRbc3JjKj1cIiR7U0NSSVBUX0JBU0VOQU1FfVwiXWApIGFzIEhUTUxTY3JpcHRFbGVtZW50O1xuICAgICAgXG4gICAgICBpZiAoY3VycmVudFNjcmlwdD8uc3JjKSB7XG4gICAgICAgIGNvbnN0IHNjcmlwdFNyYyA9IGN1cnJlbnRTY3JpcHQuc3JjO1xuICAgICAgICBsb2dnZXIuYXBpKCdTY3JpcHQgc291cmNlIGRldGVjdGVkOicsIHNjcmlwdFNyYyk7XG4gICAgICAgIFxuICAgICAgICAvLyBDaGVjayBmb3Igc3RhZ2luZyBlbnZpcm9ubWVudFxuICAgICAgICBpZiAoc2NyaXB0U3JjLmluY2x1ZGVzKCdzdGFnaW5nJykpIHtcbiAgICAgICAgICBsb2dnZXIuYXBpKCdTdGFnaW5nIGVudmlyb25tZW50IGRldGVjdGVkLCB1c2luZyBzdGFnaW5nIEFQSSBlbmRwb2ludCcpO1xuICAgICAgICAgIHJldHVybiBBUElfRU5EUE9JTlRTLnN0YWdpbmc7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIENoZWNrIGZvciBsb2NhbGhvc3QgZW52aXJvbm1lbnRcbiAgICAgICAgaWYgKHNjcmlwdFNyYy5pbmNsdWRlcygnbG9jYWxob3N0JykpIHtcbiAgICAgICAgICBsb2dnZXIuYXBpKCdMb2NhbGhvc3QgZW52aXJvbm1lbnQgZGV0ZWN0ZWQsIHVzaW5nIGxvY2FsaG9zdCBBUEkgZW5kcG9pbnQnKTtcbiAgICAgICAgICByZXR1cm4gQVBJX0VORFBPSU5UUy5sb2NhbDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gRGVmYXVsdCB0byBwcm9kdWN0aW9uXG4gICAgICAgIGxvZ2dlci5hcGkoJ1Byb2R1Y3Rpb24gZW52aXJvbm1lbnQgZGV0ZWN0ZWQsIHVzaW5nIHByb2R1Y3Rpb24gQVBJIGVuZHBvaW50Jyk7XG4gICAgICAgIHJldHVybiBBUElfRU5EUE9JTlRTLnByb2R1Y3Rpb247XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2dnZXIuYXBpKCdObyBzY3JpcHQgdGFnIGZvdW5kLCBkZWZhdWx0aW5nIHRvIHByb2R1Y3Rpb24gQVBJIGVuZHBvaW50Jyk7XG4gICAgICAgIHJldHVybiBBUElfRU5EUE9JTlRTLnByb2R1Y3Rpb247XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgZGV0ZXJtaW5pbmcgQVBJIGVuZHBvaW50OicsIGVycm9yKTtcbiAgICAgIC8vIEZhbGxiYWNrIHRvIHByb2R1Y3Rpb24gaWYgZGV0ZWN0aW9uIGZhaWxzXG4gICAgICBsb2dnZXIuYXBpKCdGYWxsaW5nIGJhY2sgdG8gcHJvZHVjdGlvbiBBUEkgZW5kcG9pbnQgZHVlIHRvIGVycm9yJyk7XG4gICAgICByZXR1cm4gQVBJX0VORFBPSU5UUy5wcm9kdWN0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdHJhY2tpbmcgY29udGV4dCBmcm9tIHRyYWNrZXIgc3RhdGVcbiAgICovXG4gIHNldFRyYWNraW5nQ29udGV4dChzZXNzaW9uSWQ6IHN0cmluZywgbG9jYXRpb25JZDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zZXNzaW9uSWQgPSBzZXNzaW9uSWQ7XG4gICAgdGhpcy5sb2NhdGlvbklkID0gbG9jYXRpb25JZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGZXRjaCBsb2NhdGlvbiBJRCBmcm9tIHRyYWNraW5nIElEXG4gICAqL1xuICBhc3luYyBmZXRjaExvY2F0aW9uSWQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcbiAgICAgICAgYCR7dGhpcy5hcGlFbmRwb2ludH0vZXh0ZXJuYWwtdHJhY2tpbmcvdHJhY2tpbmcvJHt0aGlzLnRyYWNraW5nSWR9YFxuICAgICAgKTtcblxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBmZXRjaCBsb2NhdGlvbiBJRDogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBkYXRhOiBUcmFja2luZ0lkUmVzcG9uc2UgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICB0aGlzLmxvY2F0aW9uSWQgPSBkYXRhLmxvY2F0aW9uSWQ7XG4gICAgICBsb2dnZXIuYXBpKFwiTG9jYXRpb24gSUQgZmV0Y2hlZDpcIiwgdGhpcy5sb2NhdGlvbklkKTtcbiAgICAgIHJldHVybiB0aGlzLmxvY2F0aW9uSWQ7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihcIkVycm9yIGZldGNoaW5nIGxvY2F0aW9uIElEOlwiLCBlcnJvcik7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VuZCB0cmFja2luZyBldmVudCB0byBiYWNrZW5kIChxdWV1ZWQgd2l0aCByYXRlIGxpbWl0aW5nKVxuICAgKi9cbiAgYXN5bmMgc2VuZEV2ZW50KGV2ZW50OiBUcmFja2luZ0V2ZW50KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLmxvY2F0aW9uSWQpIHtcbiAgICAgIGF3YWl0IHRoaXMuZmV0Y2hMb2NhdGlvbklkKCk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIEVuc3VyZSBkZXZpY2UgdHlwZSBpcyBjYXB0dXJlZCBjb25zaXN0ZW50bHkgZm9yIGFsbCBldmVudHMuXG4gICAgICBldmVudC5wcm9wZXJ0aWVzID0ge1xuICAgICAgICAuLi5ldmVudC5wcm9wZXJ0aWVzLFxuICAgICAgICBkZXZpY2VUeXBlOiBldmVudD8ucHJvcGVydGllcz8uZGV2aWNlVHlwZSB8fCBnZXREZXZpY2VUeXBlKCksXG4gICAgICB9O1xuXG4gICAgICAvLyBVc2Ugc2Vzc2lvbklkIGZyb20gdHJhY2tlciBzdGF0ZSwgZmFsbGJhY2sgdG8gY29va2llXG4gICAgICBjb25zdCBzZXNzaW9uSWQgPVxuICAgICAgICB0aGlzLnNlc3Npb25JZCB8fCBnZXRTZXNzaW9uSWRGcm9tQ29va2llKHRoaXMubG9jYXRpb25JZCB8fCBcIlwiKTtcbiAgICAgIGNvbnN0IHVzZXJEYXRhID0gZ2V0VXNlckRhdGEoKTtcblxuICAgICAgbGV0IGVuaGFuY2VkRXZlbnQ6IFRyYWNraW5nRXZlbnQgPSB7IC4uLmV2ZW50IH07XG5cbiAgICAgIC8vIEZvciBmb3JtIHN1Ym1pc3Npb25zLCBlbmhhbmNlIHdpdGggdGltZXpvbmVcbiAgICAgIGlmIChldmVudC50eXBlID09PSBFdmVudFR5cGUuRk9STV9TVUJNSVNTSU9OICYmIFwiZm9ybURhdGFcIiBpbiBldmVudCkge1xuICAgICAgICBjb25zdCBmb3JtRXZlbnQgPSBldmVudCBhcyBGb3JtU3VibWlzc2lvbkV2ZW50O1xuXG4gICAgICAgIC8vIEFkZCB0aW1lem9uZSB0byBmb3JtIGRhdGFcbiAgICAgICAgY29uc3QgZW5oYW5jZWRGb3JtRXZlbnQ6IEZvcm1TdWJtaXNzaW9uRXZlbnQgPSB7XG4gICAgICAgICAgLi4uZm9ybUV2ZW50LFxuICAgICAgICAgIGZvcm1EYXRhOiB7XG4gICAgICAgICAgICAuLi5mb3JtRXZlbnQuZm9ybURhdGEsXG4gICAgICAgICAgICBUaW1lem9uZTogZ2V0Rm9ybWF0dGVkVGltZXpvbmUoKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuXG4gICAgICAgIGVuaGFuY2VkRXZlbnQgPSBlbmhhbmNlZEZvcm1FdmVudDtcblxuICAgICAgICBsb2dnZXIuYXBpKFwiRW5oYW5jZWQgZm9ybSBkYXRhIHdpdGggdGltZXpvbmU6XCIsIHtcbiAgICAgICAgICB0aW1lem9uZTogZW5oYW5jZWRGb3JtRXZlbnQuZm9ybURhdGEuVGltZXpvbmUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICAuLi5lbmhhbmNlZEV2ZW50LFxuICAgICAgICB0cmFja2luZ0lkOiB0aGlzLnRyYWNraW5nSWQsXG4gICAgICAgIGxvY2F0aW9uSWQ6IHRoaXMubG9jYXRpb25JZCxcbiAgICAgICAgc2Vzc2lvbklkLCAvLyBVVUlEIGZvciBzZXNzaW9uIHRyYWNraW5nXG4gICAgICAgIGNvbnRhY3RJZDogdXNlckRhdGE/LmNvbnRhY3RJZCwgLy8gSWYgYXZhaWxhYmxlIGZyb20gc3RvcmVkIHVzZXIgZGF0YVxuICAgICAgICB1c2VySWQ6IHVzZXJEYXRhPy51c2VySWQsIC8vIElmIGF2YWlsYWJsZVxuICAgICAgfTtcblxuICAgICAgbG9nZ2VyLmFwaShcIlF1ZXVlaW5nIGV2ZW50IHBheWxvYWQ6XCIsIHtcbiAgICAgICAgdHlwZTogZW5oYW5jZWRFdmVudC50eXBlLFxuICAgICAgICBzZXNzaW9uSWQsIFxuICAgICAgICB0cmFja2luZ0lkOiB0aGlzLnRyYWNraW5nSWQsXG4gICAgICB9KTtcblxuICAgICAgLy8gQWRkIGV2ZW50IHRvIHF1ZXVlIGZvciByYXRlLWxpbWl0ZWQgcHJvY2Vzc2luZ1xuICAgICAgYXdhaXQgdGhpcy5ldmVudFF1ZXVlLmVucXVldWUocGF5bG9hZCk7XG4gICAgICBcbiAgICAgIGxvZ2dlci5hcGkoXCJFdmVudCBxdWV1ZWQgc3VjY2Vzc2Z1bGx5OlwiLCBlbmhhbmNlZEV2ZW50LnR5cGUpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoXCJFcnJvciBxdWV1ZWluZyBldmVudDpcIiwgZXJyb3IpO1xuICAgICAgLy8gRG9uJ3QgdGhyb3cgLSB3ZSBkb24ndCB3YW50IHRyYWNraW5nIGVycm9ycyB0byBicmVhayB0aGUgdXNlcidzIHNpdGVcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VuZCB0cmFja2luZyBldmVudCBkaXJlY3RseSB0byBiYWNrZW5kIChieXBhc3NpbmcgcXVldWUpXG4gICAqIFRoaXMgaXMgdXNlZCBpbnRlcm5hbGx5IGJ5IHRoZSBxdWV1ZSBzeXN0ZW1cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgc2VuZEV2ZW50RGlyZWN0bHkocGF5bG9hZDogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgJHt0aGlzLmFwaUVuZHBvaW50fS9leHRlcm5hbC10cmFja2luZy9ldmVudHNgO1xuXG4gICAgLy8gSWYgcGF5bG9hZCBjb250YWlucyBmaWxlIHVwbG9hZHMgKGZyb20gZm9ybSBzdWJtaXNzaW9ucyksIHNlbmQgYXMgbXVsdGlwYXJ0L2Zvcm0tZGF0YVxuICAgIGlmIChwYXlsb2FkICYmIHBheWxvYWQuZmlsZXMgJiYgdHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgY29uc3QgeyBmaWxlcywgLi4uZXZlbnRXaXRob3V0RmlsZXMgfSA9IHBheWxvYWQ7XG5cbiAgICAgICAgLy8gU2VyaWFsaXplIHRoZSBldmVudCAod2l0aG91dCBmaWxlcykgYXMgSlNPTlxuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ2V2ZW50JywgSlNPTi5zdHJpbmdpZnkoZXZlbnRXaXRob3V0RmlsZXMpKTtcblxuICAgICAgICAvLyBBcHBlbmQgZWFjaCBmaWxlIHVuZGVyIGl0cyBjb3JyZXNwb25kaW5nIGZpZWxkIG5hbWVcbiAgICAgICAgT2JqZWN0LmtleXMoZmlsZXMgYXMgUmVjb3JkPHN0cmluZywgYW55PikuZm9yRWFjaCgoZmllbGROYW1lKSA9PiB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSAoZmlsZXMgYXMgUmVjb3JkPHN0cmluZywgYW55PilbZmllbGROYW1lXTtcbiAgICAgICAgICBjb25zdCBsaXN0OiBGaWxlW10gPSBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogW3ZhbHVlXTtcbiAgICAgICAgICBsaXN0LmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgRmlsZSkge1xuICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChmaWVsZE5hbWUsIGZpbGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgICAgLy8gSWdub3JlIG5vbi1GaWxlIGVudHJpZXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChlbmRwb2ludCwge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gc2VuZCBldmVudDogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICAgICAgICB9XG5cbiAgICAgICAgbG9nZ2VyLmFwaSgnRXZlbnQgc2VudCBzdWNjZXNzZnVsbHkgKG11bHRpcGFydCk6JywgcGF5bG9hZC50eXBlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBzZW5kaW5nIG11bHRpcGFydCBldmVudCwgZmFsbGluZyBiYWNrIHRvIEpTT046JywgZXJyb3IpO1xuICAgICAgICAvLyBGYWxsIHRocm91Z2ggdG8gSlNPTiBwYXRoIGJlbG93XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRGVmYXVsdCBKU09OIHBhdGggKHBhZ2Ugdmlld3MsIG5vbi1maWxlIGV2ZW50cywgb3IgbXVsdGlwYXJ0IGZhbGxiYWNrKVxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goZW5kcG9pbnQsIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBheWxvYWQpLFxuICAgIH0pO1xuXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gc2VuZCBldmVudDogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICAgIH1cblxuICAgIGxvZ2dlci5hcGkoXCJFdmVudCBzZW50IHN1Y2Nlc3NmdWxseTpcIiwgcGF5bG9hZC50eXBlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJtaXQgZm9ybSBkYXRhXG4gICAqIFNlbmRzIGZvcm0gc3VibWlzc2lvbiBldmVudHMgd2l0aCBlbmhhbmNlZCBkYXRhXG4gICAqL1xuICBhc3luYyBzdWJtaXRGb3JtKGV2ZW50OiBGb3JtU3VibWlzc2lvbkV2ZW50KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLmxvY2F0aW9uSWQpIHtcbiAgICAgIGF3YWl0IHRoaXMuZmV0Y2hMb2NhdGlvbklkKCk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGxvZ2dlci5hcGkoXCJGb3JtIHN1Ym1pc3Npb246XCIsIGV2ZW50LmZvcm1EYXRhKTtcbiAgICAgIFxuICAgICAgLy8gU2VuZCBmb3JtIGRhdGEgYXMgYSB0cmFja2luZyBldmVudFxuICAgICAgYXdhaXQgdGhpcy5zZW5kRXZlbnQoZXZlbnQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoXCJFcnJvciBzdWJtaXR0aW5nIGZvcm06XCIsIGVycm9yKTtcbiAgICB9XG4gIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gJzAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCc7XG4iLCJpbXBvcnQgeyBUcmFja2luZ0NvbmZpZyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IEdMT0JBTF9UUkFDS0lOR19LRVksIFNDUklQVF9CQVNFTkFNRSB9IGZyb20gJy4vY29tbW9uJztcblxuLyoqXG4gKiBSZWFkcyBjb25maWd1cmF0aW9uIGZyb20gc2NyaXB0IHRhZyBhdHRyaWJ1dGVzXG4gKiBcbiAqIEByZXR1cm5zIFRyYWNraW5nQ29uZmlnIGlmIHZhbGlkIGF0dHJpYnV0ZXMgZm91bmQsIG51bGwgb3RoZXJ3aXNlXG4gKiBcbiAqIExvZ2ljIGZsb3c6XG4gKiAxLiBGaW5kIHRoZSBjdXJyZW50IHNjcmlwdCB0YWcgdXNpbmcgZG9jdW1lbnQuY3VycmVudFNjcmlwdCBvciBzZWxlY3RvclxuICogMi4gRXh0cmFjdCBkYXRhIGF0dHJpYnV0ZXMgZnJvbSB0aGUgc2NyaXB0IHRhZ1xuICogMy4gVmFsaWRhdGUgcmVxdWlyZWQgdHJhY2tpbmdJZCBhdHRyaWJ1dGVcbiAqIDQuIFBhcnNlIG9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gYXR0cmlidXRlc1xuICogNS4gUmV0dXJuIGNvbXBsZXRlIGNvbmZpZ3VyYXRpb24gb2JqZWN0XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRDb25maWdGcm9tU2NyaXB0QXR0cmlidXRlcyA9ICgpOiBUcmFja2luZ0NvbmZpZyB8IG51bGwgPT4ge1xuICB0cnkge1xuICAgIC8vIEZpbmQgdGhlIGN1cnJlbnQgc2NyaXB0IHRhZ1xuICAgIGNvbnN0IGN1cnJlbnRTY3JpcHQgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0IHx8IFxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihgc2NyaXB0W3NyYyo9XCIke1NDUklQVF9CQVNFTkFNRX1cIl1gKTtcbiAgICBcbiAgICBpZiAoIWN1cnJlbnRTY3JpcHQpIHtcbiAgICAgIGxvZ2dlci53YXJuKCdDb3VsZCBub3QgZmluZCBzY3JpcHQgdGFnIGZvciBjb25maWd1cmF0aW9uJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBFbmFibGUgZGVidWcgbW9kZSBlYXJseSBpZiBzcGVjaWZpZWQsIHNvIHdlIGNhbiBzZWUgdmFsaWRhdGlvbiBlcnJvcnNcbiAgICBjb25zdCBkZWJ1ZyA9IGN1cnJlbnRTY3JpcHQuZ2V0QXR0cmlidXRlKCdkYXRhLWRlYnVnJyk7XG4gICAgaWYgKGRlYnVnID09PSAndHJ1ZScpIHtcbiAgICAgIGNvbnN0IHcgPSB3aW5kb3cgYXMgYW55O1xuICAgICAgd1tHTE9CQUxfVFJBQ0tJTkdfS0VZXSA9IHdbR0xPQkFMX1RSQUNLSU5HX0tFWV0gfHwge307XG4gICAgICB3W0dMT0JBTF9UUkFDS0lOR19LRVldLmRlYnVnID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBSZWFkIHJlcXVpcmVkIGRhdGEgYXR0cmlidXRlc1xuICAgIGNvbnN0IHRyYWNraW5nSWQgPSBjdXJyZW50U2NyaXB0LmdldEF0dHJpYnV0ZSgnZGF0YS10cmFja2luZy1pZCcpO1xuICAgIFxuICAgIGlmICghdHJhY2tpbmdJZCkge1xuICAgICAgbG9nZ2VyLmNyaXRpY2FsKCdSZXF1aXJlZCBkYXRhLXRyYWNraW5nLWlkIGF0dHJpYnV0ZSBub3QgZm91bmQnKTtcbiAgICAgIGxvZ2dlci5jcml0aWNhbCgnUGxlYXNlIGFkZCBkYXRhLXRyYWNraW5nLWlkPVwieW91ci10cmFja2luZy1pZFwiIHRvIHRoZSBzY3JpcHQgdGFnJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBjb25maWc6IFRyYWNraW5nQ29uZmlnID0ge1xuICAgICAgdHJhY2tpbmdJZCxcbiAgICB9O1xuXG4gICAgLy8gQWRkIGRlYnVnIHRvIGNvbmZpZyBpZiBlbmFibGVkXG4gICAgaWYgKGRlYnVnID09PSAndHJ1ZScpIHtcbiAgICAgIGNvbmZpZy5kZWJ1ZyA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gUGFyc2Ugb3B0aW9uYWwgQVBJIGVuZHBvaW50IGF0dHJpYnV0ZVxuICAgIGNvbnN0IGFwaUVuZHBvaW50ID0gY3VycmVudFNjcmlwdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXBpLWVuZHBvaW50Jyk7XG4gICAgaWYgKGFwaUVuZHBvaW50KSB7XG4gICAgICBjb25maWcuYXBpRW5kcG9pbnQgPSBhcGlFbmRwb2ludDtcbiAgICB9XG5cbiAgICBsb2dnZXIubG9nKCdDb25maWd1cmF0aW9uIGxvYWRlZCBmcm9tIHNjcmlwdCBhdHRyaWJ1dGVzOicsIGNvbmZpZyk7XG4gICAgcmV0dXJuIGNvbmZpZztcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2dnZXIuY3JpdGljYWwoJ0Vycm9yIHJlYWRpbmcgc2NyaXB0IGF0dHJpYnV0ZXM6JywgZXJyb3IpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59O1xuXG4vKipcbiAqIFZhbGlkYXRlcyBhIHRyYWNraW5nIGNvbmZpZ3VyYXRpb24gb2JqZWN0XG4gKiBcbiAqIEBwYXJhbSBjb25maWcgLSBDb25maWd1cmF0aW9uIG9iamVjdCB0byB2YWxpZGF0ZVxuICogQHJldHVybnMgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIGNvbmZpZ3VyYXRpb24gaXMgdmFsaWRcbiAqL1xuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQ29uZmlnID0gKGNvbmZpZzogVHJhY2tpbmdDb25maWcpOiBib29sZWFuID0+IHtcbiAgaWYgKCFjb25maWcgfHwgdHlwZW9mIGNvbmZpZyAhPT0gJ29iamVjdCcpIHtcbiAgICBsb2dnZXIuY3JpdGljYWwoJ0ludmFsaWQgY29uZmlndXJhdGlvbjogbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIWNvbmZpZy50cmFja2luZ0lkIHx8IHR5cGVvZiBjb25maWcudHJhY2tpbmdJZCAhPT0gJ3N0cmluZycpIHtcbiAgICBsb2dnZXIuY3JpdGljYWwoJ0ludmFsaWQgY29uZmlndXJhdGlvbjogdHJhY2tpbmdJZCBtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZycpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChjb25maWcuYXBpRW5kcG9pbnQgJiYgdHlwZW9mIGNvbmZpZy5hcGlFbmRwb2ludCAhPT0gJ3N0cmluZycpIHtcbiAgICBsb2dnZXIuY3JpdGljYWwoJ0ludmFsaWQgY29uZmlndXJhdGlvbjogYXBpRW5kcG9pbnQgbXVzdCBiZSBhIHN0cmluZycpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChjb25maWcuZGVidWcgJiYgdHlwZW9mIGNvbmZpZy5kZWJ1ZyAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgbG9nZ2VyLmNyaXRpY2FsKCdJbnZhbGlkIGNvbmZpZ3VyYXRpb246IGRlYnVnIG11c3QgYmUgYSBib29sZWFuJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59OyAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuVVJMID0gZXhwb3J0cy5ETlMgPSB2b2lkIDA7XG5jb25zdCBzaGExX2pzXzEgPSByZXF1aXJlKFwiLi9zaGExLmpzXCIpO1xuY29uc3QgdjM1X2pzXzEgPSByZXF1aXJlKFwiLi92MzUuanNcIik7XG52YXIgdjM1X2pzXzIgPSByZXF1aXJlKFwiLi92MzUuanNcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJETlNcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHYzNV9qc18yLkROUzsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlVSTFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdjM1X2pzXzIuVVJMOyB9IH0pO1xuZnVuY3Rpb24gdjUodmFsdWUsIG5hbWVzcGFjZSwgYnVmLCBvZmZzZXQpIHtcbiAgICByZXR1cm4gKDAsIHYzNV9qc18xLmRlZmF1bHQpKDB4NTAsIHNoYTFfanNfMS5kZWZhdWx0LCB2YWx1ZSwgbmFtZXNwYWNlLCBidWYsIG9mZnNldCk7XG59XG52NS5ETlMgPSB2MzVfanNfMS5ETlM7XG52NS5VUkwgPSB2MzVfanNfMS5VUkw7XG5leHBvcnRzLmRlZmF1bHQgPSB2NTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgcGFyc2VfanNfMSA9IHJlcXVpcmUoXCIuL3BhcnNlLmpzXCIpO1xuY29uc3Qgc3RyaW5naWZ5X2pzXzEgPSByZXF1aXJlKFwiLi9zdHJpbmdpZnkuanNcIik7XG5mdW5jdGlvbiB2MVRvVjYodXVpZCkge1xuICAgIGNvbnN0IHYxQnl0ZXMgPSB0eXBlb2YgdXVpZCA9PT0gJ3N0cmluZycgPyAoMCwgcGFyc2VfanNfMS5kZWZhdWx0KSh1dWlkKSA6IHV1aWQ7XG4gICAgY29uc3QgdjZCeXRlcyA9IF92MVRvVjYodjFCeXRlcyk7XG4gICAgcmV0dXJuIHR5cGVvZiB1dWlkID09PSAnc3RyaW5nJyA/ICgwLCBzdHJpbmdpZnlfanNfMS51bnNhZmVTdHJpbmdpZnkpKHY2Qnl0ZXMpIDogdjZCeXRlcztcbn1cbmV4cG9ydHMuZGVmYXVsdCA9IHYxVG9WNjtcbmZ1bmN0aW9uIF92MVRvVjYodjFCeXRlcykge1xuICAgIHJldHVybiBVaW50OEFycmF5Lm9mKCgodjFCeXRlc1s2XSAmIDB4MGYpIDw8IDQpIHwgKCh2MUJ5dGVzWzddID4+IDQpICYgMHgwZiksICgodjFCeXRlc1s3XSAmIDB4MGYpIDw8IDQpIHwgKCh2MUJ5dGVzWzRdICYgMHhmMCkgPj4gNCksICgodjFCeXRlc1s0XSAmIDB4MGYpIDw8IDQpIHwgKCh2MUJ5dGVzWzVdICYgMHhmMCkgPj4gNCksICgodjFCeXRlc1s1XSAmIDB4MGYpIDw8IDQpIHwgKCh2MUJ5dGVzWzBdICYgMHhmMCkgPj4gNCksICgodjFCeXRlc1swXSAmIDB4MGYpIDw8IDQpIHwgKCh2MUJ5dGVzWzFdICYgMHhmMCkgPj4gNCksICgodjFCeXRlc1sxXSAmIDB4MGYpIDw8IDQpIHwgKCh2MUJ5dGVzWzJdICYgMHhmMCkgPj4gNCksIDB4NjAgfCAodjFCeXRlc1syXSAmIDB4MGYpLCB2MUJ5dGVzWzNdLCB2MUJ5dGVzWzhdLCB2MUJ5dGVzWzldLCB2MUJ5dGVzWzEwXSwgdjFCeXRlc1sxMV0sIHYxQnl0ZXNbMTJdLCB2MUJ5dGVzWzEzXSwgdjFCeXRlc1sxNF0sIHYxQnl0ZXNbMTVdKTtcbn1cbiIsIi8qKlxuICogQ29uZmlndXJhdGlvbiBvcHRpb25zIGZvciB0aGUgZXh0ZXJuYWwgdHJhY2tpbmcgc3lzdGVtXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVHJhY2tpbmdDb25maWcge1xuICB0cmFja2luZ0lkOiBzdHJpbmc7XG4gIGFwaUVuZHBvaW50Pzogc3RyaW5nO1xuICBkZWJ1Zz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogSW50ZXJuYWwgdHJhY2tpbmcgc3RhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUcmFja2luZ1N0YXRlIHtcbiAgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XG4gIHRyYWNraW5nSWQ6IHN0cmluZztcbiAgbG9jYXRpb25JZD86IHN0cmluZztcbiAgdXNlcklkPzogc3RyaW5nO1xuICB1c2VyUHJvcGVydGllcz86IFVzZXJQcm9wZXJ0aWVzO1xuICBzZXNzaW9uSWQ/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogRXZlbnQgdHlwZXMgdGhhdCBjYW4gYmUgdHJhY2tlZFxuICovXG5leHBvcnQgZW51bSBFdmVudFR5cGUge1xuICBTQ1JJUFRfUEFHRV9WSUVXID0gJ2V4dGVybmFsX3NjcmlwdF9wYWdlX3ZpZXcnLFxuICBGT1JNX1NVQk1JU1NJT04gPSAnZXh0ZXJuYWxfZm9ybV9zdWJtaXNzaW9uJyxcbn1cblxuLyoqXG4gKiBCYXNlIGV2ZW50IHN0cnVjdHVyZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRyYWNraW5nRXZlbnQge1xuICB0eXBlOiBFdmVudFR5cGU7XG4gIHRpbWVzdGFtcDogbnVtYmVyO1xuICB1cmw6IHN0cmluZztcbiAgcmVmZXJyZXI6IHN0cmluZztcbiAgdXNlckFnZW50OiBzdHJpbmc7XG4gIHByb3BlcnRpZXM/OiBFdmVudFByb3BlcnRpZXM7XG59XG5cbi8qKlxuICogUGFnZSB2aWV3IGV2ZW50XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUGFnZVZpZXdFdmVudCBleHRlbmRzIFRyYWNraW5nRXZlbnQge1xuICB0eXBlOiBFdmVudFR5cGUuU0NSSVBUX1BBR0VfVklFVztcbiAgdGl0bGU6IHN0cmluZztcbiAgcGF0aDogc3RyaW5nO1xuICBmb3JtSWQ/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogRm9ybSBzdWJtaXNzaW9uIGV2ZW50XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRm9ybVN1Ym1pc3Npb25FdmVudCBleHRlbmRzIFRyYWNraW5nRXZlbnQge1xuICB0eXBlOiBFdmVudFR5cGUuRk9STV9TVUJNSVNTSU9OO1xuICBmb3JtSWQ6IHN0cmluZztcbiAgZm9ybURhdGE6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIGZpbGVzPzogUmVjb3JkPHN0cmluZywgRmlsZSB8IEZpbGVbXT47XG4gIGZvcm1MYWJlbHM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xufVxuXG4vKipcbiAqIEN1c3RvbSBldmVudCBwcm9wZXJ0aWVzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRQcm9wZXJ0aWVzIHtcbiAgW2tleTogc3RyaW5nXTogYW55O1xufVxuXG4vKipcbiAqIFVzZXIgcHJvcGVydGllcyBmb3IgaWRlbnRpZmljYXRpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVc2VyUHJvcGVydGllcyB7XG4gIGVtYWlsPzogc3RyaW5nO1xuICBuYW1lPzogc3RyaW5nO1xuICBwaG9uZT86IHN0cmluZztcbiAgW2tleTogc3RyaW5nXTogYW55O1xufVxuXG4vKipcbiAqIEFQSSByZXNwb25zZSBmb3IgdHJhY2tpbmcgSUQgbG9va3VwXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVHJhY2tpbmdJZFJlc3BvbnNlIHtcbiAgdHJhY2tpbmdJZDogc3RyaW5nO1xuICBsb2NhdGlvbklkOiBzdHJpbmc7XG59XG5cbiBcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5VUkwgPSBleHBvcnRzLkROUyA9IHZvaWQgMDtcbmNvbnN0IG1kNV9qc18xID0gcmVxdWlyZShcIi4vbWQ1LmpzXCIpO1xuY29uc3QgdjM1X2pzXzEgPSByZXF1aXJlKFwiLi92MzUuanNcIik7XG52YXIgdjM1X2pzXzIgPSByZXF1aXJlKFwiLi92MzUuanNcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJETlNcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHYzNV9qc18yLkROUzsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlVSTFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdjM1X2pzXzIuVVJMOyB9IH0pO1xuZnVuY3Rpb24gdjModmFsdWUsIG5hbWVzcGFjZSwgYnVmLCBvZmZzZXQpIHtcbiAgICByZXR1cm4gKDAsIHYzNV9qc18xLmRlZmF1bHQpKDB4MzAsIG1kNV9qc18xLmRlZmF1bHQsIHZhbHVlLCBuYW1lc3BhY2UsIGJ1Ziwgb2Zmc2V0KTtcbn1cbnYzLkROUyA9IHYzNV9qc18xLkROUztcbnYzLlVSTCA9IHYzNV9qc18xLlVSTDtcbmV4cG9ydHMuZGVmYXVsdCA9IHYzO1xuIiwiLyoqXG4gKiBTYWZlIGNvbnNvbGUgbG9nZ2VyIGZvciBkZWJ1ZyBtb2RlXG4gKiBPbmx5IGxvZ3Mgd2hlbiBkZWJ1ZyBtb2RlIGlzIGVuYWJsZWQgaW4gZ2xvYmFsIHRyYWNraW5nIGNvbmZpZ3VyYXRpb25cbiAqL1xuaW1wb3J0IHsgTE9HR0VSX0VSUk9SX1BSRUZJWCwgTE9HR0VSX1BSRUZJWCwgR0xPQkFMX1RSQUNLSU5HX0tFWSB9IGZyb20gJy4uL2NvbmZpZy9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgbG9nZ2VyID0ge1xuICAvKipcbiAgICogTG9nIEFQSS1yZWxhdGVkIG1lc3NhZ2VzIChvbmx5IGluIGRlYnVnIG1vZGUpXG4gICAqIFxuICAgKiBAcGFyYW0gbWVzc2FnZSAtIE1lc3NhZ2UgdG8gbG9nXG4gICAqIEBwYXJhbSBhcmdzIC0gQWRkaXRpb25hbCBhcmd1bWVudHMgdG8gbG9nXG4gICAqL1xuICBhcGk6IChtZXNzYWdlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogdm9pZCA9PiB7XG4gICAgaWYgKGlzRGVidWdNb2RlKCkpIHtcbiAgICAgIGNvbnNvbGUubG9nKGAke0xPR0dFUl9QUkVGSVh9ICR7bWVzc2FnZX1gLCAuLi5hcmdzKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIExvZyBlcnJvciBtZXNzYWdlcyAob25seSBpbiBkZWJ1ZyBtb2RlKVxuICAgKiBcbiAgICogQHBhcmFtIG1lc3NhZ2UgLSBFcnJvciBtZXNzYWdlIHRvIGxvZ1xuICAgKiBAcGFyYW0gYXJncyAtIEFkZGl0aW9uYWwgYXJndW1lbnRzIHRvIGxvZ1xuICAgKi9cbiAgZXJyb3I6IChtZXNzYWdlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogdm9pZCA9PiB7XG4gICAgaWYgKGlzRGVidWdNb2RlKCkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYCR7TE9HR0VSX1BSRUZJWH0gJHttZXNzYWdlfWAsIC4uLmFyZ3MpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogTG9nIGNyaXRpY2FsIGVycm9ycyAoQUxXQVlTIHZpc2libGUsIHJlZ2FyZGxlc3Mgb2YgZGVidWcgbW9kZSlcbiAgICogXG4gICAqIEBwYXJhbSBtZXNzYWdlIC0gQ3JpdGljYWwgZXJyb3IgbWVzc2FnZSB0byBsb2dcbiAgICogQHBhcmFtIGFyZ3MgLSBBZGRpdGlvbmFsIGFyZ3VtZW50cyB0byBsb2dcbiAgICovXG4gIGNyaXRpY2FsOiAobWVzc2FnZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQgPT4ge1xuICAgIGNvbnNvbGUuZXJyb3IoYCR7TE9HR0VSX0VSUk9SX1BSRUZJWH0gJHttZXNzYWdlfWAsIC4uLmFyZ3MpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBMb2cgZ2VuZXJhbCBtZXNzYWdlcyAob25seSBpbiBkZWJ1ZyBtb2RlKVxuICAgKiBcbiAgICogQHBhcmFtIG1lc3NhZ2UgLSBNZXNzYWdlIHRvIGxvZ1xuICAgKiBAcGFyYW0gYXJncyAtIEFkZGl0aW9uYWwgYXJndW1lbnRzIHRvIGxvZ1xuICAgKi9cbiAgbG9nOiAobWVzc2FnZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQgPT4ge1xuICAgIGlmIChpc0RlYnVnTW9kZSgpKSB7XG4gICAgICBjb25zb2xlLmxvZyhgJHtMT0dHRVJfUFJFRklYfSAke21lc3NhZ2V9YCwgLi4uYXJncyk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBMb2cgd2FybmluZyBtZXNzYWdlcyAob25seSBpbiBkZWJ1ZyBtb2RlKVxuICAgKiBcbiAgICogQHBhcmFtIG1lc3NhZ2UgLSBXYXJuaW5nIG1lc3NhZ2UgdG8gbG9nXG4gICAqIEBwYXJhbSBhcmdzIC0gQWRkaXRpb25hbCBhcmd1bWVudHMgdG8gbG9nXG4gICAqL1xuICB3YXJuOiAobWVzc2FnZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQgPT4ge1xuICAgIGlmIChpc0RlYnVnTW9kZSgpKSB7XG4gICAgICBjb25zb2xlLndhcm4oYCR7TE9HR0VSX1BSRUZJWH0gJHttZXNzYWdlfWAsIC4uLmFyZ3MpO1xuICAgIH1cbiAgfSxcbn07XG5cbi8qKlxuICogQ2hlY2tzIGlmIGRlYnVnIG1vZGUgaXMgZW5hYmxlZFxuICogXG4gKiBAcmV0dXJucyBib29sZWFuIGluZGljYXRpbmcgaWYgZGVidWcgbW9kZSBpcyBhY3RpdmVcbiAqL1xuY29uc3QgaXNEZWJ1Z01vZGUgPSAoKTogYm9vbGVhbiA9PiB7XG4gIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgcmV0dXJuIGZhbHNlO1xuICBjb25zdCB3ID0gd2luZG93IGFzIGFueTtcbiAgcmV0dXJuIEJvb2xlYW4odz8uW0dMT0JBTF9UUkFDS0lOR19LRVldPy5kZWJ1Zyk7XG59O1xuXG4gIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSAvXig/OlswLTlhLWZdezh9LVswLTlhLWZdezR9LVsxLThdWzAtOWEtZl17M30tWzg5YWJdWzAtOWEtZl17M30tWzAtOWEtZl17MTJ9fDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMHxmZmZmZmZmZi1mZmZmLWZmZmYtZmZmZi1mZmZmZmZmZmZmZmYpJC9pO1xuIiwiaW1wb3J0IHsgRXZlbnRUeXBlLCBQYWdlVmlld0V2ZW50LCBGb3JtU3VibWlzc2lvbkV2ZW50IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZ2V0UGFnZU1ldGFkYXRhLCBwYXJzZUZvcm1EYXRhLCBsb2dnZXIsIGdldEZvcm1JZGVudGlmaWVyIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG4vKiogV2Vha1NldCB0byB0cmFjayBmb3JtcyB0aGF0IGFscmVhZHkgaGF2ZSBsaXN0ZW5lcnMgYXR0YWNoZWQgKi9cbmNvbnN0IHRyYWNrZWRGb3JtcyA9IG5ldyBXZWFrU2V0PEhUTUxGb3JtRWxlbWVudD4oKTtcblxuLyoqIE11dGF0aW9uT2JzZXJ2ZXIgaW5zdGFuY2UgZm9yIGR5bmFtaWMgZm9ybSBkZXRlY3Rpb24gKi9cbmxldCBmb3JtT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXIgfCBudWxsID0gbnVsbDtcblxuLyoqXG4gKiBTdGFydCBwYWdlIHRyYWNraW5nIC0gdHJhY2tzIHRoZSBpbml0aWFsIHBhZ2UgdmlldyBpbW1lZGlhdGVseVxuICovXG5leHBvcnQgY29uc3Qgc3RhcnRQYWdlVHJhY2tpbmcgPSAoY2FsbGJhY2s6IChldmVudDogUGFnZVZpZXdFdmVudCkgPT4gdm9pZCk6IHZvaWQgPT4ge1xuICBsb2dnZXIubG9nKCdUcmFja2luZyBpbml0aWFsIHBhZ2UgdmlldycpO1xuICBcbiAgY29uc3QgbWV0YWRhdGEgPSBnZXRQYWdlTWV0YWRhdGEoKTtcbiAgY29uc3QgZm9ybUlkID0gZ2V0Rm9ybUlkZW50aWZpZXIoKTtcbiAgY29uc3QgZXZlbnQ6IFBhZ2VWaWV3RXZlbnQgPSB7XG4gICAgdHlwZTogRXZlbnRUeXBlLlNDUklQVF9QQUdFX1ZJRVcsXG4gICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgIC4uLm1ldGFkYXRhLFxuICAgIC4uLihmb3JtSWQgPyB7IGZvcm1JZCB9IDoge30pLFxuICB9O1xuXG4gIGNhbGxiYWNrKGV2ZW50KTtcbn07XG5cbi8qKlxuICogU3RhcnQgZm9ybSB0cmFja2luZyB3aXRoIHN1cHBvcnQgZm9yIGR5bmFtaWNhbGx5IHJlbmRlcmVkIGZvcm1zXG4gKiBcbiAqIFVzZXMgTXV0YXRpb25PYnNlcnZlciB0byBkZXRlY3QgZm9ybXMgYWRkZWQgdG8gdGhlIERPTSBhZnRlciBpbml0aWFsIHBhZ2UgbG9hZCxcbiAqIHdoaWNoIGlzIGVzc2VudGlhbCBmb3IgU1BBcyBhbmQgb3RoZXIgYXBwcyB0aGF0IHJlbmRlciBmb3JtcyBhc3luY2hyb25vdXNseS5cbiAqIFxuICogQHBhcmFtIGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gY2FsbCB3aGVuIGEgZm9ybSBpcyBzdWJtaXR0ZWRcbiAqL1xuZXhwb3J0IGNvbnN0IHN0YXJ0Rm9ybVRyYWNraW5nID0gKGNhbGxiYWNrOiAoZXZlbnQ6IEZvcm1TdWJtaXNzaW9uRXZlbnQpID0+IHZvaWQpOiB2b2lkID0+IHtcbiAgbG9nZ2VyLmxvZygnU3RhcnRpbmcgZm9ybSBzdWJtaXNzaW9uIHRyYWNraW5nJyk7XG4gIFxuICAvKipcbiAgICogQXR0YWNoIHN1Ym1pdCBsaXN0ZW5lciB0byBhIGZvcm0gZWxlbWVudFxuICAgKiBQcmV2ZW50cyBkdXBsaWNhdGUgbGlzdGVuZXJzIHZpYSBXZWFrU2V0IHRyYWNraW5nXG4gICAqL1xuICBjb25zdCBhdHRhY2hGb3JtTGlzdGVuZXIgPSAoZm9ybTogSFRNTEZvcm1FbGVtZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKHRyYWNrZWRGb3Jtcy5oYXMoZm9ybSkpIHJldHVybjtcbiAgICBcbiAgICAvLyBUcmFjayBpZiBmb3JtIGhhcyBiZWVuIHN1Ym1pdHRlZCB0byBwcmV2ZW50IGR1cGxpY2F0ZSBldmVudHNcbiAgICBsZXQgZm9ybVN1Ym1pdHRlZCA9IGZhbHNlO1xuICAgIFxuICAgIGNvbnN0IGhhbmRsZVN1Ym1pc3Npb24gPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAoZm9ybVN1Ym1pdHRlZCkgcmV0dXJuO1xuICAgICAgZm9ybVN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICBsb2dnZXIubG9nKCdGb3JtIHN1Ym1pdCBldmVudCBjYXB0dXJlZCcpO1xuICAgICAgaGFuZGxlRm9ybVN1Ym1pdChmb3JtLCBjYWxsYmFjayk7XG4gICAgICAvLyBSZXNldCBhZnRlciBhIHNob3J0IGRlbGF5IHRvIGFsbG93IGZvciByZS1zdWJtaXNzaW9uXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHsgZm9ybVN1Ym1pdHRlZCA9IGZhbHNlOyB9LCAxMDAwKTtcbiAgICB9O1xuICAgIFxuICAgIC8vIExpc3RlbiBmb3IgbmF0aXZlIGZvcm0gc3VibWl0IGV2ZW50IChjYXB0dXJlIHBoYXNlKVxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgaGFuZGxlU3VibWlzc2lvbiwgeyBjYXB0dXJlOiB0cnVlIH0pO1xuICAgIFxuICAgIC8vIEZhbGxiYWNrOiBMaXN0ZW4gZm9yIHN1Ym1pdCBidXR0b24gY2xpY2tzIChHcmF2aXR5IEZvcm1zIHVzZXMgb25jbGljayBoYW5kbGVyKVxuICAgIGNvbnN0IHN1Ym1pdEJ1dHRvbnMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAnYnV0dG9uW3R5cGU9XCJzdWJtaXRcIl0sIGlucHV0W3R5cGU9XCJzdWJtaXRcIl0sIFtkYXRhLXN1Ym1pc3Npb24tdHlwZT1cInN1Ym1pdFwiXSdcbiAgICApO1xuICAgIHN1Ym1pdEJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGxvZ2dlci5sb2coJ1N1Ym1pdCBidXR0b24gY2xpY2sgZGV0ZWN0ZWQnKTtcbiAgICAgICAgLy8gU21hbGwgZGVsYXkgdG8gbGV0IGZvcm0gdmFsaWRhdGlvbiBydW4gZmlyc3RcbiAgICAgICAgc2V0VGltZW91dChoYW5kbGVTdWJtaXNzaW9uLCA1MCk7XG4gICAgICB9LCB7IGNhcHR1cmU6IHRydWUgfSk7XG4gICAgfSk7XG4gICAgXG4gICAgdHJhY2tlZEZvcm1zLmFkZChmb3JtKTtcbiAgICBjb25zdCBmb3JtSWRlbnRpZmllciA9IGdldEZvcm1JZGVudGlmaWVyKGZvcm0pIHx8ICdVbmlkZW50aWZpZWQgRm9ybSc7XG4gICAgbG9nZ2VyLmxvZygnVHJhY2tpbmcgZm9ybTonLCBmb3JtSWRlbnRpZmllciwgYCgke3N1Ym1pdEJ1dHRvbnMubGVuZ3RofSBzdWJtaXQgYnV0dG9uKHMpKWApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBGaW5kIGFuZCBhdHRhY2ggbGlzdGVuZXJzIHRvIGFsbCBmb3JtcyBpbiBhIGdpdmVuIHJvb3QgZWxlbWVudFxuICAgKi9cbiAgY29uc3QgdHJhY2tGb3Jtc0luRWxlbWVudCA9IChyb290OiBFbGVtZW50IHwgRG9jdW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBmb3JtcyA9IHJvb3QucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpO1xuICAgIGxvZ2dlci5sb2coYEZvdW5kICR7Zm9ybXMubGVuZ3RofSBmb3JtKHMpIGluIGRvY3VtZW50YCk7XG4gICAgZm9ybXMuZm9yRWFjaCgoZm9ybSkgPT4gYXR0YWNoRm9ybUxpc3RlbmVyKGZvcm0gYXMgSFRNTEZvcm1FbGVtZW50KSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIE11dGF0aW9uT2JzZXJ2ZXIgdG8gd2F0Y2ggZm9yIGR5bmFtaWNhbGx5IGFkZGVkIGZvcm1zXG4gICAqL1xuICBjb25zdCBpbml0T2JzZXJ2ZXIgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKGZvcm1PYnNlcnZlciB8fCB0eXBlb2YgTXV0YXRpb25PYnNlcnZlciA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcbiAgICBcbiAgICBmb3JtT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcbiAgICAgICAgY29uc3QgYWRkZWROb2RlcyA9IEFycmF5LmZyb20obXV0YXRpb24uYWRkZWROb2Rlcyk7XG4gICAgICAgIGFkZGVkTm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICAgIGlmICghKG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50KSkgcmV0dXJuO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBhZGRlZCBub2RlIGlzIGEgZm9ybVxuICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgSFRNTEZvcm1FbGVtZW50KSB7XG4gICAgICAgICAgICBsb2dnZXIubG9nKCdEeW5hbWljIGZvcm0gZGV0ZWN0ZWQgdmlhIE11dGF0aW9uT2JzZXJ2ZXInKTtcbiAgICAgICAgICAgIGF0dGFjaEZvcm1MaXN0ZW5lcihub2RlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gQ2hlY2sgZm9yIGZvcm1zIG5lc3RlZCB3aXRoaW4gdGhlIGFkZGVkIG5vZGVcbiAgICAgICAgICBjb25zdCBuZXN0ZWRGb3JtcyA9IG5vZGUucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpO1xuICAgICAgICAgIG5lc3RlZEZvcm1zLmZvckVhY2goKG5lc3RlZEZvcm0pID0+IHtcbiAgICAgICAgICAgIGxvZ2dlci5sb2coJ05lc3RlZCBkeW5hbWljIGZvcm0gZGV0ZWN0ZWQgdmlhIE11dGF0aW9uT2JzZXJ2ZXInKTtcbiAgICAgICAgICAgIGF0dGFjaEZvcm1MaXN0ZW5lcihuZXN0ZWRGb3JtIGFzIEhUTUxGb3JtRWxlbWVudCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBmb3JtT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7IFxuICAgICAgY2hpbGRMaXN0OiB0cnVlLCBcbiAgICAgIHN1YnRyZWU6IHRydWUgXG4gICAgfSk7XG4gICAgbG9nZ2VyLmxvZygnTXV0YXRpb25PYnNlcnZlciBpbml0aWFsaXplZCBmb3IgZHluYW1pYyBmb3JtIGRldGVjdGlvbicpO1xuICB9O1xuXG4gIC8vIFRyYWNrIGV4aXN0aW5nIGZvcm1zIG9uIHRoZSBwYWdlXG4gIHRyYWNrRm9ybXNJbkVsZW1lbnQoZG9jdW1lbnQpO1xuXG4gIC8vIFNldHVwIE11dGF0aW9uT2JzZXJ2ZXIgLSB3YWl0IGZvciBkb2N1bWVudC5ib2R5IGlmIG5vdCByZWFkeVxuICBpZiAoZG9jdW1lbnQuYm9keSkge1xuICAgIGluaXRPYnNlcnZlcigpO1xuICB9IGVsc2Uge1xuICAgIC8vIFdhaXQgZm9yIERPTSB0byBiZSByZWFkeSBiZWZvcmUgYXR0YWNoaW5nIG9ic2VydmVyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICAgIHRyYWNrRm9ybXNJbkVsZW1lbnQoZG9jdW1lbnQpOyAvLyBSZS1jaGVjayBmb3IgZm9ybXNcbiAgICAgIGluaXRPYnNlcnZlcigpO1xuICAgIH0pO1xuICB9XG59O1xuXG4vKipcbiAqIEhhbmRsZSBmb3JtIHN1Ym1pc3Npb24gYW5kIGNyZWF0ZSB0cmFja2luZyBldmVudFxuICogXG4gKiBAcGFyYW0gZm9ybSAtIFRoZSBIVE1MIGZvcm0gZWxlbWVudCB0aGF0IHdhcyBzdWJtaXR0ZWRcbiAqIEBwYXJhbSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGNhbGwgd2l0aCB0aGUgdHJhY2tpbmcgZXZlbnRcbiAqL1xuY29uc3QgaGFuZGxlRm9ybVN1Ym1pdCA9IChmb3JtOiBIVE1MRm9ybUVsZW1lbnQsIGNhbGxiYWNrOiAoZXZlbnQ6IEZvcm1TdWJtaXNzaW9uRXZlbnQpID0+IHZvaWQpOiB2b2lkID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGZpZWxkRGF0YSwgZmllbGRMYWJlbHMsIGZpbGVzIH0gPSBwYXJzZUZvcm1EYXRhKGZvcm0pO1xuICAgIGNvbnN0IG1ldGFkYXRhID0gZ2V0UGFnZU1ldGFkYXRhKCk7XG4gICAgXG4gICAgY29uc3QgdHJhY2tpbmdFdmVudDogRm9ybVN1Ym1pc3Npb25FdmVudCA9IHtcbiAgICAgIHR5cGU6IEV2ZW50VHlwZS5GT1JNX1NVQk1JU1NJT04sXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICBmb3JtSWQ6IGdldEZvcm1JZGVudGlmaWVyKGZvcm0pIHx8ICdVbmlkZW50aWZpZWQgRm9ybScsXG4gICAgICBmb3JtRGF0YTogZmllbGREYXRhLFxuICAgICAgZm9ybUxhYmVsczogZmllbGRMYWJlbHMsXG4gICAgICAuLi4oZmlsZXMgJiYgT2JqZWN0LmtleXMoZmlsZXMpLmxlbmd0aCA/IHsgZmlsZXMgfSA6IHt9KSxcbiAgICAgIC4uLm1ldGFkYXRhLFxuICAgIH07XG5cbiAgICBjYWxsYmFjayh0cmFja2luZ0V2ZW50KTtcbiAgICBcbiAgICBsb2dnZXIubG9nKCdGb3JtIHN1Ym1pc3Npb24gdHJhY2tlZDonLCB0cmFja2luZ0V2ZW50LmZvcm1JZCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbG9nZ2VyLmVycm9yKCdFcnJvciB0cmFja2luZyBmb3JtIHN1Ym1pc3Npb246JywgZXJyb3IpO1xuICB9XG59OyBcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgcmVnZXhfanNfMSA9IHJlcXVpcmUoXCIuL3JlZ2V4LmpzXCIpO1xuZnVuY3Rpb24gdmFsaWRhdGUodXVpZCkge1xuICAgIHJldHVybiB0eXBlb2YgdXVpZCA9PT0gJ3N0cmluZycgJiYgcmVnZXhfanNfMS5kZWZhdWx0LnRlc3QodXVpZCk7XG59XG5leHBvcnRzLmRlZmF1bHQgPSB2YWxpZGF0ZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgdmFsaWRhdGVfanNfMSA9IHJlcXVpcmUoXCIuL3ZhbGlkYXRlLmpzXCIpO1xuZnVuY3Rpb24gdmVyc2lvbih1dWlkKSB7XG4gICAgaWYgKCEoMCwgdmFsaWRhdGVfanNfMS5kZWZhdWx0KSh1dWlkKSkge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ0ludmFsaWQgVVVJRCcpO1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VJbnQodXVpZC5zbGljZSgxNCwgMTUpLCAxNik7XG59XG5leHBvcnRzLmRlZmF1bHQgPSB2ZXJzaW9uO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCByYW5kb21VVUlEID0gdHlwZW9mIGNyeXB0byAhPT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvLnJhbmRvbVVVSUQgJiYgY3J5cHRvLnJhbmRvbVVVSUQuYmluZChjcnlwdG8pO1xuZXhwb3J0cy5kZWZhdWx0ID0geyByYW5kb21VVUlEIH07XG4iLCIvKipcbiAqIEdyYXZpdHkgRm9ybXMgTGFiZWwgRXh0cmFjdG9yXG4gKiBcbiAqIFByb3ZpZGVzIGZ1bmN0aW9ucyB0byBleHRyYWN0IGZpZWxkIGxhYmVscyBmcm9tIEdyYXZpdHkgRm9ybXMgSFRNTCBzdHJ1Y3R1cmUuXG4gKiBIYW5kbGVzIGJvdGggc2ltcGxlIGZpZWxkcyBhbmQgY29tcG91bmQgZmllbGRzIChOYW1lLCBBZGRyZXNzLCBldGMuKS5cbiAqL1xuXG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuLi8uLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHR5cGUgeyBGb3JtSW5wdXRFbGVtZW50IH0gZnJvbSAnLi90eXBlcyc7XG5cbi8qKiBDU1MgY2xhc3MgdXNlZCBieSBHcmF2aXR5IEZvcm1zIGZvciBmaWVsZCBjb250YWluZXJzICovXG5jb25zdCBHRklFTERfQ0xBU1MgPSAnZ2ZpZWxkJztcblxuLyoqIENTUyBjbGFzcyBmb3IgR3Jhdml0eSBGb3JtcyBmaWVsZCBsYWJlbHMgKi9cbmNvbnN0IEdGSUVMRF9MQUJFTF9DTEFTUyA9ICdnZmllbGRfbGFiZWwnO1xuXG4vKiogUmVnZXggdG8gc3RyaXAgXCIoUmVxdWlyZWQpXCIgdGV4dCBmcm9tIGxhYmVscyAqL1xuY29uc3QgUkVRVUlSRURfSU5ESUNBVE9SX1JFR0VYID0gL1xccypcXChSZXF1aXJlZFxcKVxccyovZ2k7XG5cbi8qKiBSZWdleCB0byBzdHJpcCBhc3RlcmlzayBpbmRpY2F0b3JzIGZyb20gbGFiZWxzICovXG5jb25zdCBBU1RFUklTS19JTkRJQ0FUT1JfUkVHRVggPSAvXFxzKlxcKlxccyokL2c7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGFuIGVsZW1lbnQgaXMgd2l0aGluIGEgR3Jhdml0eSBGb3JtcyBmaWVsZCBjb250YWluZXJcbiAqIFxuICogQHBhcmFtIGVsZW1lbnQgLSBET00gZWxlbWVudCB0byBjaGVja1xuICogQHJldHVybnMgVHJ1ZSBpZiBlbGVtZW50IGlzIGluc2lkZSBhIC5nZmllbGQgY29udGFpbmVyXG4gKi9cbmV4cG9ydCBjb25zdCBpc0dyYXZpdHlGb3Jtc0ZpZWxkID0gKGVsZW1lbnQ6IEVsZW1lbnQpOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIGVsZW1lbnQuY2xvc2VzdChgLiR7R0ZJRUxEX0NMQVNTfWApICE9PSBudWxsO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIFwiKFJlcXVpcmVkKVwiIGFuZCBhc3RlcmlzayBpbmRpY2F0b3JzIGZyb20gbGFiZWwgdGV4dFxuICogXG4gKiBAcGFyYW0gdGV4dCAtIFJhdyBsYWJlbCB0ZXh0XG4gKiBAcmV0dXJucyBDbGVhbmVkIGxhYmVsIHRleHRcbiAqL1xuZXhwb3J0IGNvbnN0IGNsZWFuTGFiZWxUZXh0ID0gKHRleHQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIHJldHVybiB0ZXh0XG4gICAgLnJlcGxhY2UoUkVRVUlSRURfSU5ESUNBVE9SX1JFR0VYLCAnJylcbiAgICAucmVwbGFjZShBU1RFUklTS19JTkRJQ0FUT1JfUkVHRVgsICcnKVxuICAgIC50cmltKCk7XG59O1xuXG4vKipcbiAqIEV4dHJhY3RzIHRoZSBtYWluIGxhYmVsIGZvciBhIEdyYXZpdHkgRm9ybXMgZmllbGRcbiAqIEZvciBjb21wb3VuZCBmaWVsZHMsIHRoaXMgZ2V0cyB0aGUgcHJpbWFyeSBsYWJlbCAoZS5nLiwgXCJOYW1lXCIgZm9yIGEgbmFtZSBmaWVsZClcbiAqIFxuICogQHBhcmFtIGlucHV0IC0gRm9ybSBpbnB1dCBlbGVtZW50XG4gKiBAcmV0dXJucyBNYWluIGxhYmVsIHRleHQgb3IgZW1wdHkgc3RyaW5nXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRNYWluTGFiZWwgPSAoaW5wdXQ6IEZvcm1JbnB1dEVsZW1lbnQpOiBzdHJpbmcgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGdmaWVsZCA9IGlucHV0LmNsb3Nlc3QoYC4ke0dGSUVMRF9DTEFTU31gKTtcbiAgICBpZiAoIWdmaWVsZCkgcmV0dXJuICcnO1xuXG4gICAgLy8gQ2hlY2sgZm9yIGNvbXBvdW5kIGZpZWxkIChmaWVsZHNldCB3aXRoIGdmaWVsZCBjbGFzcylcbiAgICBjb25zdCBmaWVsZHNldCA9IGlucHV0LmNsb3Nlc3QoJ2ZpZWxkc2V0Jyk7XG4gICAgY29uc3QgaXNDb21wb3VuZEZpZWxkID0gZmllbGRzZXQ/LmNsYXNzTGlzdC5jb250YWlucyhHRklFTERfQ0xBU1MpO1xuXG4gICAgaWYgKGlzQ29tcG91bmRGaWVsZCAmJiBmaWVsZHNldCkge1xuICAgICAgLy8gRm9yIGNvbXBvdW5kIGZpZWxkcywgZ2V0IGxhYmVsIGZyb20gbGVnZW5kXG4gICAgICBjb25zdCBsZWdlbmQgPSBmaWVsZHNldC5xdWVyeVNlbGVjdG9yKCdsZWdlbmQnKTtcbiAgICAgIGlmIChsZWdlbmQpIHtcbiAgICAgICAgcmV0dXJuIGNsZWFuTGFiZWxUZXh0KGxlZ2VuZC50ZXh0Q29udGVudD8udHJpbSgpID8/ICcnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBGb3Igc2ltcGxlIGZpZWxkcywgZ2V0IGxhYmVsIGZyb20gLmdmaWVsZF9sYWJlbFxuICAgIGNvbnN0IGxhYmVsRWwgPSBnZmllbGQucXVlcnlTZWxlY3RvcihgbGFiZWwuJHtHRklFTERfTEFCRUxfQ0xBU1N9YCk7XG4gICAgaWYgKGxhYmVsRWwpIHtcbiAgICAgIHJldHVybiBjbGVhbkxhYmVsVGV4dChsYWJlbEVsLnRleHRDb250ZW50Py50cmltKCkgPz8gJycpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGV4dHJhY3RpbmcgR3Jhdml0eSBGb3JtcyBtYWluIGxhYmVsOicsIGVycm9yKTtcbiAgfVxuXG4gIHJldHVybiAnJztcbn07XG5cbi8qKlxuICogRXh0cmFjdHMgdGhlIHN1Yi1sYWJlbCBmb3IgY29tcG91bmQgZmllbGRzIChlLmcuLCBcIkZpcnN0XCIsIFwiTGFzdFwiIGZvciBuYW1lIGZpZWxkcylcbiAqIFxuICogQHBhcmFtIGZvcm0gLSBQYXJlbnQgZm9ybSBlbGVtZW50XG4gKiBAcGFyYW0gaW5wdXQgLSBGb3JtIGlucHV0IGVsZW1lbnRcbiAqIEByZXR1cm5zIFN1Yi1sYWJlbCB0ZXh0IG9yIGVtcHR5IHN0cmluZ1xuICovXG5leHBvcnQgY29uc3QgZ2V0U3ViTGFiZWwgPSAoZm9ybTogSFRNTEZvcm1FbGVtZW50LCBpbnB1dDogRm9ybUlucHV0RWxlbWVudCk6IHN0cmluZyA9PiB7XG4gIGlmICghaW5wdXQuaWQpIHJldHVybiAnJztcblxuICB0cnkge1xuICAgIGNvbnN0IHN1YkxhYmVsRWwgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoYGxhYmVsW2Zvcj1cIiR7aW5wdXQuaWR9XCJdYCk7XG4gICAgaWYgKHN1YkxhYmVsRWwpIHtcbiAgICAgIHJldHVybiBzdWJMYWJlbEVsLnRleHRDb250ZW50Py50cmltKCkgPz8gJyc7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGxvZ2dlci5lcnJvcignRXJyb3IgZXh0cmFjdGluZyBHcmF2aXR5IEZvcm1zIHN1Yi1sYWJlbDonLCBlcnJvcik7XG4gIH1cblxuICByZXR1cm4gJyc7XG59O1xuXG4vKipcbiAqIERldGVybWluZXMgaWYgYW4gaW5wdXQgaXMgcGFydCBvZiBhIGNvbXBvdW5kIGZpZWxkIChOYW1lLCBBZGRyZXNzLCBldGMuKVxuICogXG4gKiBAcGFyYW0gaW5wdXQgLSBGb3JtIGlucHV0IGVsZW1lbnRcbiAqIEByZXR1cm5zIFRydWUgaWYgaW5wdXQgaXMgaW4gYSBjb21wb3VuZCBmaWVsZFxuICovXG5leHBvcnQgY29uc3QgaXNDb21wb3VuZEZpZWxkID0gKGlucHV0OiBGb3JtSW5wdXRFbGVtZW50KTogYm9vbGVhbiA9PiB7XG4gIGNvbnN0IGZpZWxkc2V0ID0gaW5wdXQuY2xvc2VzdCgnZmllbGRzZXQnKTtcbiAgcmV0dXJuIGZpZWxkc2V0Py5jbGFzc0xpc3QuY29udGFpbnMoR0ZJRUxEX0NMQVNTKSA/PyBmYWxzZTtcbn07XG5cbi8qKlxuICogR2V0cyBsYWJlbCBmb3IgR3Jhdml0eSBGb3JtcyBmaWVsZHNcbiAqIEZvciBjb21wb3VuZCBmaWVsZHM6IHJldHVybnMgc3VibGFiZWwgb25seSAoZS5nLiwgXCJGaXJzdCBOYW1lXCIgLSBhZG1pbiBjYW4gY3VzdG9taXplKVxuICogRm9yIHNpbXBsZSBmaWVsZHM6IHJldHVybnMgdGhlIG1haW4gbGFiZWxcbiAqIFxuICogQHBhcmFtIGZvcm0gLSBQYXJlbnQgZm9ybSBlbGVtZW50XG4gKiBAcGFyYW0gaW5wdXQgLSBGb3JtIGlucHV0IGVsZW1lbnRcbiAqIEByZXR1cm5zIExhYmVsIHRleHQgb3IgZW1wdHkgc3RyaW5nXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRDb21iaW5lZExhYmVsID0gKFxuICBmb3JtOiBIVE1MRm9ybUVsZW1lbnQsXG4gIGlucHV0OiBGb3JtSW5wdXRFbGVtZW50XG4pOiBzdHJpbmcgPT4ge1xuICAvLyBFYXJseSByZXR1cm4gaWYgbm90IGEgR3Jhdml0eSBGb3JtcyBmaWVsZFxuICBpZiAoIWlzR3Jhdml0eUZvcm1zRmllbGQoaW5wdXQpKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgLy8gRm9yIGNvbXBvdW5kIGZpZWxkcywgdXNlIHN1YmxhYmVsIG9ubHkgKGFkbWluIGN1c3RvbWl6ZXMgdGhlc2UgaW4gR3Jhdml0eSBGb3JtcylcbiAgaWYgKGlzQ29tcG91bmRGaWVsZChpbnB1dCkpIHtcbiAgICBjb25zdCBzdWJMYWJlbCA9IGdldFN1YkxhYmVsKGZvcm0sIGlucHV0KTtcbiAgICBpZiAoc3ViTGFiZWwpIHtcbiAgICAgIHJldHVybiBzdWJMYWJlbDtcbiAgICB9XG4gIH1cblxuICAvLyBGb3Igc2ltcGxlIGZpZWxkcywgdXNlIG1haW4gbGFiZWxcbiAgcmV0dXJuIGdldE1haW5MYWJlbChpbnB1dCk7XG59O1xuXG4vKipcbiAqIEdldHMgbGFiZWwgZnJvbSBHcmF2aXR5IEZvcm1zIGZpZWxkIGNvbnRhaW5lciAoZmFsbGJhY2sgbWV0aG9kKVxuICogRXhjbHVkZXMgc3ViLWxhYmVscyB0byBnZXQgdGhlIG1haW4gZmllbGQgbGFiZWwgb25seVxuICogXG4gKiBAcGFyYW0gaW5wdXQgLSBGb3JtIGlucHV0IGVsZW1lbnRcbiAqIEByZXR1cm5zIExhYmVsIHRleHQgb3IgZW1wdHkgc3RyaW5nXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRDb250YWluZXJMYWJlbCA9IChpbnB1dDogRm9ybUlucHV0RWxlbWVudCk6IHN0cmluZyA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgZmllbGRDb250YWluZXIgPSBpbnB1dC5jbG9zZXN0KGAuJHtHRklFTERfQ0xBU1N9YCk7XG4gICAgaWYgKCFmaWVsZENvbnRhaW5lcikgcmV0dXJuICcnO1xuXG4gICAgLy8gR3Jhdml0eSBGb3JtcyBsYWJlbCBzZWxlY3RvcnMgKGV4Y2x1ZGUgc3ViLWxhYmVscylcbiAgICBjb25zdCBsYWJlbCA9IGZpZWxkQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBgLiR7R0ZJRUxEX0xBQkVMX0NMQVNTfSwgLmdmb3JtLWZpZWxkLWxhYmVsOm5vdCguZ2Zvcm0tZmllbGQtbGFiZWwtLXR5cGUtc3ViKWBcbiAgICApO1xuXG4gICAgaWYgKGxhYmVsKSB7XG4gICAgICByZXR1cm4gY2xlYW5MYWJlbFRleHQobGFiZWwudGV4dENvbnRlbnQ/LnRyaW0oKSA/PyAnJyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGxvZ2dlci5lcnJvcignRXJyb3IgZXh0cmFjdGluZyBHcmF2aXR5IEZvcm1zIGNvbnRhaW5lciBsYWJlbDonLCBlcnJvcik7XG4gIH1cblxuICByZXR1cm4gJyc7XG59O1xuXG4vKipcbiAqIEdldHMgbGFiZWwgZnJvbSBmaWVsZHNldCBsZWdlbmQgZWxlbWVudFxuICogVXNlZCBmb3IgY29tcG91bmQgZmllbGRzIChOYW1lLCBFbWFpbCB3aXRoIGNvbmZpcm1hdGlvbiwgZXRjLilcbiAqIFxuICogQHBhcmFtIGlucHV0IC0gRm9ybSBpbnB1dCBlbGVtZW50XG4gKiBAcmV0dXJucyBMZWdlbmQgdGV4dCBvciBlbXB0eSBzdHJpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IGdldEZpZWxkc2V0TGVnZW5kID0gKGlucHV0OiBGb3JtSW5wdXRFbGVtZW50KTogc3RyaW5nID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBmaWVsZHNldCA9IGlucHV0LmNsb3Nlc3QoJ2ZpZWxkc2V0Jyk7XG4gICAgaWYgKCFmaWVsZHNldCkgcmV0dXJuICcnO1xuXG4gICAgY29uc3QgbGVnZW5kID0gZmllbGRzZXQucXVlcnlTZWxlY3RvcignbGVnZW5kJyk7XG4gICAgaWYgKGxlZ2VuZCkge1xuICAgICAgcmV0dXJuIGNsZWFuTGFiZWxUZXh0KGxlZ2VuZC50ZXh0Q29udGVudD8udHJpbSgpID8/ICcnKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbG9nZ2VyLmVycm9yKCdFcnJvciBleHRyYWN0aW5nIGZpZWxkc2V0IGxlZ2VuZDonLCBlcnJvcik7XG4gIH1cblxuICByZXR1cm4gJyc7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCB2YWxpZGF0ZV9qc18xID0gcmVxdWlyZShcIi4vdmFsaWRhdGUuanNcIik7XG5mdW5jdGlvbiBwYXJzZSh1dWlkKSB7XG4gICAgaWYgKCEoMCwgdmFsaWRhdGVfanNfMS5kZWZhdWx0KSh1dWlkKSkge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ0ludmFsaWQgVVVJRCcpO1xuICAgIH1cbiAgICBsZXQgdjtcbiAgICByZXR1cm4gVWludDhBcnJheS5vZigodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoMCwgOCksIDE2KSkgPj4+IDI0LCAodiA+Pj4gMTYpICYgMHhmZiwgKHYgPj4+IDgpICYgMHhmZiwgdiAmIDB4ZmYsICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSg5LCAxMyksIDE2KSkgPj4+IDgsIHYgJiAweGZmLCAodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoMTQsIDE4KSwgMTYpKSA+Pj4gOCwgdiAmIDB4ZmYsICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSgxOSwgMjMpLCAxNikpID4+PiA4LCB2ICYgMHhmZiwgKCh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSgyNCwgMzYpLCAxNikpIC8gMHgxMDAwMDAwMDAwMCkgJiAweGZmLCAodiAvIDB4MTAwMDAwMDAwKSAmIDB4ZmYsICh2ID4+PiAyNCkgJiAweGZmLCAodiA+Pj4gMTYpICYgMHhmZiwgKHYgPj4+IDgpICYgMHhmZiwgdiAmIDB4ZmYpO1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gcGFyc2U7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIGYocywgeCwgeSwgeikge1xuICAgIHN3aXRjaCAocykge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICByZXR1cm4gKHggJiB5KSBeICh+eCAmIHopO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICByZXR1cm4geCBeIHkgXiB6O1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZXR1cm4gKHggJiB5KSBeICh4ICYgeikgXiAoeSAmIHopO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4geCBeIHkgXiB6O1xuICAgIH1cbn1cbmZ1bmN0aW9uIFJPVEwoeCwgbikge1xuICAgIHJldHVybiAoeCA8PCBuKSB8ICh4ID4+PiAoMzIgLSBuKSk7XG59XG5mdW5jdGlvbiBzaGExKGJ5dGVzKSB7XG4gICAgY29uc3QgSyA9IFsweDVhODI3OTk5LCAweDZlZDllYmExLCAweDhmMWJiY2RjLCAweGNhNjJjMWQ2XTtcbiAgICBjb25zdCBIID0gWzB4Njc0NTIzMDEsIDB4ZWZjZGFiODksIDB4OThiYWRjZmUsIDB4MTAzMjU0NzYsIDB4YzNkMmUxZjBdO1xuICAgIGNvbnN0IG5ld0J5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZXMubGVuZ3RoICsgMSk7XG4gICAgbmV3Qnl0ZXMuc2V0KGJ5dGVzKTtcbiAgICBuZXdCeXRlc1tieXRlcy5sZW5ndGhdID0gMHg4MDtcbiAgICBieXRlcyA9IG5ld0J5dGVzO1xuICAgIGNvbnN0IGwgPSBieXRlcy5sZW5ndGggLyA0ICsgMjtcbiAgICBjb25zdCBOID0gTWF0aC5jZWlsKGwgLyAxNik7XG4gICAgY29uc3QgTSA9IG5ldyBBcnJheShOKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE47ICsraSkge1xuICAgICAgICBjb25zdCBhcnIgPSBuZXcgVWludDMyQXJyYXkoMTYpO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDE2OyArK2opIHtcbiAgICAgICAgICAgIGFycltqXSA9XG4gICAgICAgICAgICAgICAgKGJ5dGVzW2kgKiA2NCArIGogKiA0XSA8PCAyNCkgfFxuICAgICAgICAgICAgICAgICAgICAoYnl0ZXNbaSAqIDY0ICsgaiAqIDQgKyAxXSA8PCAxNikgfFxuICAgICAgICAgICAgICAgICAgICAoYnl0ZXNbaSAqIDY0ICsgaiAqIDQgKyAyXSA8PCA4KSB8XG4gICAgICAgICAgICAgICAgICAgIGJ5dGVzW2kgKiA2NCArIGogKiA0ICsgM107XG4gICAgICAgIH1cbiAgICAgICAgTVtpXSA9IGFycjtcbiAgICB9XG4gICAgTVtOIC0gMV1bMTRdID0gKChieXRlcy5sZW5ndGggLSAxKSAqIDgpIC8gTWF0aC5wb3coMiwgMzIpO1xuICAgIE1bTiAtIDFdWzE0XSA9IE1hdGguZmxvb3IoTVtOIC0gMV1bMTRdKTtcbiAgICBNW04gLSAxXVsxNV0gPSAoKGJ5dGVzLmxlbmd0aCAtIDEpICogOCkgJiAweGZmZmZmZmZmO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTjsgKytpKSB7XG4gICAgICAgIGNvbnN0IFcgPSBuZXcgVWludDMyQXJyYXkoODApO1xuICAgICAgICBmb3IgKGxldCB0ID0gMDsgdCA8IDE2OyArK3QpIHtcbiAgICAgICAgICAgIFdbdF0gPSBNW2ldW3RdO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHQgPSAxNjsgdCA8IDgwOyArK3QpIHtcbiAgICAgICAgICAgIFdbdF0gPSBST1RMKFdbdCAtIDNdIF4gV1t0IC0gOF0gXiBXW3QgLSAxNF0gXiBXW3QgLSAxNl0sIDEpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhID0gSFswXTtcbiAgICAgICAgbGV0IGIgPSBIWzFdO1xuICAgICAgICBsZXQgYyA9IEhbMl07XG4gICAgICAgIGxldCBkID0gSFszXTtcbiAgICAgICAgbGV0IGUgPSBIWzRdO1xuICAgICAgICBmb3IgKGxldCB0ID0gMDsgdCA8IDgwOyArK3QpIHtcbiAgICAgICAgICAgIGNvbnN0IHMgPSBNYXRoLmZsb29yKHQgLyAyMCk7XG4gICAgICAgICAgICBjb25zdCBUID0gKFJPVEwoYSwgNSkgKyBmKHMsIGIsIGMsIGQpICsgZSArIEtbc10gKyBXW3RdKSA+Pj4gMDtcbiAgICAgICAgICAgIGUgPSBkO1xuICAgICAgICAgICAgZCA9IGM7XG4gICAgICAgICAgICBjID0gUk9UTChiLCAzMCkgPj4+IDA7XG4gICAgICAgICAgICBiID0gYTtcbiAgICAgICAgICAgIGEgPSBUO1xuICAgICAgICB9XG4gICAgICAgIEhbMF0gPSAoSFswXSArIGEpID4+PiAwO1xuICAgICAgICBIWzFdID0gKEhbMV0gKyBiKSA+Pj4gMDtcbiAgICAgICAgSFsyXSA9IChIWzJdICsgYykgPj4+IDA7XG4gICAgICAgIEhbM10gPSAoSFszXSArIGQpID4+PiAwO1xuICAgICAgICBIWzRdID0gKEhbNF0gKyBlKSA+Pj4gMDtcbiAgICB9XG4gICAgcmV0dXJuIFVpbnQ4QXJyYXkub2YoSFswXSA+PiAyNCwgSFswXSA+PiAxNiwgSFswXSA+PiA4LCBIWzBdLCBIWzFdID4+IDI0LCBIWzFdID4+IDE2LCBIWzFdID4+IDgsIEhbMV0sIEhbMl0gPj4gMjQsIEhbMl0gPj4gMTYsIEhbMl0gPj4gOCwgSFsyXSwgSFszXSA+PiAyNCwgSFszXSA+PiAxNiwgSFszXSA+PiA4LCBIWzNdLCBIWzRdID4+IDI0LCBIWzRdID4+IDE2LCBIWzRdID4+IDgsIEhbNF0pO1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gc2hhMTtcbiIsImltcG9ydCB7IEV4dGVybmFsVHJhY2tlciB9IGZyb20gJy4vdHJhY2tlcic7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBnZXRDb25maWdGcm9tU2NyaXB0QXR0cmlidXRlcyB9IGZyb20gJy4uL2NvbmZpZy9zY3JpcHQtY29uZmlnJztcbmltcG9ydCB7IGNyZWF0ZVRyYWNrZXIgfSBmcm9tICcuLi9jb25maWcvZmFjdG9yeSc7XG5pbXBvcnQgeyBHTE9CQUxfVFJBQ0tJTkdfS0VZIH0gZnJvbSAnLi4vY29uZmlnL2NvbW1vbic7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0cmFja2VyIGZyb20gc2NyaXB0IGF0dHJpYnV0ZXNcbiAqIFxuICogQHJldHVybnMgVHJhY2tlciBpbnN0YW5jZSBpZiBzdWNjZXNzZnVsLCBudWxsIG90aGVyd2lzZVxuICovXG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZUZyb21TY3JpcHQgPSAoKTogRXh0ZXJuYWxUcmFja2VyIHwgbnVsbCA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2NyaXB0Q29uZmlnID0gZ2V0Q29uZmlnRnJvbVNjcmlwdEF0dHJpYnV0ZXMoKTtcbiAgICBcbiAgICBpZiAoIXNjcmlwdENvbmZpZykge1xuICAgICAgbG9nZ2VyLmNyaXRpY2FsKCdGYWlsZWQgdG8gaW5pdGlhbGl6ZTogaW52YWxpZCBvciBtaXNzaW5nIHNjcmlwdCBhdHRyaWJ1dGVzJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsb2dnZXIubG9nKCdJbml0aWFsaXppbmcgZnJvbSBzY3JpcHQgYXR0cmlidXRlcycpO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCB0cmFja2VyID0gY3JlYXRlVHJhY2tlcihzY3JpcHRDb25maWcpO1xuICAgICAgXG4gICAgICAvLyBTdG9yZSBpbiBnbG9iYWwgdHJhY2tpbmcgb2JqZWN0XG4gICAgICBjb25zdCB3ID0gd2luZG93IGFzIGFueTtcbiAgICAgIHdbR0xPQkFMX1RSQUNLSU5HX0tFWV0gPSB3W0dMT0JBTF9UUkFDS0lOR19LRVldIHx8IHt9O1xuICAgICAgd1tHTE9CQUxfVFJBQ0tJTkdfS0VZXS50cmFja2VyID0gdHJhY2tlcjtcbiAgICAgIHdbR0xPQkFMX1RSQUNLSU5HX0tFWV0uY29uZmlnID0gc2NyaXB0Q29uZmlnO1xuICAgICAgXG4gICAgICBsb2dnZXIubG9nKCdUcmFja2VyIGluaXRpYWxpemVkIHN1Y2Nlc3NmdWxseScpO1xuICAgICAgcmV0dXJuIHRyYWNrZXI7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZ2dlci5jcml0aWNhbCgnRmFpbGVkIHRvIGNyZWF0ZSB0cmFja2VyOicsIGVycm9yKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2dnZXIuY3JpdGljYWwoJ0Vycm9yIGR1cmluZyBpbml0aWFsaXphdGlvbjonLCBlcnJvcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07ICIsImltcG9ydCB7IGdldFVzZXJEYXRhLCBsb2dnZXIgfSBmcm9tICcuLi8uLi91dGlscyc7XG5pbXBvcnQgdHlwZSB7IFRyYWNraW5nQ29udGV4dCB9IGZyb20gJy4vdHlwZXMnO1xuXG4vKipcbiAqIEV4dHJhY3RzIHRyYWNraW5nIGNvbnRleHQgZnJvbSB0cmFja2VyIGluc3RhbmNlXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRUcmFja2luZ0NvbnRleHQgPSAodHJhY2tlcjogdW5rbm93bik6IFRyYWNraW5nQ29udGV4dCB8IG51bGwgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgc3RhdGUsIGFwaUNsaWVudCB9ID0gdHJhY2tlciBhcyBhbnk7XG4gICAgY29uc3QgdXNlckRhdGEgPSBnZXRVc2VyRGF0YSgpO1xuXG4gICAgaWYgKCFzdGF0ZT8udHJhY2tpbmdJZCB8fCAhc3RhdGU/LnNlc3Npb25JZCB8fCAhYXBpQ2xpZW50Py5hcGlFbmRwb2ludCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRyYWNraW5nSWQ6IHN0YXRlLnRyYWNraW5nSWQsXG4gICAgICBzZXNzaW9uSWQ6IHN0YXRlLnNlc3Npb25JZCxcbiAgICAgIGFwaUVuZHBvaW50OiBhcGlDbGllbnQuYXBpRW5kcG9pbnQsXG4gICAgICBsb2NhdGlvbklkOiBzdGF0ZS5sb2NhdGlvbklkLFxuICAgICAgY29udGFjdElkOiB1c2VyRGF0YT8uY29udGFjdElkLFxuICAgICAgdXNlcklkOiB1c2VyRGF0YT8udXNlcklkLFxuICAgIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbG9nZ2VyLmVycm9yKCdGYWlsZWQgdG8gcmVzb2x2ZSB0cmFja2luZyBjb250ZXh0JywgZXJyb3IpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59O1xuIiwiLyoqXG4gKiBDb21tb24gY29uc3RhbnRzIHNoYXJlZCBhY3Jvc3MgdGhlIHRyYWNraW5nIGxpYnJhcnlcbiAqL1xuXG5leHBvcnQgY29uc3QgQVBJX0VORFBPSU5UUyA9IHtcbiAgcHJvZHVjdGlvbjogJ2h0dHBzOi8vYmFja2VuZC5sZWFkY29ubmVjdG9yaHEuY29tJyxcbiAgc3RhZ2luZzogJ2h0dHBzOi8vc3RhZ2luZy5iYWNrZW5kLmxlYWRjb25uZWN0b3JocS5jb20nLFxuICBsb2NhbDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NjEwMCcsXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgTE9HR0VSX1BSRUZJWCA9ICdbTEMgVHJhY2tpbmddJztcbmV4cG9ydCBjb25zdCBMT0dHRVJfRVJST1JfUFJFRklYID0gJ1tMQyBUcmFja2luZyBFUlJPUl0nO1xuXG4vLyBOYW1lIG9mIHRoZSBnbG9iYWwgd2luZG93IGtleSBmb3IgdG9nZ2xlcyBhbmQgcmVmZXJlbmNlc1xuZXhwb3J0IGNvbnN0IEdMT0JBTF9UUkFDS0lOR19LRVkgPSAnX2xjVHJhY2tpbmcnO1xuXG4vLyBTY3JpcHQgYmFzZSBuYW1lIHRvIGRldGVjdCBydW5uaW5nIGNvbnRleHRcbmV4cG9ydCBjb25zdCBTQ1JJUFRfQkFTRU5BTUUgPSAnZXh0ZXJuYWwtdHJhY2tpbmcnO1xuXG5cbiIsIi8qKlxuICogSW50ZXJmYWNlIGZvciBmb3JtIHBhcnNpbmcgcmVzdWx0c1xuICovXG5pbXBvcnQgeyBpc1Bhc3N3b3JkTGlrZUZpZWxkIH0gZnJvbSAnLi9maWVsZC11dGlscyc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQge1xuICBnZXRHcmF2aXR5Rm9ybXNDb21iaW5lZExhYmVsLFxuICBHcmF2aXR5Rm9ybXMsXG4gIGNsZWFuTGFiZWxUZXh0LFxufSBmcm9tICcuLi9oZWxwZXJzL2Zvcm0tYnVpbGRlcnMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZvcm1QYXJzZVJlc3VsdCB7XG4gIGZpZWxkRGF0YTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgZmllbGRMYWJlbHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIGZpbGVzOiBSZWNvcmQ8c3RyaW5nLCBGaWxlW10+O1xufVxuXG4vKipcbiAqIFBhcnNlIGZvcm0gZGF0YSBmcm9tIEhUTUwgZm9ybSBlbGVtZW50IHdpdGggbGFiZWwgYW5hbHlzaXNcbiAqIE9ubHkgY2FwdHVyZXMgdmlzaWJsZSwgZW5hYmxlZCBmaWVsZHMgd2l0aCBuYW1lIGF0dHJpYnV0ZXNcbiAqIFxuICogQHBhcmFtIGZvcm0gLSBIVE1MIGZvcm0gZWxlbWVudCB0byBwYXJzZVxuICogQHJldHVybnMgT2JqZWN0IGNvbnRhaW5pbmcgZmllbGQgZGF0YSBhbmQgbGFiZWxzXG4gKiBcbiAqIExvZ2ljIGZsb3c6XG4gKiAxLiBFeHRyYWN0IGZpZWxkIGRhdGEgZnJvbSBmb3JtIHVzaW5nIEZvcm1EYXRhIEFQSVxuICogMi4gRXh0cmFjdCBmaWVsZCBsYWJlbHMgYnkgYW5hbHl6aW5nIGZvcm0gc3RydWN0dXJlXG4gKiAzLiBSZXR1cm4gYm90aCBkYXRhIGFuZCBsYWJlbHMgZm9yIGNvbXBsZXRlIGZvcm0gY29udGV4dFxuICovXG5leHBvcnQgY29uc3QgcGFyc2VGb3JtRGF0YSA9IChmb3JtOiBIVE1MRm9ybUVsZW1lbnQpOiBGb3JtUGFyc2VSZXN1bHQgPT4ge1xuICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTtcbiAgY29uc3QgZmllbGREYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gIGNvbnN0IGZpZWxkTGFiZWxzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGNvbnN0IGZpbGVzQnlGaWVsZDogUmVjb3JkPHN0cmluZywgRmlsZVtdPiA9IHt9O1xuXG4gIC8vIEJ1aWxkIGEgdW5pcXVlIHNldCBvZiBrZXlzIHByZXNlbnQgaW4gdGhlIHN1Ym1pdHRlZCBGb3JtRGF0YVxuICBjb25zdCBrZXlzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIHRyeSB7XG4gICAgLy8gRm9ybURhdGEua2V5cygpIGl0ZXJhdG9yIG1heSBkdXBsaWNhdGUga2V5czsgU2V0IG5vcm1hbGl6ZXNcbiAgICBmb3IgKGNvbnN0IGtleSBvZiAoZm9ybURhdGEgYXMgYW55KS5rZXlzPy4oKSB8fCBbXSkge1xuICAgICAga2V5cy5hZGQoU3RyaW5nKGtleSkpO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGxvZ2dlci5lcnJvcignRXJyb3IgaXRlcmF0aW5nIEZvcm1EYXRhIGtleXM7IGZhbGxpbmcgYmFjayB0byBGb3JtRGF0YS5mb3JFYWNoJywgZSk7XG4gICAgLy8gRmFsbGJhY2s6IGl0ZXJhdGUgZW50cmllc1xuICAgIGZvcm1EYXRhLmZvckVhY2goKF8sIGtleSkgPT4ga2V5cy5hZGQoa2V5KSk7XG4gIH1cblxuICBjb25zdCBnZXRBbGxWYWx1ZXMgPSAoa2V5OiBzdHJpbmcpOiBhbnlbXSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IChmb3JtRGF0YSBhcyBhbnkpLmdldEFsbD8uKGtleSk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSByZXR1cm4gdmFsdWVzO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgY2FsbGluZyBGb3JtRGF0YS5nZXRBbGw7IGZhbGxpbmcgYmFjayB0byBtYW51YWwgY29sbGVjdGlvbicsIGUpO1xuICAgIH1cbiAgICAvLyBGYWxsYmFjazogY29sbGVjdCB2aWEgZW50cmllc1xuICAgIGNvbnN0IGNvbGxlY3RlZDogYW55W10gPSBbXTtcbiAgICBmb3JtRGF0YS5mb3JFYWNoKCh2YWx1ZSwgaykgPT4ge1xuICAgICAgaWYgKGsgPT09IGtleSkgY29sbGVjdGVkLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiBjb2xsZWN0ZWQ7XG4gIH07XG5cbiAgY29uc3QgZXNjYXBlQ3NzID0gKHM6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIEB0cy1pZ25vcmU6IENTUyBuYW1lc3BhY2UgbWF5IG5vdCBleGlzdCBpbiBvbGRlciBlbnZpcm9ubWVudHNcbiAgICAgIHJldHVybiAod2luZG93IGFzIGFueSkuQ1NTPy5lc2NhcGUgPyAod2luZG93IGFzIGFueSkuQ1NTLmVzY2FwZShzKSA6IHMucmVwbGFjZSgvKFsjLjs6IStcXC1cXFtcXF1cXChcXClcXHtcXH1dKS9nLCAnXFxcXCQxJyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBlc2NhcGluZyBDU1Mgc2VsZWN0b3I7IHVzaW5nIHVuZXNjYXBlZCB2YWx1ZScsIGUpO1xuICAgICAgcmV0dXJuIHM7XG4gICAgfVxuICB9O1xuXG4gIC8vIEluZmVyIHZhbHVlcyB3aXRoIGJldHRlciBoYW5kbGluZyBmb3IgbXVsdGktc2VsZWN0cywgY2hlY2tib3ggZ3JvdXBzLCByYWRpb3MgYW5kIGZpbGVzXG4gIGtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgY29uc3QgdmFsdWVzID0gZ2V0QWxsVmFsdWVzKGtleSk7XG5cbiAgICAvLyBJZGVudGlmeSBlbGVtZW50cyBieSBuYW1lXG4gICAgY29uc3Qgc2VsZWN0b3IgPSBgW25hbWU9XCIke2VzY2FwZUNzcyhrZXkpfVwiXWA7XG4gICAgY29uc3QgZWxlbWVudHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG4gICAgY29uc3QgZmlyc3RFbCA9IGVsZW1lbnRzWzBdIGFzXG4gICAgICB8IEhUTUxJbnB1dEVsZW1lbnRcbiAgICAgIHwgSFRNTFNlbGVjdEVsZW1lbnRcbiAgICAgIHwgSFRNTFRleHRBcmVhRWxlbWVudFxuICAgICAgfCB1bmRlZmluZWQ7XG4gICAgY29uc3QgdGFnID0gKGZpcnN0RWw/LnRhZ05hbWUgfHwgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgdHlwZSA9IChmaXJzdEVsIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCB1bmRlZmluZWQpPy50eXBlPy50b0xvd2VyQ2FzZT8uKCkgfHwgJyc7XG4gICAgY29uc3QgaXNNdWx0aXBsZVNlbGVjdCA9IHRhZyA9PT0gJ3NlbGVjdCcgJiYgKGZpcnN0RWwgYXMgSFRNTFNlbGVjdEVsZW1lbnQgfCB1bmRlZmluZWQpPy5tdWx0aXBsZSA9PT0gdHJ1ZTtcblxuICAgIC8vIFNraXAgaGlkZGVuIGZpZWxkcyAoZS5nLiwgR3Jhdml0eSBGb3JtcyBpbnRlcm5hbCBmaWVsZHMgbGlrZSBnZm9ybV9zdWJtaXQsIHN0YXRlXzEsIGV0Yy4pXG4gICAgaWYgKHRhZyA9PT0gJ2lucHV0JyAmJiB0eXBlID09PSAnaGlkZGVuJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgRmlsZSBvYmplY3RzIHRvIGEgc2FmZSBtZXRhZGF0YSBvYmplY3QgZm9yIHN1Ym1pc3Npb25cbiAgICBjb25zdCBtYXBGaWxlID0gKHY6IGFueSk6IGFueSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIEZpbGUgIT09ICd1bmRlZmluZWQnICYmIHYgaW5zdGFuY2VvZiBGaWxlKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZpbGVuYW1lOiB2Lm5hbWUgfHwgJ3VwbG9hZGVkX2ZpbGUnLFxuICAgICAgICAgICAgc2l6ZTogdHlwZW9mIHYuc2l6ZSA9PT0gJ251bWJlcicgPyB2LnNpemUgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB0eXBlOiAodiBhcyBhbnkpPy50eXBlIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgbWFwcGluZyBmaWxlIG1ldGFkYXRhJywgZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdjtcbiAgICB9O1xuXG4gICAgLy8gU29tZSBmb3JtIGJ1aWxkZXJzIChIYXBweSBGb3JtcykgdXNlIG51bWVyaWMgaW5kaWNlcyBhcyBvcHRpb24gdmFsdWVzLlxuICAgIC8vIFJlc29sdmUgdG8gdGhlIHZpc2libGUgbGFiZWwgdGV4dCBzbyBkb3duc3RyZWFtIG1hcHBpbmcgcmVjZWl2ZXMgbWVhbmluZ2Z1bCBkYXRhLlxuICAgIGNvbnN0IHJlc29sdmVPcHRpb25UZXh0ID0gKGVsOiBIVE1MSW5wdXRFbGVtZW50KTogc3RyaW5nID0+IHtcbiAgICAgIGNvbnN0IHJhdyA9IFN0cmluZyhlbC52YWx1ZSk7XG4gICAgICBpZiAoIS9eXFxkKyQvLnRlc3QocmF3KSkgcmV0dXJuIHJhdztcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBlbC5jbG9zZXN0KCdsYWJlbCcpO1xuICAgICAgICBpZiAod3JhcHBlcikge1xuICAgICAgICAgIGNvbnN0IGNsb25lID0gd3JhcHBlci5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTExhYmVsRWxlbWVudDtcbiAgICAgICAgICBjbG9uZS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpLmZvckVhY2goKGMpID0+IGMucmVtb3ZlKCkpO1xuICAgICAgICAgIGNvbnN0IHRleHQgPSBjbG9uZS50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgIGlmICh0ZXh0KSByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWwuaWQpIHtcbiAgICAgICAgICBjb25zdCBmb3JMYWJlbCA9IGZvcm0ucXVlcnlTZWxlY3RvcihgbGFiZWxbZm9yPVwiJHtlbC5pZH1cIl1gKTtcbiAgICAgICAgICBpZiAoZm9yTGFiZWw/LnRleHRDb250ZW50Py50cmltKCkpIHJldHVybiBmb3JMYWJlbC50ZXh0Q29udGVudCEudHJpbSgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5leHQgPSBlbC5uZXh0U2libGluZztcbiAgICAgICAgaWYgKG5leHQ/LnRleHRDb250ZW50Py50cmltKCkpIHJldHVybiBuZXh0LnRleHRDb250ZW50IS50cmltKCk7XG4gICAgICB9IGNhdGNoIChlKSB7IGxvZ2dlci5lcnJvcignRXJyb3IgcmVzb2x2aW5nIG9wdGlvbiB0ZXh0IGZyb20gRE9NJywgZSk7IH1cbiAgICAgIHJldHVybiByYXc7XG4gICAgfTtcblxuICAgIGNvbnN0IHJlc29sdmVTZWxlY3RUZXh0ID0gKHNlbDogSFRNTFNlbGVjdEVsZW1lbnQsIHZhbDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgIGlmICghL15cXGQrJC8udGVzdCh2YWwpKSByZXR1cm4gdmFsO1xuICAgICAgY29uc3Qgb3B0ID0gQXJyYXkuZnJvbShzZWwub3B0aW9ucykuZmluZCgobykgPT4gby52YWx1ZSA9PT0gdmFsKTtcbiAgICAgIHJldHVybiBvcHQ/LnRleHRDb250ZW50Py50cmltKCkgfHwgdmFsO1xuICAgIH07XG5cbiAgICAvLyBOb3JtYWxpemUgY2hlY2tib3gvcmFkaW8vc2VsZWN0IGJlaGF2aW9yc1xuICAgIGlmICh0YWcgPT09ICdpbnB1dCcgJiYgdHlwZSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgY29uc3QgY2hlY2tlZCA9IEFycmF5LmZyb20oZWxlbWVudHMpLmZpbHRlcihcbiAgICAgICAgKGVsKSA9PiAoZWwgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZCxcbiAgICAgICkgYXMgSFRNTElucHV0RWxlbWVudFtdO1xuICAgICAgaWYgKGNoZWNrZWQubGVuZ3RoID4gMSkge1xuICAgICAgICBmaWVsZERhdGFba2V5XSA9IGNoZWNrZWQubWFwKChlbCkgPT4gcmVzb2x2ZU9wdGlvblRleHQoZWwpKTtcbiAgICAgIH0gZWxzZSBpZiAoY2hlY2tlZC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgZmllbGREYXRhW2tleV0gPSByZXNvbHZlT3B0aW9uVGV4dChjaGVja2VkWzBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpZWxkRGF0YVtrZXldID0gdmFsdWVzLmxlbmd0aCA+IDEgPyBbXSA6IGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0YWcgPT09ICdpbnB1dCcgJiYgdHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgY29uc3QgY2hlY2tlZCA9IEFycmF5LmZyb20oZWxlbWVudHMpLmZpbmQoXG4gICAgICAgIChlbCkgPT4gKGVsIGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQsXG4gICAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCB1bmRlZmluZWQ7XG4gICAgICBmaWVsZERhdGFba2V5XSA9IGNoZWNrZWQgPyByZXNvbHZlT3B0aW9uVGV4dChjaGVja2VkKSA6IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaXNNdWx0aXBsZVNlbGVjdCkge1xuICAgICAgY29uc3Qgc2VsID0gZmlyc3RFbCBhcyBIVE1MU2VsZWN0RWxlbWVudDtcbiAgICAgIGZpZWxkRGF0YVtrZXldID0gdmFsdWVzLm1hcCgodikgPT4gcmVzb2x2ZVNlbGVjdFRleHQoc2VsLCBTdHJpbmcodikpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGFnID09PSAnc2VsZWN0Jykge1xuICAgICAgY29uc3Qgc2VsID0gZmlyc3RFbCBhcyBIVE1MU2VsZWN0RWxlbWVudDtcbiAgICAgIGNvbnN0IHJhdyA9IHZhbHVlc1swXTtcbiAgICAgIGZpZWxkRGF0YVtrZXldID0gcmF3ID09PSB1bmRlZmluZWQgPyBudWxsIDogcmVzb2x2ZVNlbGVjdFRleHQoc2VsLCBTdHJpbmcocmF3KSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRhZyA9PT0gJ2lucHV0JyAmJiB0eXBlID09PSAnZmlsZScpIHtcbiAgICAgIC8vIENhcHR1cmUgcmVhbCBGaWxlIG9iamVjdHMgc28gd2UgY2FuIHNlbmQgbXVsdGlwYXJ0L2Zvcm0tZGF0YVxuICAgICAgY29uc3QgZmlsZUxpc3Q6IEZpbGVbXSA9IFtdO1xuICAgICAgY29uc3QgbWV0YUxpc3Q6IGFueVtdID0gW107XG4gICAgICB2YWx1ZXMuZm9yRWFjaCgodjogYW55KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBGaWxlICE9PSAndW5kZWZpbmVkJyAmJiB2IGluc3RhbmNlb2YgRmlsZSkge1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9ICh2Lm5hbWUgfHwgJycpLnRyaW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHNpemUgPSB0eXBlb2Ygdi5zaXplID09PSAnbnVtYmVyJyA/IHYuc2l6ZSA6IDA7XG4gICAgICAgICAgICAvLyBXaGVuIG5vIGZpbGUgaXMgc2VsZWN0ZWQsIGJyb3dzZXJzIHN0aWxsIGNyZWF0ZSBhIEZpbGUgd2l0aFxuICAgICAgICAgICAgLy8gZW1wdHkgbmFtZSBhbmQgc2l6ZSAwLiBUcmVhdCB0aGF0IGFzIFwibm8gZmlsZVwiIHNvIHdlIGRvbid0XG4gICAgICAgICAgICAvLyBzZW5kIGFuIGVtcHR5IGJpbmFyeSBwYXJ0IHRvIHRoZSBiYWNrZW5kLlxuICAgICAgICAgICAgaWYgKCFuYW1lICYmIHNpemUgPT09IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlsZUxpc3QucHVzaCh2IGFzIEZpbGUpO1xuICAgICAgICAgICAgbWV0YUxpc3QucHVzaChtYXBGaWxlKHYpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIHByb2Nlc3NpbmcgZmlsZSBpbnB1dCB2YWx1ZScsIGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChmaWxlTGlzdC5sZW5ndGgpIHtcbiAgICAgICAgZmlsZXNCeUZpZWxkW2tleV0gPSBmaWxlTGlzdDtcbiAgICAgIH1cbiAgICAgIC8vIFByZXNlcnZlIGxpZ2h0d2VpZ2h0IG1ldGFkYXRhIGluIGZpZWxkRGF0YSBmb3IgbWFwcGluZy9VSSBwYXJpdHlcbiAgICAgIGlmIChtZXRhTGlzdC5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZpZWxkRGF0YVtrZXldID0gbWV0YUxpc3Q7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWVsZERhdGFba2V5XSA9IG1ldGFMaXN0WzBdIHx8IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRGVmYXVsdCBiZWhhdmlvcjogaWYgbXVsdGlwbGUgdmFsdWVzIGZvciBzYW1lIGtleSAoZS5nLiwgdGV4dCBib3ggbGlzdCksIHJldHVybiBhcnJheVxuICAgIGlmICh2YWx1ZXMubGVuZ3RoID4gMSkge1xuICAgICAgZmllbGREYXRhW2tleV0gPSB2YWx1ZXMubWFwKCh2KSA9PiBTdHJpbmcodikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCByYXcgPSB2YWx1ZXNbMF07XG4gICAgICBjb25zdCBzdHIgPSByYXcgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IFN0cmluZyhyYXcpO1xuICAgICAgZmllbGREYXRhW2tleV0gPSBzdHIgPT09ICcnID8gbnVsbCA6IHN0cjtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEVuc3VyZSB1bmNoZWNrZWQgc2luZ2xlIGNoZWNrYm94ZXMgYXJlIGNhcHR1cmVkIGFzIGZhbHNlIGFuZCBtdWx0aSBncm91cHMgYXMgW11cbiAgdHJ5IHtcbiAgICBjb25zdCBhbGxDaGVja2JveGVzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl1bbmFtZV0nKTtcbiAgICBjb25zdCBzZWVuOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge307XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxDaGVja2JveGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBlbCA9IGFsbENoZWNrYm94ZXNbaV0gYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgIGNvbnN0IG4gPSBlbC5uYW1lO1xuICAgICAgaWYgKCFuIHx8IGVsLmRpc2FibGVkKSBjb250aW51ZTtcbiAgICAgIHNlZW5bbl0gPSAoc2VlbltuXSB8fCAwKSArIDE7XG4gICAgfVxuICAgIE9iamVjdC5rZXlzKHNlZW4pLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgIGlmICghKG5hbWUgaW4gZmllbGREYXRhKSkge1xuICAgICAgICBmaWVsZERhdGFbbmFtZV0gPSBzZWVuW25hbWVdID4gMSA/IFtdIDogZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIG5vcm1hbGl6aW5nIHVuY2hlY2tlZCBjaGVja2JveCB2YWx1ZXMnLCBlKTtcbiAgfVxuXG4gIC8vIEVuc3VyZSBlbXB0eSBtdWx0aS1zZWxlY3RzIGFyZSBbXVxuICB0cnkge1xuICAgIGNvbnN0IG11bHRpU2VsZWN0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnc2VsZWN0W211bHRpcGxlXVtuYW1lXScpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbXVsdGlTZWxlY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBlbCA9IG11bHRpU2VsZWN0c1tpXSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcbiAgICAgIGNvbnN0IG4gPSBlbC5uYW1lO1xuICAgICAgaWYgKCFuIHx8IGVsLmRpc2FibGVkKSBjb250aW51ZTtcbiAgICAgIGlmICghKG4gaW4gZmllbGREYXRhKSkgZmllbGREYXRhW25dID0gW107XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgbG9nZ2VyLmVycm9yKCdFcnJvciBub3JtYWxpemluZyBlbXB0eSBtdWx0aS1zZWxlY3QgdmFsdWVzJywgZSk7XG4gIH1cblxuICAvLyBOb3JtYWxpemUgc2lnbmF0dXJlcyBpZiBwcmVzZW50IGFzIGJhc2U2NCBzdHJpbmdzXG4gIHRyeSB7XG4gICAgT2JqZWN0LmtleXMoZmllbGREYXRhKS5mb3JFYWNoKChrKSA9PiB7XG4gICAgICBjb25zdCB2ID0gZmllbGREYXRhW2tdO1xuICAgICAgaWYgKHR5cGVvZiB2ID09PSAnc3RyaW5nJyAmJiAvc2lnbmF0dXJlL2kudGVzdChrKSkge1xuICAgICAgICBjb25zdCBzID0gdi50cmltKCk7XG4gICAgICAgIGlmIChzLnN0YXJ0c1dpdGgoJ2RhdGE6aW1hZ2UnKSkge1xuICAgICAgICAgIC8vIFVzZSBhIGRhdGFVcmwgcHJvcGVydHkgc28gZG93bnN0cmVhbSBzZXJ2aWNlc1xuICAgICAgICAgIC8vIGNhbiByZWxpYWJseSBkZXRlY3QgYW5kIHByb2Nlc3MgdGhlIHNpZ25hdHVyZS5cbiAgICAgICAgICBmaWVsZERhdGFba10gPSB7IHR5cGU6ICdzaWduYXR1cmUnLCBkYXRhVXJsOiBzIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGxvZ2dlci5lcnJvcignRXJyb3Igbm9ybWFsaXppbmcgc2lnbmF0dXJlIGZpZWxkcycsIGUpO1xuICB9XG5cbiAgLy8gRXh0cmFjdCBmaWVsZCBsYWJlbHMgZm9yIG1hcHBpbmdcbiAgY29uc3QgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCwgc2VsZWN0LCB0ZXh0YXJlYScpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBpbnB1dHNbaV07XG4gICAgY29uc3QgaW5wdXQgPSBlbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG4gICAgY29uc3QgZmllbGROYW1lID0gaW5wdXQubmFtZTtcblxuICAgIC8vIFNraXAgaW52YWxpZCBvciBleGNsdWRlZCBmaWVsZHNcbiAgICBpZiAoIXNob3VsZEluY2x1ZGVGaWVsZChpbnB1dCwgZmllbGROYW1lLCBmaWVsZERhdGEpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBFeHRyYWN0IGxhYmVsIHRvIGV2YWx1YXRlIHNlbnNpdGl2aXR5IGFuZCBmb3IgbWFwcGluZyBpZiBub24tc2Vuc2l0aXZlXG4gICAgY29uc3QgbGFiZWxUZXh0ID0gZXh0cmFjdEZpZWxkTGFiZWwoZm9ybSwgaW5wdXQpO1xuXG4gICAgaWYgKGlzUGFzc3dvcmRMaWtlRmllbGQoaW5wdXQsIGxhYmVsVGV4dCkpIHtcbiAgICAgIC8vIFJlbW92ZSBhbnkgcHJldmlvdXNseSBjYXB0dXJlZCB2YWx1ZSBmb3IgdGhpcyBzZW5zaXRpdmUgZmllbGRcbiAgICAgIGlmIChmaWVsZE5hbWUgaW4gZmllbGREYXRhKSB7XG4gICAgICAgIGRlbGV0ZSBmaWVsZERhdGFbZmllbGROYW1lXTtcbiAgICAgIH1cbiAgICAgIC8vIERvIG5vdCByZWNvcmQgYSBsYWJlbCBmb3Igc2Vuc2l0aXZlIGZpZWxkc1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gRXh0cmFjdCBsYWJlbCB0ZXh0IGZvciB0aGlzIG5vbi1zZW5zaXRpdmUgZmllbGRcbiAgICBpZiAobGFiZWxUZXh0KSB7XG4gICAgICBmaWVsZExhYmVsc1tmaWVsZE5hbWVdID0gbGFiZWxUZXh0O1xuICAgIH1cbiAgfVxuXG4gIC8vIFNwZWNpYWwgaGFuZGxpbmcgZm9yIHRlcm1zX2FuZF9jb25kaXRpb25zOlxuICAvLyBpZiB0aGUgY2hlY2tib3ggaXMgY2hlY2tlZCwgc2V0IGl0cyB2YWx1ZSB0byB0aGVcbiAgLy8gY29ycmVzcG9uZGluZyBsYWJlbCB0ZXh0IHdoZW4gYXZhaWxhYmxlLCBvdGhlcndpc2VcbiAgLy8gZGVmYXVsdCB0byBib29sZWFuIHRydWUuXG4gIHRyeSB7XG4gICAgaWYgKCd0ZXJtc19hbmRfY29uZGl0aW9ucycgaW4gZmllbGREYXRhKSB7XG4gICAgICBjb25zdCBjdXJyZW50ID0gZmllbGREYXRhWyd0ZXJtc19hbmRfY29uZGl0aW9ucyddO1xuICAgICAgaWYgKGN1cnJlbnQgPT09IHRydWUpIHtcbiAgICAgICAgY29uc3QgbGFiZWwgPSBmaWVsZExhYmVsc1sndGVybXNfYW5kX2NvbmRpdGlvbnMnXTtcbiAgICAgICAgZmllbGREYXRhWyd0ZXJtc19hbmRfY29uZGl0aW9ucyddID0gbGFiZWwgfHwgdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGFwcGx5aW5nIHRlcm1zX2FuZF9jb25kaXRpb25zIGxhYmVsIG1hcHBpbmc7IGZhbGxpbmcgYmFjayB0byByYXcgdmFsdWUnLCBlKTtcbiAgfVxuXG4gIC8vIFJldHVybiBvcmlnaW5hbCBmaWVsZCBkYXRhIHdpdGggbGFiZWxzIC0gYmFja2VuZCBtYXRjaGVzIGJ5IGxhYmVsIGZvciBmaWVsZCBtYXBwaW5nXG4gIHJldHVybiB7IGZpZWxkRGF0YSwgZmllbGRMYWJlbHMsIGZpbGVzOiBmaWxlc0J5RmllbGQgfTtcbn07XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiBhIGZpZWxkIHNob3VsZCBiZSBpbmNsdWRlZCBpbiBmb3JtIGRhdGFcbiAqIFxuICogQHBhcmFtIGlucHV0IC0gSFRNTCBpbnB1dCBlbGVtZW50XG4gKiBAcGFyYW0gZmllbGROYW1lIC0gTmFtZSBhdHRyaWJ1dGUgb2YgdGhlIGZpZWxkXG4gKiBAcGFyYW0gZmllbGREYXRhIC0gQ3VycmVudCBmaWVsZCBkYXRhIG9iamVjdFxuICogQHJldHVybnMgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIGZpZWxkIHNob3VsZCBiZSBpbmNsdWRlZFxuICovXG5jb25zdCBzaG91bGRJbmNsdWRlRmllbGQgPSAoXG4gIGlucHV0OiBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50LFxuICBmaWVsZE5hbWU6IHN0cmluZyxcbiAgZmllbGREYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG4pOiBib29sZWFuID0+IHtcbiAgLy8gU2tpcCBmaWVsZHMgd2l0aG91dCBuYW1lIGF0dHJpYnV0ZVxuICBpZiAoIWZpZWxkTmFtZSkgcmV0dXJuIGZhbHNlO1xuICBcbiAgLy8gU2tpcCBoaWRkZW4gb3IgZGlzYWJsZWQgaW5wdXRzICBcbiAgaWYgKGlucHV0LmRpc2FibGVkKSByZXR1cm4gZmFsc2U7XG4gIGlmIChpbnB1dC50eXBlID09PSAnaGlkZGVuJykgcmV0dXJuIGZhbHNlO1xuICBcbiAgLy8gU2tpcCBpbnZpc2libGUgaW5wdXRzXG4gIGlmICghaXNGaWVsZFZpc2libGUoaW5wdXQpKSByZXR1cm4gZmFsc2U7XG4gIFxuICAvLyBTa2lwIGlmIGZpZWxkIGlzIG5vdCBpbiB0aGUgc3VibWl0dGVkIGZvcm0gZGF0YVxuICBpZiAoIShmaWVsZE5hbWUgaW4gZmllbGREYXRhKSkgcmV0dXJuIGZhbHNlO1xuICBcbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGZvcm0gZmllbGQgaXMgdmlzaWJsZSB0byB0aGUgdXNlclxuICogXG4gKiBAcGFyYW0gaW5wdXQgLSBIVE1MIGlucHV0IGVsZW1lbnQgdG8gY2hlY2tcbiAqIEByZXR1cm5zIGJvb2xlYW4gaW5kaWNhdGluZyBpZiBmaWVsZCBpcyB2aXNpYmxlXG4gKi9cbmNvbnN0IGlzRmllbGRWaXNpYmxlID0gKGlucHV0OiBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50KTogYm9vbGVhbiA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgY29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGlucHV0KTtcbiAgICByZXR1cm4gIShcbiAgICAgIGNvbXB1dGVkU3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnIHx8XG4gICAgICBjb21wdXRlZFN0eWxlLnZpc2liaWxpdHkgPT09ICdoaWRkZW4nIHx8XG4gICAgICAoY29tcHV0ZWRTdHlsZS5vcGFjaXR5ID8/ICcxJykgPT09ICcwJ1xuICAgICk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGNoZWNraW5nIGZvcm0gZmllbGQgdmlzaWJpbGl0eScsIGUpO1xuICAgIC8vIElmIHdlIGNhbid0IGdldCBjb21wdXRlZCBzdHlsZSwgYXNzdW1lIHZpc2libGVcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxuLyoqXG4gKiBFeHRyYWN0cyBsYWJlbCB0ZXh0IGZvciBhIGZvcm0gZmllbGQgdXNpbmcgbXVsdGlwbGUgc3RyYXRlZ2llc1xuICogU3VwcG9ydHM6IEdyYXZpdHkgRm9ybXMsIE5pbmphIEZvcm1zLCBhbmQgc3RhbmRhcmQgSFRNTCBmb3Jtc1xuICogXG4gKiBAcGFyYW0gZm9ybSAtIEhUTUwgZm9ybSBlbGVtZW50XG4gKiBAcGFyYW0gaW5wdXQgLSBIVE1MIGlucHV0IGVsZW1lbnRcbiAqIEByZXR1cm5zIExhYmVsIHRleHQgb3IgZW1wdHkgc3RyaW5nIGlmIG5vdCBmb3VuZFxuICovXG5jb25zdCBleHRyYWN0RmllbGRMYWJlbCA9IChcbiAgZm9ybTogSFRNTEZvcm1FbGVtZW50LFxuICBpbnB1dDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudFxuKTogc3RyaW5nID0+IHtcbiAgLy8gRm9yIEdyYXZpdHkgRm9ybXMgY29tcG91bmQgZmllbGRzLCB0cnkgdG8gZ2V0IHN1YmxhYmVsIChhbHJlYWR5IGNsZWFuZWQpXG4gIGNvbnN0IGdyYXZpdHlGb3Jtc0xhYmVsID0gZ2V0R3Jhdml0eUZvcm1zQ29tYmluZWRMYWJlbChmb3JtLCBpbnB1dCk7XG4gIGlmIChncmF2aXR5Rm9ybXNMYWJlbCkgcmV0dXJuIGdyYXZpdHlGb3Jtc0xhYmVsO1xuICBcbiAgLy8gVHJ5IGV4cGxpY2l0IGxhYmVsIGFzc29jaWF0aW9uIGZpcnN0ICh3b3JrcyB3aXRoIHN0YW5kYXJkIGh0bWxGb3IgcGF0dGVybnMpXG4gIGNvbnN0IGZvckxhYmVsID0gZ2V0TGFiZWxCeUZvckF0dHJpYnV0ZShmb3JtLCBpbnB1dCk7XG4gIGlmIChmb3JMYWJlbCkgcmV0dXJuIGNsZWFuTGFiZWxUZXh0KGZvckxhYmVsKTtcbiAgXG4gIC8vIFRyeSBwYXJlbnQgbGFiZWwgZWxlbWVudFxuICBjb25zdCBwYXJlbnRMYWJlbCA9IGdldFBhcmVudExhYmVsKGlucHV0KTtcbiAgaWYgKHBhcmVudExhYmVsKSByZXR1cm4gY2xlYW5MYWJlbFRleHQocGFyZW50TGFiZWwpO1xuICBcbiAgLy8gVHJ5IGFkamFjZW50IGxhYmVsIChwcmV2aW91cyBzaWJsaW5nKVxuICBjb25zdCBhZGphY2VudExhYmVsID0gZ2V0QWRqYWNlbnRMYWJlbChpbnB1dCk7XG4gIGlmIChhZGphY2VudExhYmVsKSByZXR1cm4gY2xlYW5MYWJlbFRleHQoYWRqYWNlbnRMYWJlbCk7XG4gIFxuICAvLyBUcnkgR3Jhdml0eSBGb3JtcyBmaWVsZCBjb250YWluZXIgbGFiZWwgKGZhbGxiYWNrLCBhbHJlYWR5IGNsZWFuZWQpXG4gIGNvbnN0IGNvbnRhaW5lckxhYmVsID0gR3Jhdml0eUZvcm1zLmdldENvbnRhaW5lckxhYmVsKGlucHV0KTtcbiAgaWYgKGNvbnRhaW5lckxhYmVsKSByZXR1cm4gY29udGFpbmVyTGFiZWw7XG4gIFxuICAvLyBUcnkgZmllbGRzZXQgbGVnZW5kIChHcmF2aXR5IEZvcm1zIGNvbXBvdW5kIGZpZWxkcywgYWxyZWFkeSBjbGVhbmVkKVxuICBjb25zdCBsZWdlbmRMYWJlbCA9IEdyYXZpdHlGb3Jtcy5nZXRGaWVsZHNldExlZ2VuZChpbnB1dCk7XG4gIGlmIChsZWdlbmRMYWJlbCkgcmV0dXJuIGxlZ2VuZExhYmVsO1xuICBcbiAgcmV0dXJuICcnO1xufTtcblxuLyoqXG4gKiBHZXRzIGxhYmVsIHRleHQgdXNpbmcgJ2ZvcicgYXR0cmlidXRlIGFzc29jaWF0aW9uXG4gKiBcbiAqIEBwYXJhbSBmb3JtIC0gSFRNTCBmb3JtIGVsZW1lbnRcbiAqIEBwYXJhbSBpbnB1dCAtIEhUTUwgaW5wdXQgZWxlbWVudFxuICogQHJldHVybnMgTGFiZWwgdGV4dCBvciBlbXB0eSBzdHJpbmdcbiAqL1xuY29uc3QgZ2V0TGFiZWxCeUZvckF0dHJpYnV0ZSA9IChcbiAgZm9ybTogSFRNTEZvcm1FbGVtZW50LFxuICBpbnB1dDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudFxuKTogc3RyaW5nID0+IHtcbiAgaWYgKCFpbnB1dC5pZCkgcmV0dXJuICcnO1xuICBcbiAgY29uc3QgYXNzb2NpYXRlZExhYmVsID0gZm9ybS5xdWVyeVNlbGVjdG9yKGBsYWJlbFtmb3I9XCIke2lucHV0LmlkfVwiXWApIGFzIEhUTUxMYWJlbEVsZW1lbnQ7XG4gIHJldHVybiBhc3NvY2lhdGVkTGFiZWwgPyAoYXNzb2NpYXRlZExhYmVsLnRleHRDb250ZW50Py50cmltKCkgfHwgJycpIDogJyc7XG59O1xuXG4vKipcbiAqIEdldHMgbGFiZWwgdGV4dCBmcm9tIHBhcmVudCBsYWJlbCBlbGVtZW50XG4gKiBcbiAqIEBwYXJhbSBpbnB1dCAtIEhUTUwgaW5wdXQgZWxlbWVudFxuICogQHJldHVybnMgTGFiZWwgdGV4dCBvciBlbXB0eSBzdHJpbmdcbiAqL1xuY29uc3QgZ2V0UGFyZW50TGFiZWwgPSAoaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQpOiBzdHJpbmcgPT4ge1xuICBjb25zdCBwYXJlbnRMYWJlbCA9IGlucHV0LmNsb3Nlc3QoJ2xhYmVsJykgYXMgSFRNTExhYmVsRWxlbWVudDtcbiAgaWYgKCFwYXJlbnRMYWJlbCkgcmV0dXJuICcnO1xuICBcbiAgLy8gQ2xvbmUgYW5kIHJlbW92ZSBjaGlsZCBpbnB1dHMgdG8gZ2V0IGNsZWFuIGxhYmVsIHRleHRcbiAgY29uc3QgY2xvbmVkTGFiZWwgPSBwYXJlbnRMYWJlbC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTExhYmVsRWxlbWVudDtcbiAgY29uc3QgY2hpbGRJbnB1dHMgPSBjbG9uZWRMYWJlbC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCwgc2VsZWN0LCB0ZXh0YXJlYScpO1xuICBmb3IgKGxldCBqID0gMDsgaiA8IGNoaWxkSW5wdXRzLmxlbmd0aDsgaisrKSB7XG4gICAgY2hpbGRJbnB1dHNbal0ucmVtb3ZlKCk7XG4gIH1cbiAgXG4gIHJldHVybiBjbG9uZWRMYWJlbC50ZXh0Q29udGVudD8udHJpbSgpIHx8ICcnO1xufTtcblxuLyoqXG4gKiBHZXRzIGxhYmVsIHRleHQgZnJvbSBhZGphY2VudCBsYWJlbCBlbGVtZW50XG4gKiBcbiAqIEBwYXJhbSBpbnB1dCAtIEhUTUwgaW5wdXQgZWxlbWVudFxuICogQHJldHVybnMgTGFiZWwgdGV4dCBvciBlbXB0eSBzdHJpbmdcbiAqL1xuY29uc3QgZ2V0QWRqYWNlbnRMYWJlbCA9IChpbnB1dDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudCk6IHN0cmluZyA9PiB7XG4gIGxldCBwcmV2U2libGluZyA9IGlucHV0LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gIHdoaWxlIChwcmV2U2libGluZykge1xuICAgIGlmIChwcmV2U2libGluZy50YWdOYW1lID09PSAnTEFCRUwnKSB7XG4gICAgICByZXR1cm4gcHJldlNpYmxpbmcudGV4dENvbnRlbnQ/LnRyaW0oKSB8fCAnJztcbiAgICB9XG4gICAgcHJldlNpYmxpbmcgPSBwcmV2U2libGluZy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICB9XG4gIHJldHVybiAnJztcbn07XG4iLCIvKipcbiAqIFF1ZXVlIHN5c3RlbSBmb3IgYm90IHByZXZlbnRpb24gd2l0aCBjb25maWd1cmFibGUgcmF0ZSBsaW1pdGluZ1xuICogXG4gKiBAZGVzY3JpcHRpb24gTWFuYWdlcyBldmVudCBxdWV1aW5nIGFuZCByYXRlIGxpbWl0aW5nIHRvIHByZXZlbnQgYm90LWxpa2UgYmVoYXZpb3JcbiAqIEBhdXRob3IgQXNzaXN0YW50XG4gKi9cblxuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXVlZEV2ZW50IHtcbiAgaWQ6IHN0cmluZztcbiAgcGF5bG9hZDogYW55O1xuICB0aW1lc3RhbXA6IG51bWJlcjtcbiAgcmV0cnlDb3VudDogbnVtYmVyO1xuICBtYXhSZXRyaWVzOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVldWVDb25maWcge1xuICBtYXhFdmVudHNQZXJTZWNvbmQ6IG51bWJlcjtcbiAgbWF4UmV0cmllczogbnVtYmVyO1xuICByZXRyeURlbGF5TXM6IG51bWJlcjtcbiAgbWF4UXVldWVTaXplOiBudW1iZXI7XG59XG5cbi8qKlxuICogRXZlbnQgcXVldWUgc3lzdGVtIHdpdGggcmF0ZSBsaW1pdGluZyBmb3IgYm90IHByZXZlbnRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIEV2ZW50UXVldWUge1xuICBwcml2YXRlIHF1ZXVlOiBRdWV1ZWRFdmVudFtdID0gW107XG4gIHByaXZhdGUgcHJvY2Vzc2luZzogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIGNvbmZpZzogUXVldWVDb25maWc7XG4gIHByaXZhdGUgZXZlbnRUaW1lczogbnVtYmVyW10gPSBbXTtcbiAgcHJpdmF0ZSBldmVudElkQ291bnRlcjogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFF1ZXVlQ29uZmlnKSB7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICBtYXhFdmVudHNQZXJTZWNvbmQ6IGNvbmZpZy5tYXhFdmVudHNQZXJTZWNvbmQgfHwgNSwgLy8gRml4ZWQgcmF0ZSBsaW1pdCBmb3IgYm90IHByZXZlbnRpb25cbiAgICAgIG1heFJldHJpZXM6IGNvbmZpZy5tYXhSZXRyaWVzIHx8IDMsXG4gICAgICByZXRyeURlbGF5TXM6IGNvbmZpZy5yZXRyeURlbGF5TXMgfHwgMTAwMCxcbiAgICAgIG1heFF1ZXVlU2l6ZTogY29uZmlnLm1heFF1ZXVlU2l6ZSB8fCAxMDAsXG4gICAgfTtcbiAgICBcbiAgICBsb2dnZXIubG9nKCdFdmVudFF1ZXVlIGluaXRpYWxpemVkIHdpdGggY29uZmlnOicsIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgZXZlbnQgdG8gcXVldWUgZm9yIHByb2Nlc3NpbmdcbiAgICogXG4gICAqIEBwYXJhbSBwYXlsb2FkIC0gRXZlbnQgcGF5bG9hZCB0byBiZSBzZW50XG4gICAqIEBwYXJhbSBtYXhSZXRyaWVzIC0gTWF4aW11bSBudW1iZXIgb2YgcmV0cnkgYXR0ZW1wdHMgZm9yIHRoaXMgZXZlbnRcbiAgICogQHJldHVybnMgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gZXZlbnQgaXMgcHJvY2Vzc2VkIHN1Y2Nlc3NmdWxseVxuICAgKi9cbiAgYXN5bmMgZW5xdWV1ZShwYXlsb2FkOiBhbnksIG1heFJldHJpZXM6IG51bWJlciA9IHRoaXMuY29uZmlnLm1heFJldHJpZXMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgLy8gQ2hlY2sgaWYgcXVldWUgaXMgZnVsbFxuICAgICAgaWYgKHRoaXMucXVldWUubGVuZ3RoID49IHRoaXMuY29uZmlnLm1heFF1ZXVlU2l6ZSkge1xuICAgICAgICBsb2dnZXIud2FybignUXVldWUgaXMgZnVsbCwgZHJvcHBpbmcgb2xkZXN0IGV2ZW50Jyk7XG4gICAgICAgIHRoaXMucXVldWUuc2hpZnQoKTsgLy8gUmVtb3ZlIG9sZGVzdCBldmVudFxuICAgICAgfVxuXG4gICAgICBjb25zdCBldmVudDogUXVldWVkRXZlbnQgPSB7XG4gICAgICAgIGlkOiBgZXZlbnRfJHsrK3RoaXMuZXZlbnRJZENvdW50ZXJ9YCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgICByZXRyeUNvdW50OiAwLFxuICAgICAgICBtYXhSZXRyaWVzLFxuICAgICAgfTtcblxuICAgICAgLy8gQWRkIHJlc29sdmUvcmVqZWN0IGNhbGxiYWNrcyB0byBldmVudCBmb3IgcHJvbWlzZSBoYW5kbGluZ1xuICAgICAgKGV2ZW50IGFzIGFueSkucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICAoZXZlbnQgYXMgYW55KS5yZWplY3QgPSByZWplY3Q7XG5cbiAgICAgIHRoaXMucXVldWUucHVzaChldmVudCk7XG4gICAgICBsb2dnZXIubG9nKGBFdmVudCAke2V2ZW50LmlkfSBhZGRlZCB0byBxdWV1ZS4gUXVldWUgbGVuZ3RoOiAke3RoaXMucXVldWUubGVuZ3RofWApO1xuXG4gICAgICAvLyBTdGFydCBwcm9jZXNzaW5nIGlmIG5vdCBhbHJlYWR5IHJ1bm5pbmdcbiAgICAgIGlmICghdGhpcy5wcm9jZXNzaW5nKSB7XG4gICAgICAgIHRoaXMucHJvY2Vzc1F1ZXVlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUHJvY2VzcyBxdWV1ZWQgZXZlbnRzIHdpdGggcmF0ZSBsaW1pdGluZ1xuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBwcm9jZXNzUXVldWUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMucHJvY2Vzc2luZyB8fCB0aGlzLnF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucHJvY2Vzc2luZyA9IHRydWU7XG4gICAgbG9nZ2VyLmxvZygnU3RhcnRpbmcgcXVldWUgcHJvY2Vzc2luZycpO1xuXG4gICAgd2hpbGUgKHRoaXMucXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgZXZlbnQgPSB0aGlzLnF1ZXVlWzBdO1xuICAgICAgXG4gICAgICAvLyBDaGVjayBpZiB3ZSBjYW4gc2VuZCB0aGlzIGV2ZW50IChyYXRlIGxpbWl0aW5nKVxuICAgICAgaWYgKHRoaXMuY2FuU2VuZEV2ZW50KCkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBSZW1vdmUgZXZlbnQgZnJvbSBxdWV1ZSBiZWZvcmUgcHJvY2Vzc2luZ1xuICAgICAgICAgIHRoaXMucXVldWUuc2hpZnQoKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBSZWNvcmQgdGhlIGV2ZW50IHRpbWUgZm9yIHJhdGUgbGltaXRpbmdcbiAgICAgICAgICB0aGlzLnJlY29yZEV2ZW50VGltZSgpO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIFByb2Nlc3MgdGhlIGV2ZW50XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZW5kRXZlbnQoZXZlbnQpO1xuICAgICAgICAgIFxuICAgICAgICAgIGxvZ2dlci5sb2coYEV2ZW50ICR7ZXZlbnQuaWR9IHByb2Nlc3NlZCBzdWNjZXNzZnVsbHlgKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBSZXNvbHZlIHRoZSBwcm9taXNlXG4gICAgICBpZiAoKGV2ZW50IGFzIGFueSk/LnJlc29sdmUpIHtcbiAgICAgICAgICAgIChldmVudCBhcyBhbnkpLnJlc29sdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgbG9nZ2VyLmVycm9yKGBFcnJvciBwcm9jZXNzaW5nIGV2ZW50ICR7ZXZlbnQuaWR9OmAsIGVycm9yKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBIYW5kbGUgcmV0cnkgbG9naWNcbiAgICAgICAgICBpZiAoKGV2ZW50Py5yZXRyeUNvdW50ID8/IDApIDwgKGV2ZW50Py5tYXhSZXRyaWVzID8/IDApKSB7XG4gICAgICAgICAgICBldmVudC5yZXRyeUNvdW50Kys7XG4gICAgICAgICAgICBsb2dnZXIubG9nKGBSZXRyeWluZyBldmVudCAke2V2ZW50LmlkfSAoYXR0ZW1wdCAke2V2ZW50LnJldHJ5Q291bnR9LyR7ZXZlbnQubWF4UmV0cmllc30pYCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEFkZCBiYWNrIHRvIHF1ZXVlIHdpdGggZGVsYXlcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnF1ZXVlLnVuc2hpZnQoZXZlbnQpO1xuICAgICAgICAgICAgICBpZiAoIXRoaXMucHJvY2Vzc2luZykge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc1F1ZXVlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMuY29uZmlnLnJldHJ5RGVsYXlNcyAqIGV2ZW50LnJldHJ5Q291bnQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEV2ZW50ICR7ZXZlbnQuaWR9IGZhaWxlZCBhZnRlciAke2V2ZW50Lm1heFJldHJpZXN9IHJldHJpZXNgKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gUmVqZWN0IHRoZSBwcm9taXNlXG4gICAgICAgICAgICBpZiAoKGV2ZW50IGFzIGFueSk/LnJlamVjdCkge1xuICAgICAgICAgICAgICAoZXZlbnQgYXMgYW55KS5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gV2FpdCBiZWZvcmUgY2hlY2tpbmcgYWdhaW5cbiAgICAgICAgYXdhaXQgdGhpcy53YWl0Rm9yUmF0ZUxpbWl0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wcm9jZXNzaW5nID0gZmFsc2U7XG4gICAgbG9nZ2VyLmxvZygnUXVldWUgcHJvY2Vzc2luZyBjb21wbGV0ZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB3ZSBjYW4gc2VuZCBhbiBldmVudCBiYXNlZCBvbiByYXRlIGxpbWl0aW5nXG4gICAqIFxuICAgKiBAcmV0dXJucyBib29sZWFuIGluZGljYXRpbmcgaWYgZXZlbnQgY2FuIGJlIHNlbnRcbiAgICovXG4gIHByaXZhdGUgY2FuU2VuZEV2ZW50KCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuY2xlYW51cE9sZEV2ZW50VGltZXMoKTtcbiAgICByZXR1cm4gdGhpcy5ldmVudFRpbWVzLmxlbmd0aCA8IHRoaXMuY29uZmlnLm1heEV2ZW50c1BlclNlY29uZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNvcmQgdGhlIGN1cnJlbnQgdGltZSBmb3IgcmF0ZSBsaW1pdGluZyBjYWxjdWxhdGlvbnNcbiAgICovXG4gIHByaXZhdGUgcmVjb3JkRXZlbnRUaW1lKCk6IHZvaWQge1xuICAgIHRoaXMuZXZlbnRUaW1lcy5wdXNoKERhdGUubm93KCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBldmVudCB0aW1lcyBvbGRlciB0aGFuIDEgc2Vjb25kXG4gICAqL1xuICBwcml2YXRlIGNsZWFudXBPbGRFdmVudFRpbWVzKCk6IHZvaWQge1xuICAgIGNvbnN0IG9uZVNlY29uZEFnbyA9IERhdGUubm93KCkgLSAxMDAwO1xuICAgIHRoaXMuZXZlbnRUaW1lcyA9IHRoaXMuZXZlbnRUaW1lcy5maWx0ZXIodGltZSA9PiB0aW1lID4gb25lU2Vjb25kQWdvKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXYWl0IGZvciByYXRlIGxpbWl0IHRvIGFsbG93IG5leHQgZXZlbnRcbiAgICovXG4gIHByaXZhdGUgYXN5bmMgd2FpdEZvclJhdGVMaW1pdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB3YWl0VGltZSA9IHRoaXMuY2FsY3VsYXRlV2FpdFRpbWUoKTtcbiAgICBsb2dnZXIubG9nKGBSYXRlIGxpbWl0IHJlYWNoZWQsIHdhaXRpbmcgJHt3YWl0VGltZX1tc2ApO1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB3YWl0VGltZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSBob3cgbG9uZyB0byB3YWl0IGJlZm9yZSBuZXh0IGV2ZW50IGNhbiBiZSBzZW50XG4gICAqIFxuICAgKiBAcmV0dXJucyBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHdhaXRcbiAgICovXG4gIHByaXZhdGUgY2FsY3VsYXRlV2FpdFRpbWUoKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5ldmVudFRpbWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgY29uc3Qgb2xkZXN0RXZlbnRUaW1lID0gdGhpcy5ldmVudFRpbWVzWzBdO1xuICAgIGNvbnN0IHRpbWVTaW5jZU9sZGVzdCA9IERhdGUubm93KCkgLSBvbGRlc3RFdmVudFRpbWU7XG4gICAgY29uc3QgdGltZVRvV2FpdCA9IE1hdGgubWF4KDAsIDEwMDAgLSB0aW1lU2luY2VPbGRlc3QpO1xuICAgIFxuICAgIHJldHVybiB0aW1lVG9XYWl0ICsgMTA7IC8vIEFkZCBzbWFsbCBidWZmZXJcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGV2ZW50IHVzaW5nIHByb3ZpZGVkIHNlbmRlciBmdW5jdGlvblxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgb3ZlcnJpZGRlbiBvciBoYXZlIHNlbmRlciBmdW5jdGlvbiBpbmplY3RlZFxuICAgKiBcbiAgICogQHBhcmFtIF9ldmVudCAtIEV2ZW50IHRvIHNlbmRcbiAgICovXG4gIHByaXZhdGUgYXN5bmMgc2VuZEV2ZW50KF9ldmVudDogUXVldWVkRXZlbnQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAvLyBUaGlzIHdpbGwgYmUgaW1wbGVtZW50ZWQgYnkgdGhlIEFwaUNsaWVudFxuICAgIHRocm93IG5ldyBFcnJvcignc2VuZEV2ZW50IG1ldGhvZCBub3QgaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGV2ZW50IHNlbmRlciBmdW5jdGlvblxuICAgKiBcbiAgICogQHBhcmFtIHNlbmRlciAtIEZ1bmN0aW9uIHRvIHNlbmQgZXZlbnRzXG4gICAqL1xuICBzZXRTZW5kZXIoc2VuZGVyOiAocGF5bG9hZDogYW55KSA9PiBQcm9taXNlPHZvaWQ+KTogdm9pZCB7XG4gICAgdGhpcy5zZW5kRXZlbnQgPSBhc3luYyAoZXZlbnQ6IFF1ZXVlZEV2ZW50KSA9PiB7XG4gICAgICBhd2FpdCBzZW5kZXIoZXZlbnQucGF5bG9hZCk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgY3VycmVudCBxdWV1ZSBzdGF0dXNcbiAgICogXG4gICAqIEByZXR1cm5zIE9iamVjdCB3aXRoIHF1ZXVlIHN0YXRpc3RpY3NcbiAgICovXG4gIGdldFN0YXR1cygpOiB7XG4gICAgcXVldWVMZW5ndGg6IG51bWJlcjtcbiAgICBwcm9jZXNzaW5nOiBib29sZWFuO1xuICAgIGV2ZW50c0luTGFzdFNlY29uZDogbnVtYmVyO1xuICAgIG1heEV2ZW50c1BlclNlY29uZDogbnVtYmVyO1xuICB9IHtcbiAgICB0aGlzLmNsZWFudXBPbGRFdmVudFRpbWVzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHF1ZXVlTGVuZ3RoOiB0aGlzLnF1ZXVlLmxlbmd0aCxcbiAgICAgIHByb2Nlc3Npbmc6IHRoaXMucHJvY2Vzc2luZyxcbiAgICAgIGV2ZW50c0luTGFzdFNlY29uZDogdGhpcy5ldmVudFRpbWVzLmxlbmd0aCxcbiAgICAgIG1heEV2ZW50c1BlclNlY29uZDogdGhpcy5jb25maWcubWF4RXZlbnRzUGVyU2Vjb25kLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgYWxsIGV2ZW50cyBmcm9tIHF1ZXVlXG4gICAqL1xuICBjbGVhcigpOiB2b2lkIHtcbiAgICB0aGlzLnF1ZXVlLmZvckVhY2goZXZlbnQgPT4ge1xuICAgICAgaWYgKChldmVudCBhcyBhbnkpPy5yZWplY3QpIHtcbiAgICAgICAgKGV2ZW50IGFzIGFueSkucmVqZWN0KG5ldyBFcnJvcignUXVldWUgY2xlYXJlZCcpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgdGhpcy5ldmVudFRpbWVzID0gW107XG4gICAgbG9nZ2VyLmxvZygnUXVldWUgY2xlYXJlZCcpO1xuICB9XG59ICIsImltcG9ydCB7IGdldEZvcm1JZGVudGlmaWVyLCBnZXRVc2VyRGF0YSwgZ2V0RGV2aWNlVHlwZSwgbG9nZ2VyIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHR5cGUgeyBTZXNzaW9uVGltaW5nLCBUcmFja2luZ0NvbnRleHQgfSBmcm9tICcuL3R5cGVzJztcblxuLyoqXG4gKiBTZW5kcyB0aW1lIHNwZW50IGV2ZW50IHRvIHRoZSB0cmFja2luZyBBUElcbiAqL1xuZXhwb3J0IGNvbnN0IHNlbmRUaW1lU3BlbnRFdmVudCA9ICh0aW1pbmc6IFNlc3Npb25UaW1pbmcsIGNvbnRleHQ6IFRyYWNraW5nQ29udGV4dCk6IHZvaWQgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHVzZXJEYXRhID0gZ2V0VXNlckRhdGEoKTtcbiAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgdHlwZTogJ2V4dGVybmFsX3BhZ2VfdGltZV9zcGVudCcsXG4gICAgICB0aW1lc3RhbXA6IHRpbWluZy5zZXNzaW9uRW5kLFxuICAgICAgdXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgIHJlZmVycmVyOiBkb2N1bWVudC5yZWZlcnJlcixcbiAgICAgIHRpdGxlOiBkb2N1bWVudC50aXRsZSxcbiAgICAgIHBhdGg6IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSxcbiAgICAgIHVzZXJBZ2VudDogbmF2aWdhdG9yLnVzZXJBZ2VudCxcbiAgICAgIHNlc3Npb25JZDogY29udGV4dC5zZXNzaW9uSWQsXG4gICAgICB0cmFja2luZ0lkOiBjb250ZXh0LnRyYWNraW5nSWQsXG4gICAgICBsb2NhdGlvbklkOiBjb250ZXh0LmxvY2F0aW9uSWQsXG4gICAgICBjb250YWN0SWQ6IGNvbnRleHQuY29udGFjdElkIHx8IHVzZXJEYXRhPy5jb250YWN0SWQsXG4gICAgICB1c2VySWQ6IGNvbnRleHQudXNlcklkIHx8IHVzZXJEYXRhPy51c2VySWQsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHNlc3Npb25TdGFydDogdGltaW5nLnNlc3Npb25TdGFydCxcbiAgICAgICAgc2Vzc2lvbkVuZDogdGltaW5nLnNlc3Npb25FbmQsXG4gICAgICAgIHRpbWVTcGVudE1zOiB0aW1pbmcudGltZVNwZW50TXMsXG4gICAgICAgIGZvcm1JZGVudGlmaWVyOiBnZXRGb3JtSWRlbnRpZmllcigpLFxuICAgICAgICBkZXZpY2VUeXBlOiBnZXREZXZpY2VUeXBlKCksXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCBlbmRwb2ludCA9IGAke2NvbnRleHQuYXBpRW5kcG9pbnR9L2V4dGVybmFsLXRyYWNraW5nL2V2ZW50c2A7XG5cbiAgICBmZXRjaChlbmRwb2ludCwge1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBheWxvYWQpLFxuICAgICAga2VlcGFsaXZlOiB0cnVlLFxuICAgIH0pLmNhdGNoKChlcnIpID0+IGxvZ2dlci5lcnJvcignRmFpbGVkIHRvIHNlbmQgdGltZSBzcGVudCBldmVudCcsIGVycikpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGxvZ2dlci5lcnJvcignRmFpbGVkIHRvIGRpc3BhdGNoIHRpbWUgc3BlbnQgZXZlbnQnLCBlcnJvcik7XG4gIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuVVJMID0gZXhwb3J0cy5ETlMgPSBleHBvcnRzLnN0cmluZ1RvQnl0ZXMgPSB2b2lkIDA7XG5jb25zdCBwYXJzZV9qc18xID0gcmVxdWlyZShcIi4vcGFyc2UuanNcIik7XG5jb25zdCBzdHJpbmdpZnlfanNfMSA9IHJlcXVpcmUoXCIuL3N0cmluZ2lmeS5qc1wiKTtcbmZ1bmN0aW9uIHN0cmluZ1RvQnl0ZXMoc3RyKSB7XG4gICAgc3RyID0gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHN0cikpO1xuICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoc3RyLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgYnl0ZXNbaV0gPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ5dGVzO1xufVxuZXhwb3J0cy5zdHJpbmdUb0J5dGVzID0gc3RyaW5nVG9CeXRlcztcbmV4cG9ydHMuRE5TID0gJzZiYTdiODEwLTlkYWQtMTFkMS04MGI0LTAwYzA0ZmQ0MzBjOCc7XG5leHBvcnRzLlVSTCA9ICc2YmE3YjgxMS05ZGFkLTExZDEtODBiNC0wMGMwNGZkNDMwYzgnO1xuZnVuY3Rpb24gdjM1KHZlcnNpb24sIGhhc2gsIHZhbHVlLCBuYW1lc3BhY2UsIGJ1Ziwgb2Zmc2V0KSB7XG4gICAgY29uc3QgdmFsdWVCeXRlcyA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyBzdHJpbmdUb0J5dGVzKHZhbHVlKSA6IHZhbHVlO1xuICAgIGNvbnN0IG5hbWVzcGFjZUJ5dGVzID0gdHlwZW9mIG5hbWVzcGFjZSA9PT0gJ3N0cmluZycgPyAoMCwgcGFyc2VfanNfMS5kZWZhdWx0KShuYW1lc3BhY2UpIDogbmFtZXNwYWNlO1xuICAgIGlmICh0eXBlb2YgbmFtZXNwYWNlID09PSAnc3RyaW5nJykge1xuICAgICAgICBuYW1lc3BhY2UgPSAoMCwgcGFyc2VfanNfMS5kZWZhdWx0KShuYW1lc3BhY2UpO1xuICAgIH1cbiAgICBpZiAobmFtZXNwYWNlPy5sZW5ndGggIT09IDE2KSB7XG4gICAgICAgIHRocm93IFR5cGVFcnJvcignTmFtZXNwYWNlIG11c3QgYmUgYXJyYXktbGlrZSAoMTYgaXRlcmFibGUgaW50ZWdlciB2YWx1ZXMsIDAtMjU1KScpO1xuICAgIH1cbiAgICBsZXQgYnl0ZXMgPSBuZXcgVWludDhBcnJheSgxNiArIHZhbHVlQnl0ZXMubGVuZ3RoKTtcbiAgICBieXRlcy5zZXQobmFtZXNwYWNlQnl0ZXMpO1xuICAgIGJ5dGVzLnNldCh2YWx1ZUJ5dGVzLCBuYW1lc3BhY2VCeXRlcy5sZW5ndGgpO1xuICAgIGJ5dGVzID0gaGFzaChieXRlcyk7XG4gICAgYnl0ZXNbNl0gPSAoYnl0ZXNbNl0gJiAweDBmKSB8IHZlcnNpb247XG4gICAgYnl0ZXNbOF0gPSAoYnl0ZXNbOF0gJiAweDNmKSB8IDB4ODA7XG4gICAgaWYgKGJ1Zikge1xuICAgICAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgKytpKSB7XG4gICAgICAgICAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlc1tpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYnVmO1xuICAgIH1cbiAgICByZXR1cm4gKDAsIHN0cmluZ2lmeV9qc18xLnVuc2FmZVN0cmluZ2lmeSkoYnl0ZXMpO1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gdjM1O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXygxNTYpO1xuIl0sIm5hbWVzIjpbInJvb3QiLCJmYWN0b3J5IiwiZXhwb3J0cyIsIm1vZHVsZSIsImRlZmluZSIsImFtZCIsInNlbGYiLCJ0aGlzIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsInVuc2FmZVN0cmluZ2lmeSIsInZhbGlkYXRlX2pzXzEiLCJieXRlVG9IZXgiLCJpIiwicHVzaCIsInRvU3RyaW5nIiwic2xpY2UiLCJhcnIiLCJvZmZzZXQiLCJ0b0xvd2VyQ2FzZSIsInV1aWQiLCJkZWZhdWx0IiwiVHlwZUVycm9yIiwiVGltZU9uUGFnZVRyYWNrZXIiLCJzdGFydFRpbWVUcmFja2luZyIsInRyYWNrZXIiLCJ3aW5kb3ciLCJpbnRlcnZhbElkIiwic2V0SW50ZXJ2YWwiLCJjb250ZXh0IiwiZ2V0VHJhY2tpbmdDb250ZXh0IiwiY2xlYXJJbnRlcnZhbCIsInRpbWVUcmFja2VyIiwidGltaW5nIiwic2VuZFRpbWVTcGVudEV2ZW50IiwidyIsIkdMT0JBTF9UUkFDS0lOR19LRVkiLCJlcnJvciIsImxvZ2dlciIsImlzR3Jhdml0eUZvcm1zRmllbGQiLCJpc0NvbXBvdW5kRmllbGQiLCJnZXQiLCJnZXRNYWluTGFiZWwiLCJnZXRTdWJMYWJlbCIsImdldENvbWJpbmVkTGFiZWwiLCJnZXRDb250YWluZXJMYWJlbCIsImdldEZpZWxkc2V0TGVnZW5kIiwiY2xlYW5MYWJlbFRleHQiLCJjb25zdHJ1Y3RvciIsImNvbmZpZyIsInN0YXRlIiwiaW5pdGlhbGl6ZWQiLCJ0cmFja2luZ0lkIiwiYXBpQ2xpZW50IiwiQXBpQ2xpZW50IiwiYXBpRW5kcG9pbnQiLCJkZWJ1ZyIsImxvZyIsImluaXQiLCJ3YXJuIiwibG9jYXRpb25JZCIsImZldGNoTG9jYXRpb25JZCIsInNlc3Npb25JZCIsImdlbmVyYXRlU2Vzc2lvbklkIiwic3RvcmVTZXNzaW9uSWRJbkNvb2tpZSIsInNldFRyYWNraW5nQ29udGV4dCIsInN0YXJ0UGFnZVRyYWNraW5nIiwiYXN5bmMiLCJldmVudCIsInByb3BlcnRpZXMiLCJzZW5kRXZlbnQiLCJzdGFydEZvcm1UcmFja2luZyIsInN1Ym1pdEZvcm0iLCJ1c2VySWQiLCJ1c2VyUHJvcGVydGllcyIsImRldmljZVR5cGUiLCJnZXREZXZpY2VUeXBlIiwiY3JlYXRlVHJhY2tlciIsInZhbGlkYXRlQ29uZmlnIiwiRXJyb3IiLCJjcml0aWNhbCIsIkV4dGVybmFsVHJhY2tlciIsImluaXRpYWxpemVGcm9tU2NyaXB0IiwiaW5pdGlhbGl6ZSIsInZlcnNpb24iLCJ2YWxpZGF0ZSIsInY3IiwidjZUb1YxIiwidjYiLCJ2NSIsInY0IiwidjMiLCJ2MVRvVjYiLCJ2MSIsInN0cmluZ2lmeSIsInBhcnNlIiwiTklMIiwiTUFYIiwibWF4X2pzXzEiLCJlbnVtZXJhYmxlIiwibmlsX2pzXzEiLCJwYXJzZV9qc18xIiwic3RyaW5naWZ5X2pzXzEiLCJ2MV9qc18xIiwidjFUb1Y2X2pzXzEiLCJ2M19qc18xIiwidjRfanNfMSIsInY1X2pzXzEiLCJ2Nl9qc18xIiwidjZUb1YxX2pzXzEiLCJ2N19qc18xIiwidmVyc2lvbl9qc18xIiwiSU5BQ1RJVklUWV9NUyIsIkFDVElWSVRZX0VWRU5UUyIsIm9uQ29tcGxldGUiLCJhY3RpdmVUaW1lTXMiLCJ1cGRhdGVUaW1lciIsImlzSWRsZSIsImRlc3Ryb3llZCIsImZsdXNoZWQiLCJzZXNzaW9uRXhwaXJlZCIsIm9uQWN0aXZpdHkiLCJub3ciLCJEYXRlIiwic2Vzc2lvblN0YXJ0IiwibGFzdFRpY2siLCJsYXN0QWN0aXZpdHlBdCIsIm9uVmlzaWJpbGl0eUNoYW5nZSIsImRvY3VtZW50IiwiaGlkZGVuIiwiY2hlY2tUaW1lb3V0Iiwib25VbmxvYWQiLCJlbWl0VXBkYXRlIiwidGljayIsIm9uU2Vzc2lvbkNvbXBsZXRlIiwiYmluZCIsImZvckVhY2giLCJldnQiLCJhZGRFdmVudExpc3RlbmVyIiwicGFzc2l2ZSIsImNhcHR1cmUiLCJzZXNzaW9uRW5kIiwidGltZVNwZW50TXMiLCJNYXRoIiwibWF4Iiwicm91bmQiLCJkZXN0cm95IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInBhcnNlRm9ybURhdGEiLCJjb250YWluc1Bhc3N3b3JkIiwiaXNQYXNzd29yZExpa2VGaWVsZCIsImdldENvb2tpZSIsIm5hbWUiLCJwYXJ0cyIsImNvb2tpZSIsInNwbGl0IiwibGVuZ3RoIiwicG9wIiwic2hpZnQiLCJlIiwic2V0Q29va2llIiwiZGF5cyIsImRhdGUiLCJzZXRUaW1lIiwiZ2V0VGltZSIsImV4cGlyZXMiLCJ0b1VUQ1N0cmluZyIsInN0b3JlVXNlckRhdGEiLCJkYXRhIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsIkpTT04iLCJnZXRVc2VyRGF0YSIsImdldEl0ZW0iLCJwYXJzZWQiLCJjaWQiLCJjdXN0b21lcl9pZCIsIm5vcm1hbGl6ZWQiLCJTdHJpbmciLCJ0cmltIiwiY29udGFjdElkIiwiY29va2llTmFtZSIsInNlc3Npb25TdG9yYWdlIiwiYXBpIiwiZ2V0U2Vzc2lvbklkRnJvbUNvb2tpZSIsImNvb2tpZVJlc3VsdCIsInNlc3Npb25TdG9yYWdlUmVzdWx0IiwiZ2V0RnJvbVN0b3JhZ2UiLCJrZXkiLCJzZXRJblN0b3JhZ2UiLCJkZWJvdW5jZSIsImZ1bmMiLCJ3YWl0IiwidGltZW91dCIsImFyZ3MiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwibmF2IiwibmF2aWdhdG9yIiwidW5kZWZpbmVkIiwidWEiLCJ1c2VyQWdlbnQiLCJtYXhUb3VjaFBvaW50cyIsInVzZXJBZ2VudERhdGEiLCJpc01vYmlsZUhpbnQiLCJtb2JpbGUiLCJpbmNsdWRlcyIsImdldFBhZ2VNZXRhZGF0YSIsInRpdGxlIiwidXJsIiwibG9jYXRpb24iLCJocmVmIiwicGF0aCIsInBhdGhuYW1lIiwicmVmZXJyZXIiLCJnZXRMb2NhbFRpbWVab25lIiwiSW50bCIsIkRhdGVUaW1lRm9ybWF0IiwicmVzb2x2ZWRPcHRpb25zIiwidGltZVpvbmUiLCJnZXRMb2NhbFRpbWVab25lT2Zmc2V0IiwibWF0Y2giLCJnZXRGb3JtYXR0ZWRUaW1lem9uZSIsIkNVU1RPTV9GT1JNX0NPTlRFWFRfU0VMRUNUT1JTIiwicGlja0Zvcm1BdHRyIiwiZm9ybSIsImF0dHIiLCJnZXRBdHRyaWJ1dGUiLCJleHRyYWN0Rm9ybVRpdGxlIiwid3JhcHBlciIsImNsb3Nlc3QiLCJ0aXRsZUVsIiwicXVlcnlTZWxlY3RvciIsInRleHRDb250ZW50IiwiaW50ZXJuYWxIZWFkaW5nIiwiZGF0YVRpdGxlIiwiZ2V0Rm9ybUlkZW50aWZpZXIiLCJ0YXJnZXRGb3JtIiwiSFRNTEZvcm1FbGVtZW50Iiwic29tZSIsInNlbCIsImdldEV4cGxpY2l0Rm9ybUF0dHJpYnV0ZXNOYW1lRmlyc3QiLCJleHBsaWNpdCIsImdldEV4cGxpY2l0Rm9ybUF0dHJpYnV0ZXNJZEZpcnN0IiwidjFCeXRlcyIsInY2Qnl0ZXMiLCJVaW50OEFycmF5Iiwib2YiLCJuYXRpdmVfanNfMSIsInJuZ19qc18xIiwib3B0aW9ucyIsImJ1ZiIsInJhbmRvbVVVSUQiLCJybmRzIiwicmFuZG9tIiwicm5nIiwiUmFuZ2VFcnJvciIsImdldFJhbmRvbVZhbHVlcyIsInJuZHM4IiwiY3J5cHRvIiwidXBkYXRlVjdTdGF0ZSIsIl9zdGF0ZSIsIm1zZWNzIiwic2VxIiwidjdCeXRlcyIsImJ5dGVzIiwiZ2V0T3V0cHV0TGVuZ3RoIiwiaW5wdXRMZW5ndGg4Iiwic2FmZUFkZCIsIngiLCJ5IiwibHN3IiwibWQ1Y21uIiwicSIsImEiLCJiIiwicyIsInQiLCJudW0iLCJjbnQiLCJtZDVmZiIsImMiLCJkIiwibWQ1Z2ciLCJtZDVoaCIsIm1kNWlpIiwiaW5wdXQiLCJ1aW50MzJUb1VpbnQ4IiwibGVuIiwieHBhZCIsIlVpbnQzMkFycmF5IiwiZmlsbCIsInNldCIsIm9sZGEiLCJvbGRiIiwib2xkYyIsIm9sZGQiLCJ3b3Jkc1RvTWQ1Iiwib3V0cHV0IiwidWludDhUb1VpbnQzMiIsIl92NiIsInZhbCIsImxhYmVsVGV4dCIsInR5cGUiLCJpZCIsInBsYWNlaG9sZGVyIiwidXBkYXRlVjFTdGF0ZSIsIm5zZWNzIiwibm9kZSIsImNsb2Nrc2VxIiwidGwiLCJ0bWgiLCJuIiwiaXNWNiIsIm9wdGlvbnNLZXlzIiwia2V5cyIsImRldGVybWluZUFwaUVuZHBvaW50IiwicXVldWVDb25maWciLCJtYXhFdmVudHNQZXJTZWNvbmQiLCJtYXhSZXRyaWVzIiwicmV0cnlEZWxheU1zIiwibWF4UXVldWVTaXplIiwiZXZlbnRRdWV1ZSIsIkV2ZW50UXVldWUiLCJzZXRTZW5kZXIiLCJwYXlsb2FkIiwic2VuZEV2ZW50RGlyZWN0bHkiLCJjdXJyZW50U2NyaXB0IiwiU0NSSVBUX0JBU0VOQU1FIiwic3JjIiwic2NyaXB0U3JjIiwiQVBJX0VORFBPSU5UUyIsInN0YWdpbmciLCJsb2NhbCIsInByb2R1Y3Rpb24iLCJyZXNwb25zZSIsImZldGNoIiwib2siLCJzdGF0dXNUZXh0IiwianNvbiIsInVzZXJEYXRhIiwiZW5oYW5jZWRFdmVudCIsIkV2ZW50VHlwZSIsIkZPUk1fU1VCTUlTU0lPTiIsImZvcm1FdmVudCIsImVuaGFuY2VkRm9ybUV2ZW50IiwiZm9ybURhdGEiLCJUaW1lem9uZSIsInRpbWV6b25lIiwiZW5xdWV1ZSIsImVuZHBvaW50IiwiZmlsZXMiLCJGb3JtRGF0YSIsImV2ZW50V2l0aG91dEZpbGVzIiwiYXBwZW5kIiwiZmllbGROYW1lIiwiQXJyYXkiLCJpc0FycmF5IiwiZmlsZSIsIkZpbGUiLCJtZXRob2QiLCJib2R5IiwiaGVhZGVycyIsImdldENvbmZpZ0Zyb21TY3JpcHRBdHRyaWJ1dGVzIiwiVVJMIiwiRE5TIiwic2hhMV9qc18xIiwidjM1X2pzXzEiLCJ2MzVfanNfMiIsIm5hbWVzcGFjZSIsIm1kNV9qc18xIiwibWVzc2FnZSIsImlzRGVidWdNb2RlIiwiY29uc29sZSIsIkxPR0dFUl9QUkVGSVgiLCJMT0dHRVJfRVJST1JfUFJFRklYIiwiQm9vbGVhbiIsInRyYWNrZWRGb3JtcyIsIldlYWtTZXQiLCJmb3JtT2JzZXJ2ZXIiLCJjYWxsYmFjayIsIm1ldGFkYXRhIiwiZm9ybUlkIiwiU0NSSVBUX1BBR0VfVklFVyIsInRpbWVzdGFtcCIsImF0dGFjaEZvcm1MaXN0ZW5lciIsImhhcyIsImZvcm1TdWJtaXR0ZWQiLCJoYW5kbGVTdWJtaXNzaW9uIiwiaGFuZGxlRm9ybVN1Ym1pdCIsInN1Ym1pdEJ1dHRvbnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiYnV0dG9uIiwiYWRkIiwiZm9ybUlkZW50aWZpZXIiLCJ0cmFja0Zvcm1zSW5FbGVtZW50IiwiZm9ybXMiLCJpbml0T2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwibXV0YXRpb24iLCJmcm9tIiwiYWRkZWROb2RlcyIsIkVsZW1lbnQiLCJuZXN0ZWRGb3JtIiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJmaWVsZERhdGEiLCJmaWVsZExhYmVscyIsInRyYWNraW5nRXZlbnQiLCJmb3JtTGFiZWxzIiwicmVnZXhfanNfMSIsInRlc3QiLCJwYXJzZUludCIsIkdGSUVMRF9DTEFTUyIsIkdGSUVMRF9MQUJFTF9DTEFTUyIsIlJFUVVJUkVEX0lORElDQVRPUl9SRUdFWCIsIkFTVEVSSVNLX0lORElDQVRPUl9SRUdFWCIsImVsZW1lbnQiLCJ0ZXh0IiwicmVwbGFjZSIsImdmaWVsZCIsImZpZWxkc2V0IiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJsZWdlbmQiLCJsYWJlbEVsIiwic3ViTGFiZWxFbCIsInN1YkxhYmVsIiwiZmllbGRDb250YWluZXIiLCJsYWJlbCIsInYiLCJmIiwieiIsIlJPVEwiLCJLIiwiSCIsIm5ld0J5dGVzIiwibCIsIk4iLCJjZWlsIiwiTSIsImoiLCJwb3ciLCJmbG9vciIsIlciLCJUIiwic2NyaXB0Q29uZmlnIiwiZmlsZXNCeUZpZWxkIiwiU2V0IiwiXyIsInZhbHVlcyIsImdldEFsbCIsImNvbGxlY3RlZCIsImsiLCJnZXRBbGxWYWx1ZXMiLCJzZWxlY3RvciIsIkNTUyIsImVzY2FwZSIsImVzY2FwZUNzcyIsImVsZW1lbnRzIiwiZmlyc3RFbCIsInRhZyIsInRhZ05hbWUiLCJpc011bHRpcGxlU2VsZWN0IiwibXVsdGlwbGUiLCJyZXNvbHZlT3B0aW9uVGV4dCIsImVsIiwicmF3IiwiY2xvbmUiLCJjbG9uZU5vZGUiLCJyZW1vdmUiLCJmb3JMYWJlbCIsIm5leHQiLCJuZXh0U2libGluZyIsInJlc29sdmVTZWxlY3RUZXh0Iiwib3B0IiwiZmluZCIsIm8iLCJtYXAiLCJmaWxlTGlzdCIsIm1ldGFMaXN0Iiwic2l6ZSIsImZpbGVuYW1lIiwibWFwRmlsZSIsInN0ciIsImNoZWNrZWQiLCJmaWx0ZXIiLCJhbGxDaGVja2JveGVzIiwic2VlbiIsImRpc2FibGVkIiwibXVsdGlTZWxlY3RzIiwic3RhcnRzV2l0aCIsImRhdGFVcmwiLCJpbnB1dHMiLCJzaG91bGRJbmNsdWRlRmllbGQiLCJleHRyYWN0RmllbGRMYWJlbCIsImlzRmllbGRWaXNpYmxlIiwiY29tcHV0ZWRTdHlsZSIsImdldENvbXB1dGVkU3R5bGUiLCJkaXNwbGF5IiwidmlzaWJpbGl0eSIsIm9wYWNpdHkiLCJncmF2aXR5Rm9ybXNMYWJlbCIsImdldEdyYXZpdHlGb3Jtc0NvbWJpbmVkTGFiZWwiLCJnZXRMYWJlbEJ5Rm9yQXR0cmlidXRlIiwicGFyZW50TGFiZWwiLCJnZXRQYXJlbnRMYWJlbCIsImFkamFjZW50TGFiZWwiLCJnZXRBZGphY2VudExhYmVsIiwiY29udGFpbmVyTGFiZWwiLCJHcmF2aXR5Rm9ybXMiLCJhc3NvY2lhdGVkTGFiZWwiLCJjbG9uZWRMYWJlbCIsImNoaWxkSW5wdXRzIiwicHJldlNpYmxpbmciLCJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwicXVldWUiLCJwcm9jZXNzaW5nIiwiZXZlbnRUaW1lcyIsImV2ZW50SWRDb3VudGVyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXRyeUNvdW50IiwicHJvY2Vzc1F1ZXVlIiwiY2FuU2VuZEV2ZW50IiwicmVjb3JkRXZlbnRUaW1lIiwidW5zaGlmdCIsIndhaXRGb3JSYXRlTGltaXQiLCJjbGVhbnVwT2xkRXZlbnRUaW1lcyIsIm9uZVNlY29uZEFnbyIsInRpbWUiLCJ3YWl0VGltZSIsImNhbGN1bGF0ZVdhaXRUaW1lIiwib2xkZXN0RXZlbnRUaW1lIiwidGltZVNpbmNlT2xkZXN0IiwiX2V2ZW50Iiwic2VuZGVyIiwiZ2V0U3RhdHVzIiwicXVldWVMZW5ndGgiLCJldmVudHNJbkxhc3RTZWNvbmQiLCJjbGVhciIsImtlZXBhbGl2ZSIsImNhdGNoIiwiZXJyIiwic3RyaW5nVG9CeXRlcyIsInVuZXNjYXBlIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiY2hhckNvZGVBdCIsImhhc2giLCJ2YWx1ZUJ5dGVzIiwibmFtZXNwYWNlQnl0ZXMiLCJfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18iLCJfX3dlYnBhY2tfZXhwb3J0c19fIiwiX193ZWJwYWNrX3JlcXVpcmVfXyIsIm1vZHVsZUlkIiwiY2FjaGVkTW9kdWxlIiwiX193ZWJwYWNrX21vZHVsZXNfXyIsImNhbGwiXSwic291cmNlUm9vdCI6IiJ9
