var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { c as createLucideIcon, a as createContextScope, R as React, u as useComposedRefs, j as jsxRuntimeExports, b as createSlot, r as reactExports, d as reactDomExports, P as Primitive, e as useSize, f as useCallbackRef, g as useLayoutEffect2, h as useControllableState, i as useId, k as composeEventHandlers, l as Portal$1, m as usePrevious, n as hideOthers, o as useFocusGuards, p as ReactRemoveScroll, F as FocusScope, D as DismissableLayer, q as cn, C as Check, Q as QuestionType, s as commonjsGlobal, t as getDefaultExportFromCjs, v as Presence, w as Dialog, x as DialogContent, y as DialogHeader, z as DialogTitle, B as Button, L as Label, X, I as Input$1, A as LoaderCircle, E as CircleAlert, G as CircleCheck, S as Separator, H as Plus, J as DialogFooter, K as useParams, M as useAuth, N as useBackend, O as useQueryClient, T as useQuery, U as useMutation, V as Link$1, W as ArrowLeft, Y as Skeleton, Z as Layers, _ as Badge, $ as Pencil, a0 as Trash2, a1 as Card, a2 as CardHeader, a3 as BookOpen, a4 as Textarea, a5 as ConfirmDialog, a6 as ue, a7 as ExternalBlob } from "./index-DeYOekLN.js";
import { C as ChevronDown } from "./chevron-down-DXrSLUfZ.js";
import { G as GripVertical, A as AlignLeft, S as SquareCheckBig, g as getFontSize, F as FONT_SIZE_MAX, a as FONT_SIZE_MIN, s as setFontSize } from "./fontSizeStorage-BZdAnR9_.js";
import { C as Circle } from "./circle-BDdQekIi.js";
import { k as katex, R as RichTextDisplay } from "./RichTextDisplay-B_N3KOLW.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image$1 = createLucideIcon("image", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M9 18V5l12-2v13", key: "1jmyc2" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["circle", { cx: "18", cy: "16", r: "3", key: "1hluhg" }]
];
const Music = createLucideIcon("music", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
function clamp$1(value, [min2, max2]) {
  return Math.min(max2, Math.max(min2, value));
}
function createCollection(name) {
  const PROVIDER_NAME = name + "CollectionProvider";
  const [createCollectionContext, createCollectionScope2] = createContextScope(PROVIDER_NAME);
  const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(
    PROVIDER_NAME,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  );
  const CollectionProvider = (props) => {
    const { scope, children } = props;
    const ref = React.useRef(null);
    const itemMap = React.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionProviderImpl, { scope, itemMap, collectionRef: ref, children });
  };
  CollectionProvider.displayName = PROVIDER_NAME;
  const COLLECTION_SLOT_NAME = name + "CollectionSlot";
  const CollectionSlotImpl = createSlot(COLLECTION_SLOT_NAME);
  const CollectionSlot = React.forwardRef(
    (props, forwardedRef) => {
      const { scope, children } = props;
      const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
      const composedRefs = useComposedRefs(forwardedRef, context.collectionRef);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionSlotImpl, { ref: composedRefs, children });
    }
  );
  CollectionSlot.displayName = COLLECTION_SLOT_NAME;
  const ITEM_SLOT_NAME = name + "CollectionItemSlot";
  const ITEM_DATA_ATTR = "data-radix-collection-item";
  const CollectionItemSlotImpl = createSlot(ITEM_SLOT_NAME);
  const CollectionItemSlot = React.forwardRef(
    (props, forwardedRef) => {
      const { scope, children, ...itemData } = props;
      const ref = React.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref);
      const context = useCollectionContext(ITEM_SLOT_NAME, scope);
      React.useEffect(() => {
        context.itemMap.set(ref, { ref, ...itemData });
        return () => void context.itemMap.delete(ref);
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionItemSlotImpl, { ...{ [ITEM_DATA_ATTR]: "" }, ref: composedRefs, children });
    }
  );
  CollectionItemSlot.displayName = ITEM_SLOT_NAME;
  function useCollection2(scope) {
    const context = useCollectionContext(name + "CollectionConsumer", scope);
    const getItems = React.useCallback(() => {
      const collectionNode = context.collectionRef.current;
      if (!collectionNode) return [];
      const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
      const items = Array.from(context.itemMap.values());
      const orderedItems = items.sort(
        (a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current)
      );
      return orderedItems;
    }, [context.collectionRef, context.itemMap]);
    return getItems;
  }
  return [
    { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
    useCollection2,
    createCollectionScope2
  ];
}
var DirectionContext = reactExports.createContext(void 0);
function useDirection(localDir) {
  const globalDir = reactExports.useContext(DirectionContext);
  return localDir || globalDir || "ltr";
}
const sides = ["top", "right", "bottom", "left"];
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = (v) => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  const firstChar = placement[0];
  return firstChar === "t" || firstChar === "b" ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.includes("start") ? placement.replace("start", "end") : placement.replace("end", "start");
}
const lrPlacement = ["left", "right"];
const rlPlacement = ["right", "left"];
const tbPlacement = ["top", "bottom"];
const btPlacement = ["bottom", "top"];
function getSideList(side, isStart, rtl) {
  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rlPlacement : lrPlacement;
      return isStart ? lrPlacement : rlPlacement;
    case "left":
    case "right":
      return isStart ? tbPlacement : btPlacement;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  const side = getSide(placement);
  return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
const MAX_RESET_COUNT = 50;
const computePosition$1 = async (reference, floating, config2) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config2;
  const platformWithDetectOverflow = platform2.detectOverflow ? platform2 : {
    ...platform2,
    detectOverflow
  };
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let resetCount = 0;
  const middlewareData = {};
  for (let i = 0; i < middleware.length; i++) {
    const currentMiddleware = middleware[i];
    if (!currentMiddleware) {
      continue;
    }
    const {
      name,
      fn
    } = currentMiddleware;
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platformWithDetectOverflow,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData[name] = {
      ...middlewareData[name],
      ...data
    };
    if (reset && resetCount < MAX_RESET_COUNT) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
const arrow$3 = (options) => ({
  name: "arrow",
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform: platform2,
      elements,
      middlewareData
    } = state;
    const {
      element,
      padding = 0
    } = evaluate(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x,
      y
    };
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform2.getDimensions(element);
    const isYAxis = axis === "y";
    const minProp = isYAxis ? "top" : "left";
    const maxProp = isYAxis ? "bottom" : "right";
    const clientProp = isYAxis ? "clientHeight" : "clientWidth";
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
    if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
    const min$1 = minPadding;
    const max2 = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset2 = clamp(min$1, center, max2);
    const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset2 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset2,
        centerOffset: center - offset2 - alignmentOffset,
        ...shouldAddOffset && {
          alignmentOffset
        }
      },
      reset: shouldAddOffset
    };
  }
});
const flip$2 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const initialSideAxis = getSideAxis(initialPlacement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await platform2.detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides2 = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          const ignoreCrossAxisOverflow = checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false;
          if (!ignoreCrossAxisOverflow || // We leave the current main axis only if every placement on that axis
          // overflows the main axis.
          overflowsData.every((d) => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) {
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$filter2;
              const placement2 = (_overflowsData$filter2 = overflowsData.filter((d) => {
                if (hasFallbackAxisSideDirection) {
                  const currentSideAxis = getSideAxis(d.placement);
                  return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  currentSideAxis === "y";
                }
                return true;
              }).map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return sides.some((side) => overflow[side] >= 0);
}
const hide$2 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "hide",
    options,
    async fn(state) {
      const {
        rects,
        platform: platform2
      } = state;
      const {
        strategy = "referenceHidden",
        ...detectOverflowOptions
      } = evaluate(options, state);
      switch (strategy) {
        case "referenceHidden": {
          const overflow = await platform2.detectOverflow(state, {
            ...detectOverflowOptions,
            elementContext: "reference"
          });
          const offsets = getSideOffsets(overflow, rects.reference);
          return {
            data: {
              referenceHiddenOffsets: offsets,
              referenceHidden: isAnySideFullyClipped(offsets)
            }
          };
        }
        case "escaped": {
          const overflow = await platform2.detectOverflow(state, {
            ...detectOverflowOptions,
            altBoundary: true
          });
          const offsets = getSideOffsets(overflow, rects.floating);
          return {
            data: {
              escapedOffsets: offsets,
              escaped: isAnySideFullyClipped(offsets)
            }
          };
        }
        default: {
          return {};
        }
      }
    }
  };
};
const originSides = /* @__PURE__ */ new Set(["left", "top"]);
async function convertValueToCoords(state, options) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = originSides.has(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
const offset$2 = function(options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: "offset",
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};
const shift$2 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x,
        y,
        placement,
        platform: platform2
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y2
            } = _ref;
            return {
              x: x2,
              y: y2
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await platform2.detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
const limitShift$2 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset: offset2 = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = getSideAxis(placement);
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = evaluate(offset2, state);
      const computedOffset = typeof rawOffset === "number" ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...rawOffset
      };
      if (checkMainAxis) {
        const len = mainAxis === "y" ? "height" : "width";
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === "y" ? "width" : "height";
        const isOriginSide = originSides.has(getSide(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};
const size$2 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "size",
    options,
    async fn(state) {
      var _state$middlewareData, _state$middlewareData2;
      const {
        placement,
        rects,
        platform: platform2,
        elements
      } = state;
      const {
        apply: apply2 = () => {
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const overflow = await platform2.detectOverflow(state, detectOverflowOptions);
      const side = getSide(placement);
      const alignment = getAlignment(placement);
      const isYAxis = getSideAxis(placement) === "y";
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === "top" || side === "bottom") {
        heightSide = side;
        widthSide = alignment === (await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
      } else {
        widthSide = side;
        heightSide = alignment === "end" ? "top" : "bottom";
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
      const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
      const noShift = !state.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
        availableWidth = maximumClippingWidth;
      }
      if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
        availableHeight = maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = max(overflow.left, 0);
        const xMax = max(overflow.right, 0);
        const yMin = max(overflow.top, 0);
        const yMax = max(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
        } else {
          availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
        }
      }
      await apply2({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform2.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};
function hasWindow() {
  return typeof window !== "undefined";
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
}
function isTableElement(element) {
  return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
  try {
    if (element.matches(":popover-open")) {
      return true;
    }
  } catch (_e) {
  }
  try {
    return element.matches(":modal");
  } catch (_e) {
    return false;
  }
}
const willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
const containRe = /paint|layout|strict|content/;
const isNotNone = (value) => !!value && value !== "none";
let isWebKitValue;
function isContainingBlock(elementOrCss) {
  const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
  return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || "") || containRe.test(css.contain || "");
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (isWebKitValue == null) {
    isWebKitValue = typeof CSS !== "undefined" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none");
  }
  return isWebKitValue;
}
function isLastTraversableNode(node) {
  return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  } else {
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
function getCssDimensions(element) {
  const css = getComputedStyle$1(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}
const noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = getFrameElement(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle$1(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = getFrameElement(currentWin);
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}
function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll) {
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === "fixed";
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === "rtl") {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
const SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  const windowScrollbarX = getWindowScrollBarX(html);
  if (windowScrollbarX <= 0) {
    const doc = html.ownerDocument;
    const body = doc.body;
    const bodyStyles = getComputedStyle(body);
    const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
    const clippingStableScrollbarWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
    if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) {
      width -= clippingStableScrollbarWidth;
    }
  } else if (windowScrollbarX <= SCROLLBAR_MAX) {
    width += windowScrollbarX;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && (currentContainingBlockComputedStyle.position === "absolute" || currentContainingBlockComputedStyle.position === "fixed") || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
  let top = firstRect.top;
  let right = firstRect.right;
  let bottom = firstRect.bottom;
  let left = firstRect.left;
  for (let i = 1; i < clippingAncestors.length; i++) {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
    top = max(rect.top, top);
    right = min(rect.right, right);
    bottom = min(rect.bottom, bottom);
    left = max(rect.left, left);
  }
  return {
    width: right - left,
    height: bottom - top,
    x: left,
    y: top
  };
}
function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  function setLeftRTLScrollbarOffset() {
    offsets.x = getWindowScrollBarX(documentElement);
  }
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      setLeftRTLScrollbarOffset();
    }
  }
  if (isFixed && !isOffsetParentAnElement && documentElement) {
    setLeftRTLScrollbarOffset();
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}
function isStaticPositioned(element) {
  return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;
  if (getDocumentElement(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
  const win = getWindow(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}
const getElementRects = async function(data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};
function isRTL(element) {
  return getComputedStyle$1(element).direction === "rtl";
}
const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root2 = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root2.clientWidth - (left + width));
    const insetBottom = floor(root2.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1e3);
        } else {
          refresh(false, ratio);
        }
      }
      if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        refresh();
      }
      isFirstUpdate = false;
    }
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root2.ownerDocument
      });
    } catch (_e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...floating ? getOverflowAncestors(floating) : []] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    if (floating) {
      resizeObserver.observe(floating);
    }
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
const offset$1 = offset$2;
const shift$1 = shift$2;
const flip$1 = flip$2;
const size$1 = size$2;
const hide$1 = hide$2;
const arrow$2 = arrow$3;
const limitShift$1 = limitShift$2;
const computePosition = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};
var isClient = typeof document !== "undefined";
var noop = function noop2() {
};
var index = isClient ? reactExports.useLayoutEffect : noop;
function deepEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (typeof a === "function" && a.toString() === b.toString()) {
    return true;
  }
  let length;
  let i;
  let keys2;
  if (a && b && typeof a === "object") {
    if (Array.isArray(a)) {
      length = a.length;
      if (length !== b.length) return false;
      for (i = length; i-- !== 0; ) {
        if (!deepEqual(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    keys2 = Object.keys(a);
    length = keys2.length;
    if (length !== Object.keys(b).length) {
      return false;
    }
    for (i = length; i-- !== 0; ) {
      if (!{}.hasOwnProperty.call(b, keys2[i])) {
        return false;
      }
    }
    for (i = length; i-- !== 0; ) {
      const key = keys2[i];
      if (key === "_owner" && a.$$typeof) {
        continue;
      }
      if (!deepEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return a !== a && b !== b;
}
function getDPR(element) {
  if (typeof window === "undefined") {
    return 1;
  }
  const win = element.ownerDocument.defaultView || window;
  return win.devicePixelRatio || 1;
}
function roundByDPR(element, value) {
  const dpr = getDPR(element);
  return Math.round(value * dpr) / dpr;
}
function useLatestRef(value) {
  const ref = reactExports.useRef(value);
  index(() => {
    ref.current = value;
  });
  return ref;
}
function useFloating(options) {
  if (options === void 0) {
    options = {};
  }
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2,
    elements: {
      reference: externalReference,
      floating: externalFloating
    } = {},
    transform = true,
    whileElementsMounted,
    open
  } = options;
  const [data, setData] = reactExports.useState({
    x: 0,
    y: 0,
    strategy,
    placement,
    middlewareData: {},
    isPositioned: false
  });
  const [latestMiddleware, setLatestMiddleware] = reactExports.useState(middleware);
  if (!deepEqual(latestMiddleware, middleware)) {
    setLatestMiddleware(middleware);
  }
  const [_reference, _setReference] = reactExports.useState(null);
  const [_floating, _setFloating] = reactExports.useState(null);
  const setReference = reactExports.useCallback((node) => {
    if (node !== referenceRef.current) {
      referenceRef.current = node;
      _setReference(node);
    }
  }, []);
  const setFloating = reactExports.useCallback((node) => {
    if (node !== floatingRef.current) {
      floatingRef.current = node;
      _setFloating(node);
    }
  }, []);
  const referenceEl = externalReference || _reference;
  const floatingEl = externalFloating || _floating;
  const referenceRef = reactExports.useRef(null);
  const floatingRef = reactExports.useRef(null);
  const dataRef = reactExports.useRef(data);
  const hasWhileElementsMounted = whileElementsMounted != null;
  const whileElementsMountedRef = useLatestRef(whileElementsMounted);
  const platformRef = useLatestRef(platform2);
  const openRef = useLatestRef(open);
  const update = reactExports.useCallback(() => {
    if (!referenceRef.current || !floatingRef.current) {
      return;
    }
    const config2 = {
      placement,
      strategy,
      middleware: latestMiddleware
    };
    if (platformRef.current) {
      config2.platform = platformRef.current;
    }
    computePosition(referenceRef.current, floatingRef.current, config2).then((data2) => {
      const fullData = {
        ...data2,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: openRef.current !== false
      };
      if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
        dataRef.current = fullData;
        reactDomExports.flushSync(() => {
          setData(fullData);
        });
      }
    });
  }, [latestMiddleware, placement, strategy, platformRef, openRef]);
  index(() => {
    if (open === false && dataRef.current.isPositioned) {
      dataRef.current.isPositioned = false;
      setData((data2) => ({
        ...data2,
        isPositioned: false
      }));
    }
  }, [open]);
  const isMountedRef = reactExports.useRef(false);
  index(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  index(() => {
    if (referenceEl) referenceRef.current = referenceEl;
    if (floatingEl) floatingRef.current = floatingEl;
    if (referenceEl && floatingEl) {
      if (whileElementsMountedRef.current) {
        return whileElementsMountedRef.current(referenceEl, floatingEl, update);
      }
      update();
    }
  }, [referenceEl, floatingEl, update, whileElementsMountedRef, hasWhileElementsMounted]);
  const refs = reactExports.useMemo(() => ({
    reference: referenceRef,
    floating: floatingRef,
    setReference,
    setFloating
  }), [setReference, setFloating]);
  const elements = reactExports.useMemo(() => ({
    reference: referenceEl,
    floating: floatingEl
  }), [referenceEl, floatingEl]);
  const floatingStyles = reactExports.useMemo(() => {
    const initialStyles = {
      position: strategy,
      left: 0,
      top: 0
    };
    if (!elements.floating) {
      return initialStyles;
    }
    const x = roundByDPR(elements.floating, data.x);
    const y = roundByDPR(elements.floating, data.y);
    if (transform) {
      return {
        ...initialStyles,
        transform: "translate(" + x + "px, " + y + "px)",
        ...getDPR(elements.floating) >= 1.5 && {
          willChange: "transform"
        }
      };
    }
    return {
      position: strategy,
      left: x,
      top: y
    };
  }, [strategy, transform, elements.floating, data.x, data.y]);
  return reactExports.useMemo(() => ({
    ...data,
    update,
    refs,
    elements,
    floatingStyles
  }), [data, update, refs, elements, floatingStyles]);
}
const arrow$1 = (options) => {
  function isRef(value) {
    return {}.hasOwnProperty.call(value, "current");
  }
  return {
    name: "arrow",
    options,
    fn(state) {
      const {
        element,
        padding
      } = typeof options === "function" ? options(state) : options;
      if (element && isRef(element)) {
        if (element.current != null) {
          return arrow$2({
            element: element.current,
            padding
          }).fn(state);
        }
        return {};
      }
      if (element) {
        return arrow$2({
          element,
          padding
        }).fn(state);
      }
      return {};
    }
  };
};
const offset = (options, deps) => {
  const result = offset$1(options);
  return {
    name: result.name,
    fn: result.fn,
    options: [options, deps]
  };
};
const shift = (options, deps) => {
  const result = shift$1(options);
  return {
    name: result.name,
    fn: result.fn,
    options: [options, deps]
  };
};
const limitShift = (options, deps) => {
  const result = limitShift$1(options);
  return {
    fn: result.fn,
    options: [options, deps]
  };
};
const flip = (options, deps) => {
  const result = flip$1(options);
  return {
    name: result.name,
    fn: result.fn,
    options: [options, deps]
  };
};
const size = (options, deps) => {
  const result = size$1(options);
  return {
    name: result.name,
    fn: result.fn,
    options: [options, deps]
  };
};
const hide = (options, deps) => {
  const result = hide$1(options);
  return {
    name: result.name,
    fn: result.fn,
    options: [options, deps]
  };
};
const arrow = (options, deps) => {
  const result = arrow$1(options);
  return {
    name: result.name,
    fn: result.fn,
    options: [options, deps]
  };
};
var NAME$1 = "Arrow";
var Arrow$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { children, width = 10, height = 5, ...arrowProps } = props;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.svg,
    {
      ...arrowProps,
      ref: forwardedRef,
      width,
      height,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: props.asChild ? children : /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
Arrow$1.displayName = NAME$1;
var Root$1 = Arrow$1;
var POPPER_NAME = "Popper";
var [createPopperContext, createPopperScope] = createContextScope(POPPER_NAME);
var [PopperProvider, usePopperContext] = createPopperContext(POPPER_NAME);
var Popper = (props) => {
  const { __scopePopper, children } = props;
  const [anchor, setAnchor] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PopperProvider, { scope: __scopePopper, anchor, onAnchorChange: setAnchor, children });
};
Popper.displayName = POPPER_NAME;
var ANCHOR_NAME = "PopperAnchor";
var PopperAnchor = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopper, virtualRef, ...anchorProps } = props;
    const context = usePopperContext(ANCHOR_NAME, __scopePopper);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const anchorRef = reactExports.useRef(null);
    reactExports.useEffect(() => {
      const previousAnchor = anchorRef.current;
      anchorRef.current = (virtualRef == null ? void 0 : virtualRef.current) || ref.current;
      if (previousAnchor !== anchorRef.current) {
        context.onAnchorChange(anchorRef.current);
      }
    });
    return virtualRef ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { ...anchorProps, ref: composedRefs });
  }
);
PopperAnchor.displayName = ANCHOR_NAME;
var CONTENT_NAME$2 = "PopperContent";
var [PopperContentProvider, useContentContext] = createPopperContext(CONTENT_NAME$2);
var PopperContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    var _a, _b, _c, _d, _e, _f;
    const {
      __scopePopper,
      side = "bottom",
      sideOffset = 0,
      align = "center",
      alignOffset = 0,
      arrowPadding = 0,
      avoidCollisions = true,
      collisionBoundary = [],
      collisionPadding: collisionPaddingProp = 0,
      sticky = "partial",
      hideWhenDetached = false,
      updatePositionStrategy = "optimized",
      onPlaced,
      ...contentProps
    } = props;
    const context = usePopperContext(CONTENT_NAME$2, __scopePopper);
    const [content, setContent] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
    const [arrow$12, setArrow] = reactExports.useState(null);
    const arrowSize = useSize(arrow$12);
    const arrowWidth = (arrowSize == null ? void 0 : arrowSize.width) ?? 0;
    const arrowHeight = (arrowSize == null ? void 0 : arrowSize.height) ?? 0;
    const desiredPlacement = side + (align !== "center" ? "-" + align : "");
    const collisionPadding = typeof collisionPaddingProp === "number" ? collisionPaddingProp : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp };
    const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
    const hasExplicitBoundaries = boundary.length > 0;
    const detectOverflowOptions = {
      padding: collisionPadding,
      boundary: boundary.filter(isNotNull),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: hasExplicitBoundaries
    };
    const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: desiredPlacement,
      whileElementsMounted: (...args) => {
        const cleanup = autoUpdate(...args, {
          animationFrame: updatePositionStrategy === "always"
        });
        return cleanup;
      },
      elements: {
        reference: context.anchor
      },
      middleware: [
        offset({ mainAxis: sideOffset + arrowHeight, alignmentAxis: alignOffset }),
        avoidCollisions && shift({
          mainAxis: true,
          crossAxis: false,
          limiter: sticky === "partial" ? limitShift() : void 0,
          ...detectOverflowOptions
        }),
        avoidCollisions && flip({ ...detectOverflowOptions }),
        size({
          ...detectOverflowOptions,
          apply: ({ elements, rects, availableWidth, availableHeight }) => {
            const { width: anchorWidth, height: anchorHeight } = rects.reference;
            const contentStyle = elements.floating.style;
            contentStyle.setProperty("--radix-popper-available-width", `${availableWidth}px`);
            contentStyle.setProperty("--radix-popper-available-height", `${availableHeight}px`);
            contentStyle.setProperty("--radix-popper-anchor-width", `${anchorWidth}px`);
            contentStyle.setProperty("--radix-popper-anchor-height", `${anchorHeight}px`);
          }
        }),
        arrow$12 && arrow({ element: arrow$12, padding: arrowPadding }),
        transformOrigin({ arrowWidth, arrowHeight }),
        hideWhenDetached && hide({ strategy: "referenceHidden", ...detectOverflowOptions })
      ]
    });
    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
    const handlePlaced = useCallbackRef(onPlaced);
    useLayoutEffect2(() => {
      if (isPositioned) {
        handlePlaced == null ? void 0 : handlePlaced();
      }
    }, [isPositioned, handlePlaced]);
    const arrowX = (_a = middlewareData.arrow) == null ? void 0 : _a.x;
    const arrowY = (_b = middlewareData.arrow) == null ? void 0 : _b.y;
    const cannotCenterArrow = ((_c = middlewareData.arrow) == null ? void 0 : _c.centerOffset) !== 0;
    const [contentZIndex, setContentZIndex] = reactExports.useState();
    useLayoutEffect2(() => {
      if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
    }, [content]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: refs.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...floatingStyles,
          transform: isPositioned ? floatingStyles.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: contentZIndex,
          ["--radix-popper-transform-origin"]: [
            (_d = middlewareData.transformOrigin) == null ? void 0 : _d.x,
            (_e = middlewareData.transformOrigin) == null ? void 0 : _e.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((_f = middlewareData.hide) == null ? void 0 : _f.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: props.dir,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          PopperContentProvider,
          {
            scope: __scopePopper,
            placedSide,
            onArrowChange: setArrow,
            arrowX,
            arrowY,
            shouldHideArrow: cannotCenterArrow,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Primitive.div,
              {
                "data-side": placedSide,
                "data-align": placedAlign,
                ...contentProps,
                ref: composedRefs,
                style: {
                  ...contentProps.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: !isPositioned ? "none" : void 0
                }
              }
            )
          }
        )
      }
    );
  }
);
PopperContent.displayName = CONTENT_NAME$2;
var ARROW_NAME$1 = "PopperArrow";
var OPPOSITE_SIDE = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
};
var PopperArrow = reactExports.forwardRef(function PopperArrow2(props, forwardedRef) {
  const { __scopePopper, ...arrowProps } = props;
  const contentContext = useContentContext(ARROW_NAME$1, __scopePopper);
  const baseSide = OPPOSITE_SIDE[contentContext.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        ref: contentContext.onArrowChange,
        style: {
          position: "absolute",
          left: contentContext.arrowX,
          top: contentContext.arrowY,
          [baseSide]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[contentContext.placedSide],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: `rotate(180deg)`,
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[contentContext.placedSide],
          visibility: contentContext.shouldHideArrow ? "hidden" : void 0
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Root$1,
          {
            ...arrowProps,
            ref: forwardedRef,
            style: {
              ...arrowProps.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: "block"
            }
          }
        )
      }
    )
  );
});
PopperArrow.displayName = ARROW_NAME$1;
function isNotNull(value) {
  return value !== null;
}
var transformOrigin = (options) => ({
  name: "transformOrigin",
  options,
  fn(data) {
    var _a, _b, _c;
    const { placement, rects, middlewareData } = data;
    const cannotCenterArrow = ((_a = middlewareData.arrow) == null ? void 0 : _a.centerOffset) !== 0;
    const isArrowHidden = cannotCenterArrow;
    const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
    const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
    const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[placedAlign];
    const arrowXCenter = (((_b = middlewareData.arrow) == null ? void 0 : _b.x) ?? 0) + arrowWidth / 2;
    const arrowYCenter = (((_c = middlewareData.arrow) == null ? void 0 : _c.y) ?? 0) + arrowHeight / 2;
    let x = "";
    let y = "";
    if (placedSide === "bottom") {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
      y = `${-arrowHeight}px`;
    } else if (placedSide === "top") {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
      y = `${rects.floating.height + arrowHeight}px`;
    } else if (placedSide === "right") {
      x = `${-arrowHeight}px`;
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
    } else if (placedSide === "left") {
      x = `${rects.floating.width + arrowHeight}px`;
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
    }
    return { data: { x, y } };
  }
});
function getSideAndAlignFromPlacement(placement) {
  const [side, align = "center"] = placement.split("-");
  return [side, align];
}
var Root2$2 = Popper;
var Anchor = PopperAnchor;
var Content = PopperContent;
var Arrow = PopperArrow;
var VISUALLY_HIDDEN_STYLES = Object.freeze({
  // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
  position: "absolute",
  border: 0,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  wordWrap: "normal"
});
var NAME = "VisuallyHidden";
var VisuallyHidden = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        ...props,
        ref: forwardedRef,
        style: { ...VISUALLY_HIDDEN_STYLES, ...props.style }
      }
    );
  }
);
VisuallyHidden.displayName = NAME;
var OPEN_KEYS = [" ", "Enter", "ArrowUp", "ArrowDown"];
var SELECTION_KEYS = [" ", "Enter"];
var SELECT_NAME = "Select";
var [Collection$1, useCollection$1, createCollectionScope$1] = createCollection(SELECT_NAME);
var [createSelectContext] = createContextScope(SELECT_NAME, [
  createCollectionScope$1,
  createPopperScope
]);
var usePopperScope = createPopperScope();
var [SelectProvider, useSelectContext] = createSelectContext(SELECT_NAME);
var [SelectNativeOptionsProvider, useSelectNativeOptionsContext] = createSelectContext(SELECT_NAME);
var Select$1 = (props) => {
  const {
    __scopeSelect,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    value: valueProp,
    defaultValue,
    onValueChange,
    dir,
    name,
    autoComplete,
    disabled,
    required,
    form
  } = props;
  const popperScope = usePopperScope(__scopeSelect);
  const [trigger, setTrigger] = reactExports.useState(null);
  const [valueNode, setValueNode] = reactExports.useState(null);
  const [valueNodeHasChildren, setValueNodeHasChildren] = reactExports.useState(false);
  const direction = useDirection(dir);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: SELECT_NAME
  });
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
    caller: SELECT_NAME
  });
  const triggerPointerDownPosRef = reactExports.useRef(null);
  const isFormControl = trigger ? form || !!trigger.closest("form") : true;
  const [nativeOptionsSet, setNativeOptionsSet] = reactExports.useState(/* @__PURE__ */ new Set());
  const nativeSelectKey = Array.from(nativeOptionsSet).map((option) => option.props.value).join(";");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2$2, { ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SelectProvider,
    {
      required,
      scope: __scopeSelect,
      trigger,
      onTriggerChange: setTrigger,
      valueNode,
      onValueNodeChange: setValueNode,
      valueNodeHasChildren,
      onValueNodeHasChildrenChange: setValueNodeHasChildren,
      contentId: useId(),
      value,
      onValueChange: setValue,
      open,
      onOpenChange: setOpen,
      dir: direction,
      triggerPointerDownPosRef,
      disabled,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.Provider, { scope: __scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectNativeOptionsProvider,
          {
            scope: props.__scopeSelect,
            onNativeOptionAdd: reactExports.useCallback((option) => {
              setNativeOptionsSet((prev) => new Set(prev).add(option));
            }, []),
            onNativeOptionRemove: reactExports.useCallback((option) => {
              setNativeOptionsSet((prev) => {
                const optionsSet = new Set(prev);
                optionsSet.delete(option);
                return optionsSet;
              });
            }, []),
            children
          }
        ) }),
        isFormControl ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          SelectBubbleInput,
          {
            "aria-hidden": true,
            required,
            tabIndex: -1,
            name,
            autoComplete,
            value,
            onChange: (event) => setValue(event.target.value),
            disabled,
            form,
            children: [
              value === void 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "" }) : null,
              Array.from(nativeOptionsSet)
            ]
          },
          nativeSelectKey
        ) : null
      ]
    }
  ) });
};
Select$1.displayName = SELECT_NAME;
var TRIGGER_NAME$1 = "SelectTrigger";
var SelectTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, disabled = false, ...triggerProps } = props;
    const popperScope = usePopperScope(__scopeSelect);
    const context = useSelectContext(TRIGGER_NAME$1, __scopeSelect);
    const isDisabled = context.disabled || disabled;
    const composedRefs = useComposedRefs(forwardedRef, context.onTriggerChange);
    const getItems = useCollection$1(__scopeSelect);
    const pointerTypeRef = reactExports.useRef("touch");
    const [searchRef, handleTypeaheadSearch, resetTypeahead] = useTypeaheadSearch((search) => {
      const enabledItems = getItems().filter((item) => !item.disabled);
      const currentItem = enabledItems.find((item) => item.value === context.value);
      const nextItem = findNextItem(enabledItems, search, currentItem);
      if (nextItem !== void 0) {
        context.onValueChange(nextItem.value);
      }
    });
    const handleOpen = (pointerEvent) => {
      if (!isDisabled) {
        context.onOpenChange(true);
        resetTypeahead();
      }
      if (pointerEvent) {
        context.triggerPointerDownPosRef.current = {
          x: Math.round(pointerEvent.pageX),
          y: Math.round(pointerEvent.pageY)
        };
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { asChild: true, ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "combobox",
        "aria-controls": context.contentId,
        "aria-expanded": context.open,
        "aria-required": context.required,
        "aria-autocomplete": "none",
        dir: context.dir,
        "data-state": context.open ? "open" : "closed",
        disabled: isDisabled,
        "data-disabled": isDisabled ? "" : void 0,
        "data-placeholder": shouldShowPlaceholder(context.value) ? "" : void 0,
        ...triggerProps,
        ref: composedRefs,
        onClick: composeEventHandlers(triggerProps.onClick, (event) => {
          event.currentTarget.focus();
          if (pointerTypeRef.current !== "mouse") {
            handleOpen(event);
          }
        }),
        onPointerDown: composeEventHandlers(triggerProps.onPointerDown, (event) => {
          pointerTypeRef.current = event.pointerType;
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) {
            target.releasePointerCapture(event.pointerId);
          }
          if (event.button === 0 && event.ctrlKey === false && event.pointerType === "mouse") {
            handleOpen(event);
            event.preventDefault();
          }
        }),
        onKeyDown: composeEventHandlers(triggerProps.onKeyDown, (event) => {
          const isTypingAhead = searchRef.current !== "";
          const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
          if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
          if (isTypingAhead && event.key === " ") return;
          if (OPEN_KEYS.includes(event.key)) {
            handleOpen();
            event.preventDefault();
          }
        })
      }
    ) });
  }
);
SelectTrigger$1.displayName = TRIGGER_NAME$1;
var VALUE_NAME = "SelectValue";
var SelectValue$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, className, style, children, placeholder = "", ...valueProps } = props;
    const context = useSelectContext(VALUE_NAME, __scopeSelect);
    const { onValueNodeHasChildrenChange } = context;
    const hasChildren = children !== void 0;
    const composedRefs = useComposedRefs(forwardedRef, context.onValueNodeChange);
    useLayoutEffect2(() => {
      onValueNodeHasChildrenChange(hasChildren);
    }, [onValueNodeHasChildrenChange, hasChildren]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        ...valueProps,
        ref: composedRefs,
        style: { pointerEvents: "none" },
        children: shouldShowPlaceholder(context.value) ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: placeholder }) : children
      }
    );
  }
);
SelectValue$1.displayName = VALUE_NAME;
var ICON_NAME = "SelectIcon";
var SelectIcon = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, children, ...iconProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { "aria-hidden": true, ...iconProps, ref: forwardedRef, children: children || "▼" });
  }
);
SelectIcon.displayName = ICON_NAME;
var PORTAL_NAME = "SelectPortal";
var SelectPortal = (props) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { asChild: true, ...props });
};
SelectPortal.displayName = PORTAL_NAME;
var CONTENT_NAME$1 = "SelectContent";
var SelectContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useSelectContext(CONTENT_NAME$1, props.__scopeSelect);
    const [fragment, setFragment] = reactExports.useState();
    useLayoutEffect2(() => {
      setFragment(new DocumentFragment());
    }, []);
    if (!context.open) {
      const frag = fragment;
      return frag ? reactDomExports.createPortal(
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContentProvider, { scope: props.__scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.Slot, { scope: props.__scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: props.children }) }) }),
        frag
      ) : null;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContentImpl, { ...props, ref: forwardedRef });
  }
);
SelectContent$1.displayName = CONTENT_NAME$1;
var CONTENT_MARGIN = 10;
var [SelectContentProvider, useSelectContentContext] = createSelectContext(CONTENT_NAME$1);
var CONTENT_IMPL_NAME = "SelectContentImpl";
var Slot = createSlot("SelectContent.RemoveScroll");
var SelectContentImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSelect,
      position = "item-aligned",
      onCloseAutoFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      //
      // PopperContent props
      side,
      sideOffset,
      align,
      alignOffset,
      arrowPadding,
      collisionBoundary,
      collisionPadding,
      sticky,
      hideWhenDetached,
      avoidCollisions,
      //
      ...contentProps
    } = props;
    const context = useSelectContext(CONTENT_NAME$1, __scopeSelect);
    const [content, setContent] = reactExports.useState(null);
    const [viewport, setViewport] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
    const [selectedItem, setSelectedItem] = reactExports.useState(null);
    const [selectedItemText, setSelectedItemText] = reactExports.useState(
      null
    );
    const getItems = useCollection$1(__scopeSelect);
    const [isPositioned, setIsPositioned] = reactExports.useState(false);
    const firstValidItemFoundRef = reactExports.useRef(false);
    reactExports.useEffect(() => {
      if (content) return hideOthers(content);
    }, [content]);
    useFocusGuards();
    const focusFirst2 = reactExports.useCallback(
      (candidates) => {
        const [firstItem, ...restItems] = getItems().map((item) => item.ref.current);
        const [lastItem] = restItems.slice(-1);
        const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
        for (const candidate of candidates) {
          if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
          candidate == null ? void 0 : candidate.scrollIntoView({ block: "nearest" });
          if (candidate === firstItem && viewport) viewport.scrollTop = 0;
          if (candidate === lastItem && viewport) viewport.scrollTop = viewport.scrollHeight;
          candidate == null ? void 0 : candidate.focus();
          if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
        }
      },
      [getItems, viewport]
    );
    const focusSelectedItem = reactExports.useCallback(
      () => focusFirst2([selectedItem, content]),
      [focusFirst2, selectedItem, content]
    );
    reactExports.useEffect(() => {
      if (isPositioned) {
        focusSelectedItem();
      }
    }, [isPositioned, focusSelectedItem]);
    const { onOpenChange, triggerPointerDownPosRef } = context;
    reactExports.useEffect(() => {
      if (content) {
        let pointerMoveDelta = { x: 0, y: 0 };
        const handlePointerMove = (event) => {
          var _a, _b;
          pointerMoveDelta = {
            x: Math.abs(Math.round(event.pageX) - (((_a = triggerPointerDownPosRef.current) == null ? void 0 : _a.x) ?? 0)),
            y: Math.abs(Math.round(event.pageY) - (((_b = triggerPointerDownPosRef.current) == null ? void 0 : _b.y) ?? 0))
          };
        };
        const handlePointerUp = (event) => {
          if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) {
            event.preventDefault();
          } else {
            if (!content.contains(event.target)) {
              onOpenChange(false);
            }
          }
          document.removeEventListener("pointermove", handlePointerMove);
          triggerPointerDownPosRef.current = null;
        };
        if (triggerPointerDownPosRef.current !== null) {
          document.addEventListener("pointermove", handlePointerMove);
          document.addEventListener("pointerup", handlePointerUp, { capture: true, once: true });
        }
        return () => {
          document.removeEventListener("pointermove", handlePointerMove);
          document.removeEventListener("pointerup", handlePointerUp, { capture: true });
        };
      }
    }, [content, onOpenChange, triggerPointerDownPosRef]);
    reactExports.useEffect(() => {
      const close = () => onOpenChange(false);
      window.addEventListener("blur", close);
      window.addEventListener("resize", close);
      return () => {
        window.removeEventListener("blur", close);
        window.removeEventListener("resize", close);
      };
    }, [onOpenChange]);
    const [searchRef, handleTypeaheadSearch] = useTypeaheadSearch((search) => {
      const enabledItems = getItems().filter((item) => !item.disabled);
      const currentItem = enabledItems.find((item) => item.ref.current === document.activeElement);
      const nextItem = findNextItem(enabledItems, search, currentItem);
      if (nextItem) {
        setTimeout(() => nextItem.ref.current.focus());
      }
    });
    const itemRefCallback = reactExports.useCallback(
      (node, value, disabled) => {
        const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
        const isSelectedItem = context.value !== void 0 && context.value === value;
        if (isSelectedItem || isFirstValidItem) {
          setSelectedItem(node);
          if (isFirstValidItem) firstValidItemFoundRef.current = true;
        }
      },
      [context.value]
    );
    const handleItemLeave = reactExports.useCallback(() => content == null ? void 0 : content.focus(), [content]);
    const itemTextRefCallback = reactExports.useCallback(
      (node, value, disabled) => {
        const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
        const isSelectedItem = context.value !== void 0 && context.value === value;
        if (isSelectedItem || isFirstValidItem) {
          setSelectedItemText(node);
        }
      },
      [context.value]
    );
    const SelectPosition = position === "popper" ? SelectPopperPosition : SelectItemAlignedPosition;
    const popperContentProps = SelectPosition === SelectPopperPosition ? {
      side,
      sideOffset,
      align,
      alignOffset,
      arrowPadding,
      collisionBoundary,
      collisionPadding,
      sticky,
      hideWhenDetached,
      avoidCollisions
    } : {};
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SelectContentProvider,
      {
        scope: __scopeSelect,
        content,
        viewport,
        onViewportChange: setViewport,
        itemRefCallback,
        selectedItem,
        onItemLeave: handleItemLeave,
        itemTextRefCallback,
        focusSelectedItem,
        selectedItemText,
        position,
        isPositioned,
        searchRef,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReactRemoveScroll, { as: Slot, allowPinchZoom: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          FocusScope,
          {
            asChild: true,
            trapped: context.open,
            onMountAutoFocus: (event) => {
              event.preventDefault();
            },
            onUnmountAutoFocus: composeEventHandlers(onCloseAutoFocus, (event) => {
              var _a;
              (_a = context.trigger) == null ? void 0 : _a.focus({ preventScroll: true });
              event.preventDefault();
            }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              DismissableLayer,
              {
                asChild: true,
                disableOutsidePointerEvents: true,
                onEscapeKeyDown,
                onPointerDownOutside,
                onFocusOutside: (event) => event.preventDefault(),
                onDismiss: () => context.onOpenChange(false),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectPosition,
                  {
                    role: "listbox",
                    id: context.contentId,
                    "data-state": context.open ? "open" : "closed",
                    dir: context.dir,
                    onContextMenu: (event) => event.preventDefault(),
                    ...contentProps,
                    ...popperContentProps,
                    onPlaced: () => setIsPositioned(true),
                    ref: composedRefs,
                    style: {
                      // flex layout so we can place the scroll buttons properly
                      display: "flex",
                      flexDirection: "column",
                      // reset the outline by default as the content MAY get focused
                      outline: "none",
                      ...contentProps.style
                    },
                    onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
                      const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
                      if (event.key === "Tab") event.preventDefault();
                      if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
                      if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
                        const items = getItems().filter((item) => !item.disabled);
                        let candidateNodes = items.map((item) => item.ref.current);
                        if (["ArrowUp", "End"].includes(event.key)) {
                          candidateNodes = candidateNodes.slice().reverse();
                        }
                        if (["ArrowUp", "ArrowDown"].includes(event.key)) {
                          const currentElement = event.target;
                          const currentIndex = candidateNodes.indexOf(currentElement);
                          candidateNodes = candidateNodes.slice(currentIndex + 1);
                        }
                        setTimeout(() => focusFirst2(candidateNodes));
                        event.preventDefault();
                      }
                    })
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
SelectContentImpl.displayName = CONTENT_IMPL_NAME;
var ITEM_ALIGNED_POSITION_NAME = "SelectItemAlignedPosition";
var SelectItemAlignedPosition = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeSelect, onPlaced, ...popperProps } = props;
  const context = useSelectContext(CONTENT_NAME$1, __scopeSelect);
  const contentContext = useSelectContentContext(CONTENT_NAME$1, __scopeSelect);
  const [contentWrapper, setContentWrapper] = reactExports.useState(null);
  const [content, setContent] = reactExports.useState(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
  const getItems = useCollection$1(__scopeSelect);
  const shouldExpandOnScrollRef = reactExports.useRef(false);
  const shouldRepositionRef = reactExports.useRef(true);
  const { viewport, selectedItem, selectedItemText, focusSelectedItem } = contentContext;
  const position = reactExports.useCallback(() => {
    if (context.trigger && context.valueNode && contentWrapper && content && viewport && selectedItem && selectedItemText) {
      const triggerRect = context.trigger.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const valueNodeRect = context.valueNode.getBoundingClientRect();
      const itemTextRect = selectedItemText.getBoundingClientRect();
      if (context.dir !== "rtl") {
        const itemTextOffset = itemTextRect.left - contentRect.left;
        const left = valueNodeRect.left - itemTextOffset;
        const leftDelta = triggerRect.left - left;
        const minContentWidth = triggerRect.width + leftDelta;
        const contentWidth = Math.max(minContentWidth, contentRect.width);
        const rightEdge = window.innerWidth - CONTENT_MARGIN;
        const clampedLeft = clamp$1(left, [
          CONTENT_MARGIN,
          // Prevents the content from going off the starting edge of the
          // viewport. It may still go off the ending edge, but this can be
          // controlled by the user since they may want to manage overflow in a
          // specific way.
          // https://github.com/radix-ui/primitives/issues/2049
          Math.max(CONTENT_MARGIN, rightEdge - contentWidth)
        ]);
        contentWrapper.style.minWidth = minContentWidth + "px";
        contentWrapper.style.left = clampedLeft + "px";
      } else {
        const itemTextOffset = contentRect.right - itemTextRect.right;
        const right = window.innerWidth - valueNodeRect.right - itemTextOffset;
        const rightDelta = window.innerWidth - triggerRect.right - right;
        const minContentWidth = triggerRect.width + rightDelta;
        const contentWidth = Math.max(minContentWidth, contentRect.width);
        const leftEdge = window.innerWidth - CONTENT_MARGIN;
        const clampedRight = clamp$1(right, [
          CONTENT_MARGIN,
          Math.max(CONTENT_MARGIN, leftEdge - contentWidth)
        ]);
        contentWrapper.style.minWidth = minContentWidth + "px";
        contentWrapper.style.right = clampedRight + "px";
      }
      const items = getItems();
      const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
      const itemsHeight = viewport.scrollHeight;
      const contentStyles = window.getComputedStyle(content);
      const contentBorderTopWidth = parseInt(contentStyles.borderTopWidth, 10);
      const contentPaddingTop = parseInt(contentStyles.paddingTop, 10);
      const contentBorderBottomWidth = parseInt(contentStyles.borderBottomWidth, 10);
      const contentPaddingBottom = parseInt(contentStyles.paddingBottom, 10);
      const fullContentHeight = contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth;
      const minContentHeight = Math.min(selectedItem.offsetHeight * 5, fullContentHeight);
      const viewportStyles = window.getComputedStyle(viewport);
      const viewportPaddingTop = parseInt(viewportStyles.paddingTop, 10);
      const viewportPaddingBottom = parseInt(viewportStyles.paddingBottom, 10);
      const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
      const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;
      const selectedItemHalfHeight = selectedItem.offsetHeight / 2;
      const itemOffsetMiddle = selectedItem.offsetTop + selectedItemHalfHeight;
      const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
      const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;
      const willAlignWithoutTopOverflow = contentTopToItemMiddle <= topEdgeToTriggerMiddle;
      if (willAlignWithoutTopOverflow) {
        const isLastItem = items.length > 0 && selectedItem === items[items.length - 1].ref.current;
        contentWrapper.style.bottom = "0px";
        const viewportOffsetBottom = content.clientHeight - viewport.offsetTop - viewport.offsetHeight;
        const clampedTriggerMiddleToBottomEdge = Math.max(
          triggerMiddleToBottomEdge,
          selectedItemHalfHeight + // viewport might have padding bottom, include it to avoid a scrollable viewport
          (isLastItem ? viewportPaddingBottom : 0) + viewportOffsetBottom + contentBorderBottomWidth
        );
        const height = contentTopToItemMiddle + clampedTriggerMiddleToBottomEdge;
        contentWrapper.style.height = height + "px";
      } else {
        const isFirstItem = items.length > 0 && selectedItem === items[0].ref.current;
        contentWrapper.style.top = "0px";
        const clampedTopEdgeToTriggerMiddle = Math.max(
          topEdgeToTriggerMiddle,
          contentBorderTopWidth + viewport.offsetTop + // viewport might have padding top, include it to avoid a scrollable viewport
          (isFirstItem ? viewportPaddingTop : 0) + selectedItemHalfHeight
        );
        const height = clampedTopEdgeToTriggerMiddle + itemMiddleToContentBottom;
        contentWrapper.style.height = height + "px";
        viewport.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.offsetTop;
      }
      contentWrapper.style.margin = `${CONTENT_MARGIN}px 0`;
      contentWrapper.style.minHeight = minContentHeight + "px";
      contentWrapper.style.maxHeight = availableHeight + "px";
      onPlaced == null ? void 0 : onPlaced();
      requestAnimationFrame(() => shouldExpandOnScrollRef.current = true);
    }
  }, [
    getItems,
    context.trigger,
    context.valueNode,
    contentWrapper,
    content,
    viewport,
    selectedItem,
    selectedItemText,
    context.dir,
    onPlaced
  ]);
  useLayoutEffect2(() => position(), [position]);
  const [contentZIndex, setContentZIndex] = reactExports.useState();
  useLayoutEffect2(() => {
    if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
  }, [content]);
  const handleScrollButtonChange = reactExports.useCallback(
    (node) => {
      if (node && shouldRepositionRef.current === true) {
        position();
        focusSelectedItem == null ? void 0 : focusSelectedItem();
        shouldRepositionRef.current = false;
      }
    },
    [position, focusSelectedItem]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectViewportProvider,
    {
      scope: __scopeSelect,
      contentWrapper,
      shouldExpandOnScrollRef,
      onScrollButtonChange: handleScrollButtonChange,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: setContentWrapper,
          style: {
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            zIndex: contentZIndex
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Primitive.div,
            {
              ...popperProps,
              ref: composedRefs,
              style: {
                // When we get the height of the content, it includes borders. If we were to set
                // the height without having `boxSizing: 'border-box'` it would be too big.
                boxSizing: "border-box",
                // We need to ensure the content doesn't get taller than the wrapper
                maxHeight: "100%",
                ...popperProps.style
              }
            }
          )
        }
      )
    }
  );
});
SelectItemAlignedPosition.displayName = ITEM_ALIGNED_POSITION_NAME;
var POPPER_POSITION_NAME = "SelectPopperPosition";
var SelectPopperPosition = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeSelect,
    align = "start",
    collisionPadding = CONTENT_MARGIN,
    ...popperProps
  } = props;
  const popperScope = usePopperScope(__scopeSelect);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      ...popperScope,
      ...popperProps,
      ref: forwardedRef,
      align,
      collisionPadding,
      style: {
        // Ensure border-box for floating-ui calculations
        boxSizing: "border-box",
        ...popperProps.style,
        // re-namespace exposed content custom properties
        ...{
          "--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-select-content-available-width": "var(--radix-popper-available-width)",
          "--radix-select-content-available-height": "var(--radix-popper-available-height)",
          "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    }
  );
});
SelectPopperPosition.displayName = POPPER_POSITION_NAME;
var [SelectViewportProvider, useSelectViewportContext] = createSelectContext(CONTENT_NAME$1, {});
var VIEWPORT_NAME = "SelectViewport";
var SelectViewport = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, nonce, ...viewportProps } = props;
    const contentContext = useSelectContentContext(VIEWPORT_NAME, __scopeSelect);
    const viewportContext = useSelectViewportContext(VIEWPORT_NAME, __scopeSelect);
    const composedRefs = useComposedRefs(forwardedRef, contentContext.onViewportChange);
    const prevScrollTopRef = reactExports.useRef(0);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: `[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}`
          },
          nonce
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.Slot, { scope: __scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-radix-select-viewport": "",
          role: "presentation",
          ...viewportProps,
          ref: composedRefs,
          style: {
            // we use position: 'relative' here on the `viewport` so that when we call
            // `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
            // (independent of the scrollUpButton).
            position: "relative",
            flex: 1,
            // Viewport should only be scrollable in the vertical direction.
            // This won't work in vertical writing modes, so we'll need to
            // revisit this if/when that is supported
            // https://developer.chrome.com/blog/vertical-form-controls
            overflow: "hidden auto",
            ...viewportProps.style
          },
          onScroll: composeEventHandlers(viewportProps.onScroll, (event) => {
            const viewport = event.currentTarget;
            const { contentWrapper, shouldExpandOnScrollRef } = viewportContext;
            if ((shouldExpandOnScrollRef == null ? void 0 : shouldExpandOnScrollRef.current) && contentWrapper) {
              const scrolledBy = Math.abs(prevScrollTopRef.current - viewport.scrollTop);
              if (scrolledBy > 0) {
                const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
                const cssMinHeight = parseFloat(contentWrapper.style.minHeight);
                const cssHeight = parseFloat(contentWrapper.style.height);
                const prevHeight = Math.max(cssMinHeight, cssHeight);
                if (prevHeight < availableHeight) {
                  const nextHeight = prevHeight + scrolledBy;
                  const clampedNextHeight = Math.min(availableHeight, nextHeight);
                  const heightDiff = nextHeight - clampedNextHeight;
                  contentWrapper.style.height = clampedNextHeight + "px";
                  if (contentWrapper.style.bottom === "0px") {
                    viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
                    contentWrapper.style.justifyContent = "flex-end";
                  }
                }
              }
            }
            prevScrollTopRef.current = viewport.scrollTop;
          })
        }
      ) })
    ] });
  }
);
SelectViewport.displayName = VIEWPORT_NAME;
var GROUP_NAME$1 = "SelectGroup";
var [SelectGroupContextProvider, useSelectGroupContext] = createSelectContext(GROUP_NAME$1);
var SelectGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...groupProps } = props;
    const groupId = useId();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectGroupContextProvider, { scope: __scopeSelect, id: groupId, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { role: "group", "aria-labelledby": groupId, ...groupProps, ref: forwardedRef }) });
  }
);
SelectGroup.displayName = GROUP_NAME$1;
var LABEL_NAME = "SelectLabel";
var SelectLabel = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...labelProps } = props;
    const groupContext = useSelectGroupContext(LABEL_NAME, __scopeSelect);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { id: groupContext.id, ...labelProps, ref: forwardedRef });
  }
);
SelectLabel.displayName = LABEL_NAME;
var ITEM_NAME$1 = "SelectItem";
var [SelectItemContextProvider, useSelectItemContext] = createSelectContext(ITEM_NAME$1);
var SelectItem$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSelect,
      value,
      disabled = false,
      textValue: textValueProp,
      ...itemProps
    } = props;
    const context = useSelectContext(ITEM_NAME$1, __scopeSelect);
    const contentContext = useSelectContentContext(ITEM_NAME$1, __scopeSelect);
    const isSelected = context.value === value;
    const [textValue, setTextValue] = reactExports.useState(textValueProp ?? "");
    const [isFocused, setIsFocused] = reactExports.useState(false);
    const composedRefs = useComposedRefs(
      forwardedRef,
      (node) => {
        var _a;
        return (_a = contentContext.itemRefCallback) == null ? void 0 : _a.call(contentContext, node, value, disabled);
      }
    );
    const textId = useId();
    const pointerTypeRef = reactExports.useRef("touch");
    const handleSelect = () => {
      if (!disabled) {
        context.onValueChange(value);
        context.onOpenChange(false);
      }
    };
    if (value === "") {
      throw new Error(
        "A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder."
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SelectItemContextProvider,
      {
        scope: __scopeSelect,
        value,
        disabled,
        textId,
        isSelected,
        onItemTextChange: reactExports.useCallback((node) => {
          setTextValue((prevTextValue) => prevTextValue || ((node == null ? void 0 : node.textContent) ?? "").trim());
        }, []),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Collection$1.ItemSlot,
          {
            scope: __scopeSelect,
            value,
            disabled,
            textValue,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Primitive.div,
              {
                role: "option",
                "aria-labelledby": textId,
                "data-highlighted": isFocused ? "" : void 0,
                "aria-selected": isSelected && isFocused,
                "data-state": isSelected ? "checked" : "unchecked",
                "aria-disabled": disabled || void 0,
                "data-disabled": disabled ? "" : void 0,
                tabIndex: disabled ? void 0 : -1,
                ...itemProps,
                ref: composedRefs,
                onFocus: composeEventHandlers(itemProps.onFocus, () => setIsFocused(true)),
                onBlur: composeEventHandlers(itemProps.onBlur, () => setIsFocused(false)),
                onClick: composeEventHandlers(itemProps.onClick, () => {
                  if (pointerTypeRef.current !== "mouse") handleSelect();
                }),
                onPointerUp: composeEventHandlers(itemProps.onPointerUp, () => {
                  if (pointerTypeRef.current === "mouse") handleSelect();
                }),
                onPointerDown: composeEventHandlers(itemProps.onPointerDown, (event) => {
                  pointerTypeRef.current = event.pointerType;
                }),
                onPointerMove: composeEventHandlers(itemProps.onPointerMove, (event) => {
                  var _a;
                  pointerTypeRef.current = event.pointerType;
                  if (disabled) {
                    (_a = contentContext.onItemLeave) == null ? void 0 : _a.call(contentContext);
                  } else if (pointerTypeRef.current === "mouse") {
                    event.currentTarget.focus({ preventScroll: true });
                  }
                }),
                onPointerLeave: composeEventHandlers(itemProps.onPointerLeave, (event) => {
                  var _a;
                  if (event.currentTarget === document.activeElement) {
                    (_a = contentContext.onItemLeave) == null ? void 0 : _a.call(contentContext);
                  }
                }),
                onKeyDown: composeEventHandlers(itemProps.onKeyDown, (event) => {
                  var _a;
                  const isTypingAhead = ((_a = contentContext.searchRef) == null ? void 0 : _a.current) !== "";
                  if (isTypingAhead && event.key === " ") return;
                  if (SELECTION_KEYS.includes(event.key)) handleSelect();
                  if (event.key === " ") event.preventDefault();
                })
              }
            )
          }
        )
      }
    );
  }
);
SelectItem$1.displayName = ITEM_NAME$1;
var ITEM_TEXT_NAME = "SelectItemText";
var SelectItemText = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, className, style, ...itemTextProps } = props;
    const context = useSelectContext(ITEM_TEXT_NAME, __scopeSelect);
    const contentContext = useSelectContentContext(ITEM_TEXT_NAME, __scopeSelect);
    const itemContext = useSelectItemContext(ITEM_TEXT_NAME, __scopeSelect);
    const nativeOptionsContext = useSelectNativeOptionsContext(ITEM_TEXT_NAME, __scopeSelect);
    const [itemTextNode, setItemTextNode] = reactExports.useState(null);
    const composedRefs = useComposedRefs(
      forwardedRef,
      (node) => setItemTextNode(node),
      itemContext.onItemTextChange,
      (node) => {
        var _a;
        return (_a = contentContext.itemTextRefCallback) == null ? void 0 : _a.call(contentContext, node, itemContext.value, itemContext.disabled);
      }
    );
    const textContent = itemTextNode == null ? void 0 : itemTextNode.textContent;
    const nativeOption = reactExports.useMemo(
      () => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: itemContext.value, disabled: itemContext.disabled, children: textContent }, itemContext.value),
      [itemContext.disabled, itemContext.value, textContent]
    );
    const { onNativeOptionAdd, onNativeOptionRemove } = nativeOptionsContext;
    useLayoutEffect2(() => {
      onNativeOptionAdd(nativeOption);
      return () => onNativeOptionRemove(nativeOption);
    }, [onNativeOptionAdd, onNativeOptionRemove, nativeOption]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { id: itemContext.textId, ...itemTextProps, ref: composedRefs }),
      itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren ? reactDomExports.createPortal(itemTextProps.children, context.valueNode) : null
    ] });
  }
);
SelectItemText.displayName = ITEM_TEXT_NAME;
var ITEM_INDICATOR_NAME = "SelectItemIndicator";
var SelectItemIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...itemIndicatorProps } = props;
    const itemContext = useSelectItemContext(ITEM_INDICATOR_NAME, __scopeSelect);
    return itemContext.isSelected ? /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { "aria-hidden": true, ...itemIndicatorProps, ref: forwardedRef }) : null;
  }
);
SelectItemIndicator.displayName = ITEM_INDICATOR_NAME;
var SCROLL_UP_BUTTON_NAME = "SelectScrollUpButton";
var SelectScrollUpButton$1 = reactExports.forwardRef((props, forwardedRef) => {
  const contentContext = useSelectContentContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
  const viewportContext = useSelectViewportContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
  const [canScrollUp, setCanScrollUp] = reactExports.useState(false);
  const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
  useLayoutEffect2(() => {
    if (contentContext.viewport && contentContext.isPositioned) {
      let handleScroll2 = function() {
        const canScrollUp2 = viewport.scrollTop > 0;
        setCanScrollUp(canScrollUp2);
      };
      const viewport = contentContext.viewport;
      handleScroll2();
      viewport.addEventListener("scroll", handleScroll2);
      return () => viewport.removeEventListener("scroll", handleScroll2);
    }
  }, [contentContext.viewport, contentContext.isPositioned]);
  return canScrollUp ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectScrollButtonImpl,
    {
      ...props,
      ref: composedRefs,
      onAutoScroll: () => {
        const { viewport, selectedItem } = contentContext;
        if (viewport && selectedItem) {
          viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight;
        }
      }
    }
  ) : null;
});
SelectScrollUpButton$1.displayName = SCROLL_UP_BUTTON_NAME;
var SCROLL_DOWN_BUTTON_NAME = "SelectScrollDownButton";
var SelectScrollDownButton$1 = reactExports.forwardRef((props, forwardedRef) => {
  const contentContext = useSelectContentContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
  const viewportContext = useSelectViewportContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
  const [canScrollDown, setCanScrollDown] = reactExports.useState(false);
  const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
  useLayoutEffect2(() => {
    if (contentContext.viewport && contentContext.isPositioned) {
      let handleScroll2 = function() {
        const maxScroll = viewport.scrollHeight - viewport.clientHeight;
        const canScrollDown2 = Math.ceil(viewport.scrollTop) < maxScroll;
        setCanScrollDown(canScrollDown2);
      };
      const viewport = contentContext.viewport;
      handleScroll2();
      viewport.addEventListener("scroll", handleScroll2);
      return () => viewport.removeEventListener("scroll", handleScroll2);
    }
  }, [contentContext.viewport, contentContext.isPositioned]);
  return canScrollDown ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectScrollButtonImpl,
    {
      ...props,
      ref: composedRefs,
      onAutoScroll: () => {
        const { viewport, selectedItem } = contentContext;
        if (viewport && selectedItem) {
          viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
        }
      }
    }
  ) : null;
});
SelectScrollDownButton$1.displayName = SCROLL_DOWN_BUTTON_NAME;
var SelectScrollButtonImpl = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeSelect, onAutoScroll, ...scrollIndicatorProps } = props;
  const contentContext = useSelectContentContext("SelectScrollButton", __scopeSelect);
  const autoScrollTimerRef = reactExports.useRef(null);
  const getItems = useCollection$1(__scopeSelect);
  const clearAutoScrollTimer = reactExports.useCallback(() => {
    if (autoScrollTimerRef.current !== null) {
      window.clearInterval(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
  }, []);
  reactExports.useEffect(() => {
    return () => clearAutoScrollTimer();
  }, [clearAutoScrollTimer]);
  useLayoutEffect2(() => {
    var _a;
    const activeItem = getItems().find((item) => item.ref.current === document.activeElement);
    (_a = activeItem == null ? void 0 : activeItem.ref.current) == null ? void 0 : _a.scrollIntoView({ block: "nearest" });
  }, [getItems]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "aria-hidden": true,
      ...scrollIndicatorProps,
      ref: forwardedRef,
      style: { flexShrink: 0, ...scrollIndicatorProps.style },
      onPointerDown: composeEventHandlers(scrollIndicatorProps.onPointerDown, () => {
        if (autoScrollTimerRef.current === null) {
          autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
        }
      }),
      onPointerMove: composeEventHandlers(scrollIndicatorProps.onPointerMove, () => {
        var _a;
        (_a = contentContext.onItemLeave) == null ? void 0 : _a.call(contentContext);
        if (autoScrollTimerRef.current === null) {
          autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
        }
      }),
      onPointerLeave: composeEventHandlers(scrollIndicatorProps.onPointerLeave, () => {
        clearAutoScrollTimer();
      })
    }
  );
});
var SEPARATOR_NAME = "SelectSeparator";
var SelectSeparator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...separatorProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { "aria-hidden": true, ...separatorProps, ref: forwardedRef });
  }
);
SelectSeparator.displayName = SEPARATOR_NAME;
var ARROW_NAME = "SelectArrow";
var SelectArrow = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopeSelect);
    const context = useSelectContext(ARROW_NAME, __scopeSelect);
    const contentContext = useSelectContentContext(ARROW_NAME, __scopeSelect);
    return context.open && contentContext.position === "popper" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef }) : null;
  }
);
SelectArrow.displayName = ARROW_NAME;
var BUBBLE_INPUT_NAME = "SelectBubbleInput";
var SelectBubbleInput = reactExports.forwardRef(
  ({ __scopeSelect, value, ...props }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const prevValue = usePrevious(value);
    reactExports.useEffect(() => {
      const select = ref.current;
      if (!select) return;
      const selectProto = window.HTMLSelectElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        selectProto,
        "value"
      );
      const setValue = descriptor.set;
      if (prevValue !== value && setValue) {
        const event = new Event("change", { bubbles: true });
        setValue.call(select, value);
        select.dispatchEvent(event);
      }
    }, [prevValue, value]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.select,
      {
        ...props,
        style: { ...VISUALLY_HIDDEN_STYLES, ...props.style },
        ref: composedRefs,
        defaultValue: value
      }
    );
  }
);
SelectBubbleInput.displayName = BUBBLE_INPUT_NAME;
function shouldShowPlaceholder(value) {
  return value === "" || value === void 0;
}
function useTypeaheadSearch(onSearchChange) {
  const handleSearchChange = useCallbackRef(onSearchChange);
  const searchRef = reactExports.useRef("");
  const timerRef = reactExports.useRef(0);
  const handleTypeaheadSearch = reactExports.useCallback(
    (key) => {
      const search = searchRef.current + key;
      handleSearchChange(search);
      (function updateSearch(value) {
        searchRef.current = value;
        window.clearTimeout(timerRef.current);
        if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
      })(search);
    },
    [handleSearchChange]
  );
  const resetTypeahead = reactExports.useCallback(() => {
    searchRef.current = "";
    window.clearTimeout(timerRef.current);
  }, []);
  reactExports.useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);
  return [searchRef, handleTypeaheadSearch, resetTypeahead];
}
function findNextItem(items, search, currentItem) {
  const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
  const normalizedSearch = isRepeated ? search[0] : search;
  const currentItemIndex = currentItem ? items.indexOf(currentItem) : -1;
  let wrappedItems = wrapArray$1(items, Math.max(currentItemIndex, 0));
  const excludeCurrentItem = normalizedSearch.length === 1;
  if (excludeCurrentItem) wrappedItems = wrappedItems.filter((v) => v !== currentItem);
  const nextItem = wrappedItems.find(
    (item) => item.textValue.toLowerCase().startsWith(normalizedSearch.toLowerCase())
  );
  return nextItem !== currentItem ? nextItem : void 0;
}
function wrapArray$1(array, startIndex) {
  return array.map((_, index2) => array[(startIndex + index2) % array.length]);
}
var Root2$1 = Select$1;
var Trigger$1 = SelectTrigger$1;
var Value = SelectValue$1;
var Icon = SelectIcon;
var Portal = SelectPortal;
var Content2 = SelectContent$1;
var Viewport = SelectViewport;
var Item$1 = SelectItem$1;
var ItemText = SelectItemText;
var ItemIndicator = SelectItemIndicator;
var ScrollUpButton = SelectScrollUpButton$1;
var ScrollDownButton = SelectScrollDownButton$1;
function Select({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2$1, { "data-slot": "select", ...props });
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size: size2 = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Trigger$1,
    {
      "data-slot": "select-trigger",
      "data-size": size2,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content2,
    {
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Item$1,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4" })
    }
  );
}
const QUESTION_TYPE_LABELS = {
  [QuestionType.mcSingle]: "Multiple Choice – Single",
  [QuestionType.mcMulti]: "Multiple Choice – Multi",
  [QuestionType.textInput]: "Text Input",
  [QuestionType.dragOrder]: "Drag & Order"
};
({
  [QuestionType.mcSingle]: "MC Single",
  [QuestionType.mcMulti]: "MC Multi",
  [QuestionType.textInput]: "Text Input",
  [QuestionType.dragOrder]: "Drag Order"
});
function QuestionTypeIcon({ type, className }) {
  const cls = className ?? "w-3.5 h-3.5";
  switch (type) {
    case QuestionType.mcSingle:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: cls });
    case QuestionType.mcMulti:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: cls });
    case QuestionType.textInput:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(AlignLeft, { className: cls });
    case QuestionType.dragOrder:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: cls });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: cls });
  }
}
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function("return this")();
var Symbol$1 = root.Symbol;
var objectProto$f = Object.prototype;
var hasOwnProperty$c = objectProto$f.hasOwnProperty;
var nativeObjectToString$1 = objectProto$f.toString;
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty$c.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var objectProto$e = Object.prototype;
var nativeObjectToString = objectProto$e.toString;
function objectToString(value) {
  return nativeObjectToString.call(value);
}
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var isArray = Array.isArray;
function isObject(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
function identity(value) {
  return value;
}
var asyncTag = "[object AsyncFunction]", funcTag$2 = "[object Function]", genTag$1 = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
}
var coreJsData = root["__core-js_shared__"];
var maskSrcKey = function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var funcProto$2 = Function.prototype;
var funcToString$2 = funcProto$2.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$2.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto$1 = Function.prototype, objectProto$d = Object.prototype;
var funcToString$1 = funcProto$1.toString;
var hasOwnProperty$b = objectProto$d.hasOwnProperty;
var reIsNative = RegExp(
  "^" + funcToString$1.call(hasOwnProperty$b).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : void 0;
}
var WeakMap$1 = getNative(root, "WeakMap");
var objectCreate = Object.create;
var baseCreate = /* @__PURE__ */ function() {
  function object() {
  }
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object();
    object.prototype = void 0;
    return result;
  };
}();
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
function copyArray(source, array) {
  var index2 = -1, length = source.length;
  array || (array = Array(length));
  while (++index2 < length) {
    array[index2] = source[index2];
  }
  return array;
}
var HOT_COUNT = 800, HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut(func) {
  var count = 0, lastCalled = 0;
  return function() {
    var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(void 0, arguments);
  };
}
function constant(value) {
  return function() {
    return value;
  };
}
var defineProperty = function() {
  try {
    var func = getNative(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e) {
  }
}();
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, "toString", {
    "configurable": true,
    "enumerable": false,
    "value": constant(string),
    "writable": true
  });
};
var setToString = shortOut(baseSetToString);
function arrayEach(array, iteratee) {
  var index2 = -1, length = array == null ? 0 : array.length;
  while (++index2 < length) {
    if (iteratee(array[index2], index2, array) === false) {
      break;
    }
  }
  return array;
}
var MAX_SAFE_INTEGER$1 = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
function baseAssignValue(object, key, value) {
  if (key == "__proto__" && defineProperty) {
    defineProperty(object, key, {
      "configurable": true,
      "enumerable": true,
      "value": value,
      "writable": true
    });
  } else {
    object[key] = value;
  }
}
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
var objectProto$c = Object.prototype;
var hasOwnProperty$a = objectProto$c.hasOwnProperty;
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$a.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
    baseAssignValue(object, key, value);
  }
}
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index2 = -1, length = props.length;
  while (++index2 < length) {
    var key = props[index2];
    var newValue = void 0;
    if (newValue === void 0) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}
var nativeMax = Math.max;
function overRest(func, start, transform) {
  start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
  return function() {
    var args = arguments, index2 = -1, length = nativeMax(args.length - start, 0), array = Array(length);
    while (++index2 < length) {
      array[index2] = args[start + index2];
    }
    index2 = -1;
    var otherArgs = Array(start + 1);
    while (++index2 < start) {
      otherArgs[index2] = args[index2];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + "");
}
var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}
function isIterateeCall(value, index2, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index2;
  if (type == "number" ? isArrayLike(object) && isIndex(index2, object.length) : type == "string" && index2 in object) {
    return eq(object[index2], value);
  }
  return false;
}
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index2 = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
    customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? void 0 : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index2 < length) {
      var source = sources[index2];
      if (source) {
        assigner(object, source, index2, customizer);
      }
    }
    return object;
  });
}
var objectProto$b = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$b;
  return value === proto;
}
function baseTimes(n, iteratee) {
  var index2 = -1, result = Array(n);
  while (++index2 < n) {
    result[index2] = iteratee(index2);
  }
  return result;
}
var argsTag$3 = "[object Arguments]";
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag$3;
}
var objectProto$a = Object.prototype;
var hasOwnProperty$9 = objectProto$a.hasOwnProperty;
var propertyIsEnumerable$1 = objectProto$a.propertyIsEnumerable;
var isArguments = baseIsArguments(/* @__PURE__ */ function() {
  return arguments;
}()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$9.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
};
function stubFalse() {
  return false;
}
var freeExports$2 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule$2 = freeExports$2 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;
var Buffer$1 = moduleExports$2 ? root.Buffer : void 0;
var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : void 0;
var isBuffer = nativeIsBuffer || stubFalse;
var argsTag$2 = "[object Arguments]", arrayTag$2 = "[object Array]", boolTag$3 = "[object Boolean]", dateTag$3 = "[object Date]", errorTag$2 = "[object Error]", funcTag$1 = "[object Function]", mapTag$5 = "[object Map]", numberTag$3 = "[object Number]", objectTag$4 = "[object Object]", regexpTag$3 = "[object RegExp]", setTag$5 = "[object Set]", stringTag$3 = "[object String]", weakMapTag$2 = "[object WeakMap]";
var arrayBufferTag$3 = "[object ArrayBuffer]", dataViewTag$4 = "[object DataView]", float32Tag$2 = "[object Float32Array]", float64Tag$2 = "[object Float64Array]", int8Tag$2 = "[object Int8Array]", int16Tag$2 = "[object Int16Array]", int32Tag$2 = "[object Int32Array]", uint8Tag$2 = "[object Uint8Array]", uint8ClampedTag$2 = "[object Uint8ClampedArray]", uint16Tag$2 = "[object Uint16Array]", uint32Tag$2 = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] = typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] = typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] = typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] = typedArrayTags[uint32Tag$2] = true;
typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$2] = typedArrayTags[arrayBufferTag$3] = typedArrayTags[boolTag$3] = typedArrayTags[dataViewTag$4] = typedArrayTags[dateTag$3] = typedArrayTags[errorTag$2] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$5] = typedArrayTags[numberTag$3] = typedArrayTags[objectTag$4] = typedArrayTags[regexpTag$3] = typedArrayTags[setTag$5] = typedArrayTags[stringTag$3] = typedArrayTags[weakMapTag$2] = false;
function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}
var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
var freeProcess = moduleExports$1 && freeGlobal.process;
var nodeUtil = function() {
  try {
    var types = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
    if (types) {
      return types;
    }
    return freeProcess && freeProcess.binding && freeProcess.binding("util");
  } catch (e) {
  }
}();
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
var objectProto$9 = Object.prototype;
var hasOwnProperty$8 = objectProto$9.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty$8.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
    (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
    isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
var nativeKeys = overArg(Object.keys, Object);
var objectProto$8 = Object.prototype;
var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$7.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}
var objectProto$7 = Object.prototype;
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object), result = [];
  for (var key in object) {
    if (!(key == "constructor" && (isProto || !hasOwnProperty$6.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}
var nativeCreate = getNative(Object, "create");
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
var objectProto$6 = Object.prototype;
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED$2 ? void 0 : result;
  }
  return hasOwnProperty$5.call(data, key) ? data[key] : void 0;
}
var objectProto$5 = Object.prototype;
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== void 0 : hasOwnProperty$4.call(data, key);
}
var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED$1 : value;
  return this;
}
function Hash(entries) {
  var index2 = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index2 < length) {
    var entry = entries[index2];
    this.set(entry[0], entry[1]);
  }
}
Hash.prototype.clear = hashClear;
Hash.prototype["delete"] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
  var data = this.__data__, index2 = assocIndexOf(data, key);
  if (index2 < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index2 == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index2, 1);
  }
  --this.size;
  return true;
}
function listCacheGet(key) {
  var data = this.__data__, index2 = assocIndexOf(data, key);
  return index2 < 0 ? void 0 : data[index2][1];
}
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}
function listCacheSet(key, value) {
  var data = this.__data__, index2 = assocIndexOf(data, key);
  if (index2 < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index2][1] = value;
  }
  return this;
}
function ListCache(entries) {
  var index2 = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index2 < length) {
    var entry = entries[index2];
    this.set(entry[0], entry[1]);
  }
}
ListCache.prototype.clear = listCacheClear;
ListCache.prototype["delete"] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
var Map$1 = getNative(root, "Map");
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash(),
    "map": new (Map$1 || ListCache)(),
    "string": new Hash()
  };
}
function isKeyable(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
function mapCacheDelete(key) {
  var result = getMapData(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}
function mapCacheSet(key, value) {
  var data = getMapData(this, key), size2 = data.size;
  data.set(key, value);
  this.size += data.size == size2 ? 0 : 1;
  return this;
}
function MapCache(entries) {
  var index2 = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index2 < length) {
    var entry = entries[index2];
    this.set(entry[0], entry[1]);
  }
}
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype["delete"] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
function arrayPush(array, values) {
  var index2 = -1, length = values.length, offset2 = array.length;
  while (++index2 < length) {
    array[offset2 + index2] = values[index2];
  }
  return array;
}
var getPrototype = overArg(Object.getPrototypeOf, Object);
var objectTag$3 = "[object Object]";
var funcProto = Function.prototype, objectProto$4 = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
var objectCtorString = funcToString.call(Object);
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag$3) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$3.call(proto, "constructor") && proto.constructor;
  return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}
function stackClear() {
  this.__data__ = new ListCache();
  this.size = 0;
}
function stackDelete(key) {
  var data = this.__data__, result = data["delete"](key);
  this.size = data.size;
  return result;
}
function stackGet(key) {
  return this.__data__.get(key);
}
function stackHas(key) {
  return this.__data__.has(key);
}
var LARGE_ARRAY_SIZE = 200;
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}
Stack.prototype.clear = stackClear;
Stack.prototype["delete"] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer2 = moduleExports ? root.Buffer : void 0, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : void 0;
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
  buffer.copy(result);
  return result;
}
function arrayFilter(array, predicate) {
  var index2 = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
  while (++index2 < length) {
    var value = array[index2];
    if (predicate(value, index2, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}
function stubArray() {
  return [];
}
var objectProto$3 = Object.prototype;
var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}
var DataView = getNative(root, "DataView");
var Promise$1 = getNative(root, "Promise");
var Set$1 = getNative(root, "Set");
var mapTag$4 = "[object Map]", objectTag$2 = "[object Object]", promiseTag = "[object Promise]", setTag$4 = "[object Set]", weakMapTag$1 = "[object WeakMap]";
var dataViewTag$3 = "[object DataView]";
var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map$1), promiseCtorString = toSource(Promise$1), setCtorString = toSource(Set$1), weakMapCtorString = toSource(WeakMap$1);
var getTag = baseGetTag;
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$3 || Map$1 && getTag(new Map$1()) != mapTag$4 || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set$1 && getTag(new Set$1()) != setTag$4 || WeakMap$1 && getTag(new WeakMap$1()) != weakMapTag$1) {
  getTag = function(value) {
    var result = baseGetTag(value), Ctor = result == objectTag$2 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag$3;
        case mapCtorString:
          return mapTag$4;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag$4;
        case weakMapCtorString:
          return weakMapTag$1;
      }
    }
    return result;
  };
}
var objectProto$2 = Object.prototype;
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
function initCloneArray(array) {
  var length = array.length, result = new array.constructor(length);
  if (length && typeof array[0] == "string" && hasOwnProperty$2.call(array, "index")) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}
var Uint8Array$1 = root.Uint8Array;
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array$1(result).set(new Uint8Array$1(arrayBuffer));
  return result;
}
function cloneDataView(dataView, isDeep) {
  var buffer = cloneArrayBuffer(dataView.buffer);
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}
var reFlags = /\w*$/;
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}
var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : void 0, symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : void 0;
function cloneSymbol(symbol) {
  return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
}
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
var boolTag$2 = "[object Boolean]", dateTag$2 = "[object Date]", mapTag$3 = "[object Map]", numberTag$2 = "[object Number]", regexpTag$2 = "[object RegExp]", setTag$3 = "[object Set]", stringTag$2 = "[object String]", symbolTag$2 = "[object Symbol]";
var arrayBufferTag$2 = "[object ArrayBuffer]", dataViewTag$2 = "[object DataView]", float32Tag$1 = "[object Float32Array]", float64Tag$1 = "[object Float64Array]", int8Tag$1 = "[object Int8Array]", int16Tag$1 = "[object Int16Array]", int32Tag$1 = "[object Int32Array]", uint8Tag$1 = "[object Uint8Array]", uint8ClampedTag$1 = "[object Uint8ClampedArray]", uint16Tag$1 = "[object Uint16Array]", uint32Tag$1 = "[object Uint32Array]";
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$2:
      return cloneArrayBuffer(object);
    case boolTag$2:
    case dateTag$2:
      return new Ctor(+object);
    case dataViewTag$2:
      return cloneDataView(object);
    case float32Tag$1:
    case float64Tag$1:
    case int8Tag$1:
    case int16Tag$1:
    case int32Tag$1:
    case uint8Tag$1:
    case uint8ClampedTag$1:
    case uint16Tag$1:
    case uint32Tag$1:
      return cloneTypedArray(object, isDeep);
    case mapTag$3:
      return new Ctor();
    case numberTag$2:
    case stringTag$2:
      return new Ctor(object);
    case regexpTag$2:
      return cloneRegExp(object);
    case setTag$3:
      return new Ctor();
    case symbolTag$2:
      return cloneSymbol(object);
  }
}
function initCloneObject(object) {
  return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
}
var mapTag$2 = "[object Map]";
function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag$2;
}
var nodeIsMap = nodeUtil && nodeUtil.isMap;
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
var setTag$2 = "[object Set]";
function baseIsSet(value) {
  return isObjectLike(value) && getTag(value) == setTag$2;
}
var nodeIsSet = nodeUtil && nodeUtil.isSet;
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
var CLONE_DEEP_FLAG$1 = 1;
var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", errorTag$1 = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag$1 = "[object Map]", numberTag$1 = "[object Number]", objectTag$1 = "[object Object]", regexpTag$1 = "[object RegExp]", setTag$1 = "[object Set]", stringTag$1 = "[object String]", symbolTag$1 = "[object Symbol]", weakMapTag = "[object WeakMap]";
var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
var cloneableTags = {};
cloneableTags[argsTag$1] = cloneableTags[arrayTag$1] = cloneableTags[arrayBufferTag$1] = cloneableTags[dataViewTag$1] = cloneableTags[boolTag$1] = cloneableTags[dateTag$1] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag$1] = cloneableTags[numberTag$1] = cloneableTags[objectTag$1] = cloneableTags[regexpTag$1] = cloneableTags[setTag$1] = cloneableTags[stringTag$1] = cloneableTags[symbolTag$1] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag$1] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result, isDeep = bitmask & CLONE_DEEP_FLAG$1;
  if (result !== void 0) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
  } else {
    var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag$1 || tag == argsTag$1 || isFunc && !object) {
      result = isFunc ? {} : initCloneObject(value);
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  stack || (stack = new Stack());
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);
  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap(value)) {
    value.forEach(function(subValue, key2) {
      result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
    });
  }
  var keysFunc = getAllKeys;
  var props = isArr ? void 0 : keysFunc(value);
  arrayEach(props || value, function(subValue, key2) {
    if (props) {
      key2 = subValue;
      subValue = value[key2];
    }
    assignValue(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
  });
  return result;
}
var CLONE_DEEP_FLAG = 1, CLONE_SYMBOLS_FLAG = 4;
function cloneDeep$1(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}
var HASH_UNDEFINED = "__lodash_hash_undefined__";
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}
function setCacheHas(value) {
  return this.__data__.has(value);
}
function SetCache(values) {
  var index2 = -1, length = values == null ? 0 : values.length;
  this.__data__ = new MapCache();
  while (++index2 < length) {
    this.add(values[index2]);
  }
}
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;
function arraySome(array, predicate) {
  var index2 = -1, length = array == null ? 0 : array.length;
  while (++index2 < length) {
    if (predicate(array[index2], index2, array)) {
      return true;
    }
  }
  return false;
}
function cacheHas(cache, key) {
  return cache.has(key);
}
var COMPARE_PARTIAL_FLAG$3 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, arrLength = array.length, othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index2 = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$1 ? new SetCache() : void 0;
  stack.set(array, other);
  stack.set(other, array);
  while (++index2 < arrLength) {
    var arrValue = array[index2], othValue = other[index2];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index2, other, array, stack) : customizer(arrValue, othValue, index2, array, other, stack);
    }
    if (compared !== void 0) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    if (seen) {
      if (!arraySome(other, function(othValue2, othIndex) {
        if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack["delete"](array);
  stack["delete"](other);
  return result;
}
function mapToArray(map) {
  var index2 = -1, result = Array(map.size);
  map.forEach(function(value, key) {
    result[++index2] = [key, value];
  });
  return result;
}
function setToArray(set) {
  var index2 = -1, result = Array(set.size);
  set.forEach(function(value) {
    result[++index2] = value;
  });
  return result;
}
var COMPARE_PARTIAL_FLAG$2 = 1, COMPARE_UNORDERED_FLAG = 2;
var boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", mapTag = "[object Map]", numberTag = "[object Number]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]";
var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]";
var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;
    case arrayBufferTag:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array$1(object), new Uint8Array$1(other))) {
        return false;
      }
      return true;
    case boolTag:
    case dateTag:
    case numberTag:
      return eq(+object, +other);
    case errorTag:
      return object.name == other.name && object.message == other.message;
    case regexpTag:
    case stringTag:
      return object == other + "";
    case mapTag:
      var convert = mapToArray;
    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2;
      convert || (convert = setToArray);
      if (object.size != other.size && !isPartial) {
        return false;
      }
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack["delete"](object);
      return result;
    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}
var COMPARE_PARTIAL_FLAG$1 = 1;
var objectProto$1 = Object.prototype;
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index2 = objLength;
  while (index2--) {
    var key = objProps[index2];
    if (!(isPartial ? key in other : hasOwnProperty$1.call(other, key))) {
      return false;
    }
  }
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);
  var skipCtor = isPartial;
  while (++index2 < objLength) {
    key = objProps[index2];
    var objValue = object[key], othValue = other[key];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == "constructor");
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor, othCtor = other.constructor;
    if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack["delete"](object);
  stack["delete"](other);
  return result;
}
var COMPARE_PARTIAL_FLAG = 1;
var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]";
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;
  var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack());
    return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new Stack());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack());
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index2 = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
    while (length--) {
      var key = props[++index2];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}
var baseFor = createBaseFor();
function assignMergeValue(object, key, value) {
  if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) {
    baseAssignValue(object, key, value);
  }
}
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}
function safeGet(object, key) {
  if (key === "constructor" && typeof object[key] === "function") {
    return;
  }
  if (key == "__proto__") {
    return;
  }
  return object[key];
}
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
  var isCommon = newValue === void 0;
  if (isCommon) {
    var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      } else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      } else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      } else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      } else {
        newValue = [];
      }
    } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      } else if (!isObject(objValue) || isFunction(objValue)) {
        newValue = initCloneObject(srcValue);
      }
    } else {
      isCommon = false;
    }
  }
  if (isCommon) {
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack["delete"](srcValue);
  }
  assignMergeValue(object, key, newValue);
}
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    stack || (stack = new Stack());
    if (isObject(srcValue)) {
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    } else {
      var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
      if (newValue === void 0) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}
function isEqual$2(value, other) {
  return baseIsEqual(value, other);
}
var merge = createAssigner(function(object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});
var Scope = /* @__PURE__ */ ((Scope2) => (Scope2[Scope2.TYPE = 3] = "TYPE", Scope2[Scope2.LEVEL = 12] = "LEVEL", Scope2[Scope2.ATTRIBUTE = 13] = "ATTRIBUTE", Scope2[Scope2.BLOT = 14] = "BLOT", Scope2[Scope2.INLINE = 7] = "INLINE", Scope2[Scope2.BLOCK = 11] = "BLOCK", Scope2[Scope2.BLOCK_BLOT = 10] = "BLOCK_BLOT", Scope2[Scope2.INLINE_BLOT = 6] = "INLINE_BLOT", Scope2[Scope2.BLOCK_ATTRIBUTE = 9] = "BLOCK_ATTRIBUTE", Scope2[Scope2.INLINE_ATTRIBUTE = 5] = "INLINE_ATTRIBUTE", Scope2[Scope2.ANY = 15] = "ANY", Scope2))(Scope || {});
class Attributor {
  constructor(attrName, keyName, options = {}) {
    this.attrName = attrName, this.keyName = keyName;
    const attributeBit = Scope.TYPE & Scope.ATTRIBUTE;
    this.scope = options.scope != null ? (
      // Ignore type bits, force attribute bit
      options.scope & Scope.LEVEL | attributeBit
    ) : Scope.ATTRIBUTE, options.whitelist != null && (this.whitelist = options.whitelist);
  }
  static keys(node) {
    return Array.from(node.attributes).map((item) => item.name);
  }
  add(node, value) {
    return this.canAdd(node, value) ? (node.setAttribute(this.keyName, value), true) : false;
  }
  canAdd(_node, value) {
    return this.whitelist == null ? true : typeof value == "string" ? this.whitelist.indexOf(value.replace(/["']/g, "")) > -1 : this.whitelist.indexOf(value) > -1;
  }
  remove(node) {
    node.removeAttribute(this.keyName);
  }
  value(node) {
    const value = node.getAttribute(this.keyName);
    return this.canAdd(node, value) && value ? value : "";
  }
}
class ParchmentError extends Error {
  constructor(message) {
    message = "[Parchment] " + message, super(message), this.message = message, this.name = this.constructor.name;
  }
}
const _Registry = class _Registry2 {
  constructor() {
    this.attributes = {}, this.classes = {}, this.tags = {}, this.types = {};
  }
  static find(node, bubble = false) {
    if (node == null)
      return null;
    if (this.blots.has(node))
      return this.blots.get(node) || null;
    if (bubble) {
      let parentNode = null;
      try {
        parentNode = node.parentNode;
      } catch {
        return null;
      }
      return this.find(parentNode, bubble);
    }
    return null;
  }
  create(scroll, input, value) {
    const match2 = this.query(input);
    if (match2 == null)
      throw new ParchmentError(`Unable to create ${input} blot`);
    const blotClass = match2, node = (
      // @ts-expect-error Fix me later
      input instanceof Node || input.nodeType === Node.TEXT_NODE ? input : blotClass.create(value)
    ), blot = new blotClass(scroll, node, value);
    return _Registry2.blots.set(blot.domNode, blot), blot;
  }
  find(node, bubble = false) {
    return _Registry2.find(node, bubble);
  }
  query(query, scope = Scope.ANY) {
    let match2;
    return typeof query == "string" ? match2 = this.types[query] || this.attributes[query] : query instanceof Text || query.nodeType === Node.TEXT_NODE ? match2 = this.types.text : typeof query == "number" ? query & Scope.LEVEL & Scope.BLOCK ? match2 = this.types.block : query & Scope.LEVEL & Scope.INLINE && (match2 = this.types.inline) : query instanceof Element && ((query.getAttribute("class") || "").split(/\s+/).some((name) => (match2 = this.classes[name], !!match2)), match2 = match2 || this.tags[query.tagName]), match2 == null ? null : "scope" in match2 && scope & Scope.LEVEL & match2.scope && scope & Scope.TYPE & match2.scope ? match2 : null;
  }
  register(...definitions) {
    return definitions.map((definition) => {
      const isBlot = "blotName" in definition, isAttr = "attrName" in definition;
      if (!isBlot && !isAttr)
        throw new ParchmentError("Invalid definition");
      if (isBlot && definition.blotName === "abstract")
        throw new ParchmentError("Cannot register abstract class");
      const key = isBlot ? definition.blotName : isAttr ? definition.attrName : void 0;
      return this.types[key] = definition, isAttr ? typeof definition.keyName == "string" && (this.attributes[definition.keyName] = definition) : isBlot && (definition.className && (this.classes[definition.className] = definition), definition.tagName && (Array.isArray(definition.tagName) ? definition.tagName = definition.tagName.map((tagName) => tagName.toUpperCase()) : definition.tagName = definition.tagName.toUpperCase(), (Array.isArray(definition.tagName) ? definition.tagName : [definition.tagName]).forEach((tag) => {
        (this.tags[tag] == null || definition.className == null) && (this.tags[tag] = definition);
      }))), definition;
    });
  }
};
_Registry.blots = /* @__PURE__ */ new WeakMap();
let Registry = _Registry;
function match(node, prefix) {
  return (node.getAttribute("class") || "").split(/\s+/).filter((name) => name.indexOf(`${prefix}-`) === 0);
}
class ClassAttributor extends Attributor {
  static keys(node) {
    return (node.getAttribute("class") || "").split(/\s+/).map((name) => name.split("-").slice(0, -1).join("-"));
  }
  add(node, value) {
    return this.canAdd(node, value) ? (this.remove(node), node.classList.add(`${this.keyName}-${value}`), true) : false;
  }
  remove(node) {
    match(node, this.keyName).forEach((name) => {
      node.classList.remove(name);
    }), node.classList.length === 0 && node.removeAttribute("class");
  }
  value(node) {
    const value = (match(node, this.keyName)[0] || "").slice(this.keyName.length + 1);
    return this.canAdd(node, value) ? value : "";
  }
}
const ClassAttributor$1 = ClassAttributor;
function camelize(name) {
  const parts = name.split("-"), rest = parts.slice(1).map((part) => part[0].toUpperCase() + part.slice(1)).join("");
  return parts[0] + rest;
}
class StyleAttributor extends Attributor {
  static keys(node) {
    return (node.getAttribute("style") || "").split(";").map((value) => value.split(":")[0].trim());
  }
  add(node, value) {
    return this.canAdd(node, value) ? (node.style[camelize(this.keyName)] = value, true) : false;
  }
  remove(node) {
    node.style[camelize(this.keyName)] = "", node.getAttribute("style") || node.removeAttribute("style");
  }
  value(node) {
    const value = node.style[camelize(this.keyName)];
    return this.canAdd(node, value) ? value : "";
  }
}
const StyleAttributor$1 = StyleAttributor;
class AttributorStore {
  constructor(domNode) {
    this.attributes = {}, this.domNode = domNode, this.build();
  }
  attribute(attribute, value) {
    value ? attribute.add(this.domNode, value) && (attribute.value(this.domNode) != null ? this.attributes[attribute.attrName] = attribute : delete this.attributes[attribute.attrName]) : (attribute.remove(this.domNode), delete this.attributes[attribute.attrName]);
  }
  build() {
    this.attributes = {};
    const blot = Registry.find(this.domNode);
    if (blot == null)
      return;
    const attributes = Attributor.keys(this.domNode), classes = ClassAttributor$1.keys(this.domNode), styles = StyleAttributor$1.keys(this.domNode);
    attributes.concat(classes).concat(styles).forEach((name) => {
      const attr = blot.scroll.query(name, Scope.ATTRIBUTE);
      attr instanceof Attributor && (this.attributes[attr.attrName] = attr);
    });
  }
  copy(target) {
    Object.keys(this.attributes).forEach((key) => {
      const value = this.attributes[key].value(this.domNode);
      target.format(key, value);
    });
  }
  move(target) {
    this.copy(target), Object.keys(this.attributes).forEach((key) => {
      this.attributes[key].remove(this.domNode);
    }), this.attributes = {};
  }
  values() {
    return Object.keys(this.attributes).reduce(
      (attributes, name) => (attributes[name] = this.attributes[name].value(this.domNode), attributes),
      {}
    );
  }
}
const AttributorStore$1 = AttributorStore, _ShadowBlot = class _ShadowBlot2 {
  constructor(scroll, domNode) {
    this.scroll = scroll, this.domNode = domNode, Registry.blots.set(domNode, this), this.prev = null, this.next = null;
  }
  static create(rawValue) {
    if (this.tagName == null)
      throw new ParchmentError("Blot definition missing tagName");
    let node, value;
    return Array.isArray(this.tagName) ? (typeof rawValue == "string" ? (value = rawValue.toUpperCase(), parseInt(value, 10).toString() === value && (value = parseInt(value, 10))) : typeof rawValue == "number" && (value = rawValue), typeof value == "number" ? node = document.createElement(this.tagName[value - 1]) : value && this.tagName.indexOf(value) > -1 ? node = document.createElement(value) : node = document.createElement(this.tagName[0])) : node = document.createElement(this.tagName), this.className && node.classList.add(this.className), node;
  }
  // Hack for accessing inherited static methods
  get statics() {
    return this.constructor;
  }
  attach() {
  }
  clone() {
    const domNode = this.domNode.cloneNode(false);
    return this.scroll.create(domNode);
  }
  detach() {
    this.parent != null && this.parent.removeChild(this), Registry.blots.delete(this.domNode);
  }
  deleteAt(index2, length) {
    this.isolate(index2, length).remove();
  }
  formatAt(index2, length, name, value) {
    const blot = this.isolate(index2, length);
    if (this.scroll.query(name, Scope.BLOT) != null && value)
      blot.wrap(name, value);
    else if (this.scroll.query(name, Scope.ATTRIBUTE) != null) {
      const parent = this.scroll.create(this.statics.scope);
      blot.wrap(parent), parent.format(name, value);
    }
  }
  insertAt(index2, value, def) {
    const blot = def == null ? this.scroll.create("text", value) : this.scroll.create(value, def), ref = this.split(index2);
    this.parent.insertBefore(blot, ref || void 0);
  }
  isolate(index2, length) {
    const target = this.split(index2);
    if (target == null)
      throw new Error("Attempt to isolate at end");
    return target.split(length), target;
  }
  length() {
    return 1;
  }
  offset(root2 = this.parent) {
    return this.parent == null || this === root2 ? 0 : this.parent.children.offset(this) + this.parent.offset(root2);
  }
  optimize(_context) {
    this.statics.requiredContainer && !(this.parent instanceof this.statics.requiredContainer) && this.wrap(this.statics.requiredContainer.blotName);
  }
  remove() {
    this.domNode.parentNode != null && this.domNode.parentNode.removeChild(this.domNode), this.detach();
  }
  replaceWith(name, value) {
    const replacement = typeof name == "string" ? this.scroll.create(name, value) : name;
    return this.parent != null && (this.parent.insertBefore(replacement, this.next || void 0), this.remove()), replacement;
  }
  split(index2, _force) {
    return index2 === 0 ? this : this.next;
  }
  update(_mutations, _context) {
  }
  wrap(name, value) {
    const wrapper = typeof name == "string" ? this.scroll.create(name, value) : name;
    if (this.parent != null && this.parent.insertBefore(wrapper, this.next || void 0), typeof wrapper.appendChild != "function")
      throw new ParchmentError(`Cannot wrap ${name}`);
    return wrapper.appendChild(this), wrapper;
  }
};
_ShadowBlot.blotName = "abstract";
let ShadowBlot = _ShadowBlot;
const _LeafBlot = class _LeafBlot2 extends ShadowBlot {
  /**
   * Returns the value represented by domNode if it is this Blot's type
   * No checking that domNode can represent this Blot type is required so
   * applications needing it should check externally before calling.
   */
  static value(_domNode) {
    return true;
  }
  /**
   * Given location represented by node and offset from DOM Selection Range,
   * return index to that location.
   */
  index(node, offset2) {
    return this.domNode === node || this.domNode.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY ? Math.min(offset2, 1) : -1;
  }
  /**
   * Given index to location within blot, return node and offset representing
   * that location, consumable by DOM Selection Range
   */
  position(index2, _inclusive) {
    let offset2 = Array.from(this.parent.domNode.childNodes).indexOf(this.domNode);
    return index2 > 0 && (offset2 += 1), [this.parent.domNode, offset2];
  }
  /**
   * Return value represented by this blot
   * Should not change without interaction from API or
   * user change detectable by update()
   */
  value() {
    return {
      [this.statics.blotName]: this.statics.value(this.domNode) || true
    };
  }
};
_LeafBlot.scope = Scope.INLINE_BLOT;
let LeafBlot = _LeafBlot;
const LeafBlot$1 = LeafBlot;
class LinkedList {
  constructor() {
    this.head = null, this.tail = null, this.length = 0;
  }
  append(...nodes) {
    if (this.insertBefore(nodes[0], null), nodes.length > 1) {
      const rest = nodes.slice(1);
      this.append(...rest);
    }
  }
  at(index2) {
    const next = this.iterator();
    let cur = next();
    for (; cur && index2 > 0; )
      index2 -= 1, cur = next();
    return cur;
  }
  contains(node) {
    const next = this.iterator();
    let cur = next();
    for (; cur; ) {
      if (cur === node)
        return true;
      cur = next();
    }
    return false;
  }
  indexOf(node) {
    const next = this.iterator();
    let cur = next(), index2 = 0;
    for (; cur; ) {
      if (cur === node)
        return index2;
      index2 += 1, cur = next();
    }
    return -1;
  }
  insertBefore(node, refNode) {
    node != null && (this.remove(node), node.next = refNode, refNode != null ? (node.prev = refNode.prev, refNode.prev != null && (refNode.prev.next = node), refNode.prev = node, refNode === this.head && (this.head = node)) : this.tail != null ? (this.tail.next = node, node.prev = this.tail, this.tail = node) : (node.prev = null, this.head = this.tail = node), this.length += 1);
  }
  offset(target) {
    let index2 = 0, cur = this.head;
    for (; cur != null; ) {
      if (cur === target)
        return index2;
      index2 += cur.length(), cur = cur.next;
    }
    return -1;
  }
  remove(node) {
    this.contains(node) && (node.prev != null && (node.prev.next = node.next), node.next != null && (node.next.prev = node.prev), node === this.head && (this.head = node.next), node === this.tail && (this.tail = node.prev), this.length -= 1);
  }
  iterator(curNode = this.head) {
    return () => {
      const ret = curNode;
      return curNode != null && (curNode = curNode.next), ret;
    };
  }
  find(index2, inclusive = false) {
    const next = this.iterator();
    let cur = next();
    for (; cur; ) {
      const length = cur.length();
      if (index2 < length || inclusive && index2 === length && (cur.next == null || cur.next.length() !== 0))
        return [cur, index2];
      index2 -= length, cur = next();
    }
    return [null, 0];
  }
  forEach(callback) {
    const next = this.iterator();
    let cur = next();
    for (; cur; )
      callback(cur), cur = next();
  }
  forEachAt(index2, length, callback) {
    if (length <= 0)
      return;
    const [startNode, offset2] = this.find(index2);
    let curIndex = index2 - offset2;
    const next = this.iterator(startNode);
    let cur = next();
    for (; cur && curIndex < index2 + length; ) {
      const curLength = cur.length();
      index2 > curIndex ? callback(
        cur,
        index2 - curIndex,
        Math.min(length, curIndex + curLength - index2)
      ) : callback(cur, 0, Math.min(curLength, index2 + length - curIndex)), curIndex += curLength, cur = next();
    }
  }
  map(callback) {
    return this.reduce((memo, cur) => (memo.push(callback(cur)), memo), []);
  }
  reduce(callback, memo) {
    const next = this.iterator();
    let cur = next();
    for (; cur; )
      memo = callback(memo, cur), cur = next();
    return memo;
  }
}
function makeAttachedBlot(node, scroll) {
  const found = scroll.find(node);
  if (found)
    return found;
  try {
    return scroll.create(node);
  } catch {
    const blot = scroll.create(Scope.INLINE);
    return Array.from(node.childNodes).forEach((child) => {
      blot.domNode.appendChild(child);
    }), node.parentNode && node.parentNode.replaceChild(blot.domNode, node), blot.attach(), blot;
  }
}
const _ParentBlot = class _ParentBlot2 extends ShadowBlot {
  constructor(scroll, domNode) {
    super(scroll, domNode), this.uiNode = null, this.build();
  }
  appendChild(other) {
    this.insertBefore(other);
  }
  attach() {
    super.attach(), this.children.forEach((child) => {
      child.attach();
    });
  }
  attachUI(node) {
    this.uiNode != null && this.uiNode.remove(), this.uiNode = node, _ParentBlot2.uiClass && this.uiNode.classList.add(_ParentBlot2.uiClass), this.uiNode.setAttribute("contenteditable", "false"), this.domNode.insertBefore(this.uiNode, this.domNode.firstChild);
  }
  /**
   * Called during construction, should fill its own children LinkedList.
   */
  build() {
    this.children = new LinkedList(), Array.from(this.domNode.childNodes).filter((node) => node !== this.uiNode).reverse().forEach((node) => {
      try {
        const child = makeAttachedBlot(node, this.scroll);
        this.insertBefore(child, this.children.head || void 0);
      } catch (err) {
        if (err instanceof ParchmentError)
          return;
        throw err;
      }
    });
  }
  deleteAt(index2, length) {
    if (index2 === 0 && length === this.length())
      return this.remove();
    this.children.forEachAt(index2, length, (child, offset2, childLength) => {
      child.deleteAt(offset2, childLength);
    });
  }
  descendant(criteria, index2 = 0) {
    const [child, offset2] = this.children.find(index2);
    return criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria ? [child, offset2] : child instanceof _ParentBlot2 ? child.descendant(criteria, offset2) : [null, -1];
  }
  descendants(criteria, index2 = 0, length = Number.MAX_VALUE) {
    let descendants = [], lengthLeft = length;
    return this.children.forEachAt(
      index2,
      length,
      (child, childIndex, childLength) => {
        (criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria) && descendants.push(child), child instanceof _ParentBlot2 && (descendants = descendants.concat(
          child.descendants(criteria, childIndex, lengthLeft)
        )), lengthLeft -= childLength;
      }
    ), descendants;
  }
  detach() {
    this.children.forEach((child) => {
      child.detach();
    }), super.detach();
  }
  enforceAllowedChildren() {
    let done = false;
    this.children.forEach((child) => {
      done || this.statics.allowedChildren.some(
        (def) => child instanceof def
      ) || (child.statics.scope === Scope.BLOCK_BLOT ? (child.next != null && this.splitAfter(child), child.prev != null && this.splitAfter(child.prev), child.parent.unwrap(), done = true) : child instanceof _ParentBlot2 ? child.unwrap() : child.remove());
    });
  }
  formatAt(index2, length, name, value) {
    this.children.forEachAt(index2, length, (child, offset2, childLength) => {
      child.formatAt(offset2, childLength, name, value);
    });
  }
  insertAt(index2, value, def) {
    const [child, offset2] = this.children.find(index2);
    if (child)
      child.insertAt(offset2, value, def);
    else {
      const blot = def == null ? this.scroll.create("text", value) : this.scroll.create(value, def);
      this.appendChild(blot);
    }
  }
  insertBefore(childBlot, refBlot) {
    childBlot.parent != null && childBlot.parent.children.remove(childBlot);
    let refDomNode = null;
    this.children.insertBefore(childBlot, refBlot || null), childBlot.parent = this, refBlot != null && (refDomNode = refBlot.domNode), (this.domNode.parentNode !== childBlot.domNode || this.domNode.nextSibling !== refDomNode) && this.domNode.insertBefore(childBlot.domNode, refDomNode), childBlot.attach();
  }
  length() {
    return this.children.reduce((memo, child) => memo + child.length(), 0);
  }
  moveChildren(targetParent, refNode) {
    this.children.forEach((child) => {
      targetParent.insertBefore(child, refNode);
    });
  }
  optimize(context) {
    if (super.optimize(context), this.enforceAllowedChildren(), this.uiNode != null && this.uiNode !== this.domNode.firstChild && this.domNode.insertBefore(this.uiNode, this.domNode.firstChild), this.children.length === 0)
      if (this.statics.defaultChild != null) {
        const child = this.scroll.create(this.statics.defaultChild.blotName);
        this.appendChild(child);
      } else
        this.remove();
  }
  path(index2, inclusive = false) {
    const [child, offset2] = this.children.find(index2, inclusive), position = [[this, index2]];
    return child instanceof _ParentBlot2 ? position.concat(child.path(offset2, inclusive)) : (child != null && position.push([child, offset2]), position);
  }
  removeChild(child) {
    this.children.remove(child);
  }
  replaceWith(name, value) {
    const replacement = typeof name == "string" ? this.scroll.create(name, value) : name;
    return replacement instanceof _ParentBlot2 && this.moveChildren(replacement), super.replaceWith(replacement);
  }
  split(index2, force = false) {
    if (!force) {
      if (index2 === 0)
        return this;
      if (index2 === this.length())
        return this.next;
    }
    const after = this.clone();
    return this.parent && this.parent.insertBefore(after, this.next || void 0), this.children.forEachAt(index2, this.length(), (child, offset2, _length) => {
      const split = child.split(offset2, force);
      split != null && after.appendChild(split);
    }), after;
  }
  splitAfter(child) {
    const after = this.clone();
    for (; child.next != null; )
      after.appendChild(child.next);
    return this.parent && this.parent.insertBefore(after, this.next || void 0), after;
  }
  unwrap() {
    this.parent && this.moveChildren(this.parent, this.next || void 0), this.remove();
  }
  update(mutations, _context) {
    const addedNodes = [], removedNodes = [];
    mutations.forEach((mutation) => {
      mutation.target === this.domNode && mutation.type === "childList" && (addedNodes.push(...mutation.addedNodes), removedNodes.push(...mutation.removedNodes));
    }), removedNodes.forEach((node) => {
      if (node.parentNode != null && // @ts-expect-error Fix me later
      node.tagName !== "IFRAME" && document.body.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY)
        return;
      const blot = this.scroll.find(node);
      blot != null && (blot.domNode.parentNode == null || blot.domNode.parentNode === this.domNode) && blot.detach();
    }), addedNodes.filter((node) => node.parentNode === this.domNode && node !== this.uiNode).sort((a, b) => a === b ? 0 : a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? 1 : -1).forEach((node) => {
      let refBlot = null;
      node.nextSibling != null && (refBlot = this.scroll.find(node.nextSibling));
      const blot = makeAttachedBlot(node, this.scroll);
      (blot.next !== refBlot || blot.next == null) && (blot.parent != null && blot.parent.removeChild(this), this.insertBefore(blot, refBlot || void 0));
    }), this.enforceAllowedChildren();
  }
};
_ParentBlot.uiClass = "";
let ParentBlot = _ParentBlot;
const ParentBlot$1 = ParentBlot;
function isEqual$1(obj1, obj2) {
  if (Object.keys(obj1).length !== Object.keys(obj2).length)
    return false;
  for (const prop in obj1)
    if (obj1[prop] !== obj2[prop])
      return false;
  return true;
}
const _InlineBlot = class _InlineBlot2 extends ParentBlot$1 {
  static create(value) {
    return super.create(value);
  }
  static formats(domNode, scroll) {
    const match2 = scroll.query(_InlineBlot2.blotName);
    if (!(match2 != null && domNode.tagName === match2.tagName)) {
      if (typeof this.tagName == "string")
        return true;
      if (Array.isArray(this.tagName))
        return domNode.tagName.toLowerCase();
    }
  }
  constructor(scroll, domNode) {
    super(scroll, domNode), this.attributes = new AttributorStore$1(this.domNode);
  }
  format(name, value) {
    if (name === this.statics.blotName && !value)
      this.children.forEach((child) => {
        child instanceof _InlineBlot2 || (child = child.wrap(_InlineBlot2.blotName, true)), this.attributes.copy(child);
      }), this.unwrap();
    else {
      const format = this.scroll.query(name, Scope.INLINE);
      if (format == null)
        return;
      format instanceof Attributor ? this.attributes.attribute(format, value) : value && (name !== this.statics.blotName || this.formats()[name] !== value) && this.replaceWith(name, value);
    }
  }
  formats() {
    const formats = this.attributes.values(), format = this.statics.formats(this.domNode, this.scroll);
    return format != null && (formats[this.statics.blotName] = format), formats;
  }
  formatAt(index2, length, name, value) {
    this.formats()[name] != null || this.scroll.query(name, Scope.ATTRIBUTE) ? this.isolate(index2, length).format(name, value) : super.formatAt(index2, length, name, value);
  }
  optimize(context) {
    super.optimize(context);
    const formats = this.formats();
    if (Object.keys(formats).length === 0)
      return this.unwrap();
    const next = this.next;
    next instanceof _InlineBlot2 && next.prev === this && isEqual$1(formats, next.formats()) && (next.moveChildren(this), next.remove());
  }
  replaceWith(name, value) {
    const replacement = super.replaceWith(name, value);
    return this.attributes.copy(replacement), replacement;
  }
  update(mutations, context) {
    super.update(mutations, context), mutations.some(
      (mutation) => mutation.target === this.domNode && mutation.type === "attributes"
    ) && this.attributes.build();
  }
  wrap(name, value) {
    const wrapper = super.wrap(name, value);
    return wrapper instanceof _InlineBlot2 && this.attributes.move(wrapper), wrapper;
  }
};
_InlineBlot.allowedChildren = [_InlineBlot, LeafBlot$1], _InlineBlot.blotName = "inline", _InlineBlot.scope = Scope.INLINE_BLOT, _InlineBlot.tagName = "SPAN";
let InlineBlot = _InlineBlot;
const InlineBlot$1 = InlineBlot, _BlockBlot = class _BlockBlot2 extends ParentBlot$1 {
  static create(value) {
    return super.create(value);
  }
  static formats(domNode, scroll) {
    const match2 = scroll.query(_BlockBlot2.blotName);
    if (!(match2 != null && domNode.tagName === match2.tagName)) {
      if (typeof this.tagName == "string")
        return true;
      if (Array.isArray(this.tagName))
        return domNode.tagName.toLowerCase();
    }
  }
  constructor(scroll, domNode) {
    super(scroll, domNode), this.attributes = new AttributorStore$1(this.domNode);
  }
  format(name, value) {
    const format = this.scroll.query(name, Scope.BLOCK);
    format != null && (format instanceof Attributor ? this.attributes.attribute(format, value) : name === this.statics.blotName && !value ? this.replaceWith(_BlockBlot2.blotName) : value && (name !== this.statics.blotName || this.formats()[name] !== value) && this.replaceWith(name, value));
  }
  formats() {
    const formats = this.attributes.values(), format = this.statics.formats(this.domNode, this.scroll);
    return format != null && (formats[this.statics.blotName] = format), formats;
  }
  formatAt(index2, length, name, value) {
    this.scroll.query(name, Scope.BLOCK) != null ? this.format(name, value) : super.formatAt(index2, length, name, value);
  }
  insertAt(index2, value, def) {
    if (def == null || this.scroll.query(value, Scope.INLINE) != null)
      super.insertAt(index2, value, def);
    else {
      const after = this.split(index2);
      if (after != null) {
        const blot = this.scroll.create(value, def);
        after.parent.insertBefore(blot, after);
      } else
        throw new Error("Attempt to insertAt after block boundaries");
    }
  }
  replaceWith(name, value) {
    const replacement = super.replaceWith(name, value);
    return this.attributes.copy(replacement), replacement;
  }
  update(mutations, context) {
    super.update(mutations, context), mutations.some(
      (mutation) => mutation.target === this.domNode && mutation.type === "attributes"
    ) && this.attributes.build();
  }
};
_BlockBlot.blotName = "block", _BlockBlot.scope = Scope.BLOCK_BLOT, _BlockBlot.tagName = "P", _BlockBlot.allowedChildren = [
  InlineBlot$1,
  _BlockBlot,
  LeafBlot$1
];
let BlockBlot = _BlockBlot;
const BlockBlot$1 = BlockBlot, _ContainerBlot = class _ContainerBlot2 extends ParentBlot$1 {
  checkMerge() {
    return this.next !== null && this.next.statics.blotName === this.statics.blotName;
  }
  deleteAt(index2, length) {
    super.deleteAt(index2, length), this.enforceAllowedChildren();
  }
  formatAt(index2, length, name, value) {
    super.formatAt(index2, length, name, value), this.enforceAllowedChildren();
  }
  insertAt(index2, value, def) {
    super.insertAt(index2, value, def), this.enforceAllowedChildren();
  }
  optimize(context) {
    super.optimize(context), this.children.length > 0 && this.next != null && this.checkMerge() && (this.next.moveChildren(this), this.next.remove());
  }
};
_ContainerBlot.blotName = "container", _ContainerBlot.scope = Scope.BLOCK_BLOT;
let ContainerBlot = _ContainerBlot;
const ContainerBlot$1 = ContainerBlot;
class EmbedBlot extends LeafBlot$1 {
  static formats(_domNode, _scroll) {
  }
  format(name, value) {
    super.formatAt(0, this.length(), name, value);
  }
  formatAt(index2, length, name, value) {
    index2 === 0 && length === this.length() ? this.format(name, value) : super.formatAt(index2, length, name, value);
  }
  formats() {
    return this.statics.formats(this.domNode, this.scroll);
  }
}
const EmbedBlot$1 = EmbedBlot, OBSERVER_CONFIG = {
  attributes: true,
  characterData: true,
  characterDataOldValue: true,
  childList: true,
  subtree: true
}, MAX_OPTIMIZE_ITERATIONS = 100, _ScrollBlot = class _ScrollBlot2 extends ParentBlot$1 {
  constructor(registry, node) {
    super(null, node), this.registry = registry, this.scroll = this, this.build(), this.observer = new MutationObserver((mutations) => {
      this.update(mutations);
    }), this.observer.observe(this.domNode, OBSERVER_CONFIG), this.attach();
  }
  create(input, value) {
    return this.registry.create(this, input, value);
  }
  find(node, bubble = false) {
    const blot = this.registry.find(node, bubble);
    return blot ? blot.scroll === this ? blot : bubble ? this.find(blot.scroll.domNode.parentNode, true) : null : null;
  }
  query(query, scope = Scope.ANY) {
    return this.registry.query(query, scope);
  }
  register(...definitions) {
    return this.registry.register(...definitions);
  }
  build() {
    this.scroll != null && super.build();
  }
  detach() {
    super.detach(), this.observer.disconnect();
  }
  deleteAt(index2, length) {
    this.update(), index2 === 0 && length === this.length() ? this.children.forEach((child) => {
      child.remove();
    }) : super.deleteAt(index2, length);
  }
  formatAt(index2, length, name, value) {
    this.update(), super.formatAt(index2, length, name, value);
  }
  insertAt(index2, value, def) {
    this.update(), super.insertAt(index2, value, def);
  }
  optimize(mutations = [], context = {}) {
    super.optimize(context);
    const mutationsMap = context.mutationsMap || /* @__PURE__ */ new WeakMap();
    let records = Array.from(this.observer.takeRecords());
    for (; records.length > 0; )
      mutations.push(records.pop());
    const mark = (blot, markParent = true) => {
      blot == null || blot === this || blot.domNode.parentNode != null && (mutationsMap.has(blot.domNode) || mutationsMap.set(blot.domNode, []), markParent && mark(blot.parent));
    }, optimize = (blot) => {
      mutationsMap.has(blot.domNode) && (blot instanceof ParentBlot$1 && blot.children.forEach(optimize), mutationsMap.delete(blot.domNode), blot.optimize(context));
    };
    let remaining = mutations;
    for (let i = 0; remaining.length > 0; i += 1) {
      if (i >= MAX_OPTIMIZE_ITERATIONS)
        throw new Error("[Parchment] Maximum optimize iterations reached");
      for (remaining.forEach((mutation) => {
        const blot = this.find(mutation.target, true);
        blot != null && (blot.domNode === mutation.target && (mutation.type === "childList" ? (mark(this.find(mutation.previousSibling, false)), Array.from(mutation.addedNodes).forEach((node) => {
          const child = this.find(node, false);
          mark(child, false), child instanceof ParentBlot$1 && child.children.forEach((grandChild) => {
            mark(grandChild, false);
          });
        })) : mutation.type === "attributes" && mark(blot.prev)), mark(blot));
      }), this.children.forEach(optimize), remaining = Array.from(this.observer.takeRecords()), records = remaining.slice(); records.length > 0; )
        mutations.push(records.pop());
    }
  }
  update(mutations, context = {}) {
    mutations = mutations || this.observer.takeRecords();
    const mutationsMap = /* @__PURE__ */ new WeakMap();
    mutations.map((mutation) => {
      const blot = this.find(mutation.target, true);
      return blot == null ? null : mutationsMap.has(blot.domNode) ? (mutationsMap.get(blot.domNode).push(mutation), null) : (mutationsMap.set(blot.domNode, [mutation]), blot);
    }).forEach((blot) => {
      blot != null && blot !== this && mutationsMap.has(blot.domNode) && blot.update(mutationsMap.get(blot.domNode) || [], context);
    }), context.mutationsMap = mutationsMap, mutationsMap.has(this.domNode) && super.update(mutationsMap.get(this.domNode), context), this.optimize(mutations, context);
  }
};
_ScrollBlot.blotName = "scroll", _ScrollBlot.defaultChild = BlockBlot$1, _ScrollBlot.allowedChildren = [BlockBlot$1, ContainerBlot$1], _ScrollBlot.scope = Scope.BLOCK_BLOT, _ScrollBlot.tagName = "DIV";
let ScrollBlot = _ScrollBlot;
const ScrollBlot$1 = ScrollBlot, _TextBlot = class _TextBlot2 extends LeafBlot$1 {
  static create(value) {
    return document.createTextNode(value);
  }
  static value(domNode) {
    return domNode.data;
  }
  constructor(scroll, node) {
    super(scroll, node), this.text = this.statics.value(this.domNode);
  }
  deleteAt(index2, length) {
    this.domNode.data = this.text = this.text.slice(0, index2) + this.text.slice(index2 + length);
  }
  index(node, offset2) {
    return this.domNode === node ? offset2 : -1;
  }
  insertAt(index2, value, def) {
    def == null ? (this.text = this.text.slice(0, index2) + value + this.text.slice(index2), this.domNode.data = this.text) : super.insertAt(index2, value, def);
  }
  length() {
    return this.text.length;
  }
  optimize(context) {
    super.optimize(context), this.text = this.statics.value(this.domNode), this.text.length === 0 ? this.remove() : this.next instanceof _TextBlot2 && this.next.prev === this && (this.insertAt(this.length(), this.next.value()), this.next.remove());
  }
  position(index2, _inclusive = false) {
    return [this.domNode, index2];
  }
  split(index2, force = false) {
    if (!force) {
      if (index2 === 0)
        return this;
      if (index2 === this.length())
        return this.next;
    }
    const after = this.scroll.create(this.domNode.splitText(index2));
    return this.parent.insertBefore(after, this.next || void 0), this.text = this.statics.value(this.domNode), after;
  }
  update(mutations, _context) {
    mutations.some((mutation) => mutation.type === "characterData" && mutation.target === this.domNode) && (this.text = this.statics.value(this.domNode));
  }
  value() {
    return this.text;
  }
};
_TextBlot.blotName = "text", _TextBlot.scope = Scope.INLINE_BLOT;
let TextBlot = _TextBlot;
const TextBlot$1 = TextBlot;
const Parchment = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Attributor,
  AttributorStore: AttributorStore$1,
  BlockBlot: BlockBlot$1,
  ClassAttributor: ClassAttributor$1,
  ContainerBlot: ContainerBlot$1,
  EmbedBlot: EmbedBlot$1,
  InlineBlot: InlineBlot$1,
  LeafBlot: LeafBlot$1,
  ParentBlot: ParentBlot$1,
  Registry,
  Scope,
  ScrollBlot: ScrollBlot$1,
  StyleAttributor: StyleAttributor$1,
  TextBlot: TextBlot$1
}, Symbol.toStringTag, { value: "Module" }));
var Delta$1 = { exports: {} };
var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;
function diff_main(text1, text2, cursor_pos, cleanup, _fix_unicode) {
  if (text1 === text2) {
    if (text1) {
      return [[DIFF_EQUAL, text1]];
    }
    return [];
  }
  if (cursor_pos != null) {
    var editdiff = find_cursor_edit_diff(text1, text2, cursor_pos);
    if (editdiff) {
      return editdiff;
    }
  }
  var commonlength = diff_commonPrefix(text1, text2);
  var commonprefix = text1.substring(0, commonlength);
  text1 = text1.substring(commonlength);
  text2 = text2.substring(commonlength);
  commonlength = diff_commonSuffix(text1, text2);
  var commonsuffix = text1.substring(text1.length - commonlength);
  text1 = text1.substring(0, text1.length - commonlength);
  text2 = text2.substring(0, text2.length - commonlength);
  var diffs = diff_compute_(text1, text2);
  if (commonprefix) {
    diffs.unshift([DIFF_EQUAL, commonprefix]);
  }
  if (commonsuffix) {
    diffs.push([DIFF_EQUAL, commonsuffix]);
  }
  diff_cleanupMerge(diffs, _fix_unicode);
  if (cleanup) {
    diff_cleanupSemantic(diffs);
  }
  return diffs;
}
function diff_compute_(text1, text2) {
  var diffs;
  if (!text1) {
    return [[DIFF_INSERT, text2]];
  }
  if (!text2) {
    return [[DIFF_DELETE, text1]];
  }
  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  var i = longtext.indexOf(shorttext);
  if (i !== -1) {
    diffs = [
      [DIFF_INSERT, longtext.substring(0, i)],
      [DIFF_EQUAL, shorttext],
      [DIFF_INSERT, longtext.substring(i + shorttext.length)]
    ];
    if (text1.length > text2.length) {
      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
    }
    return diffs;
  }
  if (shorttext.length === 1) {
    return [
      [DIFF_DELETE, text1],
      [DIFF_INSERT, text2]
    ];
  }
  var hm = diff_halfMatch_(text1, text2);
  if (hm) {
    var text1_a = hm[0];
    var text1_b = hm[1];
    var text2_a = hm[2];
    var text2_b = hm[3];
    var mid_common = hm[4];
    var diffs_a = diff_main(text1_a, text2_a);
    var diffs_b = diff_main(text1_b, text2_b);
    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
  }
  return diff_bisect_(text1, text2);
}
function diff_bisect_(text1, text2) {
  var text1_length = text1.length;
  var text2_length = text2.length;
  var max_d = Math.ceil((text1_length + text2_length) / 2);
  var v_offset = max_d;
  var v_length = 2 * max_d;
  var v1 = new Array(v_length);
  var v2 = new Array(v_length);
  for (var x = 0; x < v_length; x++) {
    v1[x] = -1;
    v2[x] = -1;
  }
  v1[v_offset + 1] = 0;
  v2[v_offset + 1] = 0;
  var delta = text1_length - text2_length;
  var front = delta % 2 !== 0;
  var k1start = 0;
  var k1end = 0;
  var k2start = 0;
  var k2end = 0;
  for (var d = 0; d < max_d; d++) {
    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
      var k1_offset = v_offset + k1;
      var x1;
      if (k1 === -d || k1 !== d && v1[k1_offset - 1] < v1[k1_offset + 1]) {
        x1 = v1[k1_offset + 1];
      } else {
        x1 = v1[k1_offset - 1] + 1;
      }
      var y1 = x1 - k1;
      while (x1 < text1_length && y1 < text2_length && text1.charAt(x1) === text2.charAt(y1)) {
        x1++;
        y1++;
      }
      v1[k1_offset] = x1;
      if (x1 > text1_length) {
        k1end += 2;
      } else if (y1 > text2_length) {
        k1start += 2;
      } else if (front) {
        var k2_offset = v_offset + delta - k1;
        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] !== -1) {
          var x2 = text1_length - v2[k2_offset];
          if (x1 >= x2) {
            return diff_bisectSplit_(text1, text2, x1, y1);
          }
        }
      }
    }
    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
      var k2_offset = v_offset + k2;
      var x2;
      if (k2 === -d || k2 !== d && v2[k2_offset - 1] < v2[k2_offset + 1]) {
        x2 = v2[k2_offset + 1];
      } else {
        x2 = v2[k2_offset - 1] + 1;
      }
      var y2 = x2 - k2;
      while (x2 < text1_length && y2 < text2_length && text1.charAt(text1_length - x2 - 1) === text2.charAt(text2_length - y2 - 1)) {
        x2++;
        y2++;
      }
      v2[k2_offset] = x2;
      if (x2 > text1_length) {
        k2end += 2;
      } else if (y2 > text2_length) {
        k2start += 2;
      } else if (!front) {
        var k1_offset = v_offset + delta - k2;
        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] !== -1) {
          var x1 = v1[k1_offset];
          var y1 = v_offset + x1 - k1_offset;
          x2 = text1_length - x2;
          if (x1 >= x2) {
            return diff_bisectSplit_(text1, text2, x1, y1);
          }
        }
      }
    }
  }
  return [
    [DIFF_DELETE, text1],
    [DIFF_INSERT, text2]
  ];
}
function diff_bisectSplit_(text1, text2, x, y) {
  var text1a = text1.substring(0, x);
  var text2a = text2.substring(0, y);
  var text1b = text1.substring(x);
  var text2b = text2.substring(y);
  var diffs = diff_main(text1a, text2a);
  var diffsb = diff_main(text1b, text2b);
  return diffs.concat(diffsb);
}
function diff_commonPrefix(text1, text2) {
  if (!text1 || !text2 || text1.charAt(0) !== text2.charAt(0)) {
    return 0;
  }
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerstart = 0;
  while (pointermin < pointermid) {
    if (text1.substring(pointerstart, pointermid) == text2.substring(pointerstart, pointermid)) {
      pointermin = pointermid;
      pointerstart = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  if (is_surrogate_pair_start(text1.charCodeAt(pointermid - 1))) {
    pointermid--;
  }
  return pointermid;
}
function diff_commonOverlap_(text1, text2) {
  var text1_length = text1.length;
  var text2_length = text2.length;
  if (text1_length == 0 || text2_length == 0) {
    return 0;
  }
  if (text1_length > text2_length) {
    text1 = text1.substring(text1_length - text2_length);
  } else if (text1_length < text2_length) {
    text2 = text2.substring(0, text1_length);
  }
  var text_length = Math.min(text1_length, text2_length);
  if (text1 == text2) {
    return text_length;
  }
  var best = 0;
  var length = 1;
  while (true) {
    var pattern = text1.substring(text_length - length);
    var found = text2.indexOf(pattern);
    if (found == -1) {
      return best;
    }
    length += found;
    if (found == 0 || text1.substring(text_length - length) == text2.substring(0, length)) {
      best = length;
      length++;
    }
  }
}
function diff_commonSuffix(text1, text2) {
  if (!text1 || !text2 || text1.slice(-1) !== text2.slice(-1)) {
    return 0;
  }
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerend = 0;
  while (pointermin < pointermid) {
    if (text1.substring(text1.length - pointermid, text1.length - pointerend) == text2.substring(text2.length - pointermid, text2.length - pointerend)) {
      pointermin = pointermid;
      pointerend = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  if (is_surrogate_pair_end(text1.charCodeAt(text1.length - pointermid))) {
    pointermid--;
  }
  return pointermid;
}
function diff_halfMatch_(text1, text2) {
  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
    return null;
  }
  function diff_halfMatchI_(longtext2, shorttext2, i) {
    var seed = longtext2.substring(i, i + Math.floor(longtext2.length / 4));
    var j = -1;
    var best_common = "";
    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
    while ((j = shorttext2.indexOf(seed, j + 1)) !== -1) {
      var prefixLength = diff_commonPrefix(
        longtext2.substring(i),
        shorttext2.substring(j)
      );
      var suffixLength = diff_commonSuffix(
        longtext2.substring(0, i),
        shorttext2.substring(0, j)
      );
      if (best_common.length < suffixLength + prefixLength) {
        best_common = shorttext2.substring(j - suffixLength, j) + shorttext2.substring(j, j + prefixLength);
        best_longtext_a = longtext2.substring(0, i - suffixLength);
        best_longtext_b = longtext2.substring(i + prefixLength);
        best_shorttext_a = shorttext2.substring(0, j - suffixLength);
        best_shorttext_b = shorttext2.substring(j + prefixLength);
      }
    }
    if (best_common.length * 2 >= longtext2.length) {
      return [
        best_longtext_a,
        best_longtext_b,
        best_shorttext_a,
        best_shorttext_b,
        best_common
      ];
    } else {
      return null;
    }
  }
  var hm1 = diff_halfMatchI_(
    longtext,
    shorttext,
    Math.ceil(longtext.length / 4)
  );
  var hm2 = diff_halfMatchI_(
    longtext,
    shorttext,
    Math.ceil(longtext.length / 2)
  );
  var hm;
  if (!hm1 && !hm2) {
    return null;
  } else if (!hm2) {
    hm = hm1;
  } else if (!hm1) {
    hm = hm2;
  } else {
    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
  }
  var text1_a, text1_b, text2_a, text2_b;
  if (text1.length > text2.length) {
    text1_a = hm[0];
    text1_b = hm[1];
    text2_a = hm[2];
    text2_b = hm[3];
  } else {
    text2_a = hm[0];
    text2_b = hm[1];
    text1_a = hm[2];
    text1_b = hm[3];
  }
  var mid_common = hm[4];
  return [text1_a, text1_b, text2_a, text2_b, mid_common];
}
function diff_cleanupSemantic(diffs) {
  var changes = false;
  var equalities = [];
  var equalitiesLength = 0;
  var lastequality = null;
  var pointer = 0;
  var length_insertions1 = 0;
  var length_deletions1 = 0;
  var length_insertions2 = 0;
  var length_deletions2 = 0;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {
      equalities[equalitiesLength++] = pointer;
      length_insertions1 = length_insertions2;
      length_deletions1 = length_deletions2;
      length_insertions2 = 0;
      length_deletions2 = 0;
      lastequality = diffs[pointer][1];
    } else {
      if (diffs[pointer][0] == DIFF_INSERT) {
        length_insertions2 += diffs[pointer][1].length;
      } else {
        length_deletions2 += diffs[pointer][1].length;
      }
      if (lastequality && lastequality.length <= Math.max(length_insertions1, length_deletions1) && lastequality.length <= Math.max(length_insertions2, length_deletions2)) {
        diffs.splice(equalities[equalitiesLength - 1], 0, [
          DIFF_DELETE,
          lastequality
        ]);
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        equalitiesLength--;
        equalitiesLength--;
        pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
        length_insertions1 = 0;
        length_deletions1 = 0;
        length_insertions2 = 0;
        length_deletions2 = 0;
        lastequality = null;
        changes = true;
      }
    }
    pointer++;
  }
  if (changes) {
    diff_cleanupMerge(diffs);
  }
  diff_cleanupSemanticLossless(diffs);
  pointer = 1;
  while (pointer < diffs.length) {
    if (diffs[pointer - 1][0] == DIFF_DELETE && diffs[pointer][0] == DIFF_INSERT) {
      var deletion = diffs[pointer - 1][1];
      var insertion = diffs[pointer][1];
      var overlap_length1 = diff_commonOverlap_(deletion, insertion);
      var overlap_length2 = diff_commonOverlap_(insertion, deletion);
      if (overlap_length1 >= overlap_length2) {
        if (overlap_length1 >= deletion.length / 2 || overlap_length1 >= insertion.length / 2) {
          diffs.splice(pointer, 0, [
            DIFF_EQUAL,
            insertion.substring(0, overlap_length1)
          ]);
          diffs[pointer - 1][1] = deletion.substring(
            0,
            deletion.length - overlap_length1
          );
          diffs[pointer + 1][1] = insertion.substring(overlap_length1);
          pointer++;
        }
      } else {
        if (overlap_length2 >= deletion.length / 2 || overlap_length2 >= insertion.length / 2) {
          diffs.splice(pointer, 0, [
            DIFF_EQUAL,
            deletion.substring(0, overlap_length2)
          ]);
          diffs[pointer - 1][0] = DIFF_INSERT;
          diffs[pointer - 1][1] = insertion.substring(
            0,
            insertion.length - overlap_length2
          );
          diffs[pointer + 1][0] = DIFF_DELETE;
          diffs[pointer + 1][1] = deletion.substring(overlap_length2);
          pointer++;
        }
      }
      pointer++;
    }
    pointer++;
  }
}
var nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
var whitespaceRegex_ = /\s/;
var linebreakRegex_ = /[\r\n]/;
var blanklineEndRegex_ = /\n\r?\n$/;
var blanklineStartRegex_ = /^\r?\n\r?\n/;
function diff_cleanupSemanticLossless(diffs) {
  function diff_cleanupSemanticScore_(one, two) {
    if (!one || !two) {
      return 6;
    }
    var char1 = one.charAt(one.length - 1);
    var char2 = two.charAt(0);
    var nonAlphaNumeric1 = char1.match(nonAlphaNumericRegex_);
    var nonAlphaNumeric2 = char2.match(nonAlphaNumericRegex_);
    var whitespace1 = nonAlphaNumeric1 && char1.match(whitespaceRegex_);
    var whitespace2 = nonAlphaNumeric2 && char2.match(whitespaceRegex_);
    var lineBreak1 = whitespace1 && char1.match(linebreakRegex_);
    var lineBreak2 = whitespace2 && char2.match(linebreakRegex_);
    var blankLine1 = lineBreak1 && one.match(blanklineEndRegex_);
    var blankLine2 = lineBreak2 && two.match(blanklineStartRegex_);
    if (blankLine1 || blankLine2) {
      return 5;
    } else if (lineBreak1 || lineBreak2) {
      return 4;
    } else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
      return 3;
    } else if (whitespace1 || whitespace2) {
      return 2;
    } else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
      return 1;
    }
    return 0;
  }
  var pointer = 1;
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
      var equality1 = diffs[pointer - 1][1];
      var edit = diffs[pointer][1];
      var equality2 = diffs[pointer + 1][1];
      var commonOffset = diff_commonSuffix(equality1, edit);
      if (commonOffset) {
        var commonString = edit.substring(edit.length - commonOffset);
        equality1 = equality1.substring(0, equality1.length - commonOffset);
        edit = commonString + edit.substring(0, edit.length - commonOffset);
        equality2 = commonString + equality2;
      }
      var bestEquality1 = equality1;
      var bestEdit = edit;
      var bestEquality2 = equality2;
      var bestScore = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
      while (edit.charAt(0) === equality2.charAt(0)) {
        equality1 += edit.charAt(0);
        edit = edit.substring(1) + equality2.charAt(0);
        equality2 = equality2.substring(1);
        var score = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
        if (score >= bestScore) {
          bestScore = score;
          bestEquality1 = equality1;
          bestEdit = edit;
          bestEquality2 = equality2;
        }
      }
      if (diffs[pointer - 1][1] != bestEquality1) {
        if (bestEquality1) {
          diffs[pointer - 1][1] = bestEquality1;
        } else {
          diffs.splice(pointer - 1, 1);
          pointer--;
        }
        diffs[pointer][1] = bestEdit;
        if (bestEquality2) {
          diffs[pointer + 1][1] = bestEquality2;
        } else {
          diffs.splice(pointer + 1, 1);
          pointer--;
        }
      }
    }
    pointer++;
  }
}
function diff_cleanupMerge(diffs, fix_unicode) {
  diffs.push([DIFF_EQUAL, ""]);
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = "";
  var text_insert = "";
  var commonlength;
  while (pointer < diffs.length) {
    if (pointer < diffs.length - 1 && !diffs[pointer][1]) {
      diffs.splice(pointer, 1);
      continue;
    }
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_EQUAL:
        var previous_equality = pointer - count_insert - count_delete - 1;
        if (fix_unicode) {
          if (previous_equality >= 0 && ends_with_pair_start(diffs[previous_equality][1])) {
            var stray = diffs[previous_equality][1].slice(-1);
            diffs[previous_equality][1] = diffs[previous_equality][1].slice(
              0,
              -1
            );
            text_delete = stray + text_delete;
            text_insert = stray + text_insert;
            if (!diffs[previous_equality][1]) {
              diffs.splice(previous_equality, 1);
              pointer--;
              var k = previous_equality - 1;
              if (diffs[k] && diffs[k][0] === DIFF_INSERT) {
                count_insert++;
                text_insert = diffs[k][1] + text_insert;
                k--;
              }
              if (diffs[k] && diffs[k][0] === DIFF_DELETE) {
                count_delete++;
                text_delete = diffs[k][1] + text_delete;
                k--;
              }
              previous_equality = k;
            }
          }
          if (starts_with_pair_end(diffs[pointer][1])) {
            var stray = diffs[pointer][1].charAt(0);
            diffs[pointer][1] = diffs[pointer][1].slice(1);
            text_delete += stray;
            text_insert += stray;
          }
        }
        if (pointer < diffs.length - 1 && !diffs[pointer][1]) {
          diffs.splice(pointer, 1);
          break;
        }
        if (text_delete.length > 0 || text_insert.length > 0) {
          if (text_delete.length > 0 && text_insert.length > 0) {
            commonlength = diff_commonPrefix(text_insert, text_delete);
            if (commonlength !== 0) {
              if (previous_equality >= 0) {
                diffs[previous_equality][1] += text_insert.substring(
                  0,
                  commonlength
                );
              } else {
                diffs.splice(0, 0, [
                  DIFF_EQUAL,
                  text_insert.substring(0, commonlength)
                ]);
                pointer++;
              }
              text_insert = text_insert.substring(commonlength);
              text_delete = text_delete.substring(commonlength);
            }
            commonlength = diff_commonSuffix(text_insert, text_delete);
            if (commonlength !== 0) {
              diffs[pointer][1] = text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
              text_insert = text_insert.substring(
                0,
                text_insert.length - commonlength
              );
              text_delete = text_delete.substring(
                0,
                text_delete.length - commonlength
              );
            }
          }
          var n = count_insert + count_delete;
          if (text_delete.length === 0 && text_insert.length === 0) {
            diffs.splice(pointer - n, n);
            pointer = pointer - n;
          } else if (text_delete.length === 0) {
            diffs.splice(pointer - n, n, [DIFF_INSERT, text_insert]);
            pointer = pointer - n + 1;
          } else if (text_insert.length === 0) {
            diffs.splice(pointer - n, n, [DIFF_DELETE, text_delete]);
            pointer = pointer - n + 1;
          } else {
            diffs.splice(
              pointer - n,
              n,
              [DIFF_DELETE, text_delete],
              [DIFF_INSERT, text_insert]
            );
            pointer = pointer - n + 2;
          }
        }
        if (pointer !== 0 && diffs[pointer - 1][0] === DIFF_EQUAL) {
          diffs[pointer - 1][1] += diffs[pointer][1];
          diffs.splice(pointer, 1);
        } else {
          pointer++;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = "";
        text_insert = "";
        break;
    }
  }
  if (diffs[diffs.length - 1][1] === "") {
    diffs.pop();
  }
  var changes = false;
  pointer = 1;
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] === DIFF_EQUAL && diffs[pointer + 1][0] === DIFF_EQUAL) {
      if (diffs[pointer][1].substring(
        diffs[pointer][1].length - diffs[pointer - 1][1].length
      ) === diffs[pointer - 1][1]) {
        diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(
          0,
          diffs[pointer][1].length - diffs[pointer - 1][1].length
        );
        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
        diffs.splice(pointer - 1, 1);
        changes = true;
      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) == diffs[pointer + 1][1]) {
        diffs[pointer - 1][1] += diffs[pointer + 1][1];
        diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
        diffs.splice(pointer + 1, 1);
        changes = true;
      }
    }
    pointer++;
  }
  if (changes) {
    diff_cleanupMerge(diffs, fix_unicode);
  }
}
function is_surrogate_pair_start(charCode) {
  return charCode >= 55296 && charCode <= 56319;
}
function is_surrogate_pair_end(charCode) {
  return charCode >= 56320 && charCode <= 57343;
}
function starts_with_pair_end(str) {
  return is_surrogate_pair_end(str.charCodeAt(0));
}
function ends_with_pair_start(str) {
  return is_surrogate_pair_start(str.charCodeAt(str.length - 1));
}
function remove_empty_tuples(tuples) {
  var ret = [];
  for (var i = 0; i < tuples.length; i++) {
    if (tuples[i][1].length > 0) {
      ret.push(tuples[i]);
    }
  }
  return ret;
}
function make_edit_splice(before, oldMiddle, newMiddle, after) {
  if (ends_with_pair_start(before) || starts_with_pair_end(after)) {
    return null;
  }
  return remove_empty_tuples([
    [DIFF_EQUAL, before],
    [DIFF_DELETE, oldMiddle],
    [DIFF_INSERT, newMiddle],
    [DIFF_EQUAL, after]
  ]);
}
function find_cursor_edit_diff(oldText, newText, cursor_pos) {
  var oldRange = typeof cursor_pos === "number" ? { index: cursor_pos, length: 0 } : cursor_pos.oldRange;
  var newRange = typeof cursor_pos === "number" ? null : cursor_pos.newRange;
  var oldLength = oldText.length;
  var newLength = newText.length;
  if (oldRange.length === 0 && (newRange === null || newRange.length === 0)) {
    var oldCursor = oldRange.index;
    var oldBefore = oldText.slice(0, oldCursor);
    var oldAfter = oldText.slice(oldCursor);
    var maybeNewCursor = newRange ? newRange.index : null;
    editBefore: {
      var newCursor = oldCursor + newLength - oldLength;
      if (maybeNewCursor !== null && maybeNewCursor !== newCursor) {
        break editBefore;
      }
      if (newCursor < 0 || newCursor > newLength) {
        break editBefore;
      }
      var newBefore = newText.slice(0, newCursor);
      var newAfter = newText.slice(newCursor);
      if (newAfter !== oldAfter) {
        break editBefore;
      }
      var prefixLength = Math.min(oldCursor, newCursor);
      var oldPrefix = oldBefore.slice(0, prefixLength);
      var newPrefix = newBefore.slice(0, prefixLength);
      if (oldPrefix !== newPrefix) {
        break editBefore;
      }
      var oldMiddle = oldBefore.slice(prefixLength);
      var newMiddle = newBefore.slice(prefixLength);
      return make_edit_splice(oldPrefix, oldMiddle, newMiddle, oldAfter);
    }
    editAfter: {
      if (maybeNewCursor !== null && maybeNewCursor !== oldCursor) {
        break editAfter;
      }
      var cursor = oldCursor;
      var newBefore = newText.slice(0, cursor);
      var newAfter = newText.slice(cursor);
      if (newBefore !== oldBefore) {
        break editAfter;
      }
      var suffixLength = Math.min(oldLength - cursor, newLength - cursor);
      var oldSuffix = oldAfter.slice(oldAfter.length - suffixLength);
      var newSuffix = newAfter.slice(newAfter.length - suffixLength);
      if (oldSuffix !== newSuffix) {
        break editAfter;
      }
      var oldMiddle = oldAfter.slice(0, oldAfter.length - suffixLength);
      var newMiddle = newAfter.slice(0, newAfter.length - suffixLength);
      return make_edit_splice(oldBefore, oldMiddle, newMiddle, oldSuffix);
    }
  }
  if (oldRange.length > 0 && newRange && newRange.length === 0) {
    replaceRange: {
      var oldPrefix = oldText.slice(0, oldRange.index);
      var oldSuffix = oldText.slice(oldRange.index + oldRange.length);
      var prefixLength = oldPrefix.length;
      var suffixLength = oldSuffix.length;
      if (newLength < prefixLength + suffixLength) {
        break replaceRange;
      }
      var newPrefix = newText.slice(0, prefixLength);
      var newSuffix = newText.slice(newLength - suffixLength);
      if (oldPrefix !== newPrefix || oldSuffix !== newSuffix) {
        break replaceRange;
      }
      var oldMiddle = oldText.slice(prefixLength, oldLength - suffixLength);
      var newMiddle = newText.slice(prefixLength, newLength - suffixLength);
      return make_edit_splice(oldPrefix, oldMiddle, newMiddle, oldSuffix);
    }
  }
  return null;
}
function diff(text1, text2, cursor_pos, cleanup) {
  return diff_main(text1, text2, cursor_pos, cleanup, true);
}
diff.INSERT = DIFF_INSERT;
diff.DELETE = DIFF_DELETE;
diff.EQUAL = DIFF_EQUAL;
var diff_1 = diff;
var lodash_clonedeep = { exports: {} };
lodash_clonedeep.exports;
(function(module2, exports$1) {
  var LARGE_ARRAY_SIZE2 = 200;
  var HASH_UNDEFINED2 = "__lodash_hash_undefined__";
  var MAX_SAFE_INTEGER2 = 9007199254740991;
  var argsTag2 = "[object Arguments]", arrayTag2 = "[object Array]", boolTag2 = "[object Boolean]", dateTag2 = "[object Date]", errorTag2 = "[object Error]", funcTag2 = "[object Function]", genTag2 = "[object GeneratorFunction]", mapTag2 = "[object Map]", numberTag2 = "[object Number]", objectTag2 = "[object Object]", promiseTag2 = "[object Promise]", regexpTag2 = "[object RegExp]", setTag2 = "[object Set]", stringTag2 = "[object String]", symbolTag2 = "[object Symbol]", weakMapTag2 = "[object WeakMap]";
  var arrayBufferTag2 = "[object ArrayBuffer]", dataViewTag2 = "[object DataView]", float32Tag2 = "[object Float32Array]", float64Tag2 = "[object Float64Array]", int8Tag2 = "[object Int8Array]", int16Tag2 = "[object Int16Array]", int32Tag2 = "[object Int32Array]", uint8Tag2 = "[object Uint8Array]", uint8ClampedTag2 = "[object Uint8ClampedArray]", uint16Tag2 = "[object Uint16Array]", uint32Tag2 = "[object Uint32Array]";
  var reRegExpChar2 = /[\\^$.*+?()[\]{}|]/g;
  var reFlags2 = /\w*$/;
  var reIsHostCtor2 = /^\[object .+?Constructor\]$/;
  var reIsUint2 = /^(?:0|[1-9]\d*)$/;
  var cloneableTags2 = {};
  cloneableTags2[argsTag2] = cloneableTags2[arrayTag2] = cloneableTags2[arrayBufferTag2] = cloneableTags2[dataViewTag2] = cloneableTags2[boolTag2] = cloneableTags2[dateTag2] = cloneableTags2[float32Tag2] = cloneableTags2[float64Tag2] = cloneableTags2[int8Tag2] = cloneableTags2[int16Tag2] = cloneableTags2[int32Tag2] = cloneableTags2[mapTag2] = cloneableTags2[numberTag2] = cloneableTags2[objectTag2] = cloneableTags2[regexpTag2] = cloneableTags2[setTag2] = cloneableTags2[stringTag2] = cloneableTags2[symbolTag2] = cloneableTags2[uint8Tag2] = cloneableTags2[uint8ClampedTag2] = cloneableTags2[uint16Tag2] = cloneableTags2[uint32Tag2] = true;
  cloneableTags2[errorTag2] = cloneableTags2[funcTag2] = cloneableTags2[weakMapTag2] = false;
  var freeGlobal2 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var freeSelf2 = typeof self == "object" && self && self.Object === Object && self;
  var root2 = freeGlobal2 || freeSelf2 || Function("return this")();
  var freeExports2 = exports$1 && !exports$1.nodeType && exports$1;
  var freeModule2 = freeExports2 && true && module2 && !module2.nodeType && module2;
  var moduleExports2 = freeModule2 && freeModule2.exports === freeExports2;
  function addMapEntry(map, pair) {
    map.set(pair[0], pair[1]);
    return map;
  }
  function addSetEntry(set, value) {
    set.add(value);
    return set;
  }
  function arrayEach2(array, iteratee) {
    var index2 = -1, length = array ? array.length : 0;
    while (++index2 < length) {
      if (iteratee(array[index2], index2, array) === false) {
        break;
      }
    }
    return array;
  }
  function arrayPush2(array, values) {
    var index2 = -1, length = values.length, offset2 = array.length;
    while (++index2 < length) {
      array[offset2 + index2] = values[index2];
    }
    return array;
  }
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index2 = -1, length = array ? array.length : 0;
    while (++index2 < length) {
      accumulator = iteratee(accumulator, array[index2], index2, array);
    }
    return accumulator;
  }
  function baseTimes2(n, iteratee) {
    var index2 = -1, result = Array(n);
    while (++index2 < n) {
      result[index2] = iteratee(index2);
    }
    return result;
  }
  function getValue2(object, key) {
    return object == null ? void 0 : object[key];
  }
  function isHostObject(value) {
    var result = false;
    if (value != null && typeof value.toString != "function") {
      try {
        result = !!(value + "");
      } catch (e) {
      }
    }
    return result;
  }
  function mapToArray2(map) {
    var index2 = -1, result = Array(map.size);
    map.forEach(function(value, key) {
      result[++index2] = [key, value];
    });
    return result;
  }
  function overArg2(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  function setToArray2(set) {
    var index2 = -1, result = Array(set.size);
    set.forEach(function(value) {
      result[++index2] = value;
    });
    return result;
  }
  var arrayProto2 = Array.prototype, funcProto2 = Function.prototype, objectProto2 = Object.prototype;
  var coreJsData2 = root2["__core-js_shared__"];
  var maskSrcKey2 = function() {
    var uid = /[^.]+$/.exec(coreJsData2 && coreJsData2.keys && coreJsData2.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  var funcToString2 = funcProto2.toString;
  var hasOwnProperty2 = objectProto2.hasOwnProperty;
  var objectToString2 = objectProto2.toString;
  var reIsNative2 = RegExp(
    "^" + funcToString2.call(hasOwnProperty2).replace(reRegExpChar2, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  var Buffer3 = moduleExports2 ? root2.Buffer : void 0, Symbol2 = root2.Symbol, Uint8Array2 = root2.Uint8Array, getPrototype2 = overArg2(Object.getPrototypeOf, Object), objectCreate2 = Object.create, propertyIsEnumerable2 = objectProto2.propertyIsEnumerable, splice2 = arrayProto2.splice;
  var nativeGetSymbols2 = Object.getOwnPropertySymbols, nativeIsBuffer2 = Buffer3 ? Buffer3.isBuffer : void 0, nativeKeys2 = overArg2(Object.keys, Object);
  var DataView2 = getNative2(root2, "DataView"), Map2 = getNative2(root2, "Map"), Promise2 = getNative2(root2, "Promise"), Set2 = getNative2(root2, "Set"), WeakMap2 = getNative2(root2, "WeakMap"), nativeCreate2 = getNative2(Object, "create");
  var dataViewCtorString2 = toSource2(DataView2), mapCtorString2 = toSource2(Map2), promiseCtorString2 = toSource2(Promise2), setCtorString2 = toSource2(Set2), weakMapCtorString2 = toSource2(WeakMap2);
  var symbolProto2 = Symbol2 ? Symbol2.prototype : void 0, symbolValueOf2 = symbolProto2 ? symbolProto2.valueOf : void 0;
  function Hash2(entries) {
    var index2 = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index2 < length) {
      var entry = entries[index2];
      this.set(entry[0], entry[1]);
    }
  }
  function hashClear2() {
    this.__data__ = nativeCreate2 ? nativeCreate2(null) : {};
  }
  function hashDelete2(key) {
    return this.has(key) && delete this.__data__[key];
  }
  function hashGet2(key) {
    var data = this.__data__;
    if (nativeCreate2) {
      var result = data[key];
      return result === HASH_UNDEFINED2 ? void 0 : result;
    }
    return hasOwnProperty2.call(data, key) ? data[key] : void 0;
  }
  function hashHas2(key) {
    var data = this.__data__;
    return nativeCreate2 ? data[key] !== void 0 : hasOwnProperty2.call(data, key);
  }
  function hashSet2(key, value) {
    var data = this.__data__;
    data[key] = nativeCreate2 && value === void 0 ? HASH_UNDEFINED2 : value;
    return this;
  }
  Hash2.prototype.clear = hashClear2;
  Hash2.prototype["delete"] = hashDelete2;
  Hash2.prototype.get = hashGet2;
  Hash2.prototype.has = hashHas2;
  Hash2.prototype.set = hashSet2;
  function ListCache2(entries) {
    var index2 = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index2 < length) {
      var entry = entries[index2];
      this.set(entry[0], entry[1]);
    }
  }
  function listCacheClear2() {
    this.__data__ = [];
  }
  function listCacheDelete2(key) {
    var data = this.__data__, index2 = assocIndexOf2(data, key);
    if (index2 < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index2 == lastIndex) {
      data.pop();
    } else {
      splice2.call(data, index2, 1);
    }
    return true;
  }
  function listCacheGet2(key) {
    var data = this.__data__, index2 = assocIndexOf2(data, key);
    return index2 < 0 ? void 0 : data[index2][1];
  }
  function listCacheHas2(key) {
    return assocIndexOf2(this.__data__, key) > -1;
  }
  function listCacheSet2(key, value) {
    var data = this.__data__, index2 = assocIndexOf2(data, key);
    if (index2 < 0) {
      data.push([key, value]);
    } else {
      data[index2][1] = value;
    }
    return this;
  }
  ListCache2.prototype.clear = listCacheClear2;
  ListCache2.prototype["delete"] = listCacheDelete2;
  ListCache2.prototype.get = listCacheGet2;
  ListCache2.prototype.has = listCacheHas2;
  ListCache2.prototype.set = listCacheSet2;
  function MapCache2(entries) {
    var index2 = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index2 < length) {
      var entry = entries[index2];
      this.set(entry[0], entry[1]);
    }
  }
  function mapCacheClear2() {
    this.__data__ = {
      "hash": new Hash2(),
      "map": new (Map2 || ListCache2)(),
      "string": new Hash2()
    };
  }
  function mapCacheDelete2(key) {
    return getMapData2(this, key)["delete"](key);
  }
  function mapCacheGet2(key) {
    return getMapData2(this, key).get(key);
  }
  function mapCacheHas2(key) {
    return getMapData2(this, key).has(key);
  }
  function mapCacheSet2(key, value) {
    getMapData2(this, key).set(key, value);
    return this;
  }
  MapCache2.prototype.clear = mapCacheClear2;
  MapCache2.prototype["delete"] = mapCacheDelete2;
  MapCache2.prototype.get = mapCacheGet2;
  MapCache2.prototype.has = mapCacheHas2;
  MapCache2.prototype.set = mapCacheSet2;
  function Stack2(entries) {
    this.__data__ = new ListCache2(entries);
  }
  function stackClear2() {
    this.__data__ = new ListCache2();
  }
  function stackDelete2(key) {
    return this.__data__["delete"](key);
  }
  function stackGet2(key) {
    return this.__data__.get(key);
  }
  function stackHas2(key) {
    return this.__data__.has(key);
  }
  function stackSet2(key, value) {
    var cache = this.__data__;
    if (cache instanceof ListCache2) {
      var pairs = cache.__data__;
      if (!Map2 || pairs.length < LARGE_ARRAY_SIZE2 - 1) {
        pairs.push([key, value]);
        return this;
      }
      cache = this.__data__ = new MapCache2(pairs);
    }
    cache.set(key, value);
    return this;
  }
  Stack2.prototype.clear = stackClear2;
  Stack2.prototype["delete"] = stackDelete2;
  Stack2.prototype.get = stackGet2;
  Stack2.prototype.has = stackHas2;
  Stack2.prototype.set = stackSet2;
  function arrayLikeKeys2(value, inherited) {
    var result = isArray2(value) || isArguments2(value) ? baseTimes2(value.length, String) : [];
    var length = result.length, skipIndexes = !!length;
    for (var key in value) {
      if (hasOwnProperty2.call(value, key) && !(skipIndexes && (key == "length" || isIndex2(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }
  function assignValue2(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty2.call(object, key) && eq2(objValue, value)) || value === void 0 && !(key in object)) {
      object[key] = value;
    }
  }
  function assocIndexOf2(array, key) {
    var length = array.length;
    while (length--) {
      if (eq2(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  function baseAssign(object, source) {
    return object && copyObject2(source, keys2(source), object);
  }
  function baseClone2(value, isDeep, isFull, customizer, key, object, stack) {
    var result;
    if (customizer) {
      result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    if (result !== void 0) {
      return result;
    }
    if (!isObject2(value)) {
      return value;
    }
    var isArr = isArray2(value);
    if (isArr) {
      result = initCloneArray2(value);
      if (!isDeep) {
        return copyArray2(value, result);
      }
    } else {
      var tag = getTag2(value), isFunc = tag == funcTag2 || tag == genTag2;
      if (isBuffer2(value)) {
        return cloneBuffer2(value, isDeep);
      }
      if (tag == objectTag2 || tag == argsTag2 || isFunc && !object) {
        if (isHostObject(value)) {
          return object ? value : {};
        }
        result = initCloneObject2(isFunc ? {} : value);
        if (!isDeep) {
          return copySymbols(value, baseAssign(result, value));
        }
      } else {
        if (!cloneableTags2[tag]) {
          return object ? value : {};
        }
        result = initCloneByTag2(value, tag, baseClone2, isDeep);
      }
    }
    stack || (stack = new Stack2());
    var stacked = stack.get(value);
    if (stacked) {
      return stacked;
    }
    stack.set(value, result);
    if (!isArr) {
      var props = isFull ? getAllKeys2(value) : keys2(value);
    }
    arrayEach2(props || value, function(subValue, key2) {
      if (props) {
        key2 = subValue;
        subValue = value[key2];
      }
      assignValue2(result, key2, baseClone2(subValue, isDeep, isFull, customizer, key2, value, stack));
    });
    return result;
  }
  function baseCreate2(proto) {
    return isObject2(proto) ? objectCreate2(proto) : {};
  }
  function baseGetAllKeys2(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray2(object) ? result : arrayPush2(result, symbolsFunc(object));
  }
  function baseGetTag2(value) {
    return objectToString2.call(value);
  }
  function baseIsNative2(value) {
    if (!isObject2(value) || isMasked2(value)) {
      return false;
    }
    var pattern = isFunction2(value) || isHostObject(value) ? reIsNative2 : reIsHostCtor2;
    return pattern.test(toSource2(value));
  }
  function baseKeys2(object) {
    if (!isPrototype2(object)) {
      return nativeKeys2(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty2.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  function cloneBuffer2(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var result = new buffer.constructor(buffer.length);
    buffer.copy(result);
    return result;
  }
  function cloneArrayBuffer2(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array2(result).set(new Uint8Array2(arrayBuffer));
    return result;
  }
  function cloneDataView2(dataView, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer2(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  }
  function cloneMap(map, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(mapToArray2(map), true) : mapToArray2(map);
    return arrayReduce(array, addMapEntry, new map.constructor());
  }
  function cloneRegExp2(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags2.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
  }
  function cloneSet(set, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(setToArray2(set), true) : setToArray2(set);
    return arrayReduce(array, addSetEntry, new set.constructor());
  }
  function cloneSymbol2(symbol) {
    return symbolValueOf2 ? Object(symbolValueOf2.call(symbol)) : {};
  }
  function cloneTypedArray2(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer2(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }
  function copyArray2(source, array) {
    var index2 = -1, length = source.length;
    array || (array = Array(length));
    while (++index2 < length) {
      array[index2] = source[index2];
    }
    return array;
  }
  function copyObject2(source, props, object, customizer) {
    object || (object = {});
    var index2 = -1, length = props.length;
    while (++index2 < length) {
      var key = props[index2];
      var newValue = void 0;
      assignValue2(object, key, newValue === void 0 ? source[key] : newValue);
    }
    return object;
  }
  function copySymbols(source, object) {
    return copyObject2(source, getSymbols2(source), object);
  }
  function getAllKeys2(object) {
    return baseGetAllKeys2(object, keys2, getSymbols2);
  }
  function getMapData2(map, key) {
    var data = map.__data__;
    return isKeyable2(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  function getNative2(object, key) {
    var value = getValue2(object, key);
    return baseIsNative2(value) ? value : void 0;
  }
  var getSymbols2 = nativeGetSymbols2 ? overArg2(nativeGetSymbols2, Object) : stubArray2;
  var getTag2 = baseGetTag2;
  if (DataView2 && getTag2(new DataView2(new ArrayBuffer(1))) != dataViewTag2 || Map2 && getTag2(new Map2()) != mapTag2 || Promise2 && getTag2(Promise2.resolve()) != promiseTag2 || Set2 && getTag2(new Set2()) != setTag2 || WeakMap2 && getTag2(new WeakMap2()) != weakMapTag2) {
    getTag2 = function(value) {
      var result = objectToString2.call(value), Ctor = result == objectTag2 ? value.constructor : void 0, ctorString = Ctor ? toSource2(Ctor) : void 0;
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString2:
            return dataViewTag2;
          case mapCtorString2:
            return mapTag2;
          case promiseCtorString2:
            return promiseTag2;
          case setCtorString2:
            return setTag2;
          case weakMapCtorString2:
            return weakMapTag2;
        }
      }
      return result;
    };
  }
  function initCloneArray2(array) {
    var length = array.length, result = array.constructor(length);
    if (length && typeof array[0] == "string" && hasOwnProperty2.call(array, "index")) {
      result.index = array.index;
      result.input = array.input;
    }
    return result;
  }
  function initCloneObject2(object) {
    return typeof object.constructor == "function" && !isPrototype2(object) ? baseCreate2(getPrototype2(object)) : {};
  }
  function initCloneByTag2(object, tag, cloneFunc, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
      case arrayBufferTag2:
        return cloneArrayBuffer2(object);
      case boolTag2:
      case dateTag2:
        return new Ctor(+object);
      case dataViewTag2:
        return cloneDataView2(object, isDeep);
      case float32Tag2:
      case float64Tag2:
      case int8Tag2:
      case int16Tag2:
      case int32Tag2:
      case uint8Tag2:
      case uint8ClampedTag2:
      case uint16Tag2:
      case uint32Tag2:
        return cloneTypedArray2(object, isDeep);
      case mapTag2:
        return cloneMap(object, isDeep, cloneFunc);
      case numberTag2:
      case stringTag2:
        return new Ctor(object);
      case regexpTag2:
        return cloneRegExp2(object);
      case setTag2:
        return cloneSet(object, isDeep, cloneFunc);
      case symbolTag2:
        return cloneSymbol2(object);
    }
  }
  function isIndex2(value, length) {
    length = length == null ? MAX_SAFE_INTEGER2 : length;
    return !!length && (typeof value == "number" || reIsUint2.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  function isKeyable2(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  function isMasked2(func) {
    return !!maskSrcKey2 && maskSrcKey2 in func;
  }
  function isPrototype2(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto2;
    return value === proto;
  }
  function toSource2(func) {
    if (func != null) {
      try {
        return funcToString2.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  function cloneDeep2(value) {
    return baseClone2(value, true, true);
  }
  function eq2(value, other) {
    return value === other || value !== value && other !== other;
  }
  function isArguments2(value) {
    return isArrayLikeObject2(value) && hasOwnProperty2.call(value, "callee") && (!propertyIsEnumerable2.call(value, "callee") || objectToString2.call(value) == argsTag2);
  }
  var isArray2 = Array.isArray;
  function isArrayLike2(value) {
    return value != null && isLength2(value.length) && !isFunction2(value);
  }
  function isArrayLikeObject2(value) {
    return isObjectLike2(value) && isArrayLike2(value);
  }
  var isBuffer2 = nativeIsBuffer2 || stubFalse2;
  function isFunction2(value) {
    var tag = isObject2(value) ? objectToString2.call(value) : "";
    return tag == funcTag2 || tag == genTag2;
  }
  function isLength2(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER2;
  }
  function isObject2(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
  }
  function isObjectLike2(value) {
    return !!value && typeof value == "object";
  }
  function keys2(object) {
    return isArrayLike2(object) ? arrayLikeKeys2(object) : baseKeys2(object);
  }
  function stubArray2() {
    return [];
  }
  function stubFalse2() {
    return false;
  }
  module2.exports = cloneDeep2;
})(lodash_clonedeep, lodash_clonedeep.exports);
var lodash_clonedeepExports = lodash_clonedeep.exports;
var lodash_isequal = { exports: {} };
lodash_isequal.exports;
(function(module2, exports$1) {
  var LARGE_ARRAY_SIZE2 = 200;
  var HASH_UNDEFINED2 = "__lodash_hash_undefined__";
  var COMPARE_PARTIAL_FLAG2 = 1, COMPARE_UNORDERED_FLAG2 = 2;
  var MAX_SAFE_INTEGER2 = 9007199254740991;
  var argsTag2 = "[object Arguments]", arrayTag2 = "[object Array]", asyncTag2 = "[object AsyncFunction]", boolTag2 = "[object Boolean]", dateTag2 = "[object Date]", errorTag2 = "[object Error]", funcTag2 = "[object Function]", genTag2 = "[object GeneratorFunction]", mapTag2 = "[object Map]", numberTag2 = "[object Number]", nullTag2 = "[object Null]", objectTag2 = "[object Object]", promiseTag2 = "[object Promise]", proxyTag2 = "[object Proxy]", regexpTag2 = "[object RegExp]", setTag2 = "[object Set]", stringTag2 = "[object String]", symbolTag2 = "[object Symbol]", undefinedTag2 = "[object Undefined]", weakMapTag2 = "[object WeakMap]";
  var arrayBufferTag2 = "[object ArrayBuffer]", dataViewTag2 = "[object DataView]", float32Tag2 = "[object Float32Array]", float64Tag2 = "[object Float64Array]", int8Tag2 = "[object Int8Array]", int16Tag2 = "[object Int16Array]", int32Tag2 = "[object Int32Array]", uint8Tag2 = "[object Uint8Array]", uint8ClampedTag2 = "[object Uint8ClampedArray]", uint16Tag2 = "[object Uint16Array]", uint32Tag2 = "[object Uint32Array]";
  var reRegExpChar2 = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor2 = /^\[object .+?Constructor\]$/;
  var reIsUint2 = /^(?:0|[1-9]\d*)$/;
  var typedArrayTags2 = {};
  typedArrayTags2[float32Tag2] = typedArrayTags2[float64Tag2] = typedArrayTags2[int8Tag2] = typedArrayTags2[int16Tag2] = typedArrayTags2[int32Tag2] = typedArrayTags2[uint8Tag2] = typedArrayTags2[uint8ClampedTag2] = typedArrayTags2[uint16Tag2] = typedArrayTags2[uint32Tag2] = true;
  typedArrayTags2[argsTag2] = typedArrayTags2[arrayTag2] = typedArrayTags2[arrayBufferTag2] = typedArrayTags2[boolTag2] = typedArrayTags2[dataViewTag2] = typedArrayTags2[dateTag2] = typedArrayTags2[errorTag2] = typedArrayTags2[funcTag2] = typedArrayTags2[mapTag2] = typedArrayTags2[numberTag2] = typedArrayTags2[objectTag2] = typedArrayTags2[regexpTag2] = typedArrayTags2[setTag2] = typedArrayTags2[stringTag2] = typedArrayTags2[weakMapTag2] = false;
  var freeGlobal2 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var freeSelf2 = typeof self == "object" && self && self.Object === Object && self;
  var root2 = freeGlobal2 || freeSelf2 || Function("return this")();
  var freeExports2 = exports$1 && !exports$1.nodeType && exports$1;
  var freeModule2 = freeExports2 && true && module2 && !module2.nodeType && module2;
  var moduleExports2 = freeModule2 && freeModule2.exports === freeExports2;
  var freeProcess2 = moduleExports2 && freeGlobal2.process;
  var nodeUtil2 = function() {
    try {
      return freeProcess2 && freeProcess2.binding && freeProcess2.binding("util");
    } catch (e) {
    }
  }();
  var nodeIsTypedArray2 = nodeUtil2 && nodeUtil2.isTypedArray;
  function arrayFilter2(array, predicate) {
    var index2 = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index2 < length) {
      var value = array[index2];
      if (predicate(value, index2, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  function arrayPush2(array, values) {
    var index2 = -1, length = values.length, offset2 = array.length;
    while (++index2 < length) {
      array[offset2 + index2] = values[index2];
    }
    return array;
  }
  function arraySome2(array, predicate) {
    var index2 = -1, length = array == null ? 0 : array.length;
    while (++index2 < length) {
      if (predicate(array[index2], index2, array)) {
        return true;
      }
    }
    return false;
  }
  function baseTimes2(n, iteratee) {
    var index2 = -1, result = Array(n);
    while (++index2 < n) {
      result[index2] = iteratee(index2);
    }
    return result;
  }
  function baseUnary2(func) {
    return function(value) {
      return func(value);
    };
  }
  function cacheHas2(cache, key) {
    return cache.has(key);
  }
  function getValue2(object, key) {
    return object == null ? void 0 : object[key];
  }
  function mapToArray2(map) {
    var index2 = -1, result = Array(map.size);
    map.forEach(function(value, key) {
      result[++index2] = [key, value];
    });
    return result;
  }
  function overArg2(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  function setToArray2(set) {
    var index2 = -1, result = Array(set.size);
    set.forEach(function(value) {
      result[++index2] = value;
    });
    return result;
  }
  var arrayProto2 = Array.prototype, funcProto2 = Function.prototype, objectProto2 = Object.prototype;
  var coreJsData2 = root2["__core-js_shared__"];
  var funcToString2 = funcProto2.toString;
  var hasOwnProperty2 = objectProto2.hasOwnProperty;
  var maskSrcKey2 = function() {
    var uid = /[^.]+$/.exec(coreJsData2 && coreJsData2.keys && coreJsData2.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  var nativeObjectToString2 = objectProto2.toString;
  var reIsNative2 = RegExp(
    "^" + funcToString2.call(hasOwnProperty2).replace(reRegExpChar2, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  var Buffer3 = moduleExports2 ? root2.Buffer : void 0, Symbol2 = root2.Symbol, Uint8Array2 = root2.Uint8Array, propertyIsEnumerable2 = objectProto2.propertyIsEnumerable, splice2 = arrayProto2.splice, symToStringTag2 = Symbol2 ? Symbol2.toStringTag : void 0;
  var nativeGetSymbols2 = Object.getOwnPropertySymbols, nativeIsBuffer2 = Buffer3 ? Buffer3.isBuffer : void 0, nativeKeys2 = overArg2(Object.keys, Object);
  var DataView2 = getNative2(root2, "DataView"), Map2 = getNative2(root2, "Map"), Promise2 = getNative2(root2, "Promise"), Set2 = getNative2(root2, "Set"), WeakMap2 = getNative2(root2, "WeakMap"), nativeCreate2 = getNative2(Object, "create");
  var dataViewCtorString2 = toSource2(DataView2), mapCtorString2 = toSource2(Map2), promiseCtorString2 = toSource2(Promise2), setCtorString2 = toSource2(Set2), weakMapCtorString2 = toSource2(WeakMap2);
  var symbolProto2 = Symbol2 ? Symbol2.prototype : void 0, symbolValueOf2 = symbolProto2 ? symbolProto2.valueOf : void 0;
  function Hash2(entries) {
    var index2 = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index2 < length) {
      var entry = entries[index2];
      this.set(entry[0], entry[1]);
    }
  }
  function hashClear2() {
    this.__data__ = nativeCreate2 ? nativeCreate2(null) : {};
    this.size = 0;
  }
  function hashDelete2(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }
  function hashGet2(key) {
    var data = this.__data__;
    if (nativeCreate2) {
      var result = data[key];
      return result === HASH_UNDEFINED2 ? void 0 : result;
    }
    return hasOwnProperty2.call(data, key) ? data[key] : void 0;
  }
  function hashHas2(key) {
    var data = this.__data__;
    return nativeCreate2 ? data[key] !== void 0 : hasOwnProperty2.call(data, key);
  }
  function hashSet2(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate2 && value === void 0 ? HASH_UNDEFINED2 : value;
    return this;
  }
  Hash2.prototype.clear = hashClear2;
  Hash2.prototype["delete"] = hashDelete2;
  Hash2.prototype.get = hashGet2;
  Hash2.prototype.has = hashHas2;
  Hash2.prototype.set = hashSet2;
  function ListCache2(entries) {
    var index2 = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index2 < length) {
      var entry = entries[index2];
      this.set(entry[0], entry[1]);
    }
  }
  function listCacheClear2() {
    this.__data__ = [];
    this.size = 0;
  }
  function listCacheDelete2(key) {
    var data = this.__data__, index2 = assocIndexOf2(data, key);
    if (index2 < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index2 == lastIndex) {
      data.pop();
    } else {
      splice2.call(data, index2, 1);
    }
    --this.size;
    return true;
  }
  function listCacheGet2(key) {
    var data = this.__data__, index2 = assocIndexOf2(data, key);
    return index2 < 0 ? void 0 : data[index2][1];
  }
  function listCacheHas2(key) {
    return assocIndexOf2(this.__data__, key) > -1;
  }
  function listCacheSet2(key, value) {
    var data = this.__data__, index2 = assocIndexOf2(data, key);
    if (index2 < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index2][1] = value;
    }
    return this;
  }
  ListCache2.prototype.clear = listCacheClear2;
  ListCache2.prototype["delete"] = listCacheDelete2;
  ListCache2.prototype.get = listCacheGet2;
  ListCache2.prototype.has = listCacheHas2;
  ListCache2.prototype.set = listCacheSet2;
  function MapCache2(entries) {
    var index2 = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index2 < length) {
      var entry = entries[index2];
      this.set(entry[0], entry[1]);
    }
  }
  function mapCacheClear2() {
    this.size = 0;
    this.__data__ = {
      "hash": new Hash2(),
      "map": new (Map2 || ListCache2)(),
      "string": new Hash2()
    };
  }
  function mapCacheDelete2(key) {
    var result = getMapData2(this, key)["delete"](key);
    this.size -= result ? 1 : 0;
    return result;
  }
  function mapCacheGet2(key) {
    return getMapData2(this, key).get(key);
  }
  function mapCacheHas2(key) {
    return getMapData2(this, key).has(key);
  }
  function mapCacheSet2(key, value) {
    var data = getMapData2(this, key), size2 = data.size;
    data.set(key, value);
    this.size += data.size == size2 ? 0 : 1;
    return this;
  }
  MapCache2.prototype.clear = mapCacheClear2;
  MapCache2.prototype["delete"] = mapCacheDelete2;
  MapCache2.prototype.get = mapCacheGet2;
  MapCache2.prototype.has = mapCacheHas2;
  MapCache2.prototype.set = mapCacheSet2;
  function SetCache2(values) {
    var index2 = -1, length = values == null ? 0 : values.length;
    this.__data__ = new MapCache2();
    while (++index2 < length) {
      this.add(values[index2]);
    }
  }
  function setCacheAdd2(value) {
    this.__data__.set(value, HASH_UNDEFINED2);
    return this;
  }
  function setCacheHas2(value) {
    return this.__data__.has(value);
  }
  SetCache2.prototype.add = SetCache2.prototype.push = setCacheAdd2;
  SetCache2.prototype.has = setCacheHas2;
  function Stack2(entries) {
    var data = this.__data__ = new ListCache2(entries);
    this.size = data.size;
  }
  function stackClear2() {
    this.__data__ = new ListCache2();
    this.size = 0;
  }
  function stackDelete2(key) {
    var data = this.__data__, result = data["delete"](key);
    this.size = data.size;
    return result;
  }
  function stackGet2(key) {
    return this.__data__.get(key);
  }
  function stackHas2(key) {
    return this.__data__.has(key);
  }
  function stackSet2(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache2) {
      var pairs = data.__data__;
      if (!Map2 || pairs.length < LARGE_ARRAY_SIZE2 - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache2(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }
  Stack2.prototype.clear = stackClear2;
  Stack2.prototype["delete"] = stackDelete2;
  Stack2.prototype.get = stackGet2;
  Stack2.prototype.has = stackHas2;
  Stack2.prototype.set = stackSet2;
  function arrayLikeKeys2(value, inherited) {
    var isArr = isArray2(value), isArg = !isArr && isArguments2(value), isBuff = !isArr && !isArg && isBuffer2(value), isType = !isArr && !isArg && !isBuff && isTypedArray2(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes2(value.length, String) : [], length = result.length;
    for (var key in value) {
      if (hasOwnProperty2.call(value, key) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
      (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
      isIndex2(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }
  function assocIndexOf2(array, key) {
    var length = array.length;
    while (length--) {
      if (eq2(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  function baseGetAllKeys2(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray2(object) ? result : arrayPush2(result, symbolsFunc(object));
  }
  function baseGetTag2(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag2 : nullTag2;
    }
    return symToStringTag2 && symToStringTag2 in Object(value) ? getRawTag2(value) : objectToString2(value);
  }
  function baseIsArguments2(value) {
    return isObjectLike2(value) && baseGetTag2(value) == argsTag2;
  }
  function baseIsEqual2(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObjectLike2(value) && !isObjectLike2(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep2(value, other, bitmask, customizer, baseIsEqual2, stack);
  }
  function baseIsEqualDeep2(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray2(object), othIsArr = isArray2(other), objTag = objIsArr ? arrayTag2 : getTag2(object), othTag = othIsArr ? arrayTag2 : getTag2(other);
    objTag = objTag == argsTag2 ? objectTag2 : objTag;
    othTag = othTag == argsTag2 ? objectTag2 : othTag;
    var objIsObj = objTag == objectTag2, othIsObj = othTag == objectTag2, isSameTag = objTag == othTag;
    if (isSameTag && isBuffer2(object)) {
      if (!isBuffer2(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack2());
      return objIsArr || isTypedArray2(object) ? equalArrays2(object, other, bitmask, customizer, equalFunc, stack) : equalByTag2(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG2)) {
      var objIsWrapped = objIsObj && hasOwnProperty2.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty2.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack2());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack2());
    return equalObjects2(object, other, bitmask, customizer, equalFunc, stack);
  }
  function baseIsNative2(value) {
    if (!isObject2(value) || isMasked2(value)) {
      return false;
    }
    var pattern = isFunction2(value) ? reIsNative2 : reIsHostCtor2;
    return pattern.test(toSource2(value));
  }
  function baseIsTypedArray2(value) {
    return isObjectLike2(value) && isLength2(value.length) && !!typedArrayTags2[baseGetTag2(value)];
  }
  function baseKeys2(object) {
    if (!isPrototype2(object)) {
      return nativeKeys2(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty2.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  function equalArrays2(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG2, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var stacked = stack.get(array);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var index2 = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG2 ? new SetCache2() : void 0;
    stack.set(array, other);
    stack.set(other, array);
    while (++index2 < arrLength) {
      var arrValue = array[index2], othValue = other[index2];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index2, other, array, stack) : customizer(arrValue, othValue, index2, array, other, stack);
      }
      if (compared !== void 0) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      if (seen) {
        if (!arraySome2(other, function(othValue2, othIndex) {
          if (!cacheHas2(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
            return seen.push(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
        result = false;
        break;
      }
    }
    stack["delete"](array);
    stack["delete"](other);
    return result;
  }
  function equalByTag2(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag2:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;
      case arrayBufferTag2:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
          return false;
        }
        return true;
      case boolTag2:
      case dateTag2:
      case numberTag2:
        return eq2(+object, +other);
      case errorTag2:
        return object.name == other.name && object.message == other.message;
      case regexpTag2:
      case stringTag2:
        return object == other + "";
      case mapTag2:
        var convert = mapToArray2;
      case setTag2:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG2;
        convert || (convert = setToArray2);
        if (object.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG2;
        stack.set(object, other);
        var result = equalArrays2(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack["delete"](object);
        return result;
      case symbolTag2:
        if (symbolValueOf2) {
          return symbolValueOf2.call(object) == symbolValueOf2.call(other);
        }
    }
    return false;
  }
  function equalObjects2(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG2, objProps = getAllKeys2(object), objLength = objProps.length, othProps = getAllKeys2(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index2 = objLength;
    while (index2--) {
      var key = objProps[index2];
      if (!(isPartial ? key in other : hasOwnProperty2.call(other, key))) {
        return false;
      }
    }
    var stacked = stack.get(object);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;
    while (++index2 < objLength) {
      key = objProps[index2];
      var objValue = object[key], othValue = other[key];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
      }
      if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == "constructor");
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack["delete"](object);
    stack["delete"](other);
    return result;
  }
  function getAllKeys2(object) {
    return baseGetAllKeys2(object, keys2, getSymbols2);
  }
  function getMapData2(map, key) {
    var data = map.__data__;
    return isKeyable2(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  function getNative2(object, key) {
    var value = getValue2(object, key);
    return baseIsNative2(value) ? value : void 0;
  }
  function getRawTag2(value) {
    var isOwn = hasOwnProperty2.call(value, symToStringTag2), tag = value[symToStringTag2];
    try {
      value[symToStringTag2] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString2.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag2] = tag;
      } else {
        delete value[symToStringTag2];
      }
    }
    return result;
  }
  var getSymbols2 = !nativeGetSymbols2 ? stubArray2 : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter2(nativeGetSymbols2(object), function(symbol) {
      return propertyIsEnumerable2.call(object, symbol);
    });
  };
  var getTag2 = baseGetTag2;
  if (DataView2 && getTag2(new DataView2(new ArrayBuffer(1))) != dataViewTag2 || Map2 && getTag2(new Map2()) != mapTag2 || Promise2 && getTag2(Promise2.resolve()) != promiseTag2 || Set2 && getTag2(new Set2()) != setTag2 || WeakMap2 && getTag2(new WeakMap2()) != weakMapTag2) {
    getTag2 = function(value) {
      var result = baseGetTag2(value), Ctor = result == objectTag2 ? value.constructor : void 0, ctorString = Ctor ? toSource2(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString2:
            return dataViewTag2;
          case mapCtorString2:
            return mapTag2;
          case promiseCtorString2:
            return promiseTag2;
          case setCtorString2:
            return setTag2;
          case weakMapCtorString2:
            return weakMapTag2;
        }
      }
      return result;
    };
  }
  function isIndex2(value, length) {
    length = length == null ? MAX_SAFE_INTEGER2 : length;
    return !!length && (typeof value == "number" || reIsUint2.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  function isKeyable2(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  function isMasked2(func) {
    return !!maskSrcKey2 && maskSrcKey2 in func;
  }
  function isPrototype2(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto2;
    return value === proto;
  }
  function objectToString2(value) {
    return nativeObjectToString2.call(value);
  }
  function toSource2(func) {
    if (func != null) {
      try {
        return funcToString2.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  function eq2(value, other) {
    return value === other || value !== value && other !== other;
  }
  var isArguments2 = baseIsArguments2(/* @__PURE__ */ function() {
    return arguments;
  }()) ? baseIsArguments2 : function(value) {
    return isObjectLike2(value) && hasOwnProperty2.call(value, "callee") && !propertyIsEnumerable2.call(value, "callee");
  };
  var isArray2 = Array.isArray;
  function isArrayLike2(value) {
    return value != null && isLength2(value.length) && !isFunction2(value);
  }
  var isBuffer2 = nativeIsBuffer2 || stubFalse2;
  function isEqual2(value, other) {
    return baseIsEqual2(value, other);
  }
  function isFunction2(value) {
    if (!isObject2(value)) {
      return false;
    }
    var tag = baseGetTag2(value);
    return tag == funcTag2 || tag == genTag2 || tag == asyncTag2 || tag == proxyTag2;
  }
  function isLength2(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER2;
  }
  function isObject2(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  function isObjectLike2(value) {
    return value != null && typeof value == "object";
  }
  var isTypedArray2 = nodeIsTypedArray2 ? baseUnary2(nodeIsTypedArray2) : baseIsTypedArray2;
  function keys2(object) {
    return isArrayLike2(object) ? arrayLikeKeys2(object) : baseKeys2(object);
  }
  function stubArray2() {
    return [];
  }
  function stubFalse2() {
    return false;
  }
  module2.exports = isEqual2;
})(lodash_isequal, lodash_isequal.exports);
var lodash_isequalExports = lodash_isequal.exports;
var AttributeMap$1 = {};
Object.defineProperty(AttributeMap$1, "__esModule", { value: true });
const cloneDeep = lodash_clonedeepExports;
const isEqual = lodash_isequalExports;
var AttributeMap;
(function(AttributeMap2) {
  function compose(a = {}, b = {}, keepNull = false) {
    if (typeof a !== "object") {
      a = {};
    }
    if (typeof b !== "object") {
      b = {};
    }
    let attributes = cloneDeep(b);
    if (!keepNull) {
      attributes = Object.keys(attributes).reduce((copy, key) => {
        if (attributes[key] != null) {
          copy[key] = attributes[key];
        }
        return copy;
      }, {});
    }
    for (const key in a) {
      if (a[key] !== void 0 && b[key] === void 0) {
        attributes[key] = a[key];
      }
    }
    return Object.keys(attributes).length > 0 ? attributes : void 0;
  }
  AttributeMap2.compose = compose;
  function diff2(a = {}, b = {}) {
    if (typeof a !== "object") {
      a = {};
    }
    if (typeof b !== "object") {
      b = {};
    }
    const attributes = Object.keys(a).concat(Object.keys(b)).reduce((attrs, key) => {
      if (!isEqual(a[key], b[key])) {
        attrs[key] = b[key] === void 0 ? null : b[key];
      }
      return attrs;
    }, {});
    return Object.keys(attributes).length > 0 ? attributes : void 0;
  }
  AttributeMap2.diff = diff2;
  function invert(attr = {}, base = {}) {
    attr = attr || {};
    const baseInverted = Object.keys(base).reduce((memo, key) => {
      if (base[key] !== attr[key] && attr[key] !== void 0) {
        memo[key] = base[key];
      }
      return memo;
    }, {});
    return Object.keys(attr).reduce((memo, key) => {
      if (attr[key] !== base[key] && base[key] === void 0) {
        memo[key] = null;
      }
      return memo;
    }, baseInverted);
  }
  AttributeMap2.invert = invert;
  function transform(a, b, priority = false) {
    if (typeof a !== "object") {
      return b;
    }
    if (typeof b !== "object") {
      return void 0;
    }
    if (!priority) {
      return b;
    }
    const attributes = Object.keys(b).reduce((attrs, key) => {
      if (a[key] === void 0) {
        attrs[key] = b[key];
      }
      return attrs;
    }, {});
    return Object.keys(attributes).length > 0 ? attributes : void 0;
  }
  AttributeMap2.transform = transform;
})(AttributeMap || (AttributeMap = {}));
AttributeMap$1.default = AttributeMap;
var Op$1 = {};
Object.defineProperty(Op$1, "__esModule", { value: true });
var Op;
(function(Op2) {
  function length(op) {
    if (typeof op.delete === "number") {
      return op.delete;
    } else if (typeof op.retain === "number") {
      return op.retain;
    } else if (typeof op.retain === "object" && op.retain !== null) {
      return 1;
    } else {
      return typeof op.insert === "string" ? op.insert.length : 1;
    }
  }
  Op2.length = length;
})(Op || (Op = {}));
Op$1.default = Op;
var OpIterator = {};
Object.defineProperty(OpIterator, "__esModule", { value: true });
const Op_1 = Op$1;
class Iterator {
  constructor(ops) {
    this.ops = ops;
    this.index = 0;
    this.offset = 0;
  }
  hasNext() {
    return this.peekLength() < Infinity;
  }
  next(length) {
    if (!length) {
      length = Infinity;
    }
    const nextOp = this.ops[this.index];
    if (nextOp) {
      const offset2 = this.offset;
      const opLength = Op_1.default.length(nextOp);
      if (length >= opLength - offset2) {
        length = opLength - offset2;
        this.index += 1;
        this.offset = 0;
      } else {
        this.offset += length;
      }
      if (typeof nextOp.delete === "number") {
        return { delete: length };
      } else {
        const retOp = {};
        if (nextOp.attributes) {
          retOp.attributes = nextOp.attributes;
        }
        if (typeof nextOp.retain === "number") {
          retOp.retain = length;
        } else if (typeof nextOp.retain === "object" && nextOp.retain !== null) {
          retOp.retain = nextOp.retain;
        } else if (typeof nextOp.insert === "string") {
          retOp.insert = nextOp.insert.substr(offset2, length);
        } else {
          retOp.insert = nextOp.insert;
        }
        return retOp;
      }
    } else {
      return { retain: Infinity };
    }
  }
  peek() {
    return this.ops[this.index];
  }
  peekLength() {
    if (this.ops[this.index]) {
      return Op_1.default.length(this.ops[this.index]) - this.offset;
    } else {
      return Infinity;
    }
  }
  peekType() {
    const op = this.ops[this.index];
    if (op) {
      if (typeof op.delete === "number") {
        return "delete";
      } else if (typeof op.retain === "number" || typeof op.retain === "object" && op.retain !== null) {
        return "retain";
      } else {
        return "insert";
      }
    }
    return "retain";
  }
  rest() {
    if (!this.hasNext()) {
      return [];
    } else if (this.offset === 0) {
      return this.ops.slice(this.index);
    } else {
      const offset2 = this.offset;
      const index2 = this.index;
      const next = this.next();
      const rest = this.ops.slice(this.index);
      this.offset = offset2;
      this.index = index2;
      return [next].concat(rest);
    }
  }
}
OpIterator.default = Iterator;
(function(module2, exports$1) {
  Object.defineProperty(exports$1, "__esModule", { value: true });
  exports$1.AttributeMap = exports$1.OpIterator = exports$1.Op = void 0;
  const diff2 = diff_1;
  const cloneDeep2 = lodash_clonedeepExports;
  const isEqual2 = lodash_isequalExports;
  const AttributeMap_1 = AttributeMap$1;
  exports$1.AttributeMap = AttributeMap_1.default;
  const Op_12 = Op$1;
  exports$1.Op = Op_12.default;
  const OpIterator_1 = OpIterator;
  exports$1.OpIterator = OpIterator_1.default;
  const NULL_CHARACTER = String.fromCharCode(0);
  const getEmbedTypeAndData = (a, b) => {
    if (typeof a !== "object" || a === null) {
      throw new Error(`cannot retain a ${typeof a}`);
    }
    if (typeof b !== "object" || b === null) {
      throw new Error(`cannot retain a ${typeof b}`);
    }
    const embedType = Object.keys(a)[0];
    if (!embedType || embedType !== Object.keys(b)[0]) {
      throw new Error(`embed types not matched: ${embedType} != ${Object.keys(b)[0]}`);
    }
    return [embedType, a[embedType], b[embedType]];
  };
  class Delta2 {
    constructor(ops) {
      if (Array.isArray(ops)) {
        this.ops = ops;
      } else if (ops != null && Array.isArray(ops.ops)) {
        this.ops = ops.ops;
      } else {
        this.ops = [];
      }
    }
    static registerEmbed(embedType, handler) {
      this.handlers[embedType] = handler;
    }
    static unregisterEmbed(embedType) {
      delete this.handlers[embedType];
    }
    static getHandler(embedType) {
      const handler = this.handlers[embedType];
      if (!handler) {
        throw new Error(`no handlers for embed type "${embedType}"`);
      }
      return handler;
    }
    insert(arg, attributes) {
      const newOp = {};
      if (typeof arg === "string" && arg.length === 0) {
        return this;
      }
      newOp.insert = arg;
      if (attributes != null && typeof attributes === "object" && Object.keys(attributes).length > 0) {
        newOp.attributes = attributes;
      }
      return this.push(newOp);
    }
    delete(length) {
      if (length <= 0) {
        return this;
      }
      return this.push({ delete: length });
    }
    retain(length, attributes) {
      if (typeof length === "number" && length <= 0) {
        return this;
      }
      const newOp = { retain: length };
      if (attributes != null && typeof attributes === "object" && Object.keys(attributes).length > 0) {
        newOp.attributes = attributes;
      }
      return this.push(newOp);
    }
    push(newOp) {
      let index2 = this.ops.length;
      let lastOp = this.ops[index2 - 1];
      newOp = cloneDeep2(newOp);
      if (typeof lastOp === "object") {
        if (typeof newOp.delete === "number" && typeof lastOp.delete === "number") {
          this.ops[index2 - 1] = { delete: lastOp.delete + newOp.delete };
          return this;
        }
        if (typeof lastOp.delete === "number" && newOp.insert != null) {
          index2 -= 1;
          lastOp = this.ops[index2 - 1];
          if (typeof lastOp !== "object") {
            this.ops.unshift(newOp);
            return this;
          }
        }
        if (isEqual2(newOp.attributes, lastOp.attributes)) {
          if (typeof newOp.insert === "string" && typeof lastOp.insert === "string") {
            this.ops[index2 - 1] = { insert: lastOp.insert + newOp.insert };
            if (typeof newOp.attributes === "object") {
              this.ops[index2 - 1].attributes = newOp.attributes;
            }
            return this;
          } else if (typeof newOp.retain === "number" && typeof lastOp.retain === "number") {
            this.ops[index2 - 1] = { retain: lastOp.retain + newOp.retain };
            if (typeof newOp.attributes === "object") {
              this.ops[index2 - 1].attributes = newOp.attributes;
            }
            return this;
          }
        }
      }
      if (index2 === this.ops.length) {
        this.ops.push(newOp);
      } else {
        this.ops.splice(index2, 0, newOp);
      }
      return this;
    }
    chop() {
      const lastOp = this.ops[this.ops.length - 1];
      if (lastOp && typeof lastOp.retain === "number" && !lastOp.attributes) {
        this.ops.pop();
      }
      return this;
    }
    filter(predicate) {
      return this.ops.filter(predicate);
    }
    forEach(predicate) {
      this.ops.forEach(predicate);
    }
    map(predicate) {
      return this.ops.map(predicate);
    }
    partition(predicate) {
      const passed = [];
      const failed = [];
      this.forEach((op) => {
        const target = predicate(op) ? passed : failed;
        target.push(op);
      });
      return [passed, failed];
    }
    reduce(predicate, initialValue) {
      return this.ops.reduce(predicate, initialValue);
    }
    changeLength() {
      return this.reduce((length, elem) => {
        if (elem.insert) {
          return length + Op_12.default.length(elem);
        } else if (elem.delete) {
          return length - elem.delete;
        }
        return length;
      }, 0);
    }
    length() {
      return this.reduce((length, elem) => {
        return length + Op_12.default.length(elem);
      }, 0);
    }
    slice(start = 0, end = Infinity) {
      const ops = [];
      const iter = new OpIterator_1.default(this.ops);
      let index2 = 0;
      while (index2 < end && iter.hasNext()) {
        let nextOp;
        if (index2 < start) {
          nextOp = iter.next(start - index2);
        } else {
          nextOp = iter.next(end - index2);
          ops.push(nextOp);
        }
        index2 += Op_12.default.length(nextOp);
      }
      return new Delta2(ops);
    }
    compose(other) {
      const thisIter = new OpIterator_1.default(this.ops);
      const otherIter = new OpIterator_1.default(other.ops);
      const ops = [];
      const firstOther = otherIter.peek();
      if (firstOther != null && typeof firstOther.retain === "number" && firstOther.attributes == null) {
        let firstLeft = firstOther.retain;
        while (thisIter.peekType() === "insert" && thisIter.peekLength() <= firstLeft) {
          firstLeft -= thisIter.peekLength();
          ops.push(thisIter.next());
        }
        if (firstOther.retain - firstLeft > 0) {
          otherIter.next(firstOther.retain - firstLeft);
        }
      }
      const delta = new Delta2(ops);
      while (thisIter.hasNext() || otherIter.hasNext()) {
        if (otherIter.peekType() === "insert") {
          delta.push(otherIter.next());
        } else if (thisIter.peekType() === "delete") {
          delta.push(thisIter.next());
        } else {
          const length = Math.min(thisIter.peekLength(), otherIter.peekLength());
          const thisOp = thisIter.next(length);
          const otherOp = otherIter.next(length);
          if (otherOp.retain) {
            const newOp = {};
            if (typeof thisOp.retain === "number") {
              newOp.retain = typeof otherOp.retain === "number" ? length : otherOp.retain;
            } else {
              if (typeof otherOp.retain === "number") {
                if (thisOp.retain == null) {
                  newOp.insert = thisOp.insert;
                } else {
                  newOp.retain = thisOp.retain;
                }
              } else {
                const action = thisOp.retain == null ? "insert" : "retain";
                const [embedType, thisData, otherData] = getEmbedTypeAndData(thisOp[action], otherOp.retain);
                const handler = Delta2.getHandler(embedType);
                newOp[action] = {
                  [embedType]: handler.compose(thisData, otherData, action === "retain")
                };
              }
            }
            const attributes = AttributeMap_1.default.compose(thisOp.attributes, otherOp.attributes, typeof thisOp.retain === "number");
            if (attributes) {
              newOp.attributes = attributes;
            }
            delta.push(newOp);
            if (!otherIter.hasNext() && isEqual2(delta.ops[delta.ops.length - 1], newOp)) {
              const rest = new Delta2(thisIter.rest());
              return delta.concat(rest).chop();
            }
          } else if (typeof otherOp.delete === "number" && (typeof thisOp.retain === "number" || typeof thisOp.retain === "object" && thisOp.retain !== null)) {
            delta.push(otherOp);
          }
        }
      }
      return delta.chop();
    }
    concat(other) {
      const delta = new Delta2(this.ops.slice());
      if (other.ops.length > 0) {
        delta.push(other.ops[0]);
        delta.ops = delta.ops.concat(other.ops.slice(1));
      }
      return delta;
    }
    diff(other, cursor) {
      if (this.ops === other.ops) {
        return new Delta2();
      }
      const strings = [this, other].map((delta) => {
        return delta.map((op) => {
          if (op.insert != null) {
            return typeof op.insert === "string" ? op.insert : NULL_CHARACTER;
          }
          const prep = delta === other ? "on" : "with";
          throw new Error("diff() called " + prep + " non-document");
        }).join("");
      });
      const retDelta = new Delta2();
      const diffResult = diff2(strings[0], strings[1], cursor, true);
      const thisIter = new OpIterator_1.default(this.ops);
      const otherIter = new OpIterator_1.default(other.ops);
      diffResult.forEach((component) => {
        let length = component[1].length;
        while (length > 0) {
          let opLength = 0;
          switch (component[0]) {
            case diff2.INSERT:
              opLength = Math.min(otherIter.peekLength(), length);
              retDelta.push(otherIter.next(opLength));
              break;
            case diff2.DELETE:
              opLength = Math.min(length, thisIter.peekLength());
              thisIter.next(opLength);
              retDelta.delete(opLength);
              break;
            case diff2.EQUAL:
              opLength = Math.min(thisIter.peekLength(), otherIter.peekLength(), length);
              const thisOp = thisIter.next(opLength);
              const otherOp = otherIter.next(opLength);
              if (isEqual2(thisOp.insert, otherOp.insert)) {
                retDelta.retain(opLength, AttributeMap_1.default.diff(thisOp.attributes, otherOp.attributes));
              } else {
                retDelta.push(otherOp).delete(opLength);
              }
              break;
          }
          length -= opLength;
        }
      });
      return retDelta.chop();
    }
    eachLine(predicate, newline = "\n") {
      const iter = new OpIterator_1.default(this.ops);
      let line = new Delta2();
      let i = 0;
      while (iter.hasNext()) {
        if (iter.peekType() !== "insert") {
          return;
        }
        const thisOp = iter.peek();
        const start = Op_12.default.length(thisOp) - iter.peekLength();
        const index2 = typeof thisOp.insert === "string" ? thisOp.insert.indexOf(newline, start) - start : -1;
        if (index2 < 0) {
          line.push(iter.next());
        } else if (index2 > 0) {
          line.push(iter.next(index2));
        } else {
          if (predicate(line, iter.next(1).attributes || {}, i) === false) {
            return;
          }
          i += 1;
          line = new Delta2();
        }
      }
      if (line.length() > 0) {
        predicate(line, {}, i);
      }
    }
    invert(base) {
      const inverted = new Delta2();
      this.reduce((baseIndex, op) => {
        if (op.insert) {
          inverted.delete(Op_12.default.length(op));
        } else if (typeof op.retain === "number" && op.attributes == null) {
          inverted.retain(op.retain);
          return baseIndex + op.retain;
        } else if (op.delete || typeof op.retain === "number") {
          const length = op.delete || op.retain;
          const slice = base.slice(baseIndex, baseIndex + length);
          slice.forEach((baseOp) => {
            if (op.delete) {
              inverted.push(baseOp);
            } else if (op.retain && op.attributes) {
              inverted.retain(Op_12.default.length(baseOp), AttributeMap_1.default.invert(op.attributes, baseOp.attributes));
            }
          });
          return baseIndex + length;
        } else if (typeof op.retain === "object" && op.retain !== null) {
          const slice = base.slice(baseIndex, baseIndex + 1);
          const baseOp = new OpIterator_1.default(slice.ops).next();
          const [embedType, opData, baseOpData] = getEmbedTypeAndData(op.retain, baseOp.insert);
          const handler = Delta2.getHandler(embedType);
          inverted.retain({ [embedType]: handler.invert(opData, baseOpData) }, AttributeMap_1.default.invert(op.attributes, baseOp.attributes));
          return baseIndex + 1;
        }
        return baseIndex;
      }, 0);
      return inverted.chop();
    }
    transform(arg, priority = false) {
      priority = !!priority;
      if (typeof arg === "number") {
        return this.transformPosition(arg, priority);
      }
      const other = arg;
      const thisIter = new OpIterator_1.default(this.ops);
      const otherIter = new OpIterator_1.default(other.ops);
      const delta = new Delta2();
      while (thisIter.hasNext() || otherIter.hasNext()) {
        if (thisIter.peekType() === "insert" && (priority || otherIter.peekType() !== "insert")) {
          delta.retain(Op_12.default.length(thisIter.next()));
        } else if (otherIter.peekType() === "insert") {
          delta.push(otherIter.next());
        } else {
          const length = Math.min(thisIter.peekLength(), otherIter.peekLength());
          const thisOp = thisIter.next(length);
          const otherOp = otherIter.next(length);
          if (thisOp.delete) {
            continue;
          } else if (otherOp.delete) {
            delta.push(otherOp);
          } else {
            const thisData = thisOp.retain;
            const otherData = otherOp.retain;
            let transformedData = typeof otherData === "object" && otherData !== null ? otherData : length;
            if (typeof thisData === "object" && thisData !== null && typeof otherData === "object" && otherData !== null) {
              const embedType = Object.keys(thisData)[0];
              if (embedType === Object.keys(otherData)[0]) {
                const handler = Delta2.getHandler(embedType);
                if (handler) {
                  transformedData = {
                    [embedType]: handler.transform(thisData[embedType], otherData[embedType], priority)
                  };
                }
              }
            }
            delta.retain(transformedData, AttributeMap_1.default.transform(thisOp.attributes, otherOp.attributes, priority));
          }
        }
      }
      return delta.chop();
    }
    transformPosition(index2, priority = false) {
      priority = !!priority;
      const thisIter = new OpIterator_1.default(this.ops);
      let offset2 = 0;
      while (thisIter.hasNext() && offset2 <= index2) {
        const length = thisIter.peekLength();
        const nextType = thisIter.peekType();
        thisIter.next();
        if (nextType === "delete") {
          index2 -= Math.min(length, index2 - offset2);
          continue;
        } else if (nextType === "insert" && (offset2 < index2 || !priority)) {
          index2 += length;
        }
        offset2 += length;
      }
      return index2;
    }
  }
  Delta2.Op = Op_12.default;
  Delta2.OpIterator = OpIterator_1.default;
  Delta2.AttributeMap = AttributeMap_1.default;
  Delta2.handlers = {};
  exports$1.default = Delta2;
  {
    module2.exports = Delta2;
    module2.exports.default = Delta2;
  }
})(Delta$1, Delta$1.exports);
var DeltaExports = Delta$1.exports;
const Delta = /* @__PURE__ */ getDefaultExportFromCjs(DeltaExports);
class Break extends EmbedBlot$1 {
  static value() {
    return void 0;
  }
  optimize() {
    if (this.prev || this.next) {
      this.remove();
    }
  }
  length() {
    return 0;
  }
  value() {
    return "";
  }
}
Break.blotName = "break";
Break.tagName = "BR";
let Text$1 = class Text2 extends TextBlot$1 {
};
const entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function escapeText(text) {
  return text.replace(/[&<>"']/g, (s) => entityMap[s]);
}
const _Inline = class _Inline extends InlineBlot$1 {
  static compare(self2, other) {
    const selfIndex = _Inline.order.indexOf(self2);
    const otherIndex = _Inline.order.indexOf(other);
    if (selfIndex >= 0 || otherIndex >= 0) {
      return selfIndex - otherIndex;
    }
    if (self2 === other) {
      return 0;
    }
    if (self2 < other) {
      return -1;
    }
    return 1;
  }
  formatAt(index2, length, name, value) {
    if (_Inline.compare(this.statics.blotName, name) < 0 && this.scroll.query(name, Scope.BLOT)) {
      const blot = this.isolate(index2, length);
      if (value) {
        blot.wrap(name, value);
      }
    } else {
      super.formatAt(index2, length, name, value);
    }
  }
  optimize(context) {
    super.optimize(context);
    if (this.parent instanceof _Inline && _Inline.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
      const parent = this.parent.isolate(this.offset(), this.length());
      this.moveChildren(parent);
      parent.wrap(this);
    }
  }
};
__publicField(_Inline, "allowedChildren", [_Inline, Break, EmbedBlot$1, Text$1]);
// Lower index means deeper in the DOM tree, since not found (-1) is for embeds
__publicField(_Inline, "order", [
  "cursor",
  "inline",
  // Must be lower
  "link",
  // Chrome wants <a> to be lower
  "underline",
  "strike",
  "italic",
  "bold",
  "script",
  "code"
  // Must be higher
]);
let Inline = _Inline;
const NEWLINE_LENGTH = 1;
class Block extends BlockBlot$1 {
  constructor() {
    super(...arguments);
    __publicField(this, "cache", {});
  }
  delta() {
    if (this.cache.delta == null) {
      this.cache.delta = blockDelta(this);
    }
    return this.cache.delta;
  }
  deleteAt(index2, length) {
    super.deleteAt(index2, length);
    this.cache = {};
  }
  formatAt(index2, length, name, value) {
    if (length <= 0) return;
    if (this.scroll.query(name, Scope.BLOCK)) {
      if (index2 + length === this.length()) {
        this.format(name, value);
      }
    } else {
      super.formatAt(index2, Math.min(length, this.length() - index2 - 1), name, value);
    }
    this.cache = {};
  }
  insertAt(index2, value, def) {
    if (def != null) {
      super.insertAt(index2, value, def);
      this.cache = {};
      return;
    }
    if (value.length === 0) return;
    const lines = value.split("\n");
    const text = lines.shift();
    if (text.length > 0) {
      if (index2 < this.length() - 1 || this.children.tail == null) {
        super.insertAt(Math.min(index2, this.length() - 1), text);
      } else {
        this.children.tail.insertAt(this.children.tail.length(), text);
      }
      this.cache = {};
    }
    let block = this;
    lines.reduce((lineIndex, line) => {
      block = block.split(lineIndex, true);
      block.insertAt(0, line);
      return line.length;
    }, index2 + text.length);
  }
  insertBefore(blot, ref) {
    const {
      head
    } = this.children;
    super.insertBefore(blot, ref);
    if (head instanceof Break) {
      head.remove();
    }
    this.cache = {};
  }
  length() {
    if (this.cache.length == null) {
      this.cache.length = super.length() + NEWLINE_LENGTH;
    }
    return this.cache.length;
  }
  moveChildren(target, ref) {
    super.moveChildren(target, ref);
    this.cache = {};
  }
  optimize(context) {
    super.optimize(context);
    this.cache = {};
  }
  path(index2) {
    return super.path(index2, true);
  }
  removeChild(child) {
    super.removeChild(child);
    this.cache = {};
  }
  split(index2) {
    let force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    if (force && (index2 === 0 || index2 >= this.length() - NEWLINE_LENGTH)) {
      const clone = this.clone();
      if (index2 === 0) {
        this.parent.insertBefore(clone, this);
        return this;
      }
      this.parent.insertBefore(clone, this.next);
      return clone;
    }
    const next = super.split(index2, force);
    this.cache = {};
    return next;
  }
}
Block.blotName = "block";
Block.tagName = "P";
Block.defaultChild = Break;
Block.allowedChildren = [Break, Inline, EmbedBlot$1, Text$1];
class BlockEmbed extends EmbedBlot$1 {
  attach() {
    super.attach();
    this.attributes = new AttributorStore$1(this.domNode);
  }
  delta() {
    return new Delta().insert(this.value(), {
      ...this.formats(),
      ...this.attributes.values()
    });
  }
  format(name, value) {
    const attribute = this.scroll.query(name, Scope.BLOCK_ATTRIBUTE);
    if (attribute != null) {
      this.attributes.attribute(attribute, value);
    }
  }
  formatAt(index2, length, name, value) {
    this.format(name, value);
  }
  insertAt(index2, value, def) {
    if (def != null) {
      super.insertAt(index2, value, def);
      return;
    }
    const lines = value.split("\n");
    const text = lines.pop();
    const blocks = lines.map((line) => {
      const block = this.scroll.create(Block.blotName);
      block.insertAt(0, line);
      return block;
    });
    const ref = this.split(index2);
    blocks.forEach((block) => {
      this.parent.insertBefore(block, ref);
    });
    if (text) {
      this.parent.insertBefore(this.scroll.create("text", text), ref);
    }
  }
}
BlockEmbed.scope = Scope.BLOCK_BLOT;
function blockDelta(blot) {
  let filter = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
  return blot.descendants(LeafBlot$1).reduce((delta, leaf) => {
    if (leaf.length() === 0) {
      return delta;
    }
    return delta.insert(leaf.value(), bubbleFormats(leaf, {}, filter));
  }, new Delta()).insert("\n", bubbleFormats(blot));
}
function bubbleFormats(blot) {
  let formats = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  let filter = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
  if (blot == null) return formats;
  if ("formats" in blot && typeof blot.formats === "function") {
    formats = {
      ...formats,
      ...blot.formats()
    };
    if (filter) {
      delete formats["code-token"];
    }
  }
  if (blot.parent == null || blot.parent.statics.blotName === "scroll" || blot.parent.statics.scope !== blot.statics.scope) {
    return formats;
  }
  return bubbleFormats(blot.parent, formats, filter);
}
const _Cursor = class _Cursor extends EmbedBlot$1 {
  // Zero width no break space
  static value() {
    return void 0;
  }
  constructor(scroll, domNode, selection) {
    super(scroll, domNode);
    this.selection = selection;
    this.textNode = document.createTextNode(_Cursor.CONTENTS);
    this.domNode.appendChild(this.textNode);
    this.savedLength = 0;
  }
  detach() {
    if (this.parent != null) this.parent.removeChild(this);
  }
  format(name, value) {
    if (this.savedLength !== 0) {
      super.format(name, value);
      return;
    }
    let target = this;
    let index2 = 0;
    while (target != null && target.statics.scope !== Scope.BLOCK_BLOT) {
      index2 += target.offset(target.parent);
      target = target.parent;
    }
    if (target != null) {
      this.savedLength = _Cursor.CONTENTS.length;
      target.optimize();
      target.formatAt(index2, _Cursor.CONTENTS.length, name, value);
      this.savedLength = 0;
    }
  }
  index(node, offset2) {
    if (node === this.textNode) return 0;
    return super.index(node, offset2);
  }
  length() {
    return this.savedLength;
  }
  position() {
    return [this.textNode, this.textNode.data.length];
  }
  remove() {
    super.remove();
    this.parent = null;
  }
  restore() {
    if (this.selection.composing || this.parent == null) return null;
    const range = this.selection.getNativeRange();
    while (this.domNode.lastChild != null && this.domNode.lastChild !== this.textNode) {
      this.domNode.parentNode.insertBefore(this.domNode.lastChild, this.domNode);
    }
    const prevTextBlot = this.prev instanceof Text$1 ? this.prev : null;
    const prevTextLength = prevTextBlot ? prevTextBlot.length() : 0;
    const nextTextBlot = this.next instanceof Text$1 ? this.next : null;
    const nextText = nextTextBlot ? nextTextBlot.text : "";
    const {
      textNode
    } = this;
    const newText = textNode.data.split(_Cursor.CONTENTS).join("");
    textNode.data = _Cursor.CONTENTS;
    let mergedTextBlot;
    if (prevTextBlot) {
      mergedTextBlot = prevTextBlot;
      if (newText || nextTextBlot) {
        prevTextBlot.insertAt(prevTextBlot.length(), newText + nextText);
        if (nextTextBlot) {
          nextTextBlot.remove();
        }
      }
    } else if (nextTextBlot) {
      mergedTextBlot = nextTextBlot;
      nextTextBlot.insertAt(0, newText);
    } else {
      const newTextNode = document.createTextNode(newText);
      mergedTextBlot = this.scroll.create(newTextNode);
      this.parent.insertBefore(mergedTextBlot, this);
    }
    this.remove();
    if (range) {
      const remapOffset = (node, offset2) => {
        if (prevTextBlot && node === prevTextBlot.domNode) {
          return offset2;
        }
        if (node === textNode) {
          return prevTextLength + offset2 - 1;
        }
        if (nextTextBlot && node === nextTextBlot.domNode) {
          return prevTextLength + newText.length + offset2;
        }
        return null;
      };
      const start = remapOffset(range.start.node, range.start.offset);
      const end = remapOffset(range.end.node, range.end.offset);
      if (start !== null && end !== null) {
        return {
          startNode: mergedTextBlot.domNode,
          startOffset: start,
          endNode: mergedTextBlot.domNode,
          endOffset: end
        };
      }
    }
    return null;
  }
  update(mutations, context) {
    if (mutations.some((mutation) => {
      return mutation.type === "characterData" && mutation.target === this.textNode;
    })) {
      const range = this.restore();
      if (range) context.range = range;
    }
  }
  // Avoid .ql-cursor being a descendant of `<a/>`.
  // The reason is Safari pushes down `<a/>` on text insertion.
  // That will cause DOM nodes not sync with the model.
  //
  // For example ({I} is the caret), given the markup:
  //    <a><span class="ql-cursor">\uFEFF{I}</span></a>
  // When typing a char "x", `<a/>` will be pushed down inside the `<span>` first:
  //    <span class="ql-cursor"><a>\uFEFF{I}</a></span>
  // And then "x" will be inserted after `<a/>`:
  //    <span class="ql-cursor"><a>\uFEFF</a>d{I}</span>
  optimize(context) {
    super.optimize(context);
    let {
      parent
    } = this;
    while (parent) {
      if (parent.domNode.tagName === "A") {
        this.savedLength = _Cursor.CONTENTS.length;
        parent.isolate(this.offset(parent), this.length()).unwrap();
        this.savedLength = 0;
        break;
      }
      parent = parent.parent;
    }
  }
  value() {
    return "";
  }
};
__publicField(_Cursor, "blotName", "cursor");
__publicField(_Cursor, "className", "ql-cursor");
__publicField(_Cursor, "tagName", "span");
__publicField(_Cursor, "CONTENTS", "\uFEFF");
let Cursor = _Cursor;
var eventemitter3 = { exports: {} };
(function(module2) {
  var has = Object.prototype.hasOwnProperty, prefix = "~";
  function Events() {
  }
  if (Object.create) {
    Events.prototype = /* @__PURE__ */ Object.create(null);
    if (!new Events().__proto__) prefix = false;
  }
  function EE(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
  }
  function addListener(emitter, event, fn, context, once) {
    if (typeof fn !== "function") {
      throw new TypeError("The listener must be a function");
    }
    var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
    if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
    else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
    else emitter._events[evt] = [emitter._events[evt], listener];
    return emitter;
  }
  function clearEvent(emitter, evt) {
    if (--emitter._eventsCount === 0) emitter._events = new Events();
    else delete emitter._events[evt];
  }
  function EventEmitter2() {
    this._events = new Events();
    this._eventsCount = 0;
  }
  EventEmitter2.prototype.eventNames = function eventNames() {
    var names = [], events, name;
    if (this._eventsCount === 0) return names;
    for (name in events = this._events) {
      if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
    }
    if (Object.getOwnPropertySymbols) {
      return names.concat(Object.getOwnPropertySymbols(events));
    }
    return names;
  };
  EventEmitter2.prototype.listeners = function listeners(event) {
    var evt = prefix ? prefix + event : event, handlers = this._events[evt];
    if (!handlers) return [];
    if (handlers.fn) return [handlers.fn];
    for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
      ee[i] = handlers[i].fn;
    }
    return ee;
  };
  EventEmitter2.prototype.listenerCount = function listenerCount(event) {
    var evt = prefix ? prefix + event : event, listeners = this._events[evt];
    if (!listeners) return 0;
    if (listeners.fn) return 1;
    return listeners.length;
  };
  EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt]) return false;
    var listeners = this._events[evt], len = arguments.length, args, i;
    if (listeners.fn) {
      if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
      switch (len) {
        case 1:
          return listeners.fn.call(listeners.context), true;
        case 2:
          return listeners.fn.call(listeners.context, a1), true;
        case 3:
          return listeners.fn.call(listeners.context, a1, a2), true;
        case 4:
          return listeners.fn.call(listeners.context, a1, a2, a3), true;
        case 5:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
        case 6:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
      }
      for (i = 1, args = new Array(len - 1); i < len; i++) {
        args[i - 1] = arguments[i];
      }
      listeners.fn.apply(listeners.context, args);
    } else {
      var length = listeners.length, j;
      for (i = 0; i < length; i++) {
        if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
        switch (len) {
          case 1:
            listeners[i].fn.call(listeners[i].context);
            break;
          case 2:
            listeners[i].fn.call(listeners[i].context, a1);
            break;
          case 3:
            listeners[i].fn.call(listeners[i].context, a1, a2);
            break;
          case 4:
            listeners[i].fn.call(listeners[i].context, a1, a2, a3);
            break;
          default:
            if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
              args[j - 1] = arguments[j];
            }
            listeners[i].fn.apply(listeners[i].context, args);
        }
      }
    }
    return true;
  };
  EventEmitter2.prototype.on = function on(event, fn, context) {
    return addListener(this, event, fn, context, false);
  };
  EventEmitter2.prototype.once = function once(event, fn, context) {
    return addListener(this, event, fn, context, true);
  };
  EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt]) return this;
    if (!fn) {
      clearEvent(this, evt);
      return this;
    }
    var listeners = this._events[evt];
    if (listeners.fn) {
      if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
        clearEvent(this, evt);
      }
    } else {
      for (var i = 0, events = [], length = listeners.length; i < length; i++) {
        if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
          events.push(listeners[i]);
        }
      }
      if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
      else clearEvent(this, evt);
    }
    return this;
  };
  EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;
    if (event) {
      evt = prefix ? prefix + event : event;
      if (this._events[evt]) clearEvent(this, evt);
    } else {
      this._events = new Events();
      this._eventsCount = 0;
    }
    return this;
  };
  EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
  EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
  EventEmitter2.prefixed = prefix;
  EventEmitter2.EventEmitter = EventEmitter2;
  {
    module2.exports = EventEmitter2;
  }
})(eventemitter3);
var eventemitter3Exports = eventemitter3.exports;
const EventEmitter = /* @__PURE__ */ getDefaultExportFromCjs(eventemitter3Exports);
const instances = /* @__PURE__ */ new WeakMap();
const levels = ["error", "warn", "log", "info"];
let level = "warn";
function debug$6(method) {
  if (level) {
    if (levels.indexOf(method) <= levels.indexOf(level)) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      console[method](...args);
    }
  }
}
function namespace(ns) {
  return levels.reduce((logger, method) => {
    logger[method] = debug$6.bind(console, method, ns);
    return logger;
  }, {});
}
namespace.level = (newLevel) => {
  level = newLevel;
};
debug$6.level = namespace.level;
const debug$5 = namespace("quill:events");
const EVENTS = ["selectionchange", "mousedown", "mouseup", "click"];
EVENTS.forEach((eventName) => {
  document.addEventListener(eventName, function() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    Array.from(document.querySelectorAll(".ql-container")).forEach((node) => {
      const quill = instances.get(node);
      if (quill && quill.emitter) {
        quill.emitter.handleDOM(...args);
      }
    });
  });
});
class Emitter extends EventEmitter {
  constructor() {
    super();
    this.domListeners = {};
    this.on("error", debug$5.error);
  }
  emit() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    debug$5.log.call(debug$5, ...args);
    return super.emit(...args);
  }
  handleDOM(event) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    (this.domListeners[event.type] || []).forEach((_ref) => {
      let {
        node,
        handler
      } = _ref;
      if (event.target === node || node.contains(event.target)) {
        handler(event, ...args);
      }
    });
  }
  listenDOM(eventName, node, handler) {
    if (!this.domListeners[eventName]) {
      this.domListeners[eventName] = [];
    }
    this.domListeners[eventName].push({
      node,
      handler
    });
  }
}
__publicField(Emitter, "events", {
  EDITOR_CHANGE: "editor-change",
  SCROLL_BEFORE_UPDATE: "scroll-before-update",
  SCROLL_BLOT_MOUNT: "scroll-blot-mount",
  SCROLL_BLOT_UNMOUNT: "scroll-blot-unmount",
  SCROLL_OPTIMIZE: "scroll-optimize",
  SCROLL_UPDATE: "scroll-update",
  SCROLL_EMBED_UPDATE: "scroll-embed-update",
  SELECTION_CHANGE: "selection-change",
  TEXT_CHANGE: "text-change",
  COMPOSITION_BEFORE_START: "composition-before-start",
  COMPOSITION_START: "composition-start",
  COMPOSITION_BEFORE_END: "composition-before-end",
  COMPOSITION_END: "composition-end"
});
__publicField(Emitter, "sources", {
  API: "api",
  SILENT: "silent",
  USER: "user"
});
const debug$4 = namespace("quill:selection");
class Range {
  constructor(index2) {
    let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    this.index = index2;
    this.length = length;
  }
}
class Selection {
  constructor(scroll, emitter) {
    this.emitter = emitter;
    this.scroll = scroll;
    this.composing = false;
    this.mouseDown = false;
    this.root = this.scroll.domNode;
    this.cursor = this.scroll.create("cursor", this);
    this.savedRange = new Range(0, 0);
    this.lastRange = this.savedRange;
    this.lastNative = null;
    this.handleComposition();
    this.handleDragging();
    this.emitter.listenDOM("selectionchange", document, () => {
      if (!this.mouseDown && !this.composing) {
        setTimeout(this.update.bind(this, Emitter.sources.USER), 1);
      }
    });
    this.emitter.on(Emitter.events.SCROLL_BEFORE_UPDATE, () => {
      if (!this.hasFocus()) return;
      const native = this.getNativeRange();
      if (native == null) return;
      if (native.start.node === this.cursor.textNode) return;
      this.emitter.once(Emitter.events.SCROLL_UPDATE, (source, mutations) => {
        try {
          if (this.root.contains(native.start.node) && this.root.contains(native.end.node)) {
            this.setNativeRange(native.start.node, native.start.offset, native.end.node, native.end.offset);
          }
          const triggeredByTyping = mutations.some((mutation) => mutation.type === "characterData" || mutation.type === "childList" || mutation.type === "attributes" && mutation.target === this.root);
          this.update(triggeredByTyping ? Emitter.sources.SILENT : source);
        } catch (ignored) {
        }
      });
    });
    this.emitter.on(Emitter.events.SCROLL_OPTIMIZE, (mutations, context) => {
      if (context.range) {
        const {
          startNode,
          startOffset,
          endNode,
          endOffset
        } = context.range;
        this.setNativeRange(startNode, startOffset, endNode, endOffset);
        this.update(Emitter.sources.SILENT);
      }
    });
    this.update(Emitter.sources.SILENT);
  }
  handleComposition() {
    this.emitter.on(Emitter.events.COMPOSITION_BEFORE_START, () => {
      this.composing = true;
    });
    this.emitter.on(Emitter.events.COMPOSITION_END, () => {
      this.composing = false;
      if (this.cursor.parent) {
        const range = this.cursor.restore();
        if (!range) return;
        setTimeout(() => {
          this.setNativeRange(range.startNode, range.startOffset, range.endNode, range.endOffset);
        }, 1);
      }
    });
  }
  handleDragging() {
    this.emitter.listenDOM("mousedown", document.body, () => {
      this.mouseDown = true;
    });
    this.emitter.listenDOM("mouseup", document.body, () => {
      this.mouseDown = false;
      this.update(Emitter.sources.USER);
    });
  }
  focus() {
    if (this.hasFocus()) return;
    this.root.focus({
      preventScroll: true
    });
    this.setRange(this.savedRange);
  }
  format(format, value) {
    this.scroll.update();
    const nativeRange = this.getNativeRange();
    if (nativeRange == null || !nativeRange.native.collapsed || this.scroll.query(format, Scope.BLOCK)) return;
    if (nativeRange.start.node !== this.cursor.textNode) {
      const blot = this.scroll.find(nativeRange.start.node, false);
      if (blot == null) return;
      if (blot instanceof LeafBlot$1) {
        const after = blot.split(nativeRange.start.offset);
        blot.parent.insertBefore(this.cursor, after);
      } else {
        blot.insertBefore(this.cursor, nativeRange.start.node);
      }
      this.cursor.attach();
    }
    this.cursor.format(format, value);
    this.scroll.optimize();
    this.setNativeRange(this.cursor.textNode, this.cursor.textNode.data.length);
    this.update();
  }
  getBounds(index2) {
    let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    const scrollLength = this.scroll.length();
    index2 = Math.min(index2, scrollLength - 1);
    length = Math.min(index2 + length, scrollLength - 1) - index2;
    let node;
    let [leaf, offset2] = this.scroll.leaf(index2);
    if (leaf == null) return null;
    if (length > 0 && offset2 === leaf.length()) {
      const [next] = this.scroll.leaf(index2 + 1);
      if (next) {
        const [line] = this.scroll.line(index2);
        const [nextLine] = this.scroll.line(index2 + 1);
        if (line === nextLine) {
          leaf = next;
          offset2 = 0;
        }
      }
    }
    [node, offset2] = leaf.position(offset2, true);
    const range = document.createRange();
    if (length > 0) {
      range.setStart(node, offset2);
      [leaf, offset2] = this.scroll.leaf(index2 + length);
      if (leaf == null) return null;
      [node, offset2] = leaf.position(offset2, true);
      range.setEnd(node, offset2);
      return range.getBoundingClientRect();
    }
    let side = "left";
    let rect;
    if (node instanceof Text) {
      if (!node.data.length) {
        return null;
      }
      if (offset2 < node.data.length) {
        range.setStart(node, offset2);
        range.setEnd(node, offset2 + 1);
      } else {
        range.setStart(node, offset2 - 1);
        range.setEnd(node, offset2);
        side = "right";
      }
      rect = range.getBoundingClientRect();
    } else {
      if (!(leaf.domNode instanceof Element)) return null;
      rect = leaf.domNode.getBoundingClientRect();
      if (offset2 > 0) side = "right";
    }
    return {
      bottom: rect.top + rect.height,
      height: rect.height,
      left: rect[side],
      right: rect[side],
      top: rect.top,
      width: 0
    };
  }
  getNativeRange() {
    const selection = document.getSelection();
    if (selection == null || selection.rangeCount <= 0) return null;
    const nativeRange = selection.getRangeAt(0);
    if (nativeRange == null) return null;
    const range = this.normalizeNative(nativeRange);
    debug$4.info("getNativeRange", range);
    return range;
  }
  getRange() {
    const root2 = this.scroll.domNode;
    if ("isConnected" in root2 && !root2.isConnected) {
      return [null, null];
    }
    const normalized = this.getNativeRange();
    if (normalized == null) return [null, null];
    const range = this.normalizedToRange(normalized);
    return [range, normalized];
  }
  hasFocus() {
    return document.activeElement === this.root || document.activeElement != null && contains(this.root, document.activeElement);
  }
  normalizedToRange(range) {
    const positions = [[range.start.node, range.start.offset]];
    if (!range.native.collapsed) {
      positions.push([range.end.node, range.end.offset]);
    }
    const indexes = positions.map((position) => {
      const [node, offset2] = position;
      const blot = this.scroll.find(node, true);
      const index2 = blot.offset(this.scroll);
      if (offset2 === 0) {
        return index2;
      }
      if (blot instanceof LeafBlot$1) {
        return index2 + blot.index(node, offset2);
      }
      return index2 + blot.length();
    });
    const end = Math.min(Math.max(...indexes), this.scroll.length() - 1);
    const start = Math.min(end, ...indexes);
    return new Range(start, end - start);
  }
  normalizeNative(nativeRange) {
    if (!contains(this.root, nativeRange.startContainer) || !nativeRange.collapsed && !contains(this.root, nativeRange.endContainer)) {
      return null;
    }
    const range = {
      start: {
        node: nativeRange.startContainer,
        offset: nativeRange.startOffset
      },
      end: {
        node: nativeRange.endContainer,
        offset: nativeRange.endOffset
      },
      native: nativeRange
    };
    [range.start, range.end].forEach((position) => {
      let {
        node,
        offset: offset2
      } = position;
      while (!(node instanceof Text) && node.childNodes.length > 0) {
        if (node.childNodes.length > offset2) {
          node = node.childNodes[offset2];
          offset2 = 0;
        } else if (node.childNodes.length === offset2) {
          node = node.lastChild;
          if (node instanceof Text) {
            offset2 = node.data.length;
          } else if (node.childNodes.length > 0) {
            offset2 = node.childNodes.length;
          } else {
            offset2 = node.childNodes.length + 1;
          }
        } else {
          break;
        }
      }
      position.node = node;
      position.offset = offset2;
    });
    return range;
  }
  rangeToNative(range) {
    const scrollLength = this.scroll.length();
    const getPosition = (index2, inclusive) => {
      index2 = Math.min(scrollLength - 1, index2);
      const [leaf, leafOffset] = this.scroll.leaf(index2);
      return leaf ? leaf.position(leafOffset, inclusive) : [null, -1];
    };
    return [...getPosition(range.index, false), ...getPosition(range.index + range.length, true)];
  }
  setNativeRange(startNode, startOffset) {
    let endNode = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : startNode;
    let endOffset = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : startOffset;
    let force = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false;
    debug$4.info("setNativeRange", startNode, startOffset, endNode, endOffset);
    if (startNode != null && (this.root.parentNode == null || startNode.parentNode == null || // @ts-expect-error Fix me later
    endNode.parentNode == null)) {
      return;
    }
    const selection = document.getSelection();
    if (selection == null) return;
    if (startNode != null) {
      if (!this.hasFocus()) this.root.focus({
        preventScroll: true
      });
      const {
        native
      } = this.getNativeRange() || {};
      if (native == null || force || startNode !== native.startContainer || startOffset !== native.startOffset || endNode !== native.endContainer || endOffset !== native.endOffset) {
        if (startNode instanceof Element && startNode.tagName === "BR") {
          startOffset = Array.from(startNode.parentNode.childNodes).indexOf(startNode);
          startNode = startNode.parentNode;
        }
        if (endNode instanceof Element && endNode.tagName === "BR") {
          endOffset = Array.from(endNode.parentNode.childNodes).indexOf(endNode);
          endNode = endNode.parentNode;
        }
        const range = document.createRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else {
      selection.removeAllRanges();
      this.root.blur();
    }
  }
  setRange(range) {
    let force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    let source = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Emitter.sources.API;
    if (typeof force === "string") {
      source = force;
      force = false;
    }
    debug$4.info("setRange", range);
    if (range != null) {
      const args = this.rangeToNative(range);
      this.setNativeRange(...args, force);
    } else {
      this.setNativeRange(null);
    }
    this.update(source);
  }
  update() {
    let source = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Emitter.sources.USER;
    const oldRange = this.lastRange;
    const [lastRange, nativeRange] = this.getRange();
    this.lastRange = lastRange;
    this.lastNative = nativeRange;
    if (this.lastRange != null) {
      this.savedRange = this.lastRange;
    }
    if (!isEqual$2(oldRange, this.lastRange)) {
      if (!this.composing && nativeRange != null && nativeRange.native.collapsed && nativeRange.start.node !== this.cursor.textNode) {
        const range = this.cursor.restore();
        if (range) {
          this.setNativeRange(range.startNode, range.startOffset, range.endNode, range.endOffset);
        }
      }
      const args = [Emitter.events.SELECTION_CHANGE, cloneDeep$1(this.lastRange), cloneDeep$1(oldRange), source];
      this.emitter.emit(Emitter.events.EDITOR_CHANGE, ...args);
      if (source !== Emitter.sources.SILENT) {
        this.emitter.emit(...args);
      }
    }
  }
}
function contains(parent, descendant) {
  try {
    descendant.parentNode;
  } catch (e) {
    return false;
  }
  return parent.contains(descendant);
}
const ASCII = /^[ -~]*$/;
class Editor {
  constructor(scroll) {
    this.scroll = scroll;
    this.delta = this.getDelta();
  }
  applyDelta(delta) {
    this.scroll.update();
    let scrollLength = this.scroll.length();
    this.scroll.batchStart();
    const normalizedDelta = normalizeDelta(delta);
    const deleteDelta = new Delta();
    const normalizedOps = splitOpLines(normalizedDelta.ops.slice());
    normalizedOps.reduce((index2, op) => {
      const length = DeltaExports.Op.length(op);
      let attributes = op.attributes || {};
      let isImplicitNewlinePrepended = false;
      let isImplicitNewlineAppended = false;
      if (op.insert != null) {
        deleteDelta.retain(length);
        if (typeof op.insert === "string") {
          const text = op.insert;
          isImplicitNewlineAppended = !text.endsWith("\n") && (scrollLength <= index2 || !!this.scroll.descendant(BlockEmbed, index2)[0]);
          this.scroll.insertAt(index2, text);
          const [line, offset2] = this.scroll.line(index2);
          let formats = merge({}, bubbleFormats(line));
          if (line instanceof Block) {
            const [leaf] = line.descendant(LeafBlot$1, offset2);
            if (leaf) {
              formats = merge(formats, bubbleFormats(leaf));
            }
          }
          attributes = DeltaExports.AttributeMap.diff(formats, attributes) || {};
        } else if (typeof op.insert === "object") {
          const key = Object.keys(op.insert)[0];
          if (key == null) return index2;
          const isInlineEmbed = this.scroll.query(key, Scope.INLINE) != null;
          if (isInlineEmbed) {
            if (scrollLength <= index2 || !!this.scroll.descendant(BlockEmbed, index2)[0]) {
              isImplicitNewlineAppended = true;
            }
          } else if (index2 > 0) {
            const [leaf, offset2] = this.scroll.descendant(LeafBlot$1, index2 - 1);
            if (leaf instanceof Text$1) {
              const text = leaf.value();
              if (text[offset2] !== "\n") {
                isImplicitNewlinePrepended = true;
              }
            } else if (leaf instanceof EmbedBlot$1 && leaf.statics.scope === Scope.INLINE_BLOT) {
              isImplicitNewlinePrepended = true;
            }
          }
          this.scroll.insertAt(index2, key, op.insert[key]);
          if (isInlineEmbed) {
            const [leaf] = this.scroll.descendant(LeafBlot$1, index2);
            if (leaf) {
              const formats = merge({}, bubbleFormats(leaf));
              attributes = DeltaExports.AttributeMap.diff(formats, attributes) || {};
            }
          }
        }
        scrollLength += length;
      } else {
        deleteDelta.push(op);
        if (op.retain !== null && typeof op.retain === "object") {
          const key = Object.keys(op.retain)[0];
          if (key == null) return index2;
          this.scroll.updateEmbedAt(index2, key, op.retain[key]);
        }
      }
      Object.keys(attributes).forEach((name) => {
        this.scroll.formatAt(index2, length, name, attributes[name]);
      });
      const prependedLength = isImplicitNewlinePrepended ? 1 : 0;
      const addedLength = isImplicitNewlineAppended ? 1 : 0;
      scrollLength += prependedLength + addedLength;
      deleteDelta.retain(prependedLength);
      deleteDelta.delete(addedLength);
      return index2 + length + prependedLength + addedLength;
    }, 0);
    deleteDelta.reduce((index2, op) => {
      if (typeof op.delete === "number") {
        this.scroll.deleteAt(index2, op.delete);
        return index2;
      }
      return index2 + DeltaExports.Op.length(op);
    }, 0);
    this.scroll.batchEnd();
    this.scroll.optimize();
    return this.update(normalizedDelta);
  }
  deleteText(index2, length) {
    this.scroll.deleteAt(index2, length);
    return this.update(new Delta().retain(index2).delete(length));
  }
  formatLine(index2, length) {
    let formats = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    this.scroll.update();
    Object.keys(formats).forEach((format) => {
      this.scroll.lines(index2, Math.max(length, 1)).forEach((line) => {
        line.format(format, formats[format]);
      });
    });
    this.scroll.optimize();
    const delta = new Delta().retain(index2).retain(length, cloneDeep$1(formats));
    return this.update(delta);
  }
  formatText(index2, length) {
    let formats = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    Object.keys(formats).forEach((format) => {
      this.scroll.formatAt(index2, length, format, formats[format]);
    });
    const delta = new Delta().retain(index2).retain(length, cloneDeep$1(formats));
    return this.update(delta);
  }
  getContents(index2, length) {
    return this.delta.slice(index2, index2 + length);
  }
  getDelta() {
    return this.scroll.lines().reduce((delta, line) => {
      return delta.concat(line.delta());
    }, new Delta());
  }
  getFormat(index2) {
    let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    let lines = [];
    let leaves = [];
    if (length === 0) {
      this.scroll.path(index2).forEach((path) => {
        const [blot] = path;
        if (blot instanceof Block) {
          lines.push(blot);
        } else if (blot instanceof LeafBlot$1) {
          leaves.push(blot);
        }
      });
    } else {
      lines = this.scroll.lines(index2, length);
      leaves = this.scroll.descendants(LeafBlot$1, index2, length);
    }
    const [lineFormats, leafFormats] = [lines, leaves].map((blots) => {
      const blot = blots.shift();
      if (blot == null) return {};
      let formats = bubbleFormats(blot);
      while (Object.keys(formats).length > 0) {
        const blot2 = blots.shift();
        if (blot2 == null) return formats;
        formats = combineFormats(bubbleFormats(blot2), formats);
      }
      return formats;
    });
    return {
      ...lineFormats,
      ...leafFormats
    };
  }
  getHTML(index2, length) {
    const [line, lineOffset] = this.scroll.line(index2);
    if (line) {
      const lineLength = line.length();
      const isWithinLine = line.length() >= lineOffset + length;
      if (isWithinLine && !(lineOffset === 0 && length === lineLength)) {
        return convertHTML(line, lineOffset, length, true);
      }
      return convertHTML(this.scroll, index2, length, true);
    }
    return "";
  }
  getText(index2, length) {
    return this.getContents(index2, length).filter((op) => typeof op.insert === "string").map((op) => op.insert).join("");
  }
  insertContents(index2, contents) {
    const normalizedDelta = normalizeDelta(contents);
    const change = new Delta().retain(index2).concat(normalizedDelta);
    this.scroll.insertContents(index2, normalizedDelta);
    return this.update(change);
  }
  insertEmbed(index2, embed, value) {
    this.scroll.insertAt(index2, embed, value);
    return this.update(new Delta().retain(index2).insert({
      [embed]: value
    }));
  }
  insertText(index2, text) {
    let formats = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    this.scroll.insertAt(index2, text);
    Object.keys(formats).forEach((format) => {
      this.scroll.formatAt(index2, text.length, format, formats[format]);
    });
    return this.update(new Delta().retain(index2).insert(text, cloneDeep$1(formats)));
  }
  isBlank() {
    if (this.scroll.children.length === 0) return true;
    if (this.scroll.children.length > 1) return false;
    const blot = this.scroll.children.head;
    if ((blot == null ? void 0 : blot.statics.blotName) !== Block.blotName) return false;
    const block = blot;
    if (block.children.length > 1) return false;
    return block.children.head instanceof Break;
  }
  removeFormat(index2, length) {
    const text = this.getText(index2, length);
    const [line, offset2] = this.scroll.line(index2 + length);
    let suffixLength = 0;
    let suffix = new Delta();
    if (line != null) {
      suffixLength = line.length() - offset2;
      suffix = line.delta().slice(offset2, offset2 + suffixLength - 1).insert("\n");
    }
    const contents = this.getContents(index2, length + suffixLength);
    const diff2 = contents.diff(new Delta().insert(text).concat(suffix));
    const delta = new Delta().retain(index2).concat(diff2);
    return this.applyDelta(delta);
  }
  update(change) {
    let mutations = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    let selectionInfo = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : void 0;
    const oldDelta = this.delta;
    if (mutations.length === 1 && mutations[0].type === "characterData" && // @ts-expect-error Fix me later
    mutations[0].target.data.match(ASCII) && this.scroll.find(mutations[0].target)) {
      const textBlot = this.scroll.find(mutations[0].target);
      const formats = bubbleFormats(textBlot);
      const index2 = textBlot.offset(this.scroll);
      const oldValue = mutations[0].oldValue.replace(Cursor.CONTENTS, "");
      const oldText = new Delta().insert(oldValue);
      const newText = new Delta().insert(textBlot.value());
      const relativeSelectionInfo = selectionInfo && {
        oldRange: shiftRange$1(selectionInfo.oldRange, -index2),
        newRange: shiftRange$1(selectionInfo.newRange, -index2)
      };
      const diffDelta = new Delta().retain(index2).concat(oldText.diff(newText, relativeSelectionInfo));
      change = diffDelta.reduce((delta, op) => {
        if (op.insert) {
          return delta.insert(op.insert, formats);
        }
        return delta.push(op);
      }, new Delta());
      this.delta = oldDelta.compose(change);
    } else {
      this.delta = this.getDelta();
      if (!change || !isEqual$2(oldDelta.compose(change), this.delta)) {
        change = oldDelta.diff(this.delta, selectionInfo);
      }
    }
    return change;
  }
}
function convertListHTML(items, lastIndent, types) {
  if (items.length === 0) {
    const [endTag2] = getListType(types.pop());
    if (lastIndent <= 0) {
      return `</li></${endTag2}>`;
    }
    return `</li></${endTag2}>${convertListHTML([], lastIndent - 1, types)}`;
  }
  const [{
    child,
    offset: offset2,
    length,
    indent,
    type
  }, ...rest] = items;
  const [tag, attribute] = getListType(type);
  if (indent > lastIndent) {
    types.push(type);
    if (indent === lastIndent + 1) {
      return `<${tag}><li${attribute}>${convertHTML(child, offset2, length)}${convertListHTML(rest, indent, types)}`;
    }
    return `<${tag}><li>${convertListHTML(items, lastIndent + 1, types)}`;
  }
  const previousType = types[types.length - 1];
  if (indent === lastIndent && type === previousType) {
    return `</li><li${attribute}>${convertHTML(child, offset2, length)}${convertListHTML(rest, indent, types)}`;
  }
  const [endTag] = getListType(types.pop());
  return `</li></${endTag}>${convertListHTML(items, lastIndent - 1, types)}`;
}
function convertHTML(blot, index2, length) {
  let isRoot = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
  if ("html" in blot && typeof blot.html === "function") {
    return blot.html(index2, length);
  }
  if (blot instanceof Text$1) {
    const escapedText = escapeText(blot.value().slice(index2, index2 + length));
    return escapedText.replaceAll(" ", "&nbsp;");
  }
  if (blot instanceof ParentBlot$1) {
    if (blot.statics.blotName === "list-container") {
      const items = [];
      blot.children.forEachAt(index2, length, (child, offset2, childLength) => {
        const formats = "formats" in child && typeof child.formats === "function" ? child.formats() : {};
        items.push({
          child,
          offset: offset2,
          length: childLength,
          indent: formats.indent || 0,
          type: formats.list
        });
      });
      return convertListHTML(items, -1, []);
    }
    const parts = [];
    blot.children.forEachAt(index2, length, (child, offset2, childLength) => {
      parts.push(convertHTML(child, offset2, childLength));
    });
    if (isRoot || blot.statics.blotName === "list") {
      return parts.join("");
    }
    const {
      outerHTML,
      innerHTML
    } = blot.domNode;
    const [start, end] = outerHTML.split(`>${innerHTML}<`);
    if (start === "<table") {
      return `<table style="border: 1px solid #000;">${parts.join("")}<${end}`;
    }
    return `${start}>${parts.join("")}<${end}`;
  }
  return blot.domNode instanceof Element ? blot.domNode.outerHTML : "";
}
function combineFormats(formats, combined) {
  return Object.keys(combined).reduce((merged, name) => {
    if (formats[name] == null) return merged;
    const combinedValue = combined[name];
    if (combinedValue === formats[name]) {
      merged[name] = combinedValue;
    } else if (Array.isArray(combinedValue)) {
      if (combinedValue.indexOf(formats[name]) < 0) {
        merged[name] = combinedValue.concat([formats[name]]);
      } else {
        merged[name] = combinedValue;
      }
    } else {
      merged[name] = [combinedValue, formats[name]];
    }
    return merged;
  }, {});
}
function getListType(type) {
  const tag = type === "ordered" ? "ol" : "ul";
  switch (type) {
    case "checked":
      return [tag, ' data-list="checked"'];
    case "unchecked":
      return [tag, ' data-list="unchecked"'];
    default:
      return [tag, ""];
  }
}
function normalizeDelta(delta) {
  return delta.reduce((normalizedDelta, op) => {
    if (typeof op.insert === "string") {
      const text = op.insert.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      return normalizedDelta.insert(text, op.attributes);
    }
    return normalizedDelta.push(op);
  }, new Delta());
}
function shiftRange$1(_ref, amount) {
  let {
    index: index2,
    length
  } = _ref;
  return new Range(index2 + amount, length);
}
function splitOpLines(ops) {
  const split = [];
  ops.forEach((op) => {
    if (typeof op.insert === "string") {
      const lines = op.insert.split("\n");
      lines.forEach((line, index2) => {
        if (index2) split.push({
          insert: "\n",
          attributes: op.attributes
        });
        if (line) split.push({
          insert: line,
          attributes: op.attributes
        });
      });
    } else {
      split.push(op);
    }
  });
  return split;
}
class Module {
  constructor(quill) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.quill = quill;
    this.options = options;
  }
}
__publicField(Module, "DEFAULTS", {});
const GUARD_TEXT = "\uFEFF";
class Embed extends EmbedBlot$1 {
  constructor(scroll, node) {
    super(scroll, node);
    this.contentNode = document.createElement("span");
    this.contentNode.setAttribute("contenteditable", "false");
    Array.from(this.domNode.childNodes).forEach((childNode) => {
      this.contentNode.appendChild(childNode);
    });
    this.leftGuard = document.createTextNode(GUARD_TEXT);
    this.rightGuard = document.createTextNode(GUARD_TEXT);
    this.domNode.appendChild(this.leftGuard);
    this.domNode.appendChild(this.contentNode);
    this.domNode.appendChild(this.rightGuard);
  }
  index(node, offset2) {
    if (node === this.leftGuard) return 0;
    if (node === this.rightGuard) return 1;
    return super.index(node, offset2);
  }
  restore(node) {
    let range = null;
    let textNode;
    const text = node.data.split(GUARD_TEXT).join("");
    if (node === this.leftGuard) {
      if (this.prev instanceof Text$1) {
        const prevLength = this.prev.length();
        this.prev.insertAt(prevLength, text);
        range = {
          startNode: this.prev.domNode,
          startOffset: prevLength + text.length
        };
      } else {
        textNode = document.createTextNode(text);
        this.parent.insertBefore(this.scroll.create(textNode), this);
        range = {
          startNode: textNode,
          startOffset: text.length
        };
      }
    } else if (node === this.rightGuard) {
      if (this.next instanceof Text$1) {
        this.next.insertAt(0, text);
        range = {
          startNode: this.next.domNode,
          startOffset: text.length
        };
      } else {
        textNode = document.createTextNode(text);
        this.parent.insertBefore(this.scroll.create(textNode), this.next);
        range = {
          startNode: textNode,
          startOffset: text.length
        };
      }
    }
    node.data = GUARD_TEXT;
    return range;
  }
  update(mutations, context) {
    mutations.forEach((mutation) => {
      if (mutation.type === "characterData" && (mutation.target === this.leftGuard || mutation.target === this.rightGuard)) {
        const range = this.restore(mutation.target);
        if (range) context.range = range;
      }
    });
  }
}
class Composition {
  constructor(scroll, emitter) {
    __publicField(this, "isComposing", false);
    this.scroll = scroll;
    this.emitter = emitter;
    this.setupListeners();
  }
  setupListeners() {
    this.scroll.domNode.addEventListener("compositionstart", (event) => {
      if (!this.isComposing) {
        this.handleCompositionStart(event);
      }
    });
    this.scroll.domNode.addEventListener("compositionend", (event) => {
      if (this.isComposing) {
        queueMicrotask(() => {
          this.handleCompositionEnd(event);
        });
      }
    });
  }
  handleCompositionStart(event) {
    const blot = event.target instanceof Node ? this.scroll.find(event.target, true) : null;
    if (blot && !(blot instanceof Embed)) {
      this.emitter.emit(Emitter.events.COMPOSITION_BEFORE_START, event);
      this.scroll.batchStart();
      this.emitter.emit(Emitter.events.COMPOSITION_START, event);
      this.isComposing = true;
    }
  }
  handleCompositionEnd(event) {
    this.emitter.emit(Emitter.events.COMPOSITION_BEFORE_END, event);
    this.scroll.batchEnd();
    this.emitter.emit(Emitter.events.COMPOSITION_END, event);
    this.isComposing = false;
  }
}
const _Theme = class _Theme {
  constructor(quill, options) {
    __publicField(this, "modules", {});
    this.quill = quill;
    this.options = options;
  }
  init() {
    Object.keys(this.options.modules).forEach((name) => {
      if (this.modules[name] == null) {
        this.addModule(name);
      }
    });
  }
  addModule(name) {
    const ModuleClass = this.quill.constructor.import(`modules/${name}`);
    this.modules[name] = new ModuleClass(this.quill, this.options.modules[name] || {});
    return this.modules[name];
  }
};
__publicField(_Theme, "DEFAULTS", {
  modules: {}
});
__publicField(_Theme, "themes", {
  default: _Theme
});
let Theme = _Theme;
const getParentElement = (element) => element.parentElement || element.getRootNode().host || null;
const getElementRect = (element) => {
  const rect = element.getBoundingClientRect();
  const scaleX = "offsetWidth" in element && Math.abs(rect.width) / element.offsetWidth || 1;
  const scaleY = "offsetHeight" in element && Math.abs(rect.height) / element.offsetHeight || 1;
  return {
    top: rect.top,
    right: rect.left + element.clientWidth * scaleX,
    bottom: rect.top + element.clientHeight * scaleY,
    left: rect.left
  };
};
const paddingValueToInt = (value) => {
  const number = parseInt(value, 10);
  return Number.isNaN(number) ? 0 : number;
};
const getScrollDistance = (targetStart, targetEnd, scrollStart, scrollEnd, scrollPaddingStart, scrollPaddingEnd) => {
  if (targetStart < scrollStart && targetEnd > scrollEnd) {
    return 0;
  }
  if (targetStart < scrollStart) {
    return -(scrollStart - targetStart + scrollPaddingStart);
  }
  if (targetEnd > scrollEnd) {
    return targetEnd - targetStart > scrollEnd - scrollStart ? targetStart + scrollPaddingStart - scrollStart : targetEnd - scrollEnd + scrollPaddingEnd;
  }
  return 0;
};
const scrollRectIntoView = (root2, targetRect) => {
  var _a, _b, _c;
  const document2 = root2.ownerDocument;
  let rect = targetRect;
  let current = root2;
  while (current) {
    const isDocumentBody = current === document2.body;
    const bounding = isDocumentBody ? {
      top: 0,
      right: ((_a = window.visualViewport) == null ? void 0 : _a.width) ?? document2.documentElement.clientWidth,
      bottom: ((_b = window.visualViewport) == null ? void 0 : _b.height) ?? document2.documentElement.clientHeight,
      left: 0
    } : getElementRect(current);
    const style = getComputedStyle(current);
    const scrollDistanceX = getScrollDistance(rect.left, rect.right, bounding.left, bounding.right, paddingValueToInt(style.scrollPaddingLeft), paddingValueToInt(style.scrollPaddingRight));
    const scrollDistanceY = getScrollDistance(rect.top, rect.bottom, bounding.top, bounding.bottom, paddingValueToInt(style.scrollPaddingTop), paddingValueToInt(style.scrollPaddingBottom));
    if (scrollDistanceX || scrollDistanceY) {
      if (isDocumentBody) {
        (_c = document2.defaultView) == null ? void 0 : _c.scrollBy(scrollDistanceX, scrollDistanceY);
      } else {
        const {
          scrollLeft,
          scrollTop
        } = current;
        if (scrollDistanceY) {
          current.scrollTop += scrollDistanceY;
        }
        if (scrollDistanceX) {
          current.scrollLeft += scrollDistanceX;
        }
        const scrolledLeft = current.scrollLeft - scrollLeft;
        const scrolledTop = current.scrollTop - scrollTop;
        rect = {
          left: rect.left - scrolledLeft,
          top: rect.top - scrolledTop,
          right: rect.right - scrolledLeft,
          bottom: rect.bottom - scrolledTop
        };
      }
    }
    current = isDocumentBody || style.position === "fixed" ? null : getParentElement(current);
  }
};
const MAX_REGISTER_ITERATIONS = 100;
const CORE_FORMATS = ["block", "break", "cursor", "inline", "scroll", "text"];
const createRegistryWithFormats = (formats, sourceRegistry, debug2) => {
  const registry = new Registry();
  CORE_FORMATS.forEach((name) => {
    const coreBlot = sourceRegistry.query(name);
    if (coreBlot) registry.register(coreBlot);
  });
  formats.forEach((name) => {
    let format = sourceRegistry.query(name);
    if (!format) {
      debug2.error(`Cannot register "${name}" specified in "formats" config. Are you sure it was registered?`);
    }
    let iterations = 0;
    while (format) {
      registry.register(format);
      format = "blotName" in format ? format.requiredContainer ?? null : null;
      iterations += 1;
      if (iterations > MAX_REGISTER_ITERATIONS) {
        debug2.error(`Cycle detected in registering blot requiredContainer: "${name}"`);
        break;
      }
    }
  });
  return registry;
};
const debug$3 = namespace("quill");
const globalRegistry = new Registry();
ParentBlot$1.uiClass = "ql-ui";
const _Quill = class _Quill {
  static debug(limit) {
    if (limit === true) {
      limit = "log";
    }
    namespace.level(limit);
  }
  static find(node) {
    let bubble = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    return instances.get(node) || globalRegistry.find(node, bubble);
  }
  static import(name) {
    if (this.imports[name] == null) {
      debug$3.error(`Cannot import ${name}. Are you sure it was registered?`);
    }
    return this.imports[name];
  }
  static register() {
    if (typeof (arguments.length <= 0 ? void 0 : arguments[0]) !== "string") {
      const target = arguments.length <= 0 ? void 0 : arguments[0];
      const overwrite = !!(arguments.length <= 1 ? void 0 : arguments[1]);
      const name = "attrName" in target ? target.attrName : target.blotName;
      if (typeof name === "string") {
        this.register(`formats/${name}`, target, overwrite);
      } else {
        Object.keys(target).forEach((key) => {
          this.register(key, target[key], overwrite);
        });
      }
    } else {
      const path = arguments.length <= 0 ? void 0 : arguments[0];
      const target = arguments.length <= 1 ? void 0 : arguments[1];
      const overwrite = !!(arguments.length <= 2 ? void 0 : arguments[2]);
      if (this.imports[path] != null && !overwrite) {
        debug$3.warn(`Overwriting ${path} with`, target);
      }
      this.imports[path] = target;
      if ((path.startsWith("blots/") || path.startsWith("formats/")) && target && typeof target !== "boolean" && target.blotName !== "abstract") {
        globalRegistry.register(target);
      }
      if (typeof target.register === "function") {
        target.register(globalRegistry);
      }
    }
  }
  constructor(container) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.options = expandConfig(container, options);
    this.container = this.options.container;
    if (this.container == null) {
      debug$3.error("Invalid Quill container", container);
      return;
    }
    if (this.options.debug) {
      _Quill.debug(this.options.debug);
    }
    const html = this.container.innerHTML.trim();
    this.container.classList.add("ql-container");
    this.container.innerHTML = "";
    instances.set(this.container, this);
    this.root = this.addContainer("ql-editor");
    this.root.classList.add("ql-blank");
    this.emitter = new Emitter();
    const scrollBlotName = ScrollBlot$1.blotName;
    const ScrollBlot2 = this.options.registry.query(scrollBlotName);
    if (!ScrollBlot2 || !("blotName" in ScrollBlot2)) {
      throw new Error(`Cannot initialize Quill without "${scrollBlotName}" blot`);
    }
    this.scroll = new ScrollBlot2(this.options.registry, this.root, {
      emitter: this.emitter
    });
    this.editor = new Editor(this.scroll);
    this.selection = new Selection(this.scroll, this.emitter);
    this.composition = new Composition(this.scroll, this.emitter);
    this.theme = new this.options.theme(this, this.options);
    this.keyboard = this.theme.addModule("keyboard");
    this.clipboard = this.theme.addModule("clipboard");
    this.history = this.theme.addModule("history");
    this.uploader = this.theme.addModule("uploader");
    this.theme.addModule("input");
    this.theme.addModule("uiNode");
    this.theme.init();
    this.emitter.on(Emitter.events.EDITOR_CHANGE, (type) => {
      if (type === Emitter.events.TEXT_CHANGE) {
        this.root.classList.toggle("ql-blank", this.editor.isBlank());
      }
    });
    this.emitter.on(Emitter.events.SCROLL_UPDATE, (source, mutations) => {
      const oldRange = this.selection.lastRange;
      const [newRange] = this.selection.getRange();
      const selectionInfo = oldRange && newRange ? {
        oldRange,
        newRange
      } : void 0;
      modify.call(this, () => this.editor.update(null, mutations, selectionInfo), source);
    });
    this.emitter.on(Emitter.events.SCROLL_EMBED_UPDATE, (blot, delta) => {
      const oldRange = this.selection.lastRange;
      const [newRange] = this.selection.getRange();
      const selectionInfo = oldRange && newRange ? {
        oldRange,
        newRange
      } : void 0;
      modify.call(this, () => {
        const change = new Delta().retain(blot.offset(this)).retain({
          [blot.statics.blotName]: delta
        });
        return this.editor.update(change, [], selectionInfo);
      }, _Quill.sources.USER);
    });
    if (html) {
      const contents = this.clipboard.convert({
        html: `${html}<p><br></p>`,
        text: "\n"
      });
      this.setContents(contents);
    }
    this.history.clear();
    if (this.options.placeholder) {
      this.root.setAttribute("data-placeholder", this.options.placeholder);
    }
    if (this.options.readOnly) {
      this.disable();
    }
    this.allowReadOnlyEdits = false;
  }
  addContainer(container) {
    let refNode = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    if (typeof container === "string") {
      const className = container;
      container = document.createElement("div");
      container.classList.add(className);
    }
    this.container.insertBefore(container, refNode);
    return container;
  }
  blur() {
    this.selection.setRange(null);
  }
  deleteText(index2, length, source) {
    [index2, length, , source] = overload(index2, length, source);
    return modify.call(this, () => {
      return this.editor.deleteText(index2, length);
    }, source, index2, -1 * length);
  }
  disable() {
    this.enable(false);
  }
  editReadOnly(modifier) {
    this.allowReadOnlyEdits = true;
    const value = modifier();
    this.allowReadOnlyEdits = false;
    return value;
  }
  enable() {
    let enabled = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
    this.scroll.enable(enabled);
    this.container.classList.toggle("ql-disabled", !enabled);
  }
  focus() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.selection.focus();
    if (!options.preventScroll) {
      this.scrollSelectionIntoView();
    }
  }
  format(name, value) {
    let source = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Emitter.sources.API;
    return modify.call(this, () => {
      const range = this.getSelection(true);
      let change = new Delta();
      if (range == null) return change;
      if (this.scroll.query(name, Scope.BLOCK)) {
        change = this.editor.formatLine(range.index, range.length, {
          [name]: value
        });
      } else if (range.length === 0) {
        this.selection.format(name, value);
        return change;
      } else {
        change = this.editor.formatText(range.index, range.length, {
          [name]: value
        });
      }
      this.setSelection(range, Emitter.sources.SILENT);
      return change;
    }, source);
  }
  formatLine(index2, length, name, value, source) {
    let formats;
    [index2, length, formats, source] = overload(
      index2,
      length,
      // @ts-expect-error
      name,
      value,
      source
    );
    return modify.call(this, () => {
      return this.editor.formatLine(index2, length, formats);
    }, source, index2, 0);
  }
  formatText(index2, length, name, value, source) {
    let formats;
    [index2, length, formats, source] = overload(
      // @ts-expect-error
      index2,
      length,
      name,
      value,
      source
    );
    return modify.call(this, () => {
      return this.editor.formatText(index2, length, formats);
    }, source, index2, 0);
  }
  getBounds(index2) {
    let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    let bounds = null;
    if (typeof index2 === "number") {
      bounds = this.selection.getBounds(index2, length);
    } else {
      bounds = this.selection.getBounds(index2.index, index2.length);
    }
    if (!bounds) return null;
    const containerBounds = this.container.getBoundingClientRect();
    return {
      bottom: bounds.bottom - containerBounds.top,
      height: bounds.height,
      left: bounds.left - containerBounds.left,
      right: bounds.right - containerBounds.left,
      top: bounds.top - containerBounds.top,
      width: bounds.width
    };
  }
  getContents() {
    let index2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.getLength() - index2;
    [index2, length] = overload(index2, length);
    return this.editor.getContents(index2, length);
  }
  getFormat() {
    let index2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.getSelection(true);
    let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    if (typeof index2 === "number") {
      return this.editor.getFormat(index2, length);
    }
    return this.editor.getFormat(index2.index, index2.length);
  }
  getIndex(blot) {
    return blot.offset(this.scroll);
  }
  getLength() {
    return this.scroll.length();
  }
  getLeaf(index2) {
    return this.scroll.leaf(index2);
  }
  getLine(index2) {
    return this.scroll.line(index2);
  }
  getLines() {
    let index2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.MAX_VALUE;
    if (typeof index2 !== "number") {
      return this.scroll.lines(index2.index, index2.length);
    }
    return this.scroll.lines(index2, length);
  }
  getModule(name) {
    return this.theme.modules[name];
  }
  getSelection() {
    let focus = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    if (focus) this.focus();
    this.update();
    return this.selection.getRange()[0];
  }
  getSemanticHTML() {
    let index2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let length = arguments.length > 1 ? arguments[1] : void 0;
    if (typeof index2 === "number") {
      length = length ?? this.getLength() - index2;
    }
    [index2, length] = overload(index2, length);
    return this.editor.getHTML(index2, length);
  }
  getText() {
    let index2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let length = arguments.length > 1 ? arguments[1] : void 0;
    if (typeof index2 === "number") {
      length = length ?? this.getLength() - index2;
    }
    [index2, length] = overload(index2, length);
    return this.editor.getText(index2, length);
  }
  hasFocus() {
    return this.selection.hasFocus();
  }
  insertEmbed(index2, embed, value) {
    let source = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : _Quill.sources.API;
    return modify.call(this, () => {
      return this.editor.insertEmbed(index2, embed, value);
    }, source, index2);
  }
  insertText(index2, text, name, value, source) {
    let formats;
    [index2, , formats, source] = overload(index2, 0, name, value, source);
    return modify.call(this, () => {
      return this.editor.insertText(index2, text, formats);
    }, source, index2, text.length);
  }
  isEnabled() {
    return this.scroll.isEnabled();
  }
  off() {
    return this.emitter.off(...arguments);
  }
  on() {
    return this.emitter.on(...arguments);
  }
  once() {
    return this.emitter.once(...arguments);
  }
  removeFormat(index2, length, source) {
    [index2, length, , source] = overload(index2, length, source);
    return modify.call(this, () => {
      return this.editor.removeFormat(index2, length);
    }, source, index2);
  }
  scrollRectIntoView(rect) {
    scrollRectIntoView(this.root, rect);
  }
  /**
   * @deprecated Use Quill#scrollSelectionIntoView() instead.
   */
  scrollIntoView() {
    console.warn("Quill#scrollIntoView() has been deprecated and will be removed in the near future. Please use Quill#scrollSelectionIntoView() instead.");
    this.scrollSelectionIntoView();
  }
  /**
   * Scroll the current selection into the visible area.
   * If the selection is already visible, no scrolling will occur.
   */
  scrollSelectionIntoView() {
    const range = this.selection.lastRange;
    const bounds = range && this.selection.getBounds(range.index, range.length);
    if (bounds) {
      this.scrollRectIntoView(bounds);
    }
  }
  setContents(delta) {
    let source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Emitter.sources.API;
    return modify.call(this, () => {
      delta = new Delta(delta);
      const length = this.getLength();
      const delete1 = this.editor.deleteText(0, length);
      const applied = this.editor.insertContents(0, delta);
      const delete2 = this.editor.deleteText(this.getLength() - 1, 1);
      return delete1.compose(applied).compose(delete2);
    }, source);
  }
  setSelection(index2, length, source) {
    if (index2 == null) {
      this.selection.setRange(null, length || _Quill.sources.API);
    } else {
      [index2, length, , source] = overload(index2, length, source);
      this.selection.setRange(new Range(Math.max(0, index2), length), source);
      if (source !== Emitter.sources.SILENT) {
        this.scrollSelectionIntoView();
      }
    }
  }
  setText(text) {
    let source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Emitter.sources.API;
    const delta = new Delta().insert(text);
    return this.setContents(delta, source);
  }
  update() {
    let source = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Emitter.sources.USER;
    const change = this.scroll.update(source);
    this.selection.update(source);
    return change;
  }
  updateContents(delta) {
    let source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Emitter.sources.API;
    return modify.call(this, () => {
      delta = new Delta(delta);
      return this.editor.applyDelta(delta);
    }, source, true);
  }
};
__publicField(_Quill, "DEFAULTS", {
  bounds: null,
  modules: {
    clipboard: true,
    keyboard: true,
    history: true,
    uploader: true
  },
  placeholder: "",
  readOnly: false,
  registry: globalRegistry,
  theme: "default"
});
__publicField(_Quill, "events", Emitter.events);
__publicField(_Quill, "sources", Emitter.sources);
__publicField(_Quill, "version", "2.0.3");
__publicField(_Quill, "imports", {
  delta: Delta,
  parchment: Parchment,
  "core/module": Module,
  "core/theme": Theme
});
let Quill = _Quill;
function resolveSelector(selector) {
  return typeof selector === "string" ? document.querySelector(selector) : selector;
}
function expandModuleConfig(config2) {
  return Object.entries(config2 ?? {}).reduce((expanded, _ref) => {
    let [key, value] = _ref;
    return {
      ...expanded,
      [key]: value === true ? {} : value
    };
  }, {});
}
function omitUndefinedValuesFromOptions(obj) {
  return Object.fromEntries(Object.entries(obj).filter((entry) => entry[1] !== void 0));
}
function expandConfig(containerOrSelector, options) {
  const container = resolveSelector(containerOrSelector);
  if (!container) {
    throw new Error("Invalid Quill container");
  }
  const shouldUseDefaultTheme = !options.theme || options.theme === Quill.DEFAULTS.theme;
  const theme = shouldUseDefaultTheme ? Theme : Quill.import(`themes/${options.theme}`);
  if (!theme) {
    throw new Error(`Invalid theme ${options.theme}. Did you register it?`);
  }
  const {
    modules: quillModuleDefaults,
    ...quillDefaults
  } = Quill.DEFAULTS;
  const {
    modules: themeModuleDefaults,
    ...themeDefaults
  } = theme.DEFAULTS;
  let userModuleOptions = expandModuleConfig(options.modules);
  if (userModuleOptions != null && userModuleOptions.toolbar && userModuleOptions.toolbar.constructor !== Object) {
    userModuleOptions = {
      ...userModuleOptions,
      toolbar: {
        container: userModuleOptions.toolbar
      }
    };
  }
  const modules = merge({}, expandModuleConfig(quillModuleDefaults), expandModuleConfig(themeModuleDefaults), userModuleOptions);
  const config2 = {
    ...quillDefaults,
    ...omitUndefinedValuesFromOptions(themeDefaults),
    ...omitUndefinedValuesFromOptions(options)
  };
  let registry = options.registry;
  if (registry) {
    if (options.formats) {
      debug$3.warn('Ignoring "formats" option because "registry" is specified');
    }
  } else {
    registry = options.formats ? createRegistryWithFormats(options.formats, config2.registry, debug$3) : config2.registry;
  }
  return {
    ...config2,
    registry,
    container,
    theme,
    modules: Object.entries(modules).reduce((modulesWithDefaults, _ref2) => {
      let [name, value] = _ref2;
      if (!value) return modulesWithDefaults;
      const moduleClass = Quill.import(`modules/${name}`);
      if (moduleClass == null) {
        debug$3.error(`Cannot load ${name} module. Are you sure you registered it?`);
        return modulesWithDefaults;
      }
      return {
        ...modulesWithDefaults,
        // @ts-expect-error
        [name]: merge({}, moduleClass.DEFAULTS || {}, value)
      };
    }, {}),
    bounds: resolveSelector(config2.bounds)
  };
}
function modify(modifier, source, index2, shift2) {
  if (!this.isEnabled() && source === Emitter.sources.USER && !this.allowReadOnlyEdits) {
    return new Delta();
  }
  let range = index2 == null ? null : this.getSelection();
  const oldDelta = this.editor.delta;
  const change = modifier();
  if (range != null) {
    if (index2 === true) {
      index2 = range.index;
    }
    if (shift2 == null) {
      range = shiftRange(range, change, source);
    } else if (shift2 !== 0) {
      range = shiftRange(range, index2, shift2, source);
    }
    this.setSelection(range, Emitter.sources.SILENT);
  }
  if (change.length() > 0) {
    const args = [Emitter.events.TEXT_CHANGE, change, oldDelta, source];
    this.emitter.emit(Emitter.events.EDITOR_CHANGE, ...args);
    if (source !== Emitter.sources.SILENT) {
      this.emitter.emit(...args);
    }
  }
  return change;
}
function overload(index2, length, name, value, source) {
  let formats = {};
  if (typeof index2.index === "number" && typeof index2.length === "number") {
    if (typeof length !== "number") {
      source = value;
      value = name;
      name = length;
      length = index2.length;
      index2 = index2.index;
    } else {
      length = index2.length;
      index2 = index2.index;
    }
  } else if (typeof length !== "number") {
    source = value;
    value = name;
    name = length;
    length = 0;
  }
  if (typeof name === "object") {
    formats = name;
    source = value;
  } else if (typeof name === "string") {
    if (value != null) {
      formats[name] = value;
    } else {
      source = name;
    }
  }
  source = source || Emitter.sources.API;
  return [index2, length, formats, source];
}
function shiftRange(range, index2, lengthOrSource, source) {
  const length = typeof lengthOrSource === "number" ? lengthOrSource : 0;
  if (range == null) return null;
  let start;
  let end;
  if (index2 && typeof index2.transformPosition === "function") {
    [start, end] = [range.index, range.index + range.length].map((pos) => (
      // @ts-expect-error -- TODO: add a better type guard around `index`
      index2.transformPosition(pos, source !== Emitter.sources.USER)
    ));
  } else {
    [start, end] = [range.index, range.index + range.length].map((pos) => {
      if (pos < index2 || pos === index2 && source === Emitter.sources.USER) return pos;
      if (length >= 0) {
        return pos + length;
      }
      return Math.max(index2, pos + length);
    });
  }
  return new Range(start, end - start);
}
class Container extends ContainerBlot$1 {
}
function isLine$1(blot) {
  return blot instanceof Block || blot instanceof BlockEmbed;
}
function isUpdatable(blot) {
  return typeof blot.updateContent === "function";
}
class Scroll extends ScrollBlot$1 {
  constructor(registry, domNode, _ref) {
    let {
      emitter
    } = _ref;
    super(registry, domNode);
    this.emitter = emitter;
    this.batch = false;
    this.optimize();
    this.enable();
    this.domNode.addEventListener("dragstart", (e) => this.handleDragStart(e));
  }
  batchStart() {
    if (!Array.isArray(this.batch)) {
      this.batch = [];
    }
  }
  batchEnd() {
    if (!this.batch) return;
    const mutations = this.batch;
    this.batch = false;
    this.update(mutations);
  }
  emitMount(blot) {
    this.emitter.emit(Emitter.events.SCROLL_BLOT_MOUNT, blot);
  }
  emitUnmount(blot) {
    this.emitter.emit(Emitter.events.SCROLL_BLOT_UNMOUNT, blot);
  }
  emitEmbedUpdate(blot, change) {
    this.emitter.emit(Emitter.events.SCROLL_EMBED_UPDATE, blot, change);
  }
  deleteAt(index2, length) {
    const [first, offset2] = this.line(index2);
    const [last] = this.line(index2 + length);
    super.deleteAt(index2, length);
    if (last != null && first !== last && offset2 > 0) {
      if (first instanceof BlockEmbed || last instanceof BlockEmbed) {
        this.optimize();
        return;
      }
      const ref = last.children.head instanceof Break ? null : last.children.head;
      first.moveChildren(last, ref);
      first.remove();
    }
    this.optimize();
  }
  enable() {
    let enabled = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
    this.domNode.setAttribute("contenteditable", enabled ? "true" : "false");
  }
  formatAt(index2, length, format, value) {
    super.formatAt(index2, length, format, value);
    this.optimize();
  }
  insertAt(index2, value, def) {
    if (index2 >= this.length()) {
      if (def == null || this.scroll.query(value, Scope.BLOCK) == null) {
        const blot = this.scroll.create(this.statics.defaultChild.blotName);
        this.appendChild(blot);
        if (def == null && value.endsWith("\n")) {
          blot.insertAt(0, value.slice(0, -1), def);
        } else {
          blot.insertAt(0, value, def);
        }
      } else {
        const embed = this.scroll.create(value, def);
        this.appendChild(embed);
      }
    } else {
      super.insertAt(index2, value, def);
    }
    this.optimize();
  }
  insertBefore(blot, ref) {
    if (blot.statics.scope === Scope.INLINE_BLOT) {
      const wrapper = this.scroll.create(this.statics.defaultChild.blotName);
      wrapper.appendChild(blot);
      super.insertBefore(wrapper, ref);
    } else {
      super.insertBefore(blot, ref);
    }
  }
  insertContents(index2, delta) {
    const renderBlocks = this.deltaToRenderBlocks(delta.concat(new Delta().insert("\n")));
    const last = renderBlocks.pop();
    if (last == null) return;
    this.batchStart();
    const first = renderBlocks.shift();
    if (first) {
      const shouldInsertNewlineChar = first.type === "block" && (first.delta.length() === 0 || !this.descendant(BlockEmbed, index2)[0] && index2 < this.length());
      const delta2 = first.type === "block" ? first.delta : new Delta().insert({
        [first.key]: first.value
      });
      insertInlineContents(this, index2, delta2);
      const newlineCharLength = first.type === "block" ? 1 : 0;
      const lineEndIndex = index2 + delta2.length() + newlineCharLength;
      if (shouldInsertNewlineChar) {
        this.insertAt(lineEndIndex - 1, "\n");
      }
      const formats = bubbleFormats(this.line(index2)[0]);
      const attributes = DeltaExports.AttributeMap.diff(formats, first.attributes) || {};
      Object.keys(attributes).forEach((name) => {
        this.formatAt(lineEndIndex - 1, 1, name, attributes[name]);
      });
      index2 = lineEndIndex;
    }
    let [refBlot, refBlotOffset] = this.children.find(index2);
    if (renderBlocks.length) {
      if (refBlot) {
        refBlot = refBlot.split(refBlotOffset);
        refBlotOffset = 0;
      }
      renderBlocks.forEach((renderBlock) => {
        if (renderBlock.type === "block") {
          const block = this.createBlock(renderBlock.attributes, refBlot || void 0);
          insertInlineContents(block, 0, renderBlock.delta);
        } else {
          const blockEmbed = this.create(renderBlock.key, renderBlock.value);
          this.insertBefore(blockEmbed, refBlot || void 0);
          Object.keys(renderBlock.attributes).forEach((name) => {
            blockEmbed.format(name, renderBlock.attributes[name]);
          });
        }
      });
    }
    if (last.type === "block" && last.delta.length()) {
      const offset2 = refBlot ? refBlot.offset(refBlot.scroll) + refBlotOffset : this.length();
      insertInlineContents(this, offset2, last.delta);
    }
    this.batchEnd();
    this.optimize();
  }
  isEnabled() {
    return this.domNode.getAttribute("contenteditable") === "true";
  }
  leaf(index2) {
    const last = this.path(index2).pop();
    if (!last) {
      return [null, -1];
    }
    const [blot, offset2] = last;
    return blot instanceof LeafBlot$1 ? [blot, offset2] : [null, -1];
  }
  line(index2) {
    if (index2 === this.length()) {
      return this.line(index2 - 1);
    }
    return this.descendant(isLine$1, index2);
  }
  lines() {
    let index2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.MAX_VALUE;
    const getLines = (blot, blotIndex, blotLength) => {
      let lines = [];
      let lengthLeft = blotLength;
      blot.children.forEachAt(blotIndex, blotLength, (child, childIndex, childLength) => {
        if (isLine$1(child)) {
          lines.push(child);
        } else if (child instanceof ContainerBlot$1) {
          lines = lines.concat(getLines(child, childIndex, lengthLeft));
        }
        lengthLeft -= childLength;
      });
      return lines;
    };
    return getLines(this, index2, length);
  }
  optimize() {
    let mutations = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    let context = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.batch) return;
    super.optimize(mutations, context);
    if (mutations.length > 0) {
      this.emitter.emit(Emitter.events.SCROLL_OPTIMIZE, mutations, context);
    }
  }
  path(index2) {
    return super.path(index2).slice(1);
  }
  remove() {
  }
  update(mutations) {
    if (this.batch) {
      if (Array.isArray(mutations)) {
        this.batch = this.batch.concat(mutations);
      }
      return;
    }
    let source = Emitter.sources.USER;
    if (typeof mutations === "string") {
      source = mutations;
    }
    if (!Array.isArray(mutations)) {
      mutations = this.observer.takeRecords();
    }
    mutations = mutations.filter((_ref2) => {
      let {
        target
      } = _ref2;
      const blot = this.find(target, true);
      return blot && !isUpdatable(blot);
    });
    if (mutations.length > 0) {
      this.emitter.emit(Emitter.events.SCROLL_BEFORE_UPDATE, source, mutations);
    }
    super.update(mutations.concat([]));
    if (mutations.length > 0) {
      this.emitter.emit(Emitter.events.SCROLL_UPDATE, source, mutations);
    }
  }
  updateEmbedAt(index2, key, change) {
    const [blot] = this.descendant((b) => b instanceof BlockEmbed, index2);
    if (blot && blot.statics.blotName === key && isUpdatable(blot)) {
      blot.updateContent(change);
    }
  }
  handleDragStart(event) {
    event.preventDefault();
  }
  deltaToRenderBlocks(delta) {
    const renderBlocks = [];
    let currentBlockDelta = new Delta();
    delta.forEach((op) => {
      const insert = op == null ? void 0 : op.insert;
      if (!insert) return;
      if (typeof insert === "string") {
        const splitted = insert.split("\n");
        splitted.slice(0, -1).forEach((text) => {
          currentBlockDelta.insert(text, op.attributes);
          renderBlocks.push({
            type: "block",
            delta: currentBlockDelta,
            attributes: op.attributes ?? {}
          });
          currentBlockDelta = new Delta();
        });
        const last = splitted[splitted.length - 1];
        if (last) {
          currentBlockDelta.insert(last, op.attributes);
        }
      } else {
        const key = Object.keys(insert)[0];
        if (!key) return;
        if (this.query(key, Scope.INLINE)) {
          currentBlockDelta.push(op);
        } else {
          if (currentBlockDelta.length()) {
            renderBlocks.push({
              type: "block",
              delta: currentBlockDelta,
              attributes: {}
            });
          }
          currentBlockDelta = new Delta();
          renderBlocks.push({
            type: "blockEmbed",
            key,
            value: insert[key],
            attributes: op.attributes ?? {}
          });
        }
      }
    });
    if (currentBlockDelta.length()) {
      renderBlocks.push({
        type: "block",
        delta: currentBlockDelta,
        attributes: {}
      });
    }
    return renderBlocks;
  }
  createBlock(attributes, refBlot) {
    let blotName;
    const formats = {};
    Object.entries(attributes).forEach((_ref3) => {
      let [key, value] = _ref3;
      const isBlockBlot = this.query(key, Scope.BLOCK & Scope.BLOT) != null;
      if (isBlockBlot) {
        blotName = key;
      } else {
        formats[key] = value;
      }
    });
    const block = this.create(blotName || this.statics.defaultChild.blotName, blotName ? attributes[blotName] : void 0);
    this.insertBefore(block, refBlot || void 0);
    const length = block.length();
    Object.entries(formats).forEach((_ref4) => {
      let [key, value] = _ref4;
      block.formatAt(0, length, key, value);
    });
    return block;
  }
}
__publicField(Scroll, "blotName", "scroll");
__publicField(Scroll, "className", "ql-editor");
__publicField(Scroll, "tagName", "DIV");
__publicField(Scroll, "defaultChild", Block);
__publicField(Scroll, "allowedChildren", [Block, BlockEmbed, Container]);
function insertInlineContents(parent, index2, inlineContents) {
  inlineContents.reduce((index3, op) => {
    const length = DeltaExports.Op.length(op);
    let attributes = op.attributes || {};
    if (op.insert != null) {
      if (typeof op.insert === "string") {
        const text = op.insert;
        parent.insertAt(index3, text);
        const [leaf] = parent.descendant(LeafBlot$1, index3);
        const formats = bubbleFormats(leaf);
        attributes = DeltaExports.AttributeMap.diff(formats, attributes) || {};
      } else if (typeof op.insert === "object") {
        const key = Object.keys(op.insert)[0];
        if (key == null) return index3;
        parent.insertAt(index3, key, op.insert[key]);
        const isInlineEmbed = parent.scroll.query(key, Scope.INLINE) != null;
        if (isInlineEmbed) {
          const [leaf] = parent.descendant(LeafBlot$1, index3);
          const formats = bubbleFormats(leaf);
          attributes = DeltaExports.AttributeMap.diff(formats, attributes) || {};
        }
      }
    }
    Object.keys(attributes).forEach((key) => {
      parent.formatAt(index3, length, key, attributes[key]);
    });
    return index3 + length;
  }, index2);
}
const config$2 = {
  scope: Scope.BLOCK,
  whitelist: ["right", "center", "justify"]
};
const AlignAttribute = new Attributor("align", "align", config$2);
const AlignClass = new ClassAttributor$1("align", "ql-align", config$2);
const AlignStyle = new StyleAttributor$1("align", "text-align", config$2);
class ColorAttributor extends StyleAttributor$1 {
  value(domNode) {
    let value = super.value(domNode);
    if (!value.startsWith("rgb(")) return value;
    value = value.replace(/^[^\d]+/, "").replace(/[^\d]+$/, "");
    const hex = value.split(",").map((component) => `00${parseInt(component, 10).toString(16)}`.slice(-2)).join("");
    return `#${hex}`;
  }
}
const ColorClass = new ClassAttributor$1("color", "ql-color", {
  scope: Scope.INLINE
});
const ColorStyle = new ColorAttributor("color", "color", {
  scope: Scope.INLINE
});
const BackgroundClass = new ClassAttributor$1("background", "ql-bg", {
  scope: Scope.INLINE
});
const BackgroundStyle = new ColorAttributor("background", "background-color", {
  scope: Scope.INLINE
});
class CodeBlockContainer extends Container {
  static create(value) {
    const domNode = super.create(value);
    domNode.setAttribute("spellcheck", "false");
    return domNode;
  }
  code(index2, length) {
    return this.children.map((child) => child.length() <= 1 ? "" : child.domNode.innerText).join("\n").slice(index2, index2 + length);
  }
  html(index2, length) {
    return `<pre>
${escapeText(this.code(index2, length))}
</pre>`;
  }
}
class CodeBlock extends Block {
  static register() {
    Quill.register(CodeBlockContainer);
  }
}
__publicField(CodeBlock, "TAB", "  ");
class Code extends Inline {
}
Code.blotName = "code";
Code.tagName = "CODE";
CodeBlock.blotName = "code-block";
CodeBlock.className = "ql-code-block";
CodeBlock.tagName = "DIV";
CodeBlockContainer.blotName = "code-block-container";
CodeBlockContainer.className = "ql-code-block-container";
CodeBlockContainer.tagName = "DIV";
CodeBlockContainer.allowedChildren = [CodeBlock];
CodeBlock.allowedChildren = [Text$1, Break, Cursor];
CodeBlock.requiredContainer = CodeBlockContainer;
const config$1 = {
  scope: Scope.BLOCK,
  whitelist: ["rtl"]
};
const DirectionAttribute = new Attributor("direction", "dir", config$1);
const DirectionClass = new ClassAttributor$1("direction", "ql-direction", config$1);
const DirectionStyle = new StyleAttributor$1("direction", "direction", config$1);
const config = {
  scope: Scope.INLINE,
  whitelist: ["serif", "monospace"]
};
const FontClass = new ClassAttributor$1("font", "ql-font", config);
class FontStyleAttributor extends StyleAttributor$1 {
  value(node) {
    return super.value(node).replace(/["']/g, "");
  }
}
const FontStyle = new FontStyleAttributor("font", "font-family", config);
const SizeClass = new ClassAttributor$1("size", "ql-size", {
  scope: Scope.INLINE,
  whitelist: ["small", "large", "huge"]
});
const SizeStyle = new StyleAttributor$1("size", "font-size", {
  scope: Scope.INLINE,
  whitelist: ["10px", "18px", "32px"]
});
const debug$2 = namespace("quill:keyboard");
const SHORTKEY = /Mac/i.test(navigator.platform) ? "metaKey" : "ctrlKey";
class Keyboard extends Module {
  static match(evt, binding) {
    if (["altKey", "ctrlKey", "metaKey", "shiftKey"].some((key) => {
      return !!binding[key] !== evt[key] && binding[key] !== null;
    })) {
      return false;
    }
    return binding.key === evt.key || binding.key === evt.which;
  }
  constructor(quill, options) {
    super(quill, options);
    this.bindings = {};
    Object.keys(this.options.bindings).forEach((name) => {
      if (this.options.bindings[name]) {
        this.addBinding(this.options.bindings[name]);
      }
    });
    this.addBinding({
      key: "Enter",
      shiftKey: null
    }, this.handleEnter);
    this.addBinding({
      key: "Enter",
      metaKey: null,
      ctrlKey: null,
      altKey: null
    }, () => {
    });
    if (/Firefox/i.test(navigator.userAgent)) {
      this.addBinding({
        key: "Backspace"
      }, {
        collapsed: true
      }, this.handleBackspace);
      this.addBinding({
        key: "Delete"
      }, {
        collapsed: true
      }, this.handleDelete);
    } else {
      this.addBinding({
        key: "Backspace"
      }, {
        collapsed: true,
        prefix: /^.?$/
      }, this.handleBackspace);
      this.addBinding({
        key: "Delete"
      }, {
        collapsed: true,
        suffix: /^.?$/
      }, this.handleDelete);
    }
    this.addBinding({
      key: "Backspace"
    }, {
      collapsed: false
    }, this.handleDeleteRange);
    this.addBinding({
      key: "Delete"
    }, {
      collapsed: false
    }, this.handleDeleteRange);
    this.addBinding({
      key: "Backspace",
      altKey: null,
      ctrlKey: null,
      metaKey: null,
      shiftKey: null
    }, {
      collapsed: true,
      offset: 0
    }, this.handleBackspace);
    this.listen();
  }
  addBinding(keyBinding) {
    let context = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let handler = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const binding = normalize$2(keyBinding);
    if (binding == null) {
      debug$2.warn("Attempted to add invalid keyboard binding", binding);
      return;
    }
    if (typeof context === "function") {
      context = {
        handler: context
      };
    }
    if (typeof handler === "function") {
      handler = {
        handler
      };
    }
    const keys2 = Array.isArray(binding.key) ? binding.key : [binding.key];
    keys2.forEach((key) => {
      const singleBinding = {
        ...binding,
        key,
        ...context,
        ...handler
      };
      this.bindings[singleBinding.key] = this.bindings[singleBinding.key] || [];
      this.bindings[singleBinding.key].push(singleBinding);
    });
  }
  listen() {
    this.quill.root.addEventListener("keydown", (evt) => {
      if (evt.defaultPrevented || evt.isComposing) return;
      const isComposing = evt.keyCode === 229 && (evt.key === "Enter" || evt.key === "Backspace");
      if (isComposing) return;
      const bindings = (this.bindings[evt.key] || []).concat(this.bindings[evt.which] || []);
      const matches = bindings.filter((binding) => Keyboard.match(evt, binding));
      if (matches.length === 0) return;
      const blot = Quill.find(evt.target, true);
      if (blot && blot.scroll !== this.quill.scroll) return;
      const range = this.quill.getSelection();
      if (range == null || !this.quill.hasFocus()) return;
      const [line, offset2] = this.quill.getLine(range.index);
      const [leafStart, offsetStart] = this.quill.getLeaf(range.index);
      const [leafEnd, offsetEnd] = range.length === 0 ? [leafStart, offsetStart] : this.quill.getLeaf(range.index + range.length);
      const prefixText = leafStart instanceof TextBlot$1 ? leafStart.value().slice(0, offsetStart) : "";
      const suffixText = leafEnd instanceof TextBlot$1 ? leafEnd.value().slice(offsetEnd) : "";
      const curContext = {
        collapsed: range.length === 0,
        // @ts-expect-error Fix me later
        empty: range.length === 0 && line.length() <= 1,
        format: this.quill.getFormat(range),
        line,
        offset: offset2,
        prefix: prefixText,
        suffix: suffixText,
        event: evt
      };
      const prevented = matches.some((binding) => {
        if (binding.collapsed != null && binding.collapsed !== curContext.collapsed) {
          return false;
        }
        if (binding.empty != null && binding.empty !== curContext.empty) {
          return false;
        }
        if (binding.offset != null && binding.offset !== curContext.offset) {
          return false;
        }
        if (Array.isArray(binding.format)) {
          if (binding.format.every((name) => curContext.format[name] == null)) {
            return false;
          }
        } else if (typeof binding.format === "object") {
          if (!Object.keys(binding.format).every((name) => {
            if (binding.format[name] === true) return curContext.format[name] != null;
            if (binding.format[name] === false) return curContext.format[name] == null;
            return isEqual$2(binding.format[name], curContext.format[name]);
          })) {
            return false;
          }
        }
        if (binding.prefix != null && !binding.prefix.test(curContext.prefix)) {
          return false;
        }
        if (binding.suffix != null && !binding.suffix.test(curContext.suffix)) {
          return false;
        }
        return binding.handler.call(this, range, curContext, binding) !== true;
      });
      if (prevented) {
        evt.preventDefault();
      }
    });
  }
  handleBackspace(range, context) {
    const length = /[\uD800-\uDBFF][\uDC00-\uDFFF]$/.test(context.prefix) ? 2 : 1;
    if (range.index === 0 || this.quill.getLength() <= 1) return;
    let formats = {};
    const [line] = this.quill.getLine(range.index);
    let delta = new Delta().retain(range.index - length).delete(length);
    if (context.offset === 0) {
      const [prev] = this.quill.getLine(range.index - 1);
      if (prev) {
        const isPrevLineEmpty = prev.statics.blotName === "block" && prev.length() <= 1;
        if (!isPrevLineEmpty) {
          const curFormats = line.formats();
          const prevFormats = this.quill.getFormat(range.index - 1, 1);
          formats = DeltaExports.AttributeMap.diff(curFormats, prevFormats) || {};
          if (Object.keys(formats).length > 0) {
            const formatDelta = new Delta().retain(range.index + line.length() - 2).retain(1, formats);
            delta = delta.compose(formatDelta);
          }
        }
      }
    }
    this.quill.updateContents(delta, Quill.sources.USER);
    this.quill.focus();
  }
  handleDelete(range, context) {
    const length = /^[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(context.suffix) ? 2 : 1;
    if (range.index >= this.quill.getLength() - length) return;
    let formats = {};
    const [line] = this.quill.getLine(range.index);
    let delta = new Delta().retain(range.index).delete(length);
    if (context.offset >= line.length() - 1) {
      const [next] = this.quill.getLine(range.index + 1);
      if (next) {
        const curFormats = line.formats();
        const nextFormats = this.quill.getFormat(range.index, 1);
        formats = DeltaExports.AttributeMap.diff(curFormats, nextFormats) || {};
        if (Object.keys(formats).length > 0) {
          delta = delta.retain(next.length() - 1).retain(1, formats);
        }
      }
    }
    this.quill.updateContents(delta, Quill.sources.USER);
    this.quill.focus();
  }
  handleDeleteRange(range) {
    deleteRange({
      range,
      quill: this.quill
    });
    this.quill.focus();
  }
  handleEnter(range, context) {
    const lineFormats = Object.keys(context.format).reduce((formats, format) => {
      if (this.quill.scroll.query(format, Scope.BLOCK) && !Array.isArray(context.format[format])) {
        formats[format] = context.format[format];
      }
      return formats;
    }, {});
    const delta = new Delta().retain(range.index).delete(range.length).insert("\n", lineFormats);
    this.quill.updateContents(delta, Quill.sources.USER);
    this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
    this.quill.focus();
  }
}
const defaultOptions = {
  bindings: {
    bold: makeFormatHandler("bold"),
    italic: makeFormatHandler("italic"),
    underline: makeFormatHandler("underline"),
    indent: {
      // highlight tab or tab at beginning of list, indent or blockquote
      key: "Tab",
      format: ["blockquote", "indent", "list"],
      handler(range, context) {
        if (context.collapsed && context.offset !== 0) return true;
        this.quill.format("indent", "+1", Quill.sources.USER);
        return false;
      }
    },
    outdent: {
      key: "Tab",
      shiftKey: true,
      format: ["blockquote", "indent", "list"],
      // highlight tab or tab at beginning of list, indent or blockquote
      handler(range, context) {
        if (context.collapsed && context.offset !== 0) return true;
        this.quill.format("indent", "-1", Quill.sources.USER);
        return false;
      }
    },
    "outdent backspace": {
      key: "Backspace",
      collapsed: true,
      shiftKey: null,
      metaKey: null,
      ctrlKey: null,
      altKey: null,
      format: ["indent", "list"],
      offset: 0,
      handler(range, context) {
        if (context.format.indent != null) {
          this.quill.format("indent", "-1", Quill.sources.USER);
        } else if (context.format.list != null) {
          this.quill.format("list", false, Quill.sources.USER);
        }
      }
    },
    "indent code-block": makeCodeBlockHandler(true),
    "outdent code-block": makeCodeBlockHandler(false),
    "remove tab": {
      key: "Tab",
      shiftKey: true,
      collapsed: true,
      prefix: /\t$/,
      handler(range) {
        this.quill.deleteText(range.index - 1, 1, Quill.sources.USER);
      }
    },
    tab: {
      key: "Tab",
      handler(range, context) {
        if (context.format.table) return true;
        this.quill.history.cutoff();
        const delta = new Delta().retain(range.index).delete(range.length).insert("	");
        this.quill.updateContents(delta, Quill.sources.USER);
        this.quill.history.cutoff();
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        return false;
      }
    },
    "blockquote empty enter": {
      key: "Enter",
      collapsed: true,
      format: ["blockquote"],
      empty: true,
      handler() {
        this.quill.format("blockquote", false, Quill.sources.USER);
      }
    },
    "list empty enter": {
      key: "Enter",
      collapsed: true,
      format: ["list"],
      empty: true,
      handler(range, context) {
        const formats = {
          list: false
        };
        if (context.format.indent) {
          formats.indent = false;
        }
        this.quill.formatLine(range.index, range.length, formats, Quill.sources.USER);
      }
    },
    "checklist enter": {
      key: "Enter",
      collapsed: true,
      format: {
        list: "checked"
      },
      handler(range) {
        const [line, offset2] = this.quill.getLine(range.index);
        const formats = {
          // @ts-expect-error Fix me later
          ...line.formats(),
          list: "checked"
        };
        const delta = new Delta().retain(range.index).insert("\n", formats).retain(line.length() - offset2 - 1).retain(1, {
          list: "unchecked"
        });
        this.quill.updateContents(delta, Quill.sources.USER);
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        this.quill.scrollSelectionIntoView();
      }
    },
    "header enter": {
      key: "Enter",
      collapsed: true,
      format: ["header"],
      suffix: /^$/,
      handler(range, context) {
        const [line, offset2] = this.quill.getLine(range.index);
        const delta = new Delta().retain(range.index).insert("\n", context.format).retain(line.length() - offset2 - 1).retain(1, {
          header: null
        });
        this.quill.updateContents(delta, Quill.sources.USER);
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        this.quill.scrollSelectionIntoView();
      }
    },
    "table backspace": {
      key: "Backspace",
      format: ["table"],
      collapsed: true,
      offset: 0,
      handler() {
      }
    },
    "table delete": {
      key: "Delete",
      format: ["table"],
      collapsed: true,
      suffix: /^$/,
      handler() {
      }
    },
    "table enter": {
      key: "Enter",
      shiftKey: null,
      format: ["table"],
      handler(range) {
        const module2 = this.quill.getModule("table");
        if (module2) {
          const [table, row, cell, offset2] = module2.getTable(range);
          const shift2 = tableSide(table, row, cell, offset2);
          if (shift2 == null) return;
          let index2 = table.offset();
          if (shift2 < 0) {
            const delta = new Delta().retain(index2).insert("\n");
            this.quill.updateContents(delta, Quill.sources.USER);
            this.quill.setSelection(range.index + 1, range.length, Quill.sources.SILENT);
          } else if (shift2 > 0) {
            index2 += table.length();
            const delta = new Delta().retain(index2).insert("\n");
            this.quill.updateContents(delta, Quill.sources.USER);
            this.quill.setSelection(index2, Quill.sources.USER);
          }
        }
      }
    },
    "table tab": {
      key: "Tab",
      shiftKey: null,
      format: ["table"],
      handler(range, context) {
        const {
          event,
          line: cell
        } = context;
        const offset2 = cell.offset(this.quill.scroll);
        if (event.shiftKey) {
          this.quill.setSelection(offset2 - 1, Quill.sources.USER);
        } else {
          this.quill.setSelection(offset2 + cell.length(), Quill.sources.USER);
        }
      }
    },
    "list autofill": {
      key: " ",
      shiftKey: null,
      collapsed: true,
      format: {
        "code-block": false,
        blockquote: false,
        table: false
      },
      prefix: /^\s*?(\d+\.|-|\*|\[ ?\]|\[x\])$/,
      handler(range, context) {
        if (this.quill.scroll.query("list") == null) return true;
        const {
          length
        } = context.prefix;
        const [line, offset2] = this.quill.getLine(range.index);
        if (offset2 > length) return true;
        let value;
        switch (context.prefix.trim()) {
          case "[]":
          case "[ ]":
            value = "unchecked";
            break;
          case "[x]":
            value = "checked";
            break;
          case "-":
          case "*":
            value = "bullet";
            break;
          default:
            value = "ordered";
        }
        this.quill.insertText(range.index, " ", Quill.sources.USER);
        this.quill.history.cutoff();
        const delta = new Delta().retain(range.index - offset2).delete(length + 1).retain(line.length() - 2 - offset2).retain(1, {
          list: value
        });
        this.quill.updateContents(delta, Quill.sources.USER);
        this.quill.history.cutoff();
        this.quill.setSelection(range.index - length, Quill.sources.SILENT);
        return false;
      }
    },
    "code exit": {
      key: "Enter",
      collapsed: true,
      format: ["code-block"],
      prefix: /^$/,
      suffix: /^\s*$/,
      handler(range) {
        const [line, offset2] = this.quill.getLine(range.index);
        let numLines = 2;
        let cur = line;
        while (cur != null && cur.length() <= 1 && cur.formats()["code-block"]) {
          cur = cur.prev;
          numLines -= 1;
          if (numLines <= 0) {
            const delta = new Delta().retain(range.index + line.length() - offset2 - 2).retain(1, {
              "code-block": null
            }).delete(1);
            this.quill.updateContents(delta, Quill.sources.USER);
            this.quill.setSelection(range.index - 1, Quill.sources.SILENT);
            return false;
          }
        }
        return true;
      }
    },
    "embed left": makeEmbedArrowHandler("ArrowLeft", false),
    "embed left shift": makeEmbedArrowHandler("ArrowLeft", true),
    "embed right": makeEmbedArrowHandler("ArrowRight", false),
    "embed right shift": makeEmbedArrowHandler("ArrowRight", true),
    "table down": makeTableArrowHandler(false),
    "table up": makeTableArrowHandler(true)
  }
};
Keyboard.DEFAULTS = defaultOptions;
function makeCodeBlockHandler(indent) {
  return {
    key: "Tab",
    shiftKey: !indent,
    format: {
      "code-block": true
    },
    handler(range, _ref) {
      let {
        event
      } = _ref;
      const CodeBlock2 = this.quill.scroll.query("code-block");
      const {
        TAB
      } = CodeBlock2;
      if (range.length === 0 && !event.shiftKey) {
        this.quill.insertText(range.index, TAB, Quill.sources.USER);
        this.quill.setSelection(range.index + TAB.length, Quill.sources.SILENT);
        return;
      }
      const lines = range.length === 0 ? this.quill.getLines(range.index, 1) : this.quill.getLines(range);
      let {
        index: index2,
        length
      } = range;
      lines.forEach((line, i) => {
        if (indent) {
          line.insertAt(0, TAB);
          if (i === 0) {
            index2 += TAB.length;
          } else {
            length += TAB.length;
          }
        } else if (line.domNode.textContent.startsWith(TAB)) {
          line.deleteAt(0, TAB.length);
          if (i === 0) {
            index2 -= TAB.length;
          } else {
            length -= TAB.length;
          }
        }
      });
      this.quill.update(Quill.sources.USER);
      this.quill.setSelection(index2, length, Quill.sources.SILENT);
    }
  };
}
function makeEmbedArrowHandler(key, shiftKey) {
  const where = key === "ArrowLeft" ? "prefix" : "suffix";
  return {
    key,
    shiftKey,
    altKey: null,
    [where]: /^$/,
    handler(range) {
      let {
        index: index2
      } = range;
      if (key === "ArrowRight") {
        index2 += range.length + 1;
      }
      const [leaf] = this.quill.getLeaf(index2);
      if (!(leaf instanceof EmbedBlot$1)) return true;
      if (key === "ArrowLeft") {
        if (shiftKey) {
          this.quill.setSelection(range.index - 1, range.length + 1, Quill.sources.USER);
        } else {
          this.quill.setSelection(range.index - 1, Quill.sources.USER);
        }
      } else if (shiftKey) {
        this.quill.setSelection(range.index, range.length + 1, Quill.sources.USER);
      } else {
        this.quill.setSelection(range.index + range.length + 1, Quill.sources.USER);
      }
      return false;
    }
  };
}
function makeFormatHandler(format) {
  return {
    key: format[0],
    shortKey: true,
    handler(range, context) {
      this.quill.format(format, !context.format[format], Quill.sources.USER);
    }
  };
}
function makeTableArrowHandler(up) {
  return {
    key: up ? "ArrowUp" : "ArrowDown",
    collapsed: true,
    format: ["table"],
    handler(range, context) {
      const key = up ? "prev" : "next";
      const cell = context.line;
      const targetRow = cell.parent[key];
      if (targetRow != null) {
        if (targetRow.statics.blotName === "table-row") {
          let targetCell = targetRow.children.head;
          let cur = cell;
          while (cur.prev != null) {
            cur = cur.prev;
            targetCell = targetCell.next;
          }
          const index2 = targetCell.offset(this.quill.scroll) + Math.min(context.offset, targetCell.length() - 1);
          this.quill.setSelection(index2, 0, Quill.sources.USER);
        }
      } else {
        const targetLine = cell.table()[key];
        if (targetLine != null) {
          if (up) {
            this.quill.setSelection(targetLine.offset(this.quill.scroll) + targetLine.length() - 1, 0, Quill.sources.USER);
          } else {
            this.quill.setSelection(targetLine.offset(this.quill.scroll), 0, Quill.sources.USER);
          }
        }
      }
      return false;
    }
  };
}
function normalize$2(binding) {
  if (typeof binding === "string" || typeof binding === "number") {
    binding = {
      key: binding
    };
  } else if (typeof binding === "object") {
    binding = cloneDeep$1(binding);
  } else {
    return null;
  }
  if (binding.shortKey) {
    binding[SHORTKEY] = binding.shortKey;
    delete binding.shortKey;
  }
  return binding;
}
function deleteRange(_ref2) {
  let {
    quill,
    range
  } = _ref2;
  const lines = quill.getLines(range);
  let formats = {};
  if (lines.length > 1) {
    const firstFormats = lines[0].formats();
    const lastFormats = lines[lines.length - 1].formats();
    formats = DeltaExports.AttributeMap.diff(lastFormats, firstFormats) || {};
  }
  quill.deleteText(range, Quill.sources.USER);
  if (Object.keys(formats).length > 0) {
    quill.formatLine(range.index, 1, formats, Quill.sources.USER);
  }
  quill.setSelection(range.index, Quill.sources.SILENT);
}
function tableSide(_table, row, cell, offset2) {
  if (row.prev == null && row.next == null) {
    if (cell.prev == null && cell.next == null) {
      return offset2 === 0 ? -1 : 1;
    }
    return cell.prev == null ? -1 : 1;
  }
  if (row.prev == null) {
    return -1;
  }
  if (row.next == null) {
    return 1;
  }
  return null;
}
const normalWeightRegexp = /font-weight:\s*normal/;
const blockTagNames = ["P", "OL", "UL"];
const isBlockElement = (element) => {
  return element && blockTagNames.includes(element.tagName);
};
const normalizeEmptyLines = (doc) => {
  Array.from(doc.querySelectorAll("br")).filter((br) => isBlockElement(br.previousElementSibling) && isBlockElement(br.nextElementSibling)).forEach((br) => {
    var _a;
    (_a = br.parentNode) == null ? void 0 : _a.removeChild(br);
  });
};
const normalizeFontWeight = (doc) => {
  Array.from(doc.querySelectorAll('b[style*="font-weight"]')).filter((node) => {
    var _a;
    return (_a = node.getAttribute("style")) == null ? void 0 : _a.match(normalWeightRegexp);
  }).forEach((node) => {
    var _a;
    const fragment = doc.createDocumentFragment();
    fragment.append(...node.childNodes);
    (_a = node.parentNode) == null ? void 0 : _a.replaceChild(fragment, node);
  });
};
function normalize$1(doc) {
  if (doc.querySelector('[id^="docs-internal-guid-"]')) {
    normalizeFontWeight(doc);
    normalizeEmptyLines(doc);
  }
}
const ignoreRegexp = /\bmso-list:[^;]*ignore/i;
const idRegexp = /\bmso-list:[^;]*\bl(\d+)/i;
const indentRegexp = /\bmso-list:[^;]*\blevel(\d+)/i;
const parseListItem = (element, html) => {
  const style = element.getAttribute("style");
  const idMatch = style == null ? void 0 : style.match(idRegexp);
  if (!idMatch) {
    return null;
  }
  const id = Number(idMatch[1]);
  const indentMatch = style == null ? void 0 : style.match(indentRegexp);
  const indent = indentMatch ? Number(indentMatch[1]) : 1;
  const typeRegexp = new RegExp(`@list l${id}:level${indent}\\s*\\{[^\\}]*mso-level-number-format:\\s*([\\w-]+)`, "i");
  const typeMatch = html.match(typeRegexp);
  const type = typeMatch && typeMatch[1] === "bullet" ? "bullet" : "ordered";
  return {
    id,
    indent,
    type,
    element
  };
};
const normalizeListItem = (doc) => {
  var _a, _b;
  const msoList = Array.from(doc.querySelectorAll("[style*=mso-list]"));
  const ignored = [];
  const others = [];
  msoList.forEach((node) => {
    const shouldIgnore = (node.getAttribute("style") || "").match(ignoreRegexp);
    if (shouldIgnore) {
      ignored.push(node);
    } else {
      others.push(node);
    }
  });
  ignored.forEach((node) => {
    var _a2;
    return (_a2 = node.parentNode) == null ? void 0 : _a2.removeChild(node);
  });
  const html = doc.documentElement.innerHTML;
  const listItems = others.map((element) => parseListItem(element, html)).filter((parsed) => parsed);
  while (listItems.length) {
    const childListItems = [];
    let current = listItems.shift();
    while (current) {
      childListItems.push(current);
      current = listItems.length && ((_a = listItems[0]) == null ? void 0 : _a.element) === current.element.nextElementSibling && // Different id means the next item doesn't belong to this group.
      listItems[0].id === current.id ? listItems.shift() : null;
    }
    const ul = document.createElement("ul");
    childListItems.forEach((listItem) => {
      const li = document.createElement("li");
      li.setAttribute("data-list", listItem.type);
      if (listItem.indent > 1) {
        li.setAttribute("class", `ql-indent-${listItem.indent - 1}`);
      }
      li.innerHTML = listItem.element.innerHTML;
      ul.appendChild(li);
    });
    const element = (_b = childListItems[0]) == null ? void 0 : _b.element;
    const {
      parentNode
    } = element ?? {};
    if (element) {
      parentNode == null ? void 0 : parentNode.replaceChild(ul, element);
    }
    childListItems.slice(1).forEach((_ref) => {
      let {
        element: e
      } = _ref;
      parentNode == null ? void 0 : parentNode.removeChild(e);
    });
  }
};
function normalize(doc) {
  if (doc.documentElement.getAttribute("xmlns:w") === "urn:schemas-microsoft-com:office:word") {
    normalizeListItem(doc);
  }
}
const NORMALIZERS = [normalize, normalize$1];
const normalizeExternalHTML = (doc) => {
  if (doc.documentElement) {
    NORMALIZERS.forEach((normalize2) => {
      normalize2(doc);
    });
  }
};
const debug$1 = namespace("quill:clipboard");
const CLIPBOARD_CONFIG = [[Node.TEXT_NODE, matchText], [Node.TEXT_NODE, matchNewline], ["br", matchBreak], [Node.ELEMENT_NODE, matchNewline], [Node.ELEMENT_NODE, matchBlot], [Node.ELEMENT_NODE, matchAttributor], [Node.ELEMENT_NODE, matchStyles], ["li", matchIndent], ["ol, ul", matchList], ["pre", matchCodeBlock], ["tr", matchTable], ["b", createMatchAlias("bold")], ["i", createMatchAlias("italic")], ["strike", createMatchAlias("strike")], ["style", matchIgnore]];
const ATTRIBUTE_ATTRIBUTORS = [AlignAttribute, DirectionAttribute].reduce((memo, attr) => {
  memo[attr.keyName] = attr;
  return memo;
}, {});
const STYLE_ATTRIBUTORS = [AlignStyle, BackgroundStyle, ColorStyle, DirectionStyle, FontStyle, SizeStyle].reduce((memo, attr) => {
  memo[attr.keyName] = attr;
  return memo;
}, {});
class Clipboard extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.quill.root.addEventListener("copy", (e) => this.onCaptureCopy(e, false));
    this.quill.root.addEventListener("cut", (e) => this.onCaptureCopy(e, true));
    this.quill.root.addEventListener("paste", this.onCapturePaste.bind(this));
    this.matchers = [];
    CLIPBOARD_CONFIG.concat(this.options.matchers ?? []).forEach((_ref) => {
      let [selector, matcher] = _ref;
      this.addMatcher(selector, matcher);
    });
  }
  addMatcher(selector, matcher) {
    this.matchers.push([selector, matcher]);
  }
  convert(_ref2) {
    let {
      html,
      text
    } = _ref2;
    let formats = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (formats[CodeBlock.blotName]) {
      return new Delta().insert(text || "", {
        [CodeBlock.blotName]: formats[CodeBlock.blotName]
      });
    }
    if (!html) {
      return new Delta().insert(text || "", formats);
    }
    const delta = this.convertHTML(html);
    if (deltaEndsWith(delta, "\n") && (delta.ops[delta.ops.length - 1].attributes == null || formats.table)) {
      return delta.compose(new Delta().retain(delta.length() - 1).delete(1));
    }
    return delta;
  }
  normalizeHTML(doc) {
    normalizeExternalHTML(doc);
  }
  convertHTML(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    this.normalizeHTML(doc);
    const container = doc.body;
    const nodeMatches = /* @__PURE__ */ new WeakMap();
    const [elementMatchers, textMatchers] = this.prepareMatching(container, nodeMatches);
    return traverse(this.quill.scroll, container, elementMatchers, textMatchers, nodeMatches);
  }
  dangerouslyPasteHTML(index2, html) {
    let source = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Quill.sources.API;
    if (typeof index2 === "string") {
      const delta = this.convert({
        html: index2,
        text: ""
      });
      this.quill.setContents(delta, html);
      this.quill.setSelection(0, Quill.sources.SILENT);
    } else {
      const paste = this.convert({
        html,
        text: ""
      });
      this.quill.updateContents(new Delta().retain(index2).concat(paste), source);
      this.quill.setSelection(index2 + paste.length(), Quill.sources.SILENT);
    }
  }
  onCaptureCopy(e) {
    var _a, _b;
    let isCut = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    if (e.defaultPrevented) return;
    e.preventDefault();
    const [range] = this.quill.selection.getRange();
    if (range == null) return;
    const {
      html,
      text
    } = this.onCopy(range, isCut);
    (_a = e.clipboardData) == null ? void 0 : _a.setData("text/plain", text);
    (_b = e.clipboardData) == null ? void 0 : _b.setData("text/html", html);
    if (isCut) {
      deleteRange({
        range,
        quill: this.quill
      });
    }
  }
  /*
   * https://www.iana.org/assignments/media-types/text/uri-list
   */
  normalizeURIList(urlList) {
    return urlList.split(/\r?\n/).filter((url) => url[0] !== "#").join("\n");
  }
  onCapturePaste(e) {
    var _a, _b, _c, _d, _e;
    if (e.defaultPrevented || !this.quill.isEnabled()) return;
    e.preventDefault();
    const range = this.quill.getSelection(true);
    if (range == null) return;
    const html = (_a = e.clipboardData) == null ? void 0 : _a.getData("text/html");
    let text = (_b = e.clipboardData) == null ? void 0 : _b.getData("text/plain");
    if (!html && !text) {
      const urlList = (_c = e.clipboardData) == null ? void 0 : _c.getData("text/uri-list");
      if (urlList) {
        text = this.normalizeURIList(urlList);
      }
    }
    const files = Array.from(((_d = e.clipboardData) == null ? void 0 : _d.files) || []);
    if (!html && files.length > 0) {
      this.quill.uploader.upload(range, files);
      return;
    }
    if (html && files.length > 0) {
      const doc = new DOMParser().parseFromString(html, "text/html");
      if (doc.body.childElementCount === 1 && ((_e = doc.body.firstElementChild) == null ? void 0 : _e.tagName) === "IMG") {
        this.quill.uploader.upload(range, files);
        return;
      }
    }
    this.onPaste(range, {
      html,
      text
    });
  }
  onCopy(range) {
    const text = this.quill.getText(range);
    const html = this.quill.getSemanticHTML(range);
    return {
      html,
      text
    };
  }
  onPaste(range, _ref3) {
    let {
      text,
      html
    } = _ref3;
    const formats = this.quill.getFormat(range.index);
    const pastedDelta = this.convert({
      text,
      html
    }, formats);
    debug$1.log("onPaste", pastedDelta, {
      text,
      html
    });
    const delta = new Delta().retain(range.index).delete(range.length).concat(pastedDelta);
    this.quill.updateContents(delta, Quill.sources.USER);
    this.quill.setSelection(delta.length() - range.length, Quill.sources.SILENT);
    this.quill.scrollSelectionIntoView();
  }
  prepareMatching(container, nodeMatches) {
    const elementMatchers = [];
    const textMatchers = [];
    this.matchers.forEach((pair) => {
      const [selector, matcher] = pair;
      switch (selector) {
        case Node.TEXT_NODE:
          textMatchers.push(matcher);
          break;
        case Node.ELEMENT_NODE:
          elementMatchers.push(matcher);
          break;
        default:
          Array.from(container.querySelectorAll(selector)).forEach((node) => {
            if (nodeMatches.has(node)) {
              const matches = nodeMatches.get(node);
              matches == null ? void 0 : matches.push(matcher);
            } else {
              nodeMatches.set(node, [matcher]);
            }
          });
          break;
      }
    });
    return [elementMatchers, textMatchers];
  }
}
__publicField(Clipboard, "DEFAULTS", {
  matchers: []
});
function applyFormat(delta, format, value, scroll) {
  if (!scroll.query(format)) {
    return delta;
  }
  return delta.reduce((newDelta, op) => {
    if (!op.insert) return newDelta;
    if (op.attributes && op.attributes[format]) {
      return newDelta.push(op);
    }
    const formats = value ? {
      [format]: value
    } : {};
    return newDelta.insert(op.insert, {
      ...formats,
      ...op.attributes
    });
  }, new Delta());
}
function deltaEndsWith(delta, text) {
  let endText = "";
  for (let i = delta.ops.length - 1; i >= 0 && endText.length < text.length; --i) {
    const op = delta.ops[i];
    if (typeof op.insert !== "string") break;
    endText = op.insert + endText;
  }
  return endText.slice(-1 * text.length) === text;
}
function isLine(node, scroll) {
  if (!(node instanceof Element)) return false;
  const match2 = scroll.query(node);
  if (match2 && match2.prototype instanceof EmbedBlot$1) return false;
  return ["address", "article", "blockquote", "canvas", "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "iframe", "li", "main", "nav", "ol", "output", "p", "pre", "section", "table", "td", "tr", "ul", "video"].includes(node.tagName.toLowerCase());
}
function isBetweenInlineElements(node, scroll) {
  return node.previousElementSibling && node.nextElementSibling && !isLine(node.previousElementSibling, scroll) && !isLine(node.nextElementSibling, scroll);
}
const preNodes = /* @__PURE__ */ new WeakMap();
function isPre(node) {
  if (node == null) return false;
  if (!preNodes.has(node)) {
    if (node.tagName === "PRE") {
      preNodes.set(node, true);
    } else {
      preNodes.set(node, isPre(node.parentNode));
    }
  }
  return preNodes.get(node);
}
function traverse(scroll, node, elementMatchers, textMatchers, nodeMatches) {
  if (node.nodeType === node.TEXT_NODE) {
    return textMatchers.reduce((delta, matcher) => {
      return matcher(node, delta, scroll);
    }, new Delta());
  }
  if (node.nodeType === node.ELEMENT_NODE) {
    return Array.from(node.childNodes || []).reduce((delta, childNode) => {
      let childrenDelta = traverse(scroll, childNode, elementMatchers, textMatchers, nodeMatches);
      if (childNode.nodeType === node.ELEMENT_NODE) {
        childrenDelta = elementMatchers.reduce((reducedDelta, matcher) => {
          return matcher(childNode, reducedDelta, scroll);
        }, childrenDelta);
        childrenDelta = (nodeMatches.get(childNode) || []).reduce((reducedDelta, matcher) => {
          return matcher(childNode, reducedDelta, scroll);
        }, childrenDelta);
      }
      return delta.concat(childrenDelta);
    }, new Delta());
  }
  return new Delta();
}
function createMatchAlias(format) {
  return (_node, delta, scroll) => {
    return applyFormat(delta, format, true, scroll);
  };
}
function matchAttributor(node, delta, scroll) {
  const attributes = Attributor.keys(node);
  const classes = ClassAttributor$1.keys(node);
  const styles = StyleAttributor$1.keys(node);
  const formats = {};
  attributes.concat(classes).concat(styles).forEach((name) => {
    let attr = scroll.query(name, Scope.ATTRIBUTE);
    if (attr != null) {
      formats[attr.attrName] = attr.value(node);
      if (formats[attr.attrName]) return;
    }
    attr = ATTRIBUTE_ATTRIBUTORS[name];
    if (attr != null && (attr.attrName === name || attr.keyName === name)) {
      formats[attr.attrName] = attr.value(node) || void 0;
    }
    attr = STYLE_ATTRIBUTORS[name];
    if (attr != null && (attr.attrName === name || attr.keyName === name)) {
      attr = STYLE_ATTRIBUTORS[name];
      formats[attr.attrName] = attr.value(node) || void 0;
    }
  });
  return Object.entries(formats).reduce((newDelta, _ref4) => {
    let [name, value] = _ref4;
    return applyFormat(newDelta, name, value, scroll);
  }, delta);
}
function matchBlot(node, delta, scroll) {
  const match2 = scroll.query(node);
  if (match2 == null) return delta;
  if (match2.prototype instanceof EmbedBlot$1) {
    const embed = {};
    const value = match2.value(node);
    if (value != null) {
      embed[match2.blotName] = value;
      return new Delta().insert(embed, match2.formats(node, scroll));
    }
  } else {
    if (match2.prototype instanceof BlockBlot$1 && !deltaEndsWith(delta, "\n")) {
      delta.insert("\n");
    }
    if ("blotName" in match2 && "formats" in match2 && typeof match2.formats === "function") {
      return applyFormat(delta, match2.blotName, match2.formats(node, scroll), scroll);
    }
  }
  return delta;
}
function matchBreak(node, delta) {
  if (!deltaEndsWith(delta, "\n")) {
    delta.insert("\n");
  }
  return delta;
}
function matchCodeBlock(node, delta, scroll) {
  const match2 = scroll.query("code-block");
  const language = match2 && "formats" in match2 && typeof match2.formats === "function" ? match2.formats(node, scroll) : true;
  return applyFormat(delta, "code-block", language, scroll);
}
function matchIgnore() {
  return new Delta();
}
function matchIndent(node, delta, scroll) {
  const match2 = scroll.query(node);
  if (match2 == null || // @ts-expect-error
  match2.blotName !== "list" || !deltaEndsWith(delta, "\n")) {
    return delta;
  }
  let indent = -1;
  let parent = node.parentNode;
  while (parent != null) {
    if (["OL", "UL"].includes(parent.tagName)) {
      indent += 1;
    }
    parent = parent.parentNode;
  }
  if (indent <= 0) return delta;
  return delta.reduce((composed, op) => {
    if (!op.insert) return composed;
    if (op.attributes && typeof op.attributes.indent === "number") {
      return composed.push(op);
    }
    return composed.insert(op.insert, {
      indent,
      ...op.attributes || {}
    });
  }, new Delta());
}
function matchList(node, delta, scroll) {
  const element = node;
  let list = element.tagName === "OL" ? "ordered" : "bullet";
  const checkedAttr = element.getAttribute("data-checked");
  if (checkedAttr) {
    list = checkedAttr === "true" ? "checked" : "unchecked";
  }
  return applyFormat(delta, "list", list, scroll);
}
function matchNewline(node, delta, scroll) {
  if (!deltaEndsWith(delta, "\n")) {
    if (isLine(node, scroll) && (node.childNodes.length > 0 || node instanceof HTMLParagraphElement)) {
      return delta.insert("\n");
    }
    if (delta.length() > 0 && node.nextSibling) {
      let nextSibling = node.nextSibling;
      while (nextSibling != null) {
        if (isLine(nextSibling, scroll)) {
          return delta.insert("\n");
        }
        const match2 = scroll.query(nextSibling);
        if (match2 && match2.prototype instanceof BlockEmbed) {
          return delta.insert("\n");
        }
        nextSibling = nextSibling.firstChild;
      }
    }
  }
  return delta;
}
function matchStyles(node, delta, scroll) {
  var _a;
  const formats = {};
  const style = node.style || {};
  if (style.fontStyle === "italic") {
    formats.italic = true;
  }
  if (style.textDecoration === "underline") {
    formats.underline = true;
  }
  if (style.textDecoration === "line-through") {
    formats.strike = true;
  }
  if (((_a = style.fontWeight) == null ? void 0 : _a.startsWith("bold")) || // @ts-expect-error Fix me later
  parseInt(style.fontWeight, 10) >= 700) {
    formats.bold = true;
  }
  delta = Object.entries(formats).reduce((newDelta, _ref5) => {
    let [name, value] = _ref5;
    return applyFormat(newDelta, name, value, scroll);
  }, delta);
  if (parseFloat(style.textIndent || 0) > 0) {
    return new Delta().insert("	").concat(delta);
  }
  return delta;
}
function matchTable(node, delta, scroll) {
  var _a, _b;
  const table = ((_a = node.parentElement) == null ? void 0 : _a.tagName) === "TABLE" ? node.parentElement : (_b = node.parentElement) == null ? void 0 : _b.parentElement;
  if (table != null) {
    const rows = Array.from(table.querySelectorAll("tr"));
    const row = rows.indexOf(node) + 1;
    return applyFormat(delta, "table", row, scroll);
  }
  return delta;
}
function matchText(node, delta, scroll) {
  var _a;
  let text = node.data;
  if (((_a = node.parentElement) == null ? void 0 : _a.tagName) === "O:P") {
    return delta.insert(text.trim());
  }
  if (!isPre(node)) {
    if (text.trim().length === 0 && text.includes("\n") && !isBetweenInlineElements(node, scroll)) {
      return delta;
    }
    text = text.replace(/[^\S\u00a0]/g, " ");
    text = text.replace(/ {2,}/g, " ");
    if (node.previousSibling == null && node.parentElement != null && isLine(node.parentElement, scroll) || node.previousSibling instanceof Element && isLine(node.previousSibling, scroll)) {
      text = text.replace(/^ /, "");
    }
    if (node.nextSibling == null && node.parentElement != null && isLine(node.parentElement, scroll) || node.nextSibling instanceof Element && isLine(node.nextSibling, scroll)) {
      text = text.replace(/ $/, "");
    }
    text = text.replaceAll(" ", " ");
  }
  return delta.insert(text);
}
class History extends Module {
  constructor(quill, options) {
    super(quill, options);
    __publicField(this, "lastRecorded", 0);
    __publicField(this, "ignoreChange", false);
    __publicField(this, "stack", {
      undo: [],
      redo: []
    });
    __publicField(this, "currentRange", null);
    this.quill.on(Quill.events.EDITOR_CHANGE, (eventName, value, oldValue, source) => {
      if (eventName === Quill.events.SELECTION_CHANGE) {
        if (value && source !== Quill.sources.SILENT) {
          this.currentRange = value;
        }
      } else if (eventName === Quill.events.TEXT_CHANGE) {
        if (!this.ignoreChange) {
          if (!this.options.userOnly || source === Quill.sources.USER) {
            this.record(value, oldValue);
          } else {
            this.transform(value);
          }
        }
        this.currentRange = transformRange(this.currentRange, value);
      }
    });
    this.quill.keyboard.addBinding({
      key: "z",
      shortKey: true
    }, this.undo.bind(this));
    this.quill.keyboard.addBinding({
      key: ["z", "Z"],
      shortKey: true,
      shiftKey: true
    }, this.redo.bind(this));
    if (/Win/i.test(navigator.platform)) {
      this.quill.keyboard.addBinding({
        key: "y",
        shortKey: true
      }, this.redo.bind(this));
    }
    this.quill.root.addEventListener("beforeinput", (event) => {
      if (event.inputType === "historyUndo") {
        this.undo();
        event.preventDefault();
      } else if (event.inputType === "historyRedo") {
        this.redo();
        event.preventDefault();
      }
    });
  }
  change(source, dest) {
    if (this.stack[source].length === 0) return;
    const item = this.stack[source].pop();
    if (!item) return;
    const base = this.quill.getContents();
    const inverseDelta = item.delta.invert(base);
    this.stack[dest].push({
      delta: inverseDelta,
      range: transformRange(item.range, inverseDelta)
    });
    this.lastRecorded = 0;
    this.ignoreChange = true;
    this.quill.updateContents(item.delta, Quill.sources.USER);
    this.ignoreChange = false;
    this.restoreSelection(item);
  }
  clear() {
    this.stack = {
      undo: [],
      redo: []
    };
  }
  cutoff() {
    this.lastRecorded = 0;
  }
  record(changeDelta, oldDelta) {
    if (changeDelta.ops.length === 0) return;
    this.stack.redo = [];
    let undoDelta = changeDelta.invert(oldDelta);
    let undoRange = this.currentRange;
    const timestamp = Date.now();
    if (
      // @ts-expect-error Fix me later
      this.lastRecorded + this.options.delay > timestamp && this.stack.undo.length > 0
    ) {
      const item = this.stack.undo.pop();
      if (item) {
        undoDelta = undoDelta.compose(item.delta);
        undoRange = item.range;
      }
    } else {
      this.lastRecorded = timestamp;
    }
    if (undoDelta.length() === 0) return;
    this.stack.undo.push({
      delta: undoDelta,
      range: undoRange
    });
    if (this.stack.undo.length > this.options.maxStack) {
      this.stack.undo.shift();
    }
  }
  redo() {
    this.change("redo", "undo");
  }
  transform(delta) {
    transformStack(this.stack.undo, delta);
    transformStack(this.stack.redo, delta);
  }
  undo() {
    this.change("undo", "redo");
  }
  restoreSelection(stackItem) {
    if (stackItem.range) {
      this.quill.setSelection(stackItem.range, Quill.sources.USER);
    } else {
      const index2 = getLastChangeIndex(this.quill.scroll, stackItem.delta);
      this.quill.setSelection(index2, Quill.sources.USER);
    }
  }
}
__publicField(History, "DEFAULTS", {
  delay: 1e3,
  maxStack: 100,
  userOnly: false
});
function transformStack(stack, delta) {
  let remoteDelta = delta;
  for (let i = stack.length - 1; i >= 0; i -= 1) {
    const oldItem = stack[i];
    stack[i] = {
      delta: remoteDelta.transform(oldItem.delta, true),
      range: oldItem.range && transformRange(oldItem.range, remoteDelta)
    };
    remoteDelta = oldItem.delta.transform(remoteDelta);
    if (stack[i].delta.length() === 0) {
      stack.splice(i, 1);
    }
  }
}
function endsWithNewlineChange(scroll, delta) {
  const lastOp = delta.ops[delta.ops.length - 1];
  if (lastOp == null) return false;
  if (lastOp.insert != null) {
    return typeof lastOp.insert === "string" && lastOp.insert.endsWith("\n");
  }
  if (lastOp.attributes != null) {
    return Object.keys(lastOp.attributes).some((attr) => {
      return scroll.query(attr, Scope.BLOCK) != null;
    });
  }
  return false;
}
function getLastChangeIndex(scroll, delta) {
  const deleteLength = delta.reduce((length, op) => {
    return length + (op.delete || 0);
  }, 0);
  let changeIndex = delta.length() - deleteLength;
  if (endsWithNewlineChange(scroll, delta)) {
    changeIndex -= 1;
  }
  return changeIndex;
}
function transformRange(range, delta) {
  if (!range) return range;
  const start = delta.transformPosition(range.index);
  const end = delta.transformPosition(range.index + range.length);
  return {
    index: start,
    length: end - start
  };
}
class Uploader extends Module {
  constructor(quill, options) {
    super(quill, options);
    quill.root.addEventListener("drop", (e) => {
      var _a;
      e.preventDefault();
      let native = null;
      if (document.caretRangeFromPoint) {
        native = document.caretRangeFromPoint(e.clientX, e.clientY);
      } else if (document.caretPositionFromPoint) {
        const position = document.caretPositionFromPoint(e.clientX, e.clientY);
        native = document.createRange();
        native.setStart(position.offsetNode, position.offset);
        native.setEnd(position.offsetNode, position.offset);
      }
      const normalized = native && quill.selection.normalizeNative(native);
      if (normalized) {
        const range = quill.selection.normalizedToRange(normalized);
        if ((_a = e.dataTransfer) == null ? void 0 : _a.files) {
          this.upload(range, e.dataTransfer.files);
        }
      }
    });
  }
  upload(range, files) {
    const uploads = [];
    Array.from(files).forEach((file) => {
      var _a;
      if (file && ((_a = this.options.mimetypes) == null ? void 0 : _a.includes(file.type))) {
        uploads.push(file);
      }
    });
    if (uploads.length > 0) {
      this.options.handler.call(this, range, uploads);
    }
  }
}
Uploader.DEFAULTS = {
  mimetypes: ["image/png", "image/jpeg"],
  handler(range, files) {
    if (!this.quill.scroll.query("image")) {
      return;
    }
    const promises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then((images) => {
      const update = images.reduce((delta, image) => {
        return delta.insert({
          image
        });
      }, new Delta().retain(range.index).delete(range.length));
      this.quill.updateContents(update, Emitter.sources.USER);
      this.quill.setSelection(range.index + images.length, Emitter.sources.SILENT);
    });
  }
};
const INSERT_TYPES = ["insertText", "insertReplacementText"];
class Input extends Module {
  constructor(quill, options) {
    super(quill, options);
    quill.root.addEventListener("beforeinput", (event) => {
      this.handleBeforeInput(event);
    });
    if (!/Android/i.test(navigator.userAgent)) {
      quill.on(Quill.events.COMPOSITION_BEFORE_START, () => {
        this.handleCompositionStart();
      });
    }
  }
  deleteRange(range) {
    deleteRange({
      range,
      quill: this.quill
    });
  }
  replaceText(range) {
    let text = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    if (range.length === 0) return false;
    if (text) {
      const formats = this.quill.getFormat(range.index, 1);
      this.deleteRange(range);
      this.quill.updateContents(new Delta().retain(range.index).insert(text, formats), Quill.sources.USER);
    } else {
      this.deleteRange(range);
    }
    this.quill.setSelection(range.index + text.length, 0, Quill.sources.SILENT);
    return true;
  }
  handleBeforeInput(event) {
    if (this.quill.composition.isComposing || event.defaultPrevented || !INSERT_TYPES.includes(event.inputType)) {
      return;
    }
    const staticRange = event.getTargetRanges ? event.getTargetRanges()[0] : null;
    if (!staticRange || staticRange.collapsed === true) {
      return;
    }
    const text = getPlainTextFromInputEvent(event);
    if (text == null) {
      return;
    }
    const normalized = this.quill.selection.normalizeNative(staticRange);
    const range = normalized ? this.quill.selection.normalizedToRange(normalized) : null;
    if (range && this.replaceText(range, text)) {
      event.preventDefault();
    }
  }
  handleCompositionStart() {
    const range = this.quill.getSelection();
    if (range) {
      this.replaceText(range);
    }
  }
}
function getPlainTextFromInputEvent(event) {
  var _a;
  if (typeof event.data === "string") {
    return event.data;
  }
  if ((_a = event.dataTransfer) == null ? void 0 : _a.types.includes("text/plain")) {
    return event.dataTransfer.getData("text/plain");
  }
  return null;
}
const isMac = /Mac/i.test(navigator.platform);
const TTL_FOR_VALID_SELECTION_CHANGE = 100;
const canMoveCaretBeforeUINode = (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight" || // RTL scripts or moving from the end of the previous line
  event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "Home") {
    return true;
  }
  if (isMac && event.key === "a" && event.ctrlKey === true) {
    return true;
  }
  return false;
};
class UINode extends Module {
  constructor(quill, options) {
    super(quill, options);
    __publicField(this, "isListening", false);
    __publicField(this, "selectionChangeDeadline", 0);
    this.handleArrowKeys();
    this.handleNavigationShortcuts();
  }
  handleArrowKeys() {
    this.quill.keyboard.addBinding({
      key: ["ArrowLeft", "ArrowRight"],
      offset: 0,
      shiftKey: null,
      handler(range, _ref) {
        let {
          line,
          event
        } = _ref;
        if (!(line instanceof ParentBlot$1) || !line.uiNode) {
          return true;
        }
        const isRTL2 = getComputedStyle(line.domNode)["direction"] === "rtl";
        if (isRTL2 && event.key !== "ArrowRight" || !isRTL2 && event.key !== "ArrowLeft") {
          return true;
        }
        this.quill.setSelection(range.index - 1, range.length + (event.shiftKey ? 1 : 0), Quill.sources.USER);
        return false;
      }
    });
  }
  handleNavigationShortcuts() {
    this.quill.root.addEventListener("keydown", (event) => {
      if (!event.defaultPrevented && canMoveCaretBeforeUINode(event)) {
        this.ensureListeningToSelectionChange();
      }
    });
  }
  /**
   * We only listen to the `selectionchange` event when
   * there is an intention of moving the caret to the beginning using shortcuts.
   * This is primarily implemented to prevent infinite loops, as we are changing
   * the selection within the handler of a `selectionchange` event.
   */
  ensureListeningToSelectionChange() {
    this.selectionChangeDeadline = Date.now() + TTL_FOR_VALID_SELECTION_CHANGE;
    if (this.isListening) return;
    this.isListening = true;
    const listener = () => {
      this.isListening = false;
      if (Date.now() <= this.selectionChangeDeadline) {
        this.handleSelectionChange();
      }
    };
    document.addEventListener("selectionchange", listener, {
      once: true
    });
  }
  handleSelectionChange() {
    const selection = document.getSelection();
    if (!selection) return;
    const range = selection.getRangeAt(0);
    if (range.collapsed !== true || range.startOffset !== 0) return;
    const line = this.quill.scroll.find(range.startContainer);
    if (!(line instanceof ParentBlot$1) || !line.uiNode) return;
    const newRange = document.createRange();
    newRange.setStartAfter(line.uiNode);
    newRange.setEndAfter(line.uiNode);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
}
Quill.register({
  "blots/block": Block,
  "blots/block/embed": BlockEmbed,
  "blots/break": Break,
  "blots/container": Container,
  "blots/cursor": Cursor,
  "blots/embed": Embed,
  "blots/inline": Inline,
  "blots/scroll": Scroll,
  "blots/text": Text$1,
  "modules/clipboard": Clipboard,
  "modules/history": History,
  "modules/keyboard": Keyboard,
  "modules/uploader": Uploader,
  "modules/input": Input,
  "modules/uiNode": UINode
});
class IndentAttributor extends ClassAttributor$1 {
  add(node, value) {
    let normalizedValue = 0;
    if (value === "+1" || value === "-1") {
      const indent = this.value(node) || 0;
      normalizedValue = value === "+1" ? indent + 1 : indent - 1;
    } else if (typeof value === "number") {
      normalizedValue = value;
    }
    if (normalizedValue === 0) {
      this.remove(node);
      return true;
    }
    return super.add(node, normalizedValue.toString());
  }
  canAdd(node, value) {
    return super.canAdd(node, value) || super.canAdd(node, parseInt(value, 10));
  }
  value(node) {
    return parseInt(super.value(node), 10) || void 0;
  }
}
const IndentClass = new IndentAttributor("indent", "ql-indent", {
  scope: Scope.BLOCK,
  // @ts-expect-error
  whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
});
class Blockquote extends Block {
}
__publicField(Blockquote, "blotName", "blockquote");
__publicField(Blockquote, "tagName", "blockquote");
class Header extends Block {
  static formats(domNode) {
    return this.tagName.indexOf(domNode.tagName) + 1;
  }
}
__publicField(Header, "blotName", "header");
__publicField(Header, "tagName", ["H1", "H2", "H3", "H4", "H5", "H6"]);
class ListContainer extends Container {
}
ListContainer.blotName = "list-container";
ListContainer.tagName = "OL";
class ListItem extends Block {
  static create(value) {
    const node = super.create();
    node.setAttribute("data-list", value);
    return node;
  }
  static formats(domNode) {
    return domNode.getAttribute("data-list") || void 0;
  }
  static register() {
    Quill.register(ListContainer);
  }
  constructor(scroll, domNode) {
    super(scroll, domNode);
    const ui = domNode.ownerDocument.createElement("span");
    const listEventHandler = (e) => {
      if (!scroll.isEnabled()) return;
      const format = this.statics.formats(domNode, scroll);
      if (format === "checked") {
        this.format("list", "unchecked");
        e.preventDefault();
      } else if (format === "unchecked") {
        this.format("list", "checked");
        e.preventDefault();
      }
    };
    ui.addEventListener("mousedown", listEventHandler);
    ui.addEventListener("touchstart", listEventHandler);
    this.attachUI(ui);
  }
  format(name, value) {
    if (name === this.statics.blotName && value) {
      this.domNode.setAttribute("data-list", value);
    } else {
      super.format(name, value);
    }
  }
}
ListItem.blotName = "list";
ListItem.tagName = "LI";
ListContainer.allowedChildren = [ListItem];
ListItem.requiredContainer = ListContainer;
class Bold extends Inline {
  static create() {
    return super.create();
  }
  static formats() {
    return true;
  }
  optimize(context) {
    super.optimize(context);
    if (this.domNode.tagName !== this.statics.tagName[0]) {
      this.replaceWith(this.statics.blotName);
    }
  }
}
__publicField(Bold, "blotName", "bold");
__publicField(Bold, "tagName", ["STRONG", "B"]);
class Italic extends Bold {
}
__publicField(Italic, "blotName", "italic");
__publicField(Italic, "tagName", ["EM", "I"]);
class Link extends Inline {
  static create(value) {
    const node = super.create(value);
    node.setAttribute("href", this.sanitize(value));
    node.setAttribute("rel", "noopener noreferrer");
    node.setAttribute("target", "_blank");
    return node;
  }
  static formats(domNode) {
    return domNode.getAttribute("href");
  }
  static sanitize(url) {
    return sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL;
  }
  format(name, value) {
    if (name !== this.statics.blotName || !value) {
      super.format(name, value);
    } else {
      this.domNode.setAttribute("href", this.constructor.sanitize(value));
    }
  }
}
__publicField(Link, "blotName", "link");
__publicField(Link, "tagName", "A");
__publicField(Link, "SANITIZED_URL", "about:blank");
__publicField(Link, "PROTOCOL_WHITELIST", ["http", "https", "mailto", "tel", "sms"]);
function sanitize(url, protocols) {
  const anchor = document.createElement("a");
  anchor.href = url;
  const protocol = anchor.href.slice(0, anchor.href.indexOf(":"));
  return protocols.indexOf(protocol) > -1;
}
class Script extends Inline {
  static create(value) {
    if (value === "super") {
      return document.createElement("sup");
    }
    if (value === "sub") {
      return document.createElement("sub");
    }
    return super.create(value);
  }
  static formats(domNode) {
    if (domNode.tagName === "SUB") return "sub";
    if (domNode.tagName === "SUP") return "super";
    return void 0;
  }
}
__publicField(Script, "blotName", "script");
__publicField(Script, "tagName", ["SUB", "SUP"]);
class Strike extends Bold {
}
__publicField(Strike, "blotName", "strike");
__publicField(Strike, "tagName", ["S", "STRIKE"]);
class Underline extends Inline {
}
__publicField(Underline, "blotName", "underline");
__publicField(Underline, "tagName", "U");
class Formula extends Embed {
  static create(value) {
    if (window.katex == null) {
      throw new Error("Formula module requires KaTeX.");
    }
    const node = super.create(value);
    if (typeof value === "string") {
      window.katex.render(value, node, {
        throwOnError: false,
        errorColor: "#f00"
      });
      node.setAttribute("data-value", value);
    }
    return node;
  }
  static value(domNode) {
    return domNode.getAttribute("data-value");
  }
  html() {
    const {
      formula
    } = this.value();
    return `<span>${formula}</span>`;
  }
}
__publicField(Formula, "blotName", "formula");
__publicField(Formula, "className", "ql-formula");
__publicField(Formula, "tagName", "SPAN");
const ATTRIBUTES$1 = ["alt", "height", "width"];
class Image extends EmbedBlot$1 {
  static create(value) {
    const node = super.create(value);
    if (typeof value === "string") {
      node.setAttribute("src", this.sanitize(value));
    }
    return node;
  }
  static formats(domNode) {
    return ATTRIBUTES$1.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }
  static match(url) {
    return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
  }
  static sanitize(url) {
    return sanitize(url, ["http", "https", "data"]) ? url : "//:0";
  }
  static value(domNode) {
    return domNode.getAttribute("src");
  }
  format(name, value) {
    if (ATTRIBUTES$1.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
__publicField(Image, "blotName", "image");
__publicField(Image, "tagName", "IMG");
const ATTRIBUTES = ["height", "width"];
class Video extends BlockEmbed {
  static create(value) {
    const node = super.create(value);
    node.setAttribute("frameborder", "0");
    node.setAttribute("allowfullscreen", "true");
    node.setAttribute("src", this.sanitize(value));
    return node;
  }
  static formats(domNode) {
    return ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }
  static sanitize(url) {
    return Link.sanitize(url);
  }
  static value(domNode) {
    return domNode.getAttribute("src");
  }
  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
  html() {
    const {
      video
    } = this.value();
    return `<a href="${video}">${video}</a>`;
  }
}
__publicField(Video, "blotName", "video");
__publicField(Video, "className", "ql-video");
__publicField(Video, "tagName", "IFRAME");
const TokenAttributor = new ClassAttributor$1("code-token", "hljs", {
  scope: Scope.INLINE
});
class CodeToken extends Inline {
  static formats(node, scroll) {
    while (node != null && node !== scroll.domNode) {
      if (node.classList && node.classList.contains(CodeBlock.className)) {
        return super.formats(node, scroll);
      }
      node = node.parentNode;
    }
    return void 0;
  }
  constructor(scroll, domNode, value) {
    super(scroll, domNode, value);
    TokenAttributor.add(this.domNode, value);
  }
  format(format, value) {
    if (format !== CodeToken.blotName) {
      super.format(format, value);
    } else if (value) {
      TokenAttributor.add(this.domNode, value);
    } else {
      TokenAttributor.remove(this.domNode);
      this.domNode.classList.remove(this.statics.className);
    }
  }
  optimize() {
    super.optimize(...arguments);
    if (!TokenAttributor.value(this.domNode)) {
      this.unwrap();
    }
  }
}
CodeToken.blotName = "code-token";
CodeToken.className = "ql-token";
class SyntaxCodeBlock extends CodeBlock {
  static create(value) {
    const domNode = super.create(value);
    if (typeof value === "string") {
      domNode.setAttribute("data-language", value);
    }
    return domNode;
  }
  static formats(domNode) {
    return domNode.getAttribute("data-language") || "plain";
  }
  static register() {
  }
  // Syntax module will register
  format(name, value) {
    if (name === this.statics.blotName && value) {
      this.domNode.setAttribute("data-language", value);
    } else {
      super.format(name, value);
    }
  }
  replaceWith(name, value) {
    this.formatAt(0, this.length(), CodeToken.blotName, false);
    return super.replaceWith(name, value);
  }
}
class SyntaxCodeBlockContainer extends CodeBlockContainer {
  attach() {
    super.attach();
    this.forceNext = false;
    this.scroll.emitMount(this);
  }
  format(name, value) {
    if (name === SyntaxCodeBlock.blotName) {
      this.forceNext = true;
      this.children.forEach((child) => {
        child.format(name, value);
      });
    }
  }
  formatAt(index2, length, name, value) {
    if (name === SyntaxCodeBlock.blotName) {
      this.forceNext = true;
    }
    super.formatAt(index2, length, name, value);
  }
  highlight(highlight2) {
    let forced = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    if (this.children.head == null) return;
    const nodes = Array.from(this.domNode.childNodes).filter((node) => node !== this.uiNode);
    const text = `${nodes.map((node) => node.textContent).join("\n")}
`;
    const language = SyntaxCodeBlock.formats(this.children.head.domNode);
    if (forced || this.forceNext || this.cachedText !== text) {
      if (text.trim().length > 0 || this.cachedText == null) {
        const oldDelta = this.children.reduce((delta2, child) => {
          return delta2.concat(blockDelta(child, false));
        }, new Delta());
        const delta = highlight2(text, language);
        oldDelta.diff(delta).reduce((index2, _ref) => {
          let {
            retain,
            attributes
          } = _ref;
          if (!retain) return index2;
          if (attributes) {
            Object.keys(attributes).forEach((format) => {
              if ([SyntaxCodeBlock.blotName, CodeToken.blotName].includes(format)) {
                this.formatAt(index2, retain, format, attributes[format]);
              }
            });
          }
          return index2 + retain;
        }, 0);
      }
      this.cachedText = text;
      this.forceNext = false;
    }
  }
  html(index2, length) {
    const [codeBlock] = this.children.find(index2);
    const language = codeBlock ? SyntaxCodeBlock.formats(codeBlock.domNode) : "plain";
    return `<pre data-language="${language}">
${escapeText(this.code(index2, length))}
</pre>`;
  }
  optimize(context) {
    super.optimize(context);
    if (this.parent != null && this.children.head != null && this.uiNode != null) {
      const language = SyntaxCodeBlock.formats(this.children.head.domNode);
      if (language !== this.uiNode.value) {
        this.uiNode.value = language;
      }
    }
  }
}
SyntaxCodeBlockContainer.allowedChildren = [SyntaxCodeBlock];
SyntaxCodeBlock.requiredContainer = SyntaxCodeBlockContainer;
SyntaxCodeBlock.allowedChildren = [CodeToken, Cursor, Text$1, Break];
const highlight = (lib, language, text) => {
  if (typeof lib.versionString === "string") {
    const majorVersion = lib.versionString.split(".")[0];
    if (parseInt(majorVersion, 10) >= 11) {
      return lib.highlight(text, {
        language
      }).value;
    }
  }
  return lib.highlight(language, text).value;
};
class Syntax extends Module {
  static register() {
    Quill.register(CodeToken, true);
    Quill.register(SyntaxCodeBlock, true);
    Quill.register(SyntaxCodeBlockContainer, true);
  }
  constructor(quill, options) {
    super(quill, options);
    if (this.options.hljs == null) {
      throw new Error("Syntax module requires highlight.js. Please include the library on the page before Quill.");
    }
    this.languages = this.options.languages.reduce((memo, _ref2) => {
      let {
        key
      } = _ref2;
      memo[key] = true;
      return memo;
    }, {});
    this.highlightBlot = this.highlightBlot.bind(this);
    this.initListener();
    this.initTimer();
  }
  initListener() {
    this.quill.on(Quill.events.SCROLL_BLOT_MOUNT, (blot) => {
      if (!(blot instanceof SyntaxCodeBlockContainer)) return;
      const select = this.quill.root.ownerDocument.createElement("select");
      this.options.languages.forEach((_ref3) => {
        let {
          key,
          label
        } = _ref3;
        const option = select.ownerDocument.createElement("option");
        option.textContent = label;
        option.setAttribute("value", key);
        select.appendChild(option);
      });
      select.addEventListener("change", () => {
        blot.format(SyntaxCodeBlock.blotName, select.value);
        this.quill.root.focus();
        this.highlight(blot, true);
      });
      if (blot.uiNode == null) {
        blot.attachUI(select);
        if (blot.children.head) {
          select.value = SyntaxCodeBlock.formats(blot.children.head.domNode);
        }
      }
    });
  }
  initTimer() {
    let timer = null;
    this.quill.on(Quill.events.SCROLL_OPTIMIZE, () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        this.highlight();
        timer = null;
      }, this.options.interval);
    });
  }
  highlight() {
    let blot = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
    let force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    if (this.quill.selection.composing) return;
    this.quill.update(Quill.sources.USER);
    const range = this.quill.getSelection();
    const blots = blot == null ? this.quill.scroll.descendants(SyntaxCodeBlockContainer) : [blot];
    blots.forEach((container) => {
      container.highlight(this.highlightBlot, force);
    });
    this.quill.update(Quill.sources.SILENT);
    if (range != null) {
      this.quill.setSelection(range, Quill.sources.SILENT);
    }
  }
  highlightBlot(text) {
    let language = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "plain";
    language = this.languages[language] ? language : "plain";
    if (language === "plain") {
      return escapeText(text).split("\n").reduce((delta, line, i) => {
        if (i !== 0) {
          delta.insert("\n", {
            [CodeBlock.blotName]: language
          });
        }
        return delta.insert(line);
      }, new Delta());
    }
    const container = this.quill.root.ownerDocument.createElement("div");
    container.classList.add(CodeBlock.className);
    container.innerHTML = highlight(this.options.hljs, language, text);
    return traverse(this.quill.scroll, container, [(node, delta) => {
      const value = TokenAttributor.value(node);
      if (value) {
        return delta.compose(new Delta().retain(delta.length(), {
          [CodeToken.blotName]: value
        }));
      }
      return delta;
    }], [(node, delta) => {
      return node.data.split("\n").reduce((memo, nodeText, i) => {
        if (i !== 0) memo.insert("\n", {
          [CodeBlock.blotName]: language
        });
        return memo.insert(nodeText);
      }, delta);
    }], /* @__PURE__ */ new WeakMap());
  }
}
Syntax.DEFAULTS = {
  hljs: (() => {
    return window.hljs;
  })(),
  interval: 1e3,
  languages: [{
    key: "plain",
    label: "Plain"
  }, {
    key: "bash",
    label: "Bash"
  }, {
    key: "cpp",
    label: "C++"
  }, {
    key: "cs",
    label: "C#"
  }, {
    key: "css",
    label: "CSS"
  }, {
    key: "diff",
    label: "Diff"
  }, {
    key: "xml",
    label: "HTML/XML"
  }, {
    key: "java",
    label: "Java"
  }, {
    key: "javascript",
    label: "JavaScript"
  }, {
    key: "markdown",
    label: "Markdown"
  }, {
    key: "php",
    label: "PHP"
  }, {
    key: "python",
    label: "Python"
  }, {
    key: "ruby",
    label: "Ruby"
  }, {
    key: "sql",
    label: "SQL"
  }]
};
const _TableCell = class _TableCell extends Block {
  static create(value) {
    const node = super.create();
    if (value) {
      node.setAttribute("data-row", value);
    } else {
      node.setAttribute("data-row", tableId());
    }
    return node;
  }
  static formats(domNode) {
    if (domNode.hasAttribute("data-row")) {
      return domNode.getAttribute("data-row");
    }
    return void 0;
  }
  cellOffset() {
    if (this.parent) {
      return this.parent.children.indexOf(this);
    }
    return -1;
  }
  format(name, value) {
    if (name === _TableCell.blotName && value) {
      this.domNode.setAttribute("data-row", value);
    } else {
      super.format(name, value);
    }
  }
  row() {
    return this.parent;
  }
  rowOffset() {
    if (this.row()) {
      return this.row().rowOffset();
    }
    return -1;
  }
  table() {
    return this.row() && this.row().table();
  }
};
__publicField(_TableCell, "blotName", "table");
__publicField(_TableCell, "tagName", "TD");
let TableCell = _TableCell;
class TableRow extends Container {
  checkMerge() {
    if (super.checkMerge() && this.next.children.head != null) {
      const thisHead = this.children.head.formats();
      const thisTail = this.children.tail.formats();
      const nextHead = this.next.children.head.formats();
      const nextTail = this.next.children.tail.formats();
      return thisHead.table === thisTail.table && thisHead.table === nextHead.table && thisHead.table === nextTail.table;
    }
    return false;
  }
  optimize(context) {
    super.optimize(context);
    this.children.forEach((child) => {
      if (child.next == null) return;
      const childFormats = child.formats();
      const nextFormats = child.next.formats();
      if (childFormats.table !== nextFormats.table) {
        const next = this.splitAfter(child);
        if (next) {
          next.optimize();
        }
        if (this.prev) {
          this.prev.optimize();
        }
      }
    });
  }
  rowOffset() {
    if (this.parent) {
      return this.parent.children.indexOf(this);
    }
    return -1;
  }
  table() {
    return this.parent && this.parent.parent;
  }
}
__publicField(TableRow, "blotName", "table-row");
__publicField(TableRow, "tagName", "TR");
class TableBody extends Container {
}
__publicField(TableBody, "blotName", "table-body");
__publicField(TableBody, "tagName", "TBODY");
class TableContainer extends Container {
  balanceCells() {
    const rows = this.descendants(TableRow);
    const maxColumns = rows.reduce((max2, row) => {
      return Math.max(row.children.length, max2);
    }, 0);
    rows.forEach((row) => {
      new Array(maxColumns - row.children.length).fill(0).forEach(() => {
        let value;
        if (row.children.head != null) {
          value = TableCell.formats(row.children.head.domNode);
        }
        const blot = this.scroll.create(TableCell.blotName, value);
        row.appendChild(blot);
        blot.optimize();
      });
    });
  }
  cells(column) {
    return this.rows().map((row) => row.children.at(column));
  }
  deleteColumn(index2) {
    const [body] = this.descendant(TableBody);
    if (body == null || body.children.head == null) return;
    body.children.forEach((row) => {
      const cell = row.children.at(index2);
      if (cell != null) {
        cell.remove();
      }
    });
  }
  insertColumn(index2) {
    const [body] = this.descendant(TableBody);
    if (body == null || body.children.head == null) return;
    body.children.forEach((row) => {
      const ref = row.children.at(index2);
      const value = TableCell.formats(row.children.head.domNode);
      const cell = this.scroll.create(TableCell.blotName, value);
      row.insertBefore(cell, ref);
    });
  }
  insertRow(index2) {
    const [body] = this.descendant(TableBody);
    if (body == null || body.children.head == null) return;
    const id = tableId();
    const row = this.scroll.create(TableRow.blotName);
    body.children.head.children.forEach(() => {
      const cell = this.scroll.create(TableCell.blotName, id);
      row.appendChild(cell);
    });
    const ref = body.children.at(index2);
    body.insertBefore(row, ref);
  }
  rows() {
    const body = this.children.head;
    if (body == null) return [];
    return body.children.map((row) => row);
  }
}
__publicField(TableContainer, "blotName", "table-container");
__publicField(TableContainer, "tagName", "TABLE");
TableContainer.allowedChildren = [TableBody];
TableBody.requiredContainer = TableContainer;
TableBody.allowedChildren = [TableRow];
TableRow.requiredContainer = TableBody;
TableRow.allowedChildren = [TableCell];
TableCell.requiredContainer = TableRow;
function tableId() {
  const id = Math.random().toString(36).slice(2, 6);
  return `row-${id}`;
}
class Table extends Module {
  static register() {
    Quill.register(TableCell);
    Quill.register(TableRow);
    Quill.register(TableBody);
    Quill.register(TableContainer);
  }
  constructor() {
    super(...arguments);
    this.listenBalanceCells();
  }
  balanceTables() {
    this.quill.scroll.descendants(TableContainer).forEach((table) => {
      table.balanceCells();
    });
  }
  deleteColumn() {
    const [table, , cell] = this.getTable();
    if (cell == null) return;
    table.deleteColumn(cell.cellOffset());
    this.quill.update(Quill.sources.USER);
  }
  deleteRow() {
    const [, row] = this.getTable();
    if (row == null) return;
    row.remove();
    this.quill.update(Quill.sources.USER);
  }
  deleteTable() {
    const [table] = this.getTable();
    if (table == null) return;
    const offset2 = table.offset();
    table.remove();
    this.quill.update(Quill.sources.USER);
    this.quill.setSelection(offset2, Quill.sources.SILENT);
  }
  getTable() {
    let range = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.quill.getSelection();
    if (range == null) return [null, null, null, -1];
    const [cell, offset2] = this.quill.getLine(range.index);
    if (cell == null || cell.statics.blotName !== TableCell.blotName) {
      return [null, null, null, -1];
    }
    const row = cell.parent;
    const table = row.parent.parent;
    return [table, row, cell, offset2];
  }
  insertColumn(offset2) {
    const range = this.quill.getSelection();
    if (!range) return;
    const [table, row, cell] = this.getTable(range);
    if (cell == null) return;
    const column = cell.cellOffset();
    table.insertColumn(column + offset2);
    this.quill.update(Quill.sources.USER);
    let shift2 = row.rowOffset();
    if (offset2 === 0) {
      shift2 += 1;
    }
    this.quill.setSelection(range.index + shift2, range.length, Quill.sources.SILENT);
  }
  insertColumnLeft() {
    this.insertColumn(0);
  }
  insertColumnRight() {
    this.insertColumn(1);
  }
  insertRow(offset2) {
    const range = this.quill.getSelection();
    if (!range) return;
    const [table, row, cell] = this.getTable(range);
    if (cell == null) return;
    const index2 = row.rowOffset();
    table.insertRow(index2 + offset2);
    this.quill.update(Quill.sources.USER);
    if (offset2 > 0) {
      this.quill.setSelection(range, Quill.sources.SILENT);
    } else {
      this.quill.setSelection(range.index + row.children.length, range.length, Quill.sources.SILENT);
    }
  }
  insertRowAbove() {
    this.insertRow(0);
  }
  insertRowBelow() {
    this.insertRow(1);
  }
  insertTable(rows, columns) {
    const range = this.quill.getSelection();
    if (range == null) return;
    const delta = new Array(rows).fill(0).reduce((memo) => {
      const text = new Array(columns).fill("\n").join("");
      return memo.insert(text, {
        table: tableId()
      });
    }, new Delta().retain(range.index));
    this.quill.updateContents(delta, Quill.sources.USER);
    this.quill.setSelection(range.index, Quill.sources.SILENT);
    this.balanceTables();
  }
  listenBalanceCells() {
    this.quill.on(Quill.events.SCROLL_OPTIMIZE, (mutations) => {
      mutations.some((mutation) => {
        if (["TD", "TR", "TBODY", "TABLE"].includes(mutation.target.tagName)) {
          this.quill.once(Quill.events.TEXT_CHANGE, (delta, old, source) => {
            if (source !== Quill.sources.USER) return;
            this.balanceTables();
          });
          return true;
        }
        return false;
      });
    });
  }
}
const debug = namespace("quill:toolbar");
class Toolbar extends Module {
  constructor(quill, options) {
    var _a, _b;
    super(quill, options);
    if (Array.isArray(this.options.container)) {
      const container = document.createElement("div");
      container.setAttribute("role", "toolbar");
      addControls(container, this.options.container);
      (_b = (_a = quill.container) == null ? void 0 : _a.parentNode) == null ? void 0 : _b.insertBefore(container, quill.container);
      this.container = container;
    } else if (typeof this.options.container === "string") {
      this.container = document.querySelector(this.options.container);
    } else {
      this.container = this.options.container;
    }
    if (!(this.container instanceof HTMLElement)) {
      debug.error("Container required for toolbar", this.options);
      return;
    }
    this.container.classList.add("ql-toolbar");
    this.controls = [];
    this.handlers = {};
    if (this.options.handlers) {
      Object.keys(this.options.handlers).forEach((format) => {
        var _a2;
        const handler = (_a2 = this.options.handlers) == null ? void 0 : _a2[format];
        if (handler) {
          this.addHandler(format, handler);
        }
      });
    }
    Array.from(this.container.querySelectorAll("button, select")).forEach((input) => {
      this.attach(input);
    });
    this.quill.on(Quill.events.EDITOR_CHANGE, () => {
      const [range] = this.quill.selection.getRange();
      this.update(range);
    });
  }
  addHandler(format, handler) {
    this.handlers[format] = handler;
  }
  attach(input) {
    let format = Array.from(input.classList).find((className) => {
      return className.indexOf("ql-") === 0;
    });
    if (!format) return;
    format = format.slice("ql-".length);
    if (input.tagName === "BUTTON") {
      input.setAttribute("type", "button");
    }
    if (this.handlers[format] == null && this.quill.scroll.query(format) == null) {
      debug.warn("ignoring attaching to nonexistent format", format, input);
      return;
    }
    const eventName = input.tagName === "SELECT" ? "change" : "click";
    input.addEventListener(eventName, (e) => {
      let value;
      if (input.tagName === "SELECT") {
        if (input.selectedIndex < 0) return;
        const selected = input.options[input.selectedIndex];
        if (selected.hasAttribute("selected")) {
          value = false;
        } else {
          value = selected.value || false;
        }
      } else {
        if (input.classList.contains("ql-active")) {
          value = false;
        } else {
          value = input.value || !input.hasAttribute("value");
        }
        e.preventDefault();
      }
      this.quill.focus();
      const [range] = this.quill.selection.getRange();
      if (this.handlers[format] != null) {
        this.handlers[format].call(this, value);
      } else if (
        // @ts-expect-error
        this.quill.scroll.query(format).prototype instanceof EmbedBlot$1
      ) {
        value = prompt(`Enter ${format}`);
        if (!value) return;
        this.quill.updateContents(new Delta().retain(range.index).delete(range.length).insert({
          [format]: value
        }), Quill.sources.USER);
      } else {
        this.quill.format(format, value, Quill.sources.USER);
      }
      this.update(range);
    });
    this.controls.push([format, input]);
  }
  update(range) {
    const formats = range == null ? {} : this.quill.getFormat(range);
    this.controls.forEach((pair) => {
      const [format, input] = pair;
      if (input.tagName === "SELECT") {
        let option = null;
        if (range == null) {
          option = null;
        } else if (formats[format] == null) {
          option = input.querySelector("option[selected]");
        } else if (!Array.isArray(formats[format])) {
          let value = formats[format];
          if (typeof value === "string") {
            value = value.replace(/"/g, '\\"');
          }
          option = input.querySelector(`option[value="${value}"]`);
        }
        if (option == null) {
          input.value = "";
          input.selectedIndex = -1;
        } else {
          option.selected = true;
        }
      } else if (range == null) {
        input.classList.remove("ql-active");
        input.setAttribute("aria-pressed", "false");
      } else if (input.hasAttribute("value")) {
        const value = formats[format];
        const isActive = value === input.getAttribute("value") || value != null && value.toString() === input.getAttribute("value") || value == null && !input.getAttribute("value");
        input.classList.toggle("ql-active", isActive);
        input.setAttribute("aria-pressed", isActive.toString());
      } else {
        const isActive = formats[format] != null;
        input.classList.toggle("ql-active", isActive);
        input.setAttribute("aria-pressed", isActive.toString());
      }
    });
  }
}
Toolbar.DEFAULTS = {};
function addButton(container, format, value) {
  const input = document.createElement("button");
  input.setAttribute("type", "button");
  input.classList.add(`ql-${format}`);
  input.setAttribute("aria-pressed", "false");
  if (value != null) {
    input.value = value;
    input.setAttribute("aria-label", `${format}: ${value}`);
  } else {
    input.setAttribute("aria-label", format);
  }
  container.appendChild(input);
}
function addControls(container, groups) {
  if (!Array.isArray(groups[0])) {
    groups = [groups];
  }
  groups.forEach((controls) => {
    const group = document.createElement("span");
    group.classList.add("ql-formats");
    controls.forEach((control) => {
      if (typeof control === "string") {
        addButton(group, control);
      } else {
        const format = Object.keys(control)[0];
        const value = control[format];
        if (Array.isArray(value)) {
          addSelect(group, format, value);
        } else {
          addButton(group, format, value);
        }
      }
    });
    container.appendChild(group);
  });
}
function addSelect(container, format, values) {
  const input = document.createElement("select");
  input.classList.add(`ql-${format}`);
  values.forEach((value) => {
    const option = document.createElement("option");
    if (value !== false) {
      option.setAttribute("value", String(value));
    } else {
      option.setAttribute("selected", "selected");
    }
    input.appendChild(option);
  });
  container.appendChild(input);
}
Toolbar.DEFAULTS = {
  container: null,
  handlers: {
    clean() {
      const range = this.quill.getSelection();
      if (range == null) return;
      if (range.length === 0) {
        const formats = this.quill.getFormat();
        Object.keys(formats).forEach((name) => {
          if (this.quill.scroll.query(name, Scope.INLINE) != null) {
            this.quill.format(name, false, Quill.sources.USER);
          }
        });
      } else {
        this.quill.removeFormat(range.index, range.length, Quill.sources.USER);
      }
    },
    direction(value) {
      const {
        align
      } = this.quill.getFormat();
      if (value === "rtl" && align == null) {
        this.quill.format("align", "right", Quill.sources.USER);
      } else if (!value && align === "right") {
        this.quill.format("align", false, Quill.sources.USER);
      }
      this.quill.format("direction", value, Quill.sources.USER);
    },
    indent(value) {
      const range = this.quill.getSelection();
      const formats = this.quill.getFormat(range);
      const indent = parseInt(formats.indent || 0, 10);
      if (value === "+1" || value === "-1") {
        let modifier = value === "+1" ? 1 : -1;
        if (formats.direction === "rtl") modifier *= -1;
        this.quill.format("indent", indent + modifier, Quill.sources.USER);
      }
    },
    link(value) {
      if (value === true) {
        value = prompt("Enter link URL:");
      }
      this.quill.format("link", value, Quill.sources.USER);
    },
    list(value) {
      const range = this.quill.getSelection();
      const formats = this.quill.getFormat(range);
      if (value === "check") {
        if (formats.list === "checked" || formats.list === "unchecked") {
          this.quill.format("list", false, Quill.sources.USER);
        } else {
          this.quill.format("list", "unchecked", Quill.sources.USER);
        }
      } else {
        this.quill.format("list", value, Quill.sources.USER);
      }
    }
  }
};
const alignLeftIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"/></svg>';
const alignCenterIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="14" x2="4" y1="14" y2="14"/><line class="ql-stroke" x1="12" x2="6" y1="4" y2="4"/></svg>';
const alignRightIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="15" x2="5" y1="14" y2="14"/><line class="ql-stroke" x1="15" x2="9" y1="4" y2="4"/></svg>';
const alignJustifyIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="15" x2="3" y1="14" y2="14"/><line class="ql-stroke" x1="15" x2="3" y1="4" y2="4"/></svg>';
const backgroundIcon = '<svg viewbox="0 0 18 18"><g class="ql-fill ql-color-label"><polygon points="6 6.868 6 6 5 6 5 7 5.942 7 6 6.868"/><rect height="1" width="1" x="4" y="4"/><polygon points="6.817 5 6 5 6 6 6.38 6 6.817 5"/><rect height="1" width="1" x="2" y="6"/><rect height="1" width="1" x="3" y="5"/><rect height="1" width="1" x="4" y="7"/><polygon points="4 11.439 4 11 3 11 3 12 3.755 12 4 11.439"/><rect height="1" width="1" x="2" y="12"/><rect height="1" width="1" x="2" y="9"/><rect height="1" width="1" x="2" y="15"/><polygon points="4.63 10 4 10 4 11 4.192 11 4.63 10"/><rect height="1" width="1" x="3" y="8"/><path d="M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z"/><path d="M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z"/><path d="M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z"/><rect height="1" width="1" x="12" y="2"/><rect height="1" width="1" x="11" y="3"/><path d="M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z"/><rect height="1" width="1" x="2" y="3"/><rect height="1" width="1" x="6" y="2"/><rect height="1" width="1" x="3" y="2"/><rect height="1" width="1" x="5" y="3"/><rect height="1" width="1" x="9" y="2"/><rect height="1" width="1" x="15" y="14"/><polygon points="13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174"/><rect height="1" width="1" x="13" y="7"/><rect height="1" width="1" x="15" y="5"/><rect height="1" width="1" x="14" y="6"/><rect height="1" width="1" x="15" y="8"/><rect height="1" width="1" x="14" y="9"/><path d="M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z"/><rect height="1" width="1" x="14" y="3"/><polygon points="12 6.868 12 6 11.62 6 12 6.868"/><rect height="1" width="1" x="15" y="2"/><rect height="1" width="1" x="12" y="5"/><rect height="1" width="1" x="13" y="4"/><polygon points="12.933 9 13 9 13 8 12.495 8 12.933 9"/><rect height="1" width="1" x="9" y="14"/><rect height="1" width="1" x="8" y="15"/><path d="M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z"/><rect height="1" width="1" x="5" y="15"/><path d="M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z"/><rect height="1" width="1" x="11" y="15"/><path d="M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z"/><rect height="1" width="1" x="14" y="15"/><rect height="1" width="1" x="15" y="11"/></g><polyline class="ql-stroke" points="5.5 13 9 5 12.5 13"/><line class="ql-stroke" x1="11.63" x2="6.38" y1="11" y2="11"/></svg>';
const blockquoteIcon = '<svg viewbox="0 0 18 18"><rect class="ql-fill ql-stroke" height="3" width="3" x="4" y="5"/><rect class="ql-fill ql-stroke" height="3" width="3" x="11" y="5"/><path class="ql-even ql-fill ql-stroke" d="M7,8c0,4.031-3,5-3,5"/><path class="ql-even ql-fill ql-stroke" d="M14,8c0,4.031-3,5-3,5"/></svg>';
const boldIcon = '<svg viewbox="0 0 18 18"><path class="ql-stroke" d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z"/><path class="ql-stroke" d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z"/></svg>';
const cleanIcon = '<svg class="" viewbox="0 0 18 18"><line class="ql-stroke" x1="5" x2="13" y1="3" y2="3"/><line class="ql-stroke" x1="6" x2="9.35" y1="12" y2="3"/><line class="ql-stroke" x1="11" x2="15" y1="11" y2="15"/><line class="ql-stroke" x1="15" x2="11" y1="11" y2="15"/><rect class="ql-fill" height="1" rx="0.5" ry="0.5" width="7" x="2" y="14"/></svg>';
const codeIcon = '<svg viewbox="0 0 18 18"><polyline class="ql-even ql-stroke" points="5 7 3 9 5 11"/><polyline class="ql-even ql-stroke" points="13 7 15 9 13 11"/><line class="ql-stroke" x1="10" x2="8" y1="5" y2="13"/></svg>';
const colorIcon = '<svg viewbox="0 0 18 18"><line class="ql-color-label ql-stroke ql-transparent" x1="3" x2="15" y1="15" y2="15"/><polyline class="ql-stroke" points="5.5 11 9 3 12.5 11"/><line class="ql-stroke" x1="11.63" x2="6.38" y1="9" y2="9"/></svg>';
const directionLeftToRightIcon = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke ql-fill" points="3 11 5 9 3 7 3 11"/><line class="ql-stroke ql-fill" x1="15" x2="11" y1="4" y2="4"/><path class="ql-fill" d="M11,3a3,3,0,0,0,0,6h1V3H11Z"/><rect class="ql-fill" height="11" width="1" x="11" y="4"/><rect class="ql-fill" height="11" width="1" x="13" y="4"/></svg>';
const directionRightToLeftIcon = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke ql-fill" points="15 12 13 10 15 8 15 12"/><line class="ql-stroke ql-fill" x1="9" x2="5" y1="4" y2="4"/><path class="ql-fill" d="M5,3A3,3,0,0,0,5,9H6V3H5Z"/><rect class="ql-fill" height="11" width="1" x="5" y="4"/><rect class="ql-fill" height="11" width="1" x="7" y="4"/></svg>';
const formulaIcon = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z"/><rect class="ql-fill" height="1.6" rx="0.8" ry="0.8" width="5" x="5.15" y="6.2"/><path class="ql-fill" d="M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z"/></svg>';
const headerIcon = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm6.06787,9.209H14.98975V7.59863a.54085.54085,0,0,0-.605-.60547h-.62744a1.01119,1.01119,0,0,0-.748.29688L11.645,8.56641a.5435.5435,0,0,0-.022.8584l.28613.30762a.53861.53861,0,0,0,.84717.0332l.09912-.08789a1.2137,1.2137,0,0,0,.2417-.35254h.02246s-.01123.30859-.01123.60547V13.209H12.041a.54085.54085,0,0,0-.605.60547v.43945a.54085.54085,0,0,0,.605.60547h4.02686a.54085.54085,0,0,0,.605-.60547v-.43945A.54085.54085,0,0,0,16.06787,13.209Z"/></svg>';
const header2Icon = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.73975,13.81445v.43945a.54085.54085,0,0,1-.605.60547H11.855a.58392.58392,0,0,1-.64893-.60547V14.0127c0-2.90527,3.39941-3.42187,3.39941-4.55469a.77675.77675,0,0,0-.84717-.78125,1.17684,1.17684,0,0,0-.83594.38477c-.2749.26367-.561.374-.85791.13184l-.4292-.34082c-.30811-.24219-.38525-.51758-.1543-.81445a2.97155,2.97155,0,0,1,2.45361-1.17676,2.45393,2.45393,0,0,1,2.68408,2.40918c0,2.45312-3.1792,2.92676-3.27832,3.93848h2.79443A.54085.54085,0,0,1,16.73975,13.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>';
const header3Icon = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.65186,12.30664a2.6742,2.6742,0,0,1-2.915,2.68457,3.96592,3.96592,0,0,1-2.25537-.6709.56007.56007,0,0,1-.13232-.83594L11.64648,13c.209-.34082.48389-.36328.82471-.1543a2.32654,2.32654,0,0,0,1.12256.33008c.71484,0,1.12207-.35156,1.12207-.78125,0-.61523-.61621-.86816-1.46338-.86816H13.2085a.65159.65159,0,0,1-.68213-.41895l-.05518-.10937a.67114.67114,0,0,1,.14307-.78125l.71533-.86914a8.55289,8.55289,0,0,1,.68213-.7373V8.58887a3.93913,3.93913,0,0,1-.748.05469H11.9873a.54085.54085,0,0,1-.605-.60547V7.59863a.54085.54085,0,0,1,.605-.60547h3.75146a.53773.53773,0,0,1,.60547.59375v.17676a1.03723,1.03723,0,0,1-.27539.748L14.74854,10.0293A2.31132,2.31132,0,0,1,16.65186,12.30664ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>';
const header4Icon = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm7.05371,7.96582v.38477c0,.39648-.165.60547-.46191.60547h-.47314v1.29785a.54085.54085,0,0,1-.605.60547h-.69336a.54085.54085,0,0,1-.605-.60547V12.95605H11.333a.5412.5412,0,0,1-.60547-.60547v-.15332a1.199,1.199,0,0,1,.22021-.748l2.56348-4.05957a.7819.7819,0,0,1,.72607-.39648h1.27637a.54085.54085,0,0,1,.605.60547v3.7627h.33008A.54055.54055,0,0,1,17.05371,11.96582ZM14.28125,8.7207h-.022a4.18969,4.18969,0,0,1-.38525.81348l-1.188,1.80469v.02246h1.5293V9.60059A7.04058,7.04058,0,0,1,14.28125,8.7207Z"/></svg>';
const header5Icon = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.74023,12.18555a2.75131,2.75131,0,0,1-2.91553,2.80566,3.908,3.908,0,0,1-2.25537-.68164.54809.54809,0,0,1-.13184-.8252L11.73438,13c.209-.34082.48389-.36328.8252-.1543a2.23757,2.23757,0,0,0,1.1001.33008,1.01827,1.01827,0,0,0,1.1001-.96777c0-.61621-.53906-.97949-1.25439-.97949a2.15554,2.15554,0,0,0-.64893.09961,1.15209,1.15209,0,0,1-.814.01074l-.12109-.04395a.64116.64116,0,0,1-.45117-.71484l.231-3.00391a.56666.56666,0,0,1,.62744-.583H15.541a.54085.54085,0,0,1,.605.60547v.43945a.54085.54085,0,0,1-.605.60547H13.41748l-.04395.72559a1.29306,1.29306,0,0,1-.04395.30859h.022a2.39776,2.39776,0,0,1,.57227-.07715A2.53266,2.53266,0,0,1,16.74023,12.18555ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>';
const header6Icon = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M14.51758,9.64453a1.85627,1.85627,0,0,0-1.24316.38477H13.252a1.73532,1.73532,0,0,1,1.72754-1.4082,2.66491,2.66491,0,0,1,.5498.06641c.35254.05469.57227.01074.70508-.40723l.16406-.5166a.53393.53393,0,0,0-.373-.75977,4.83723,4.83723,0,0,0-1.17773-.14258c-2.43164,0-3.7627,2.17773-3.7627,4.43359,0,2.47559,1.60645,3.69629,3.19043,3.69629A2.70585,2.70585,0,0,0,16.96,12.19727,2.43861,2.43861,0,0,0,14.51758,9.64453Zm-.23047,3.58691c-.67187,0-1.22168-.81445-1.22168-1.45215,0-.47363.30762-.583.72559-.583.96875,0,1.27734.59375,1.27734,1.12207A.82182.82182,0,0,1,14.28711,13.23145ZM10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Z"/></svg>';
const italicIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="13" y1="4" y2="4"/><line class="ql-stroke" x1="5" x2="11" y1="14" y2="14"/><line class="ql-stroke" x1="8" x2="10" y1="14" y2="4"/></svg>';
const imageIcon = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="10" width="12" x="3" y="4"/><circle class="ql-fill" cx="6" cy="7" r="1"/><polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"/></svg>';
const indentIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-fill ql-stroke" points="3 7 3 11 5 9 3 7"/></svg>';
const outdentIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-stroke" points="5 7 5 11 3 9 5 7"/></svg>';
const linkIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="11" y1="7" y2="11"/><path class="ql-even ql-stroke" d="M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z"/><path class="ql-even ql-stroke" d="M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z"/></svg>';
const listBulletIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="6" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="6" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="6" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="3" y1="4" y2="4"/><line class="ql-stroke" x1="3" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="3" x2="3" y1="14" y2="14"/></svg>';
const listCheckIcon = '<svg class="" viewbox="0 0 18 18"><line class="ql-stroke" x1="9" x2="15" y1="4" y2="4"/><polyline class="ql-stroke" points="3 4 4 5 6 3"/><line class="ql-stroke" x1="9" x2="15" y1="14" y2="14"/><polyline class="ql-stroke" points="3 14 4 15 6 13"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-stroke" points="3 9 4 10 6 8"/></svg>';
const listOrderedIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="7" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="7" x2="15" y1="14" y2="14"/><line class="ql-stroke ql-thin" x1="2.5" x2="4.5" y1="5.5" y2="5.5"/><path class="ql-fill" d="M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z"/><path class="ql-stroke ql-thin" d="M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156"/><path class="ql-stroke ql-thin" d="M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109"/></svg>';
const subscriptIcon = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z"/><path class="ql-fill" d="M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z"/></svg>';
const superscriptIcon = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z"/><path class="ql-fill" d="M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z"/></svg>';
const strikeIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke ql-thin" x1="15.5" x2="2.5" y1="8.5" y2="9.5"/><path class="ql-fill" d="M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z"/><path class="ql-fill" d="M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z"/></svg>';
const tableIcon = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="12" width="12" x="3" y="3"/><rect class="ql-fill" height="2" width="3" x="5" y="5"/><rect class="ql-fill" height="2" width="4" x="9" y="5"/><g class="ql-fill ql-transparent"><rect height="2" width="3" x="5" y="8"/><rect height="2" width="4" x="9" y="8"/><rect height="2" width="3" x="5" y="11"/><rect height="2" width="4" x="9" y="11"/></g></svg>';
const underlineIcon = '<svg viewbox="0 0 18 18"><path class="ql-stroke" d="M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3"/><rect class="ql-fill" height="1" rx="0.5" ry="0.5" width="12" x="3" y="15"/></svg>';
const videoIcon = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="12" width="12" x="3" y="3"/><rect class="ql-fill" height="12" width="1" x="5" y="3"/><rect class="ql-fill" height="12" width="1" x="12" y="3"/><rect class="ql-fill" height="2" width="8" x="5" y="8"/><rect class="ql-fill" height="1" width="3" x="3" y="5"/><rect class="ql-fill" height="1" width="3" x="3" y="7"/><rect class="ql-fill" height="1" width="3" x="3" y="10"/><rect class="ql-fill" height="1" width="3" x="3" y="12"/><rect class="ql-fill" height="1" width="3" x="12" y="5"/><rect class="ql-fill" height="1" width="3" x="12" y="7"/><rect class="ql-fill" height="1" width="3" x="12" y="10"/><rect class="ql-fill" height="1" width="3" x="12" y="12"/></svg>';
const Icons = {
  align: {
    "": alignLeftIcon,
    center: alignCenterIcon,
    right: alignRightIcon,
    justify: alignJustifyIcon
  },
  background: backgroundIcon,
  blockquote: blockquoteIcon,
  bold: boldIcon,
  clean: cleanIcon,
  code: codeIcon,
  "code-block": codeIcon,
  color: colorIcon,
  direction: {
    "": directionLeftToRightIcon,
    rtl: directionRightToLeftIcon
  },
  formula: formulaIcon,
  header: {
    "1": headerIcon,
    "2": header2Icon,
    "3": header3Icon,
    "4": header4Icon,
    "5": header5Icon,
    "6": header6Icon
  },
  italic: italicIcon,
  image: imageIcon,
  indent: {
    "+1": indentIcon,
    "-1": outdentIcon
  },
  link: linkIcon,
  list: {
    bullet: listBulletIcon,
    check: listCheckIcon,
    ordered: listOrderedIcon
  },
  script: {
    sub: subscriptIcon,
    super: superscriptIcon
  },
  strike: strikeIcon,
  table: tableIcon,
  underline: underlineIcon,
  video: videoIcon
};
const DropdownIcon = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke" points="7 11 9 13 11 11 7 11"/><polygon class="ql-stroke" points="7 7 9 5 11 7 7 7"/></svg>';
let optionsCounter = 0;
function toggleAriaAttribute(element, attribute) {
  element.setAttribute(attribute, `${!(element.getAttribute(attribute) === "true")}`);
}
class Picker {
  constructor(select) {
    this.select = select;
    this.container = document.createElement("span");
    this.buildPicker();
    this.select.style.display = "none";
    this.select.parentNode.insertBefore(this.container, this.select);
    this.label.addEventListener("mousedown", () => {
      this.togglePicker();
    });
    this.label.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "Enter":
          this.togglePicker();
          break;
        case "Escape":
          this.escape();
          event.preventDefault();
          break;
      }
    });
    this.select.addEventListener("change", this.update.bind(this));
  }
  togglePicker() {
    this.container.classList.toggle("ql-expanded");
    toggleAriaAttribute(this.label, "aria-expanded");
    toggleAriaAttribute(this.options, "aria-hidden");
  }
  buildItem(option) {
    const item = document.createElement("span");
    item.tabIndex = "0";
    item.setAttribute("role", "button");
    item.classList.add("ql-picker-item");
    const value = option.getAttribute("value");
    if (value) {
      item.setAttribute("data-value", value);
    }
    if (option.textContent) {
      item.setAttribute("data-label", option.textContent);
    }
    item.addEventListener("click", () => {
      this.selectItem(item, true);
    });
    item.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "Enter":
          this.selectItem(item, true);
          event.preventDefault();
          break;
        case "Escape":
          this.escape();
          event.preventDefault();
          break;
      }
    });
    return item;
  }
  buildLabel() {
    const label = document.createElement("span");
    label.classList.add("ql-picker-label");
    label.innerHTML = DropdownIcon;
    label.tabIndex = "0";
    label.setAttribute("role", "button");
    label.setAttribute("aria-expanded", "false");
    this.container.appendChild(label);
    return label;
  }
  buildOptions() {
    const options = document.createElement("span");
    options.classList.add("ql-picker-options");
    options.setAttribute("aria-hidden", "true");
    options.tabIndex = "-1";
    options.id = `ql-picker-options-${optionsCounter}`;
    optionsCounter += 1;
    this.label.setAttribute("aria-controls", options.id);
    this.options = options;
    Array.from(this.select.options).forEach((option) => {
      const item = this.buildItem(option);
      options.appendChild(item);
      if (option.selected === true) {
        this.selectItem(item);
      }
    });
    this.container.appendChild(options);
  }
  buildPicker() {
    Array.from(this.select.attributes).forEach((item) => {
      this.container.setAttribute(item.name, item.value);
    });
    this.container.classList.add("ql-picker");
    this.label = this.buildLabel();
    this.buildOptions();
  }
  escape() {
    this.close();
    setTimeout(() => this.label.focus(), 1);
  }
  close() {
    this.container.classList.remove("ql-expanded");
    this.label.setAttribute("aria-expanded", "false");
    this.options.setAttribute("aria-hidden", "true");
  }
  selectItem(item) {
    let trigger = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    const selected = this.container.querySelector(".ql-selected");
    if (item === selected) return;
    if (selected != null) {
      selected.classList.remove("ql-selected");
    }
    if (item == null) return;
    item.classList.add("ql-selected");
    this.select.selectedIndex = Array.from(item.parentNode.children).indexOf(item);
    if (item.hasAttribute("data-value")) {
      this.label.setAttribute("data-value", item.getAttribute("data-value"));
    } else {
      this.label.removeAttribute("data-value");
    }
    if (item.hasAttribute("data-label")) {
      this.label.setAttribute("data-label", item.getAttribute("data-label"));
    } else {
      this.label.removeAttribute("data-label");
    }
    if (trigger) {
      this.select.dispatchEvent(new Event("change"));
      this.close();
    }
  }
  update() {
    let option;
    if (this.select.selectedIndex > -1) {
      const item = (
        // @ts-expect-error Fix me later
        this.container.querySelector(".ql-picker-options").children[this.select.selectedIndex]
      );
      option = this.select.options[this.select.selectedIndex];
      this.selectItem(item);
    } else {
      this.selectItem(null);
    }
    const isActive = option != null && option !== this.select.querySelector("option[selected]");
    this.label.classList.toggle("ql-active", isActive);
  }
}
class ColorPicker extends Picker {
  constructor(select, label) {
    super(select);
    this.label.innerHTML = label;
    this.container.classList.add("ql-color-picker");
    Array.from(this.container.querySelectorAll(".ql-picker-item")).slice(0, 7).forEach((item) => {
      item.classList.add("ql-primary");
    });
  }
  buildItem(option) {
    const item = super.buildItem(option);
    item.style.backgroundColor = option.getAttribute("value") || "";
    return item;
  }
  selectItem(item, trigger) {
    super.selectItem(item, trigger);
    const colorLabel = this.label.querySelector(".ql-color-label");
    const value = item ? item.getAttribute("data-value") || "" : "";
    if (colorLabel) {
      if (colorLabel.tagName === "line") {
        colorLabel.style.stroke = value;
      } else {
        colorLabel.style.fill = value;
      }
    }
  }
}
class IconPicker extends Picker {
  constructor(select, icons) {
    super(select);
    this.container.classList.add("ql-icon-picker");
    Array.from(this.container.querySelectorAll(".ql-picker-item")).forEach((item) => {
      item.innerHTML = icons[item.getAttribute("data-value") || ""];
    });
    this.defaultItem = this.container.querySelector(".ql-selected");
    this.selectItem(this.defaultItem);
  }
  selectItem(target, trigger) {
    super.selectItem(target, trigger);
    const item = target || this.defaultItem;
    if (item != null) {
      if (this.label.innerHTML === item.innerHTML) return;
      this.label.innerHTML = item.innerHTML;
    }
  }
}
const isScrollable = (el) => {
  const {
    overflowY
  } = getComputedStyle(el, null);
  return overflowY !== "visible" && overflowY !== "clip";
};
class Tooltip {
  constructor(quill, boundsContainer) {
    this.quill = quill;
    this.boundsContainer = boundsContainer || document.body;
    this.root = quill.addContainer("ql-tooltip");
    this.root.innerHTML = this.constructor.TEMPLATE;
    if (isScrollable(this.quill.root)) {
      this.quill.root.addEventListener("scroll", () => {
        this.root.style.marginTop = `${-1 * this.quill.root.scrollTop}px`;
      });
    }
    this.hide();
  }
  hide() {
    this.root.classList.add("ql-hidden");
  }
  position(reference) {
    const left = reference.left + reference.width / 2 - this.root.offsetWidth / 2;
    const top = reference.bottom + this.quill.root.scrollTop;
    this.root.style.left = `${left}px`;
    this.root.style.top = `${top}px`;
    this.root.classList.remove("ql-flip");
    const containerBounds = this.boundsContainer.getBoundingClientRect();
    const rootBounds = this.root.getBoundingClientRect();
    let shift2 = 0;
    if (rootBounds.right > containerBounds.right) {
      shift2 = containerBounds.right - rootBounds.right;
      this.root.style.left = `${left + shift2}px`;
    }
    if (rootBounds.left < containerBounds.left) {
      shift2 = containerBounds.left - rootBounds.left;
      this.root.style.left = `${left + shift2}px`;
    }
    if (rootBounds.bottom > containerBounds.bottom) {
      const height = rootBounds.bottom - rootBounds.top;
      const verticalShift = reference.bottom - reference.top + height;
      this.root.style.top = `${top - verticalShift}px`;
      this.root.classList.add("ql-flip");
    }
    return shift2;
  }
  show() {
    this.root.classList.remove("ql-editing");
    this.root.classList.remove("ql-hidden");
  }
}
const ALIGNS = [false, "center", "right", "justify"];
const COLORS = ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"];
const FONTS = [false, "serif", "monospace"];
const HEADERS = ["1", "2", "3", false];
const SIZES = ["small", false, "large", "huge"];
class BaseTheme extends Theme {
  constructor(quill, options) {
    super(quill, options);
    const listener = (e) => {
      if (!document.body.contains(quill.root)) {
        document.body.removeEventListener("click", listener);
        return;
      }
      if (this.tooltip != null && // @ts-expect-error
      !this.tooltip.root.contains(e.target) && // @ts-expect-error
      document.activeElement !== this.tooltip.textbox && !this.quill.hasFocus()) {
        this.tooltip.hide();
      }
      if (this.pickers != null) {
        this.pickers.forEach((picker) => {
          if (!picker.container.contains(e.target)) {
            picker.close();
          }
        });
      }
    };
    quill.emitter.listenDOM("click", document.body, listener);
  }
  addModule(name) {
    const module2 = super.addModule(name);
    if (name === "toolbar") {
      this.extendToolbar(module2);
    }
    return module2;
  }
  buildButtons(buttons, icons) {
    Array.from(buttons).forEach((button) => {
      const className = button.getAttribute("class") || "";
      className.split(/\s+/).forEach((name) => {
        if (!name.startsWith("ql-")) return;
        name = name.slice("ql-".length);
        if (icons[name] == null) return;
        if (name === "direction") {
          button.innerHTML = icons[name][""] + icons[name].rtl;
        } else if (typeof icons[name] === "string") {
          button.innerHTML = icons[name];
        } else {
          const value = button.value || "";
          if (value != null && icons[name][value]) {
            button.innerHTML = icons[name][value];
          }
        }
      });
    });
  }
  buildPickers(selects, icons) {
    this.pickers = Array.from(selects).map((select) => {
      if (select.classList.contains("ql-align")) {
        if (select.querySelector("option") == null) {
          fillSelect(select, ALIGNS);
        }
        if (typeof icons.align === "object") {
          return new IconPicker(select, icons.align);
        }
      }
      if (select.classList.contains("ql-background") || select.classList.contains("ql-color")) {
        const format = select.classList.contains("ql-background") ? "background" : "color";
        if (select.querySelector("option") == null) {
          fillSelect(select, COLORS, format === "background" ? "#ffffff" : "#000000");
        }
        return new ColorPicker(select, icons[format]);
      }
      if (select.querySelector("option") == null) {
        if (select.classList.contains("ql-font")) {
          fillSelect(select, FONTS);
        } else if (select.classList.contains("ql-header")) {
          fillSelect(select, HEADERS);
        } else if (select.classList.contains("ql-size")) {
          fillSelect(select, SIZES);
        }
      }
      return new Picker(select);
    });
    const update = () => {
      this.pickers.forEach((picker) => {
        picker.update();
      });
    };
    this.quill.on(Emitter.events.EDITOR_CHANGE, update);
  }
}
BaseTheme.DEFAULTS = merge({}, Theme.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        formula() {
          this.quill.theme.tooltip.edit("formula");
        },
        image() {
          let fileInput = this.container.querySelector("input.ql-image[type=file]");
          if (fileInput == null) {
            fileInput = document.createElement("input");
            fileInput.setAttribute("type", "file");
            fileInput.setAttribute("accept", this.quill.uploader.options.mimetypes.join(", "));
            fileInput.classList.add("ql-image");
            fileInput.addEventListener("change", () => {
              const range = this.quill.getSelection(true);
              this.quill.uploader.upload(range, fileInput.files);
              fileInput.value = "";
            });
            this.container.appendChild(fileInput);
          }
          fileInput.click();
        },
        video() {
          this.quill.theme.tooltip.edit("video");
        }
      }
    }
  }
});
class BaseTooltip extends Tooltip {
  constructor(quill, boundsContainer) {
    super(quill, boundsContainer);
    this.textbox = this.root.querySelector('input[type="text"]');
    this.listen();
  }
  listen() {
    this.textbox.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.save();
        event.preventDefault();
      } else if (event.key === "Escape") {
        this.cancel();
        event.preventDefault();
      }
    });
  }
  cancel() {
    this.hide();
    this.restoreFocus();
  }
  edit() {
    let mode = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "link";
    let preview = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    this.root.classList.remove("ql-hidden");
    this.root.classList.add("ql-editing");
    if (this.textbox == null) return;
    if (preview != null) {
      this.textbox.value = preview;
    } else if (mode !== this.root.getAttribute("data-mode")) {
      this.textbox.value = "";
    }
    const bounds = this.quill.getBounds(this.quill.selection.savedRange);
    if (bounds != null) {
      this.position(bounds);
    }
    this.textbox.select();
    this.textbox.setAttribute("placeholder", this.textbox.getAttribute(`data-${mode}`) || "");
    this.root.setAttribute("data-mode", mode);
  }
  restoreFocus() {
    this.quill.focus({
      preventScroll: true
    });
  }
  save() {
    let {
      value
    } = this.textbox;
    switch (this.root.getAttribute("data-mode")) {
      case "link": {
        const {
          scrollTop
        } = this.quill.root;
        if (this.linkRange) {
          this.quill.formatText(this.linkRange, "link", value, Emitter.sources.USER);
          delete this.linkRange;
        } else {
          this.restoreFocus();
          this.quill.format("link", value, Emitter.sources.USER);
        }
        this.quill.root.scrollTop = scrollTop;
        break;
      }
      case "video": {
        value = extractVideoUrl(value);
      }
      case "formula": {
        if (!value) break;
        const range = this.quill.getSelection(true);
        if (range != null) {
          const index2 = range.index + range.length;
          this.quill.insertEmbed(
            index2,
            // @ts-expect-error Fix me later
            this.root.getAttribute("data-mode"),
            value,
            Emitter.sources.USER
          );
          if (this.root.getAttribute("data-mode") === "formula") {
            this.quill.insertText(index2 + 1, " ", Emitter.sources.USER);
          }
          this.quill.setSelection(index2 + 2, Emitter.sources.USER);
        }
        break;
      }
    }
    this.textbox.value = "";
    this.hide();
  }
}
function extractVideoUrl(url) {
  let match2 = url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) || url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (match2) {
    return `${match2[1] || "https"}://www.youtube.com/embed/${match2[2]}?showinfo=0`;
  }
  if (match2 = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/)) {
    return `${match2[1] || "https"}://player.vimeo.com/video/${match2[2]}/`;
  }
  return url;
}
function fillSelect(select, values) {
  let defaultValue = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
  values.forEach((value) => {
    const option = document.createElement("option");
    if (value === defaultValue) {
      option.setAttribute("selected", "selected");
    } else {
      option.setAttribute("value", String(value));
    }
    select.appendChild(option);
  });
}
const TOOLBAR_CONFIG$1 = [["bold", "italic", "link"], [{
  header: 1
}, {
  header: 2
}, "blockquote"]];
class BubbleTooltip extends BaseTooltip {
  constructor(quill, bounds) {
    super(quill, bounds);
    this.quill.on(Emitter.events.EDITOR_CHANGE, (type, range, oldRange, source) => {
      if (type !== Emitter.events.SELECTION_CHANGE) return;
      if (range != null && range.length > 0 && source === Emitter.sources.USER) {
        this.show();
        this.root.style.left = "0px";
        this.root.style.width = "";
        this.root.style.width = `${this.root.offsetWidth}px`;
        const lines = this.quill.getLines(range.index, range.length);
        if (lines.length === 1) {
          const bounds2 = this.quill.getBounds(range);
          if (bounds2 != null) {
            this.position(bounds2);
          }
        } else {
          const lastLine = lines[lines.length - 1];
          const index2 = this.quill.getIndex(lastLine);
          const length = Math.min(lastLine.length() - 1, range.index + range.length - index2);
          const indexBounds = this.quill.getBounds(new Range(index2, length));
          if (indexBounds != null) {
            this.position(indexBounds);
          }
        }
      } else if (document.activeElement !== this.textbox && this.quill.hasFocus()) {
        this.hide();
      }
    });
  }
  listen() {
    super.listen();
    this.root.querySelector(".ql-close").addEventListener("click", () => {
      this.root.classList.remove("ql-editing");
    });
    this.quill.on(Emitter.events.SCROLL_OPTIMIZE, () => {
      setTimeout(() => {
        if (this.root.classList.contains("ql-hidden")) return;
        const range = this.quill.getSelection();
        if (range != null) {
          const bounds = this.quill.getBounds(range);
          if (bounds != null) {
            this.position(bounds);
          }
        }
      }, 1);
    });
  }
  cancel() {
    this.show();
  }
  position(reference) {
    const shift2 = super.position(reference);
    const arrow2 = this.root.querySelector(".ql-tooltip-arrow");
    arrow2.style.marginLeft = "";
    if (shift2 !== 0) {
      arrow2.style.marginLeft = `${-1 * shift2 - arrow2.offsetWidth / 2}px`;
    }
    return shift2;
  }
}
__publicField(BubbleTooltip, "TEMPLATE", ['<span class="ql-tooltip-arrow"></span>', '<div class="ql-tooltip-editor">', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-close"></a>', "</div>"].join(""));
class BubbleTheme extends BaseTheme {
  constructor(quill, options) {
    if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
      options.modules.toolbar.container = TOOLBAR_CONFIG$1;
    }
    super(quill, options);
    this.quill.container.classList.add("ql-bubble");
  }
  extendToolbar(toolbar) {
    this.tooltip = new BubbleTooltip(this.quill, this.options.bounds);
    if (toolbar.container != null) {
      this.tooltip.root.appendChild(toolbar.container);
      this.buildButtons(toolbar.container.querySelectorAll("button"), Icons);
      this.buildPickers(toolbar.container.querySelectorAll("select"), Icons);
    }
  }
}
BubbleTheme.DEFAULTS = merge({}, BaseTheme.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        link(value) {
          if (!value) {
            this.quill.format("link", false, Quill.sources.USER);
          } else {
            this.quill.theme.tooltip.edit();
          }
        }
      }
    }
  }
});
const TOOLBAR_CONFIG = [[{
  header: ["1", "2", "3", false]
}], ["bold", "italic", "underline", "link"], [{
  list: "ordered"
}, {
  list: "bullet"
}], ["clean"]];
class SnowTooltip extends BaseTooltip {
  constructor() {
    super(...arguments);
    __publicField(this, "preview", this.root.querySelector("a.ql-preview"));
  }
  listen() {
    super.listen();
    this.root.querySelector("a.ql-action").addEventListener("click", (event) => {
      if (this.root.classList.contains("ql-editing")) {
        this.save();
      } else {
        this.edit("link", this.preview.textContent);
      }
      event.preventDefault();
    });
    this.root.querySelector("a.ql-remove").addEventListener("click", (event) => {
      if (this.linkRange != null) {
        const range = this.linkRange;
        this.restoreFocus();
        this.quill.formatText(range, "link", false, Emitter.sources.USER);
        delete this.linkRange;
      }
      event.preventDefault();
      this.hide();
    });
    this.quill.on(Emitter.events.SELECTION_CHANGE, (range, oldRange, source) => {
      if (range == null) return;
      if (range.length === 0 && source === Emitter.sources.USER) {
        const [link, offset2] = this.quill.scroll.descendant(Link, range.index);
        if (link != null) {
          this.linkRange = new Range(range.index - offset2, link.length());
          const preview = Link.formats(link.domNode);
          this.preview.textContent = preview;
          this.preview.setAttribute("href", preview);
          this.show();
          const bounds = this.quill.getBounds(this.linkRange);
          if (bounds != null) {
            this.position(bounds);
          }
          return;
        }
      } else {
        delete this.linkRange;
      }
      this.hide();
    });
  }
  show() {
    super.show();
    this.root.removeAttribute("data-mode");
  }
}
__publicField(SnowTooltip, "TEMPLATE", ['<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-action"></a>', '<a class="ql-remove"></a>'].join(""));
class SnowTheme extends BaseTheme {
  constructor(quill, options) {
    if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
      options.modules.toolbar.container = TOOLBAR_CONFIG;
    }
    super(quill, options);
    this.quill.container.classList.add("ql-snow");
  }
  extendToolbar(toolbar) {
    if (toolbar.container != null) {
      toolbar.container.classList.add("ql-snow");
      this.buildButtons(toolbar.container.querySelectorAll("button"), Icons);
      this.buildPickers(toolbar.container.querySelectorAll("select"), Icons);
      this.tooltip = new SnowTooltip(this.quill, this.options.bounds);
      if (toolbar.container.querySelector(".ql-link")) {
        this.quill.keyboard.addBinding({
          key: "k",
          shortKey: true
        }, (_range, context) => {
          toolbar.handlers.link.call(toolbar, !context.format.link);
        });
      }
    }
  }
}
SnowTheme.DEFAULTS = merge({}, BaseTheme.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        link(value) {
          if (value) {
            const range = this.quill.getSelection();
            if (range == null || range.length === 0) return;
            let preview = this.quill.getText(range);
            if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf("mailto:") !== 0) {
              preview = `mailto:${preview}`;
            }
            const {
              tooltip
            } = this.quill.theme;
            tooltip.edit("link", preview);
          } else {
            this.quill.format("link", false, Quill.sources.USER);
          }
        }
      }
    }
  }
});
Quill.register({
  "attributors/attribute/direction": DirectionAttribute,
  "attributors/class/align": AlignClass,
  "attributors/class/background": BackgroundClass,
  "attributors/class/color": ColorClass,
  "attributors/class/direction": DirectionClass,
  "attributors/class/font": FontClass,
  "attributors/class/size": SizeClass,
  "attributors/style/align": AlignStyle,
  "attributors/style/background": BackgroundStyle,
  "attributors/style/color": ColorStyle,
  "attributors/style/direction": DirectionStyle,
  "attributors/style/font": FontStyle,
  "attributors/style/size": SizeStyle
}, true);
Quill.register({
  "formats/align": AlignClass,
  "formats/direction": DirectionClass,
  "formats/indent": IndentClass,
  "formats/background": BackgroundStyle,
  "formats/color": ColorStyle,
  "formats/font": FontClass,
  "formats/size": SizeClass,
  "formats/blockquote": Blockquote,
  "formats/code-block": CodeBlock,
  "formats/header": Header,
  "formats/list": ListItem,
  "formats/bold": Bold,
  "formats/code": Code,
  "formats/italic": Italic,
  "formats/link": Link,
  "formats/script": Script,
  "formats/strike": Strike,
  "formats/underline": Underline,
  "formats/formula": Formula,
  "formats/image": Image,
  "formats/video": Video,
  "modules/syntax": Syntax,
  "modules/table": Table,
  "modules/toolbar": Toolbar,
  "themes/bubble": BubbleTheme,
  "themes/snow": SnowTheme,
  "ui/icons": Icons,
  "ui/picker": Picker,
  "ui/icon-picker": IconPicker,
  "ui/color-picker": ColorPicker,
  "ui/tooltip": Tooltip
}, true);
class ReactQuill extends React.Component {
  constructor(props) {
    super(props);
    this.editingAreaRef = reactExports.createRef();
    this.dirtyProps = [
      "modules",
      "formats",
      "bounds",
      "theme",
      "children"
    ];
    this.cleanProps = [
      "id",
      "className",
      "style",
      "placeholder",
      "tabIndex",
      "onChange",
      "onChangeSelection",
      "onFocus",
      "onBlur",
      "onKeyPress",
      "onKeyDown",
      "onKeyUp"
    ];
    this.state = {
      generation: 0
    };
    this.selection = null;
    this.onEditorChange = (eventName, rangeOrDelta, oldRangeOrDelta, source) => {
      var _a, _b;
      if (eventName === "text-change") {
        (_a = this.onEditorChangeText) == null ? void 0 : _a.call(this, this.editor.root.innerHTML, rangeOrDelta, source, this.unprivilegedEditor);
      } else if (eventName === "selection-change") {
        (_b = this.onEditorChangeSelection) == null ? void 0 : _b.call(this, rangeOrDelta, source, this.unprivilegedEditor);
      }
    };
    const value = this.isControlled() ? props.value : props.defaultValue;
    this.value = value ?? "";
  }
  validateProps(props) {
    if (React.Children.count(props.children) > 1)
      throw new Error("The Quill editing area can only be composed of a single React element.");
    if (React.Children.count(props.children)) {
      const child = React.Children.only(props.children);
      if ((child == null ? void 0 : child.type) === "textarea")
        throw new Error("Quill does not support editing on a <textarea>. Use a <div> instead.");
    }
    if (this.lastDeltaChangeSet && props.value === this.lastDeltaChangeSet)
      throw new Error("You are passing the `delta` object from the `onChange` event back as `value`. You most probably want `editor.getContents()` instead. See: https://github.com/zenoamaro/react-quill#using-deltas");
  }
  shouldComponentUpdate(nextProps, nextState) {
    this.validateProps(nextProps);
    if (!this.editor || this.state.generation !== nextState.generation) {
      return true;
    }
    if ("value" in nextProps) {
      const prevContents = this.getEditorContents();
      const nextContents = nextProps.value ?? "";
      if (!this.isEqualValue(nextContents, prevContents)) {
        this.setEditorContents(this.editor, nextContents);
      }
    }
    if (nextProps.readOnly !== this.props.readOnly) {
      this.setEditorReadOnly(this.editor, nextProps.readOnly);
    }
    return [...this.cleanProps, ...this.dirtyProps].some((prop) => {
      return !isEqual$2(nextProps[prop], this.props[prop]);
    });
  }
  shouldComponentRegenerate(nextProps) {
    return this.dirtyProps.some((prop) => {
      return !isEqual$2(nextProps[prop], this.props[prop]);
    });
  }
  componentDidMount() {
    this.instantiateEditor();
    this.setEditorContents(this.editor, this.getEditorContents());
  }
  componentWillUnmount() {
    this.destroyEditor();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.editor && this.shouldComponentRegenerate(prevProps)) {
      const delta = this.editor.getContents();
      const selection = this.editor.getSelection();
      this.regenerationSnapshot = { delta, selection };
      this.setState({ generation: this.state.generation + 1 });
      this.destroyEditor();
    }
    if (this.state.generation !== prevState.generation) {
      const { delta, selection } = this.regenerationSnapshot;
      delete this.regenerationSnapshot;
      this.instantiateEditor();
      const editor = this.editor;
      editor.setContents(delta);
      postpone(() => this.setEditorSelection(editor, selection));
    }
  }
  instantiateEditor() {
    if (this.editor) {
      this.hookEditor(this.editor);
    } else {
      this.editor = this.createEditor(this.getEditingArea(), this.getEditorConfig());
    }
  }
  destroyEditor() {
    var _a;
    if (!this.editor)
      return;
    this.unhookEditor(this.editor);
    const toolbar = (_a = this.props.modules) == null ? void 0 : _a.toolbar;
    const usingExternalToolbar = typeof toolbar === "object" && toolbar && "container" in toolbar && typeof toolbar.container === "string" || typeof toolbar === "string";
    if (!usingExternalToolbar) {
      const leftOverToolbar = document.querySelector(".ql-toolbar");
      if (leftOverToolbar) {
        leftOverToolbar.remove();
      }
    }
    delete this.editor;
  }
  /*
  We consider the component to be controlled if `value` is being sent in props.
  */
  isControlled() {
    return "value" in this.props;
  }
  getEditorConfig() {
    return {
      bounds: this.props.bounds,
      formats: this.props.formats,
      modules: this.props.modules,
      placeholder: this.props.placeholder,
      readOnly: this.props.readOnly,
      tabIndex: this.props.tabIndex,
      theme: this.props.theme
    };
  }
  getEditor() {
    if (!this.editor)
      throw new Error("Accessing non-instantiated editor");
    return this.editor;
  }
  /**
  Creates an editor on the given element. The editor will be passed the
  configuration, have its events bound,
  */
  createEditor(element, config2) {
    const editor = new Quill(element, config2);
    if (config2.tabIndex != null) {
      this.setEditorTabIndex(editor, config2.tabIndex);
    }
    this.hookEditor(editor);
    return editor;
  }
  hookEditor(editor) {
    this.unprivilegedEditor = this.makeUnprivilegedEditor(editor);
    editor.on("editor-change", this.onEditorChange);
  }
  unhookEditor(editor) {
    editor.off("editor-change", this.onEditorChange);
  }
  getEditorContents() {
    return this.value;
  }
  getEditorSelection() {
    return this.selection;
  }
  /*
  True if the value is a Delta instance or a Delta look-alike.
  */
  isDelta(value) {
    return value && value.ops;
  }
  /*
  Special comparison function that knows how to compare Deltas.
  */
  isEqualValue(value, nextValue) {
    if (this.isDelta(value) && this.isDelta(nextValue)) {
      return isEqual$2(value.ops, nextValue.ops);
    } else {
      return isEqual$2(value, nextValue);
    }
  }
  /*
  Replace the contents of the editor, but keep the previous selection hanging
  around so that the cursor won't move.
  */
  setEditorContents(editor, value) {
    this.value = value;
    const sel = this.getEditorSelection();
    if (typeof value === "string") {
      editor.setContents(editor.clipboard.convert({ html: value }));
    } else {
      editor.setContents(value);
    }
    postpone(() => this.setEditorSelection(editor, sel));
  }
  setEditorSelection(editor, range) {
    this.selection = range;
    if (range) {
      const length = editor.getLength();
      range.index = Math.max(0, Math.min(range.index, length - 1));
      range.length = Math.max(0, Math.min(range.length, length - 1 - range.index));
      editor.setSelection(range);
    }
  }
  setEditorTabIndex(editor, tabIndex) {
    var _a;
    if ((_a = editor == null ? void 0 : editor.scroll) == null ? void 0 : _a.domNode) {
      editor.scroll.domNode.tabIndex = tabIndex;
    }
  }
  setEditorReadOnly(editor, value) {
    if (value) {
      editor.disable();
    } else {
      editor.enable();
    }
  }
  /*
  Returns a weaker, unprivileged proxy object that only exposes read-only
  accessors found on the editor instance, without any state-modifying methods.
  */
  makeUnprivilegedEditor(editor) {
    const e = editor;
    return {
      getHTML: () => e.root.innerHTML,
      getSemanticHTML: e.getSemanticHTML.bind(e),
      getLength: e.getLength.bind(e),
      getText: e.getText.bind(e),
      getContents: e.getContents.bind(e),
      getSelection: e.getSelection.bind(e),
      getBounds: e.getBounds.bind(e)
    };
  }
  getEditingArea() {
    const element = this.editingAreaRef.current;
    if (!element) {
      throw new Error("Cannot find element for editing area");
    }
    if (element.nodeType === 3) {
      throw new Error("Editing area cannot be a text node");
    }
    return element;
  }
  /*
  Renders an editor area, unless it has been provided one to clone.
  */
  renderEditingArea() {
    const { children, preserveWhitespace } = this.props;
    const { generation } = this.state;
    const properties = {
      key: generation,
      ref: this.editingAreaRef
    };
    if (React.Children.count(children)) {
      return React.cloneElement(React.Children.only(children), properties);
    }
    return preserveWhitespace ? React.createElement("pre", { ...properties }) : React.createElement("div", { ...properties });
  }
  render() {
    return React.createElement("div", { id: this.props.id, style: this.props.style, key: this.state.generation, className: `quill ${this.props.className ?? ""}`, onKeyPress: this.props.onKeyPress, onKeyDown: this.props.onKeyDown, onKeyUp: this.props.onKeyUp }, this.renderEditingArea());
  }
  onEditorChangeText(value, delta, source, editor) {
    var _a, _b;
    if (!this.editor)
      return;
    const nextContents = this.isDelta(this.value) ? editor.getContents() : editor.getHTML();
    if (nextContents !== this.getEditorContents()) {
      this.lastDeltaChangeSet = delta;
      this.value = nextContents;
      (_b = (_a = this.props).onChange) == null ? void 0 : _b.call(_a, value, delta, source, editor);
    }
  }
  onEditorChangeSelection(nextSelection, source, editor) {
    var _a, _b, _c, _d, _e, _f;
    if (!this.editor)
      return;
    const currentSelection = this.getEditorSelection();
    const hasGainedFocus = !currentSelection && nextSelection;
    const hasLostFocus = currentSelection && !nextSelection;
    if (isEqual$2(nextSelection, currentSelection))
      return;
    this.selection = nextSelection;
    (_b = (_a = this.props).onChangeSelection) == null ? void 0 : _b.call(_a, nextSelection, source, editor);
    if (hasGainedFocus) {
      (_d = (_c = this.props).onFocus) == null ? void 0 : _d.call(_c, nextSelection, source, editor);
    } else if (hasLostFocus) {
      (_f = (_e = this.props).onBlur) == null ? void 0 : _f.call(_e, currentSelection, source, editor);
    }
  }
  focus() {
    if (!this.editor)
      return;
    this.editor.focus();
  }
  blur() {
    if (!this.editor)
      return;
    this.selection = null;
    this.editor.blur();
  }
}
ReactQuill.displayName = "React Quill";
ReactQuill.Quill = Quill;
ReactQuill.defaultProps = {
  theme: "snow",
  modules: {},
  readOnly: false
};
function postpone(fn) {
  Promise.resolve().then(fn);
}
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME,
  [createCollectionScope]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = reactExports.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection(__scopeRovingFocusGroup);
  const isClickFocusRef = reactExports.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: reactExports.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: reactExports.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
          onMouseDown: composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true;
          }),
          onFocus: composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current;
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
              event.currentTarget.dispatchEvent(entryFocusEvent);
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable);
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME = "RovingFocusGroupItem";
var RovingFocusGroupItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      children,
      ...itemProps
    } = props;
    const autoId = useId();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    reactExports.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!focusable) event.preventDefault();
              else context.onItemFocus(id);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (event.key === "Tab" && event.shiftKey) {
                context.onItemShiftTab();
                return;
              }
              if (event.target !== event.currentTarget) return;
              const focusIntent = getFocusIntent(event, context.orientation, context.dir);
              if (focusIntent !== void 0) {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault();
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst(candidateNodes));
              }
            }),
            children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
          }
        )
      }
    );
  }
);
RovingFocusGroupItem.displayName = ITEM_NAME;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index2) => array[(startIndex + index2) % array.length]);
}
var Root = RovingFocusGroup;
var Item = RovingFocusGroupItem;
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
const SYMBOL_GROUPS = [
  {
    label: "Greek",
    symbols: [
      { label: "α", latex: "\\alpha" },
      { label: "β", latex: "\\beta" },
      { label: "γ", latex: "\\gamma" },
      { label: "δ", latex: "\\delta" },
      { label: "ε", latex: "\\epsilon" },
      { label: "ζ", latex: "\\zeta" },
      { label: "η", latex: "\\eta" },
      { label: "θ", latex: "\\theta" },
      { label: "ι", latex: "\\iota" },
      { label: "κ", latex: "\\kappa" },
      { label: "λ", latex: "\\lambda" },
      { label: "μ", latex: "\\mu" },
      { label: "ν", latex: "\\nu" },
      { label: "ξ", latex: "\\xi" },
      { label: "π", latex: "\\pi" },
      { label: "ρ", latex: "\\rho" },
      { label: "σ", latex: "\\sigma" },
      { label: "τ", latex: "\\tau" },
      { label: "υ", latex: "\\upsilon" },
      { label: "φ", latex: "\\phi" },
      { label: "χ", latex: "\\chi" },
      { label: "ψ", latex: "\\psi" },
      { label: "ω", latex: "\\omega" }
    ]
  },
  {
    label: "Operators",
    symbols: [
      { label: "+", latex: "+" },
      { label: "-", latex: "-" },
      { label: "×", latex: "\\times" },
      { label: "÷", latex: "\\div" },
      { label: "=", latex: "=" },
      { label: "≠", latex: "\\neq" },
      { label: "<", latex: "<" },
      { label: ">", latex: ">" },
      { label: "≤", latex: "\\leq" },
      { label: "≥", latex: "\\geq" },
      { label: "±", latex: "\\pm" },
      { label: "∞", latex: "\\infty" },
      { label: "∑", latex: "\\sum" },
      { label: "∏", latex: "\\prod" },
      { label: "∫", latex: "\\int" },
      { label: "∂", latex: "\\partial" },
      { label: "√", latex: "\\sqrt{}" },
      { label: "∈", latex: "\\in" },
      { label: "∉", latex: "\\notin" },
      { label: "⊂", latex: "\\subset" },
      { label: "⊃", latex: "\\supset" },
      { label: "∩", latex: "\\cap" },
      { label: "∪", latex: "\\cup" },
      { label: "¬", latex: "\\neg" },
      { label: "∧", latex: "\\wedge" },
      { label: "∨", latex: "\\vee" },
      { label: "∀", latex: "\\forall" },
      { label: "∃", latex: "\\exists" }
    ]
  },
  {
    label: "Templates",
    symbols: [
      { label: "x²", latex: "x^{2}" },
      { label: "xₙ", latex: "x_{n}" },
      { label: "a/b", latex: "\\frac{a}{b}" },
      { label: "√x", latex: "\\sqrt{x}" },
      { label: "∛x", latex: "\\sqrt[3]{x}" },
      { label: "lim", latex: "\\lim_{x \\to \\infty}" },
      { label: "∑ᵢ", latex: "\\sum_{i=0}^{n}" },
      { label: "∫ab", latex: "\\int_{a}^{b}" },
      { label: "vec", latex: "\\vec{v}" },
      { label: "hat", latex: "\\hat{x}" },
      { label: "bar", latex: "\\bar{x}" },
      {
        label: "mat",
        latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}"
      }
    ]
  }
];
function renderPreview(latex, display) {
  if (!latex.trim()) return "";
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode: display,
      output: "htmlAndMathml"
    });
  } catch {
    return `<span style="color: var(--color-destructive)">${latex}</span>`;
  }
}
function MathEditorModal({
  open,
  onClose,
  onInsert,
  initialValue = ""
}) {
  const [latex, setLatex] = reactExports.useState(initialValue);
  const [displayMode, setDisplayMode] = reactExports.useState(false);
  const [activeGroup, setActiveGroup] = reactExports.useState("Greek");
  const textareaRef = reactExports.useRef(null);
  const previewHtml = renderPreview(latex, displayMode);
  reactExports.useEffect(() => {
    if (open) {
      setLatex(initialValue);
    }
  }, [open, initialValue]);
  const insertSymbol = reactExports.useCallback(
    (symbolLatex) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        setLatex((prev) => prev + symbolLatex);
        return;
      }
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = latex.slice(0, start);
      const after = latex.slice(end);
      const newLatex = before + symbolLatex + after;
      setLatex(newLatex);
      requestAnimationFrame(() => {
        textarea.focus();
        const cursorPos = start + symbolLatex.length;
        textarea.setSelectionRange(cursorPos, cursorPos);
      });
    },
    [latex]
  );
  const handleInsert = reactExports.useCallback(() => {
    const trimmed = latex.trim();
    if (!trimmed) return;
    onInsert(trimmed, displayMode);
    onClose();
  }, [latex, displayMode, onInsert, onClose]);
  const handleKeyDown = reactExports.useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleInsert();
    },
    [onClose, handleInsert]
  );
  const currentGroup = SYMBOL_GROUPS.find((g) => g.label === activeGroup) ?? SYMBOL_GROUPS[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-2xl w-full p-0 gap-0 overflow-hidden",
      "data-ocid": "math_editor.dialog",
      onKeyDown: handleKeyDown,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "px-5 pt-5 pb-3 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base font-semibold text-foreground", children: "Math Formula Editor" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Mode" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex rounded-md border border-border overflow-hidden text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setDisplayMode(false),
                    "data-ocid": "math_editor.inline_toggle",
                    className: `px-3 py-1.5 transition-colors ${!displayMode ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`,
                    children: "Inline"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setDisplayMode(true),
                    "data-ocid": "math_editor.display_toggle",
                    className: `px-3 py-1.5 transition-colors ${displayMode ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`,
                    children: "Display"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "math-latex-input",
                  className: "text-xs font-medium text-muted-foreground",
                  children: "LaTeX"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  id: "math-latex-input",
                  ref: textareaRef,
                  value: latex,
                  onChange: (e) => setLatex(e.target.value),
                  placeholder: "e.g. \\\\frac{a}{b} or \\\\sum_{i=0}^{n} x_i",
                  rows: 4,
                  "data-ocid": "math_editor.latex_input",
                  className: "w-full rounded-md border border-input bg-card px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground resize-y focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Press",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1 py-0.5 rounded border border-border bg-muted text-xs", children: "Ctrl+Enter" }),
                " ",
                "to insert."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { value: activeGroup, onValueChange: setActiveGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TabsList, { className: "h-7 gap-1 bg-muted/40", children: SYMBOL_GROUPS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                TabsTrigger,
                {
                  value: g.label,
                  className: "text-xs h-6 px-2",
                  "data-ocid": `math_editor.symbol_tab.${g.label.toLowerCase()}`,
                  children: g.label
                },
                g.label
              )) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-8 gap-1", children: currentGroup.symbols.map((sym) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  title: sym.latex,
                  onClick: () => insertSymbol(sym.latex),
                  "data-ocid": "math_editor.symbol_button",
                  className: "flex items-center justify-center h-8 w-full rounded border border-border bg-card text-sm hover:bg-primary/10 hover:border-primary/40 transition-colors cursor-pointer font-serif",
                  children: sym.label
                },
                sym.latex
              )) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2 bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Preview" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "min-h-32 rounded-lg border border-border bg-card p-4 flex items-center justify-center",
                "data-ocid": "math_editor.preview",
                children: previewHtml ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    dangerouslySetInnerHTML: { __html: previewHtml },
                    className: `text-foreground ${displayMode ? "text-center text-lg" : "text-sm"}`
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic", children: "Your formula will appear here…" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: displayMode ? "Display mode — formula rendered on its own line" : "Inline mode — formula flows with surrounding text" }),
            latex.trim() && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Raw LaTeX" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "block rounded border border-border bg-card px-2.5 py-1.5 text-xs font-mono text-foreground break-all", children: displayMode ? `$$${latex}$$` : `$${latex}$` })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-t border-border flex items-center justify-end gap-2 bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: onClose,
              "data-ocid": "math_editor.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              onClick: handleInsert,
              disabled: !latex.trim(),
              "data-ocid": "math_editor.insert_button",
              children: "Insert Formula"
            }
          )
        ] })
      ]
    }
  ) });
}
function registerFormulaBlot() {
  var _a;
  try {
    const QuillClass = ReactQuill.Quill ?? window.Quill;
    if (!QuillClass) {
      console.error(
        "[RichTextEditor] Quill class not available — formula blot not registered"
      );
      return;
    }
    const existing = (_a = QuillClass.imports) == null ? void 0 : _a["formats/formula"];
    if (existing) return;
    const Embed2 = QuillClass.import("blots/embed");
    class FormulaBlot extends Embed2 {
      static create(value) {
        const node = Embed2.create(value);
        katex.render(value, node, {
          throwOnError: false,
          displayMode: false
        });
        node.setAttribute("data-value", value);
        return node;
      }
      static value(domNode) {
        return domNode.getAttribute("data-value");
      }
    }
    __publicField(FormulaBlot, "blotName", "formula");
    __publicField(FormulaBlot, "tagName", "span");
    __publicField(FormulaBlot, "className", "ql-formula");
    QuillClass.register(FormulaBlot, true);
  } catch (err) {
    console.error("[RichTextEditor] Failed to register FormulaBlot:", err);
  }
}
const TOOLBAR_MODULES = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "formula"],
  ["clean"]
];
const FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "link",
  "formula"
];
function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter text…",
  minHeight = 150,
  id
}) {
  const quillRef = reactExports.useRef(null);
  const [mathModalOpen, setMathModalOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    registerFormulaBlot();
  }, []);
  reactExports.useEffect(() => {
    var _a, _b, _c, _d;
    const editor = quillRef.current;
    if (!editor) return;
    const toolbarEl = (_d = (_c = (_b = (_a = editor.getEditor) == null ? void 0 : _a.call(editor)) == null ? void 0 : _b.getModule) == null ? void 0 : _c.call(_b, "toolbar")) == null ? void 0 : _d.container;
    if (!toolbarEl) return;
    const formulaBtn = toolbarEl.querySelector("button.ql-formula");
    if (!formulaBtn) return;
    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setMathModalOpen(true);
    };
    formulaBtn.addEventListener("click", handler, true);
    return () => formulaBtn.removeEventListener("click", handler, true);
  });
  const handleChange = reactExports.useCallback(
    (content) => {
      const isEmpty = content === "<p><br></p>" || content === "<p></p>";
      onChange(isEmpty ? "" : content);
    },
    [onChange]
  );
  const handleInsertFormula = reactExports.useCallback(
    (latex, displayMode) => {
      var _a, _b;
      const editor = (_b = (_a = quillRef.current) == null ? void 0 : _a.getEditor) == null ? void 0 : _b.call(_a);
      if (!editor) return;
      const quillAny = editor;
      const range = quillAny.getSelection(true);
      const idx = (range == null ? void 0 : range.index) ?? quillAny.getLength() - 1;
      if (range == null ? void 0 : range.length) quillAny.deleteText(idx, range.length);
      if (displayMode) {
        quillAny.insertText(idx, ` $${latex}$ `, "user");
      } else {
        quillAny.insertEmbed(idx, "formula", latex, "user");
        quillAny.insertText(idx + 1, " ", "user");
      }
      quillAny.setSelection(idx + 2, 0, "user");
    },
    []
  );
  const modules = reactExports.useMemo(
    () => ({
      toolbar: TOOLBAR_MODULES
    }),
    []
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rich-text-editor",
        style: { minHeight },
        "data-ocid": id ?? "rich_text_editor",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ReactQuill,
          {
            ref: quillRef,
            theme: "snow",
            value,
            onChange: handleChange,
            modules,
            formats: FORMATS,
            placeholder
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MathEditorModal,
      {
        open: mathModalOpen,
        onClose: () => setMathModalOpen(false),
        onInsert: handleInsertFormula
      }
    )
  ] });
}
function defaultQuestionFormData(sectionId = null) {
  return {
    text: "",
    questionType: QuestionType.mcSingle,
    options: ["", "", "", ""],
    correctAnswers: [0],
    correctText: "",
    correctOrder: [0, 1, 2, 3],
    imageFile: null,
    imagePreviewUrl: null,
    sectionId,
    explanation: "",
    audioUrl: "",
    audioStatus: "idle",
    audioErrorMsg: ""
  };
}
function QuestionForm({
  data,
  onChange,
  uploadProgress = 0,
  sections = [],
  onDownloadAudio
}) {
  const fileInputRef = reactExports.useRef(null);
  const [dragOverIndex, setDragOverIndex] = reactExports.useState(null);
  const dragItemIndex = reactExports.useRef(null);
  const [fontSize, setFontSizeState] = reactExports.useState(() => getFontSize());
  function handleFontSizeChange(size2) {
    setFontSizeState(size2);
    setFontSize(size2);
  }
  function update(partial) {
    onChange({ ...data, ...partial });
  }
  function handleTypeChange(type) {
    const filledOpts = data.options.filter((o) => o.trim());
    const optCount = Math.max(filledOpts.length, 4);
    const opts = Array.from(
      { length: optCount },
      (_, i) => data.options[i] ?? ""
    );
    update({
      questionType: type,
      options: opts,
      correctAnswers: [0],
      correctOrder: opts.map((_, i) => i)
    });
  }
  function handleOptionChange(index2, value) {
    const next = [...data.options];
    next[index2] = value;
    update({ options: next });
  }
  function addOption() {
    const nextOpts = [...data.options, ""];
    update({
      options: nextOpts,
      correctOrder: [...data.correctOrder, nextOpts.length - 1]
    });
  }
  function removeOption(index2) {
    if (data.options.length <= 2) return;
    const next = data.options.filter((_, i) => i !== index2);
    const nextCorrect = data.correctAnswers.filter((i) => i !== index2).map((i) => i > index2 ? i - 1 : i);
    const nextOrder = data.correctOrder.filter((i) => i !== index2).map((i) => i > index2 ? i - 1 : i);
    update({
      options: next,
      correctAnswers: nextCorrect,
      correctOrder: nextOrder
    });
  }
  function toggleCorrect(index2) {
    if (data.questionType === QuestionType.mcSingle) {
      update({ correctAnswers: [index2] });
    } else {
      const has = data.correctAnswers.includes(index2);
      update({
        correctAnswers: has ? data.correctAnswers.filter((i) => i !== index2) : [...data.correctAnswers, index2]
      });
    }
  }
  function onDragStart(index2) {
    dragItemIndex.current = index2;
  }
  function onDragOver(e, index2) {
    e.preventDefault();
    setDragOverIndex(index2);
  }
  function onDrop(targetIndex) {
    const from = dragItemIndex.current;
    if (from === null || from === targetIndex) {
      setDragOverIndex(null);
      return;
    }
    const next = [...data.correctOrder];
    const [removed] = next.splice(from, 1);
    next.splice(targetIndex, 0, removed);
    update({ correctOrder: next });
    dragItemIndex.current = null;
    setDragOverIndex(null);
  }
  function handleImageChange(e) {
    var _a;
    const file = ((_a = e.target.files) == null ? void 0 : _a[0]) ?? null;
    if (!file) return;
    const url = URL.createObjectURL(file);
    update({ imageFile: file, imagePreviewUrl: url });
  }
  function clearImage() {
    if (data.imagePreviewUrl) URL.revokeObjectURL(data.imagePreviewUrl);
    update({ imageFile: null, imagePreviewUrl: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
  async function handleAudioUrlChange(url) {
    update({ audioUrl: url, audioStatus: "idle", audioErrorMsg: "" });
  }
  async function handleAudioDownload() {
    if (!data.audioUrl.trim()) return;
    update({ audioStatus: "downloading", audioErrorMsg: "" });
    if (onDownloadAudio) {
      const result = await onDownloadAudio(data.audioUrl.trim());
      if (result.success) {
        update({ audioStatus: "ready", audioErrorMsg: "" });
      } else {
        update({
          audioStatus: "error",
          audioErrorMsg: result.error ?? "Download failed"
        });
      }
    } else {
      update({ audioStatus: "ready", audioErrorMsg: "" });
    }
  }
  function handleAudioRetry() {
    update({ audioStatus: "downloading", audioErrorMsg: "" });
    handleAudioDownload();
  }
  function clearAudio() {
    update({ audioUrl: "", audioStatus: "idle", audioErrorMsg: "" });
  }
  const fontSizeStyle = { fontSize: `${fontSize}px` };
  const showOptions = data.questionType === QuestionType.mcSingle || data.questionType === QuestionType.mcMulti || data.questionType === QuestionType.dragOrder;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Text size:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "range",
          min: FONT_SIZE_MIN,
          max: FONT_SIZE_MAX,
          step: 1,
          value: fontSize,
          onChange: (e) => handleFontSizeChange(Number(e.target.value)),
          "aria-label": `Font size: ${fontSize}px`,
          "data-ocid": "question_form.font_size_slider",
          className: "w-28 sm:w-36 accent-primary cursor-pointer"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums w-8 text-right select-none", children: [
        fontSize,
        "px"
      ] })
    ] }),
    sections.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Section" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: data.sectionId !== null ? String(data.sectionId) : "uncategorized",
          onValueChange: (v) => update({ sectionId: v === "uncategorized" ? null : Number(v) }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "admin.question_form.section.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Uncategorized" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "uncategorized", children: "Uncategorized" }),
              sections.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(s.id), children: s.name }, s.id))
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Question Type" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: data.questionType,
          onValueChange: (v) => handleTypeChange(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "admin.question_form.type.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(QuestionType).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(QuestionTypeIcon, { type: t }),
              QUESTION_TYPE_LABELS[t]
            ] }) }, t)) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "admin.question.text_input", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Question Text" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        RichTextEditor,
        {
          value: data.text,
          onChange: (html) => update({ text: html }),
          placeholder: "Enter the question…",
          minHeight: 150,
          id: "admin.question_form.text.editor"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "w-4 h-4 text-muted-foreground" }),
        "Question Image",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs", children: "(optional)" })
      ] }),
      data.imagePreviewUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: data.imagePreviewUrl,
            alt: "Question preview",
            className: "max-h-40 rounded-lg border border-border object-contain bg-muted"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: clearImage,
            className: "absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:opacity-90 transition-fast",
            "aria-label": "Remove image",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          className: "flex items-center gap-3 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-fast",
          "data-ocid": "admin.question_form.image.dropzone",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-5 h-5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Click to upload image" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "PNG, JPG up to 5 MB" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: "image/*",
                className: "hidden",
                onChange: handleImageChange
              }
            )
          ]
        }
      ),
      uploadProgress > 0 && uploadProgress < 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted rounded-full h-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "bg-accent rounded-full h-1.5 transition-all",
          style: { width: `${uploadProgress}%` }
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "w-4 h-4 text-muted-foreground" }),
        "Audio",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs", children: "(optional — paste MP3 URL)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input$1,
          {
            value: data.audioUrl,
            onChange: (e) => handleAudioUrlChange(e.target.value),
            onBlur: () => {
              if (data.audioUrl.trim() && data.audioStatus === "idle")
                handleAudioDownload();
            },
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAudioDownload();
              }
            },
            placeholder: "https://example.com/audio.mp3",
            className: "flex-1",
            "data-ocid": "admin.question_form.audio_url.input"
          }
        ),
        data.audioUrl.trim() && data.audioStatus !== "ready" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: handleAudioDownload,
            disabled: data.audioStatus === "downloading",
            "data-ocid": "admin.question_form.audio_download.button",
            children: data.audioStatus === "downloading" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : "Download"
          }
        ),
        data.audioUrl.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "icon",
            onClick: clearAudio,
            "aria-label": "Clear audio",
            "data-ocid": "admin.question_form.audio_clear.button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
          }
        )
      ] }),
      data.audioStatus === "downloading" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 text-xs text-muted-foreground",
          "data-ocid": "admin.question_form.audio.loading_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }),
            "Downloading audio…"
          ]
        }
      ),
      data.audioStatus === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start gap-2.5 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30",
          "data-ocid": "admin.question_form.audio.error_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-destructive shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-destructive", children: data.audioErrorMsg || "Download failed: URL not accessible. Max file size is 2MB." }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: handleAudioRetry,
                className: "shrink-0 text-xs h-7 border-destructive/40 text-destructive hover:bg-destructive/10",
                "data-ocid": "admin.question_form.audio.retry_button",
                children: "Retry"
              }
            )
          ]
        }
      ),
      data.audioStatus === "ready" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2.5 px-3 py-2 rounded-lg bg-accent/10 border border-accent/30",
          "data-ocid": "admin.question_form.audio.success_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-accent shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-accent flex-1", children: "Audio ready" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "audio",
              {
                src: data.audioUrl,
                controls: true,
                className: "h-7 max-w-48",
                "data-ocid": "admin.question_form.audio.preview_player",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" })
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
    showOptions && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: data.questionType === QuestionType.dragOrder ? "Items (set the correct order below)" : "Answer Options" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", style: fontSizeStyle, children: data.options.map((opt, i) => {
        const isCorrect = data.correctAnswers.includes(i);
        const optKey = `opt-${i}`;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          (data.questionType === QuestionType.mcSingle || data.questionType === QuestionType.mcMulti) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => toggleCorrect(i),
              "aria-label": isCorrect ? "Mark incorrect" : "Mark correct",
              className: `w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-fast ${isCorrect ? "border-accent bg-accent text-accent-foreground" : "border-border bg-background hover:border-accent/60"}`,
              "data-ocid": `admin.question.correct_checkbox.${i + 1}`,
              children: isCorrect && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block w-2 h-2 rounded-full bg-accent-foreground" })
            }
          ),
          data.questionType === QuestionType.dragOrder && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 rounded bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center shrink-0", children: i }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input$1,
            {
              value: opt,
              onChange: (e) => handleOptionChange(i, e.target.value),
              placeholder: `Option ${i + 1}`,
              "data-ocid": `admin.question.option_input.${i + 1}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => removeOption(i),
              disabled: data.options.length <= 2,
              className: "w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:text-destructive disabled:opacity-30 transition-fast",
              "aria-label": "Remove option",
              "data-ocid": `admin.question_form.remove_option.${i + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3.5 h-3.5" })
            }
          )
        ] }, optKey);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          className: "gap-1.5",
          onClick: addOption,
          "data-ocid": "admin.question_form.add_option.button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
            "Add Option"
          ]
        }
      ),
      (data.questionType === QuestionType.mcSingle || data.questionType === QuestionType.mcMulti) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: data.questionType === QuestionType.mcSingle ? "Click the circle to mark the correct answer." : "Click circles to mark all correct answers." })
    ] }),
    data.questionType === QuestionType.dragOrder && data.options.some((o) => o.trim()) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Correct Order" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Drag items to set the correct order." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: data.correctOrder.map((optIdx, pos) => {
        const posKey = `order-pos-${pos}`;
        const label = data.options[optIdx] || `Option ${optIdx}`;
        const isDragOver = dragOverIndex === pos;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            draggable: true,
            onDragStart: () => onDragStart(pos),
            onDragOver: (e) => onDragOver(e, pos),
            onDrop: () => onDrop(pos),
            onDragLeave: () => setDragOverIndex(null),
            className: `flex items-center gap-2 p-2.5 rounded-lg border cursor-grab active:cursor-grabbing transition-fast ${isDragOver ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:bg-muted/50"}`,
            "data-ocid": `admin.question_form.order_item.${pos + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "w-4 h-4 text-muted-foreground shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 h-5 rounded bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0", children: pos + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground truncate min-w-0", children: label })
            ]
          },
          posKey
        );
      }) })
    ] }),
    data.questionType === QuestionType.textInput && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Correct Answer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input$1,
        {
          value: data.correctText,
          onChange: (e) => update({ correctText: e.target.value }),
          placeholder: "Expected answer text",
          "data-ocid": "admin.question_form.correct_text.input"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "The student's answer will be compared (case-insensitive) to this text." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-1.5", children: [
        "Answer Explanation",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs", children: "(optional)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground -mt-1", children: "Shown to users after they answer this question" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "border-l-2 border-accent pl-3 rounded-sm",
          "data-ocid": "admin.question_form.explanation.editor",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            RichTextEditor,
            {
              value: data.explanation,
              onChange: (html) => update({ explanation: html }),
              placeholder: "Explain the correct answer, add hints, or include a formula…",
              minHeight: 120,
              id: "admin.question_form.explanation.editor"
            }
          )
        }
      )
    ] })
  ] });
}
const CONFIRM_PHRASE = "I want to delete";
function SectionDeleteDialog({
  open,
  onOpenChange,
  sectionName,
  questionCount,
  isPending,
  onConfirm
}) {
  const [phrase, setPhrase] = reactExports.useState("");
  const canDelete = phrase === CONFIRM_PHRASE;
  function handleOpenChange(next) {
    if (!next) setPhrase("");
    onOpenChange(next);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "admin.section_delete.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Delete Section?" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "You are about to permanently delete",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: sectionName }),
        ".",
        questionCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          " ",
          "This will also delete",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-destructive", children: [
            questionCount,
            " question",
            questionCount !== 1 ? "s" : ""
          ] }),
          " ",
          "inside it."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm", children: [
          "Type",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-destructive", children: CONFIRM_PHRASE }),
          " ",
          "to confirm:"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input$1,
          {
            value: phrase,
            onChange: (e) => setPhrase(e.target.value),
            placeholder: CONFIRM_PHRASE,
            autoComplete: "off",
            "data-ocid": "admin.section.delete_confirm_input"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: () => handleOpenChange(false),
          disabled: isPending,
          "data-ocid": "admin.section_delete.cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "destructive",
          onClick: onConfirm,
          disabled: !canDelete || isPending,
          "data-ocid": "admin.section.delete_confirm_button",
          children: isPending ? "Deleting…" : "Delete Section"
        }
      )
    ] })
  ] }) });
}
function defaultSectionForm() {
  return { name: "", description: "" };
}
function AdminTestDetailPage() {
  const { testId } = useParams({ from: "/admin/tests/$testId" });
  const { session } = useAuth();
  const backend = useBackend();
  const queryClient = useQueryClient();
  const username = (session == null ? void 0 : session.username) ?? "";
  const [questionModal, setQuestionModal] = reactExports.useState(
    null
  );
  const [editQuestion, setEditQuestion] = reactExports.useState(null);
  const [deleteQuestion, setDeleteQuestion] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(defaultQuestionFormData());
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [sectionModal, setSectionModal] = reactExports.useState(
    null
  );
  const [editSection, setEditSection] = reactExports.useState(null);
  const [deleteSectionTarget, setDeleteSectionTarget] = reactExports.useState(null);
  const [sectionForm, setSectionForm] = reactExports.useState(
    defaultSectionForm()
  );
  const [selectedSection, setSelectedSection] = reactExports.useState(null);
  const testIdBig = BigInt(testId);
  const { data: test } = useQuery({
    queryKey: ["test", testId],
    queryFn: async () => {
      if (!backend) return null;
      return backend.getTest(testIdBig);
    },
    enabled: !!backend
  });
  const { data: questions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ["questions", testId],
    queryFn: async () => {
      if (!backend) return [];
      return backend.listQuestionsForTest(testIdBig);
    },
    enabled: !!backend
  });
  const { data: sections = [], isLoading: sectionsLoading } = useQuery({
    queryKey: ["sections", testId],
    queryFn: async () => {
      if (!backend) return [];
      return backend.listSectionsForTest(testIdBig);
    },
    enabled: !!backend
  });
  const createSectionMutation = useMutation({
    mutationFn: async () => {
      if (!backend) throw new Error("Not connected");
      return backend.createSection(username, testIdBig, {
        name: sectionForm.name.trim(),
        description: sectionForm.description.trim()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections", testId] });
      ue.success("Section created");
      setSectionModal(null);
      setSectionForm(defaultSectionForm());
    },
    onError: () => ue.error("Failed to create section")
  });
  const updateSectionMutation = useMutation({
    mutationFn: async () => {
      if (!backend || !editSection) throw new Error("Not connected");
      return backend.updateSection(username, editSection.id, {
        name: sectionForm.name.trim(),
        description: sectionForm.description.trim()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections", testId] });
      ue.success("Section updated");
      setSectionModal(null);
      setEditSection(null);
      setSectionForm(defaultSectionForm());
    },
    onError: () => ue.error("Failed to update section")
  });
  const deleteSectionMutation = useMutation({
    mutationFn: async (sectionId) => {
      if (!backend) throw new Error("Not connected");
      return backend.deleteSection(username, sectionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections", testId] });
      queryClient.invalidateQueries({ queryKey: ["questions", testId] });
      ue.success("Section deleted");
      setDeleteSectionTarget(null);
    },
    onError: () => ue.error("Failed to delete section")
  });
  async function buildBlob() {
    if (!form.imageFile) return void 0;
    const bytes = new Uint8Array(await form.imageFile.arrayBuffer());
    const blob = ExternalBlob.fromBytes(bytes);
    return blob.withUploadProgress((p) => setUploadProgress(p));
  }
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!backend) throw new Error("Not connected");
      const imageBlob = await buildBlob();
      return backend.addQuestion(username, testIdBig, {
        text: form.text,
        questionType: form.questionType,
        options: form.options.filter((o) => o.trim()),
        correctAnswers: form.correctAnswers.map(BigInt),
        correctText: form.correctText,
        correctOrder: form.correctOrder.map(BigInt),
        imageBlob,
        sectionId: form.sectionId !== null ? BigInt(form.sectionId) : void 0,
        explanation: form.explanation || void 0
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", testId] });
      ue.success("Question added");
      setQuestionModal(null);
      setUploadProgress(0);
    },
    onError: () => {
      ue.error("Failed to add question");
      setUploadProgress(0);
    }
  });
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!backend || !editQuestion) throw new Error("Not connected");
      const imageBlob = await buildBlob();
      return backend.updateQuestion(username, editQuestion.id, {
        text: form.text,
        questionType: form.questionType,
        options: form.options.filter((o) => o.trim()),
        correctAnswers: form.correctAnswers.map(BigInt),
        correctText: form.correctText,
        correctOrder: form.correctOrder.map(BigInt),
        imageBlob,
        sectionId: form.sectionId !== null ? BigInt(form.sectionId) : void 0,
        explanation: form.explanation || void 0
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", testId] });
      ue.success("Question updated");
      setQuestionModal(null);
      setEditQuestion(null);
      setUploadProgress(0);
    },
    onError: () => {
      ue.error("Failed to update question");
      setUploadProgress(0);
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (qId) => {
      if (!backend) throw new Error("Not connected");
      return backend.deleteQuestion(username, qId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", testId] });
      ue.success("Question deleted");
      setDeleteQuestion(null);
    },
    onError: () => ue.error("Failed to delete question")
  });
  function openCreate(preselectedSectionId) {
    setForm(defaultQuestionFormData(preselectedSectionId ?? null));
    setEditQuestion(null);
    setQuestionModal("create");
  }
  function openEdit(q) {
    const optCount = Math.max(q.options.length, 4);
    const opts = Array.from({ length: optCount }, (_, i) => q.options[i] ?? "");
    setForm({
      text: q.text,
      questionType: q.questionType,
      options: opts,
      correctAnswers: q.correctAnswers.map(Number),
      correctText: q.correctText,
      correctOrder: q.correctOrder.length > 0 ? q.correctOrder.map(Number) : opts.map((_, i) => i),
      imageFile: null,
      imagePreviewUrl: q.imageBlob ? q.imageBlob.getDirectURL() : null,
      sectionId: q.sectionId != null ? Number(q.sectionId) : null,
      explanation: q.explanation ?? "",
      audioUrl: q.audioUrl ?? "",
      audioStatus: q.audioUrl ? "ready" : "idle",
      audioErrorMsg: ""
    });
    setEditQuestion(q);
    setQuestionModal("edit");
  }
  function openCreateInSection() {
    const sectionId = selectedSection && selectedSection.id !== BigInt(-1) ? Number(selectedSection.id) : null;
    openCreate(sectionId);
  }
  function openCreateSection() {
    setSectionForm(defaultSectionForm());
    setEditSection(null);
    setSectionModal("create");
  }
  function openEditSection(s) {
    setSectionForm({ name: s.name, description: s.description });
    setEditSection(s);
    setSectionModal("edit");
  }
  async function handleDownloadAudio(url) {
    if (!backend) return { success: false, error: "Not connected" };
    if (!editQuestion) {
      return { success: true };
    }
    try {
      const result = await backend.downloadAudio(
        username,
        editQuestion.id,
        url
      );
      if (result.__kind__ === "ok") return { success: true };
      return { success: false, error: result.err };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }
  function getQuestionCountForSection(sId) {
    return questions.filter((q) => q.sectionId === sId).length;
  }
  function getUncategorisedCount() {
    return questions.filter((q) => q.sectionId == null).length;
  }
  const sortedQuestions = [...questions].sort(
    (a, b) => Number(a.orderIndex) - Number(b.orderIndex)
  );
  const UNCATEGORISED_SENTINEL = {
    id: BigInt(-1),
    testId: testIdBig,
    name: "Uncategorised",
    description: "Questions not assigned to any section",
    createdAt: BigInt(0),
    updatedAt: BigInt(0)
  };
  const sectionQuestions = selectedSection ? selectedSection.id === BigInt(-1) ? sortedQuestions.filter((q) => q.sectionId == null) : sortedQuestions.filter((q) => q.sectionId === selectedSection.id) : [];
  const sectionOptions = sections.map((s) => ({
    id: Number(s.id),
    name: s.name
  }));
  const isLoading = questionsLoading || sectionsLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link$1,
        {
          to: "/admin",
          className: "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-fast",
          "data-ocid": "admin.detail.back.link",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            "My Tests"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: (test == null ? void 0 : test.name) ?? "Loading…" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        test ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: test.name }),
          test.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: test.description })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-48" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: questions.length }),
          " ",
          "question",
          questions.length !== 1 ? "s" : "",
          sections.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            " · ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: sections.length }),
            " ",
            "section",
            sections.length !== 1 ? "s" : ""
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => selectedSection ? openCreateInSection() : openCreate(),
          className: "gap-2",
          "data-ocid": "admin.question.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "Add Question"
          ]
        }
      )
    ] }),
    selectedSection ? (
      /* ── Section drill-down view ─────────────────────────────────── */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "admin.detail.section.drilldown.panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "gap-1.5 text-muted-foreground hover:text-foreground",
                onClick: () => setSelectedSection(null),
                "data-ocid": "admin.detail.section.back_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                  "Back to Sections"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "/" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-4 h-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: selectedSection.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                sectionQuestions.length,
                " question",
                sectionQuestions.length !== 1 ? "s" : ""
              ] })
            ] })
          ] }),
          selectedSection.id !== BigInt(-1) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 text-muted-foreground hover:text-foreground",
                onClick: () => openEditSection(selectedSection),
                "aria-label": "Edit section",
                "data-ocid": "admin.detail.section.drilldown.edit_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 text-muted-foreground hover:text-destructive",
                onClick: () => setDeleteSectionTarget(selectedSection),
                "aria-label": "Delete section",
                "data-ocid": "admin.detail.section.drilldown.delete_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
              }
            )
          ] })
        ] }),
        selectedSection.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-5 -mt-2", children: selectedSection.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-[4.5rem] z-20 mb-4 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: openCreateInSection,
            size: "sm",
            className: "gap-2 shadow-md",
            "data-ocid": "admin.detail.section.drilldown.add_question.button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              "Add Question"
            ]
          }
        ) }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-lg" }, i)) }) : sectionQuestions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-xl border border-dashed border-border",
            "data-ocid": "admin.detail.section.drilldown.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlignLeft, { className: "w-10 h-10 text-muted-foreground mb-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-1", children: "No questions in this section" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4", children: "Add a question and assign it to this section" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  onClick: openCreateInSection,
                  className: "gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                    "Add Question"
                  ]
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: sectionQuestions.map((q, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: "shadow-subtle border-border",
            "data-ocid": `admin.detail.question.item.${idx + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  RichTextDisplay,
                  {
                    html: q.text,
                    className: "font-medium text-foreground line-clamp-2 text-sm"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "gap-1 text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(QuestionTypeIcon, { type: q.questionType }),
                    QUESTION_TYPE_LABELS[q.questionType]
                  ] }),
                  q.imageBlob && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "gap-1 text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "w-3 h-3" }),
                    "Has image"
                  ] }),
                  q.options.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    q.options.length,
                    " option",
                    q.options.length !== 1 ? "s" : ""
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8 text-muted-foreground hover:text-foreground",
                    onClick: () => openEdit(q),
                    "aria-label": "Edit question",
                    "data-ocid": `admin.detail.question.edit_button.${idx + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8 text-muted-foreground hover:text-destructive",
                    onClick: () => setDeleteQuestion(q),
                    "aria-label": "Delete question",
                    "data-ocid": `admin.detail.question.delete_button.${idx + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                )
              ] })
            ] }) })
          },
          String(q.id)
        )) })
      ] })
    ) : (
      /* ── Default view: sections list only, NO questions ─────────── */
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-border bg-card shadow-subtle",
          "data-ocid": "admin.detail.sections.panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-sm", children: "Sections" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  "(",
                  sections.length,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "gap-1.5 h-8",
                  onClick: openCreateSection,
                  "data-ocid": "admin.section.add_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                    "Add Section"
                  ]
                }
              )
            ] }),
            sectionsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-lg" }, i)) }) : sections.length === 0 && getUncategorisedCount() === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center gap-2 py-8 text-center",
                "data-ocid": "admin.detail.sections.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-8 h-8 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No sections yet. Add sections to organise your questions." })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: [
              ...sections,
              ...getUncategorisedCount() > 0 ? [UNCATEGORISED_SENTINEL] : []
            ].map((s, idx) => {
              const isUncategorised = s.id === BigInt(-1);
              const qCount = isUncategorised ? getUncategorisedCount() : getQuestionCountForSection(s.id);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "li",
                {
                  className: "flex items-center gap-3 px-5 py-3 group",
                  "data-ocid": `admin.detail.section.item.${idx + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "flex-1 min-w-0 text-left cursor-pointer",
                        onClick: () => setSelectedSection(s),
                        "data-ocid": `admin.detail.section.open_button.${idx + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors", children: s.name }),
                          s.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: s.description })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs shrink-0", children: [
                      qCount,
                      " question",
                      qCount !== 1 ? "s" : ""
                    ] }),
                    !isUncategorised && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "h-7 w-7 text-muted-foreground hover:text-foreground shrink-0",
                          onClick: () => openEditSection(s),
                          "aria-label": "Edit section",
                          "data-ocid": `admin.section.edit_button.${idx + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "h-7 w-7 text-muted-foreground hover:text-destructive shrink-0",
                          onClick: () => setDeleteSectionTarget(s),
                          "aria-label": "Delete section",
                          "data-ocid": `admin.section.delete_button.${idx + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                        }
                      )
                    ] })
                  ]
                },
                String(s.id)
              );
            }) })
          ]
        }
      )
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!sectionModal,
        onOpenChange: (o) => {
          if (!o) {
            setSectionModal(null);
            setEditSection(null);
            setSectionForm(defaultSectionForm());
          }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "admin.section_form.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: sectionModal === "create" ? "Add Section" : "Edit Section" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "section-name", children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input$1,
                {
                  id: "section-name",
                  value: sectionForm.name,
                  onChange: (e) => setSectionForm((f) => ({ ...f, name: e.target.value })),
                  placeholder: "e.g. Chapter 1",
                  "data-ocid": "admin.section.name_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "section-desc", children: [
                "Description",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs ml-1", children: "(optional)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "section-desc",
                  value: sectionForm.description,
                  onChange: (e) => setSectionForm((f) => ({ ...f, description: e.target.value })),
                  placeholder: "A short description of this section",
                  rows: 2,
                  "data-ocid": "admin.section_form.description.textarea"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => {
                  setSectionModal(null);
                  setEditSection(null);
                  setSectionForm(defaultSectionForm());
                },
                "data-ocid": "admin.section.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => sectionModal === "create" ? createSectionMutation.mutate() : updateSectionMutation.mutate(),
                disabled: !sectionForm.name.trim() || createSectionMutation.isPending || updateSectionMutation.isPending,
                "data-ocid": "admin.section.save_button",
                children: createSectionMutation.isPending || updateSectionMutation.isPending ? "Saving…" : sectionModal === "create" ? "Add Section" : "Save Changes"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionDeleteDialog,
      {
        open: !!deleteSectionTarget,
        onOpenChange: (o) => !o && setDeleteSectionTarget(null),
        sectionName: (deleteSectionTarget == null ? void 0 : deleteSectionTarget.name) ?? "",
        questionCount: deleteSectionTarget ? getQuestionCountForSection(deleteSectionTarget.id) : 0,
        isPending: deleteSectionMutation.isPending,
        onConfirm: () => deleteSectionTarget && deleteSectionMutation.mutate(deleteSectionTarget.id)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!questionModal,
        onOpenChange: (o) => {
          if (!o) {
            setQuestionModal(null);
            setEditQuestion(null);
          }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "max-w-2xl max-h-[90vh] overflow-y-auto",
            "data-ocid": "admin.question.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: questionModal === "create" ? "Add Question" : "Edit Question" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                QuestionForm,
                {
                  data: form,
                  onChange: setForm,
                  uploadProgress,
                  sections: sectionOptions,
                  onDownloadAudio: handleDownloadAudio
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "mt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    onClick: () => {
                      setQuestionModal(null);
                      setEditQuestion(null);
                    },
                    "data-ocid": "admin.question.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: () => questionModal === "create" ? createMutation.mutate() : updateMutation.mutate(),
                    disabled: !form.text.trim() || createMutation.isPending || updateMutation.isPending || form.audioStatus === "downloading",
                    "data-ocid": "admin.question.submit_button",
                    children: createMutation.isPending || updateMutation.isPending ? "Saving…" : questionModal === "create" ? "Add Question" : "Save Changes"
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: !!deleteQuestion,
        onOpenChange: (o) => !o && setDeleteQuestion(null),
        title: "Delete Question?",
        description: "This will permanently delete this question. This action cannot be undone.",
        confirmLabel: "Delete Question",
        destructive: true,
        isPending: deleteMutation.isPending,
        onConfirm: () => deleteQuestion && deleteMutation.mutate(deleteQuestion.id),
        ocidPrefix: "admin.delete_question"
      }
    )
  ] });
}
export {
  AdminTestDetailPage
};
