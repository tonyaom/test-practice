import { j as jsxRuntimeExports, a5 as Root, r as reactExports, u as useComposedRefs, a6 as WarningProvider, a7 as Content, k as composeEventHandlers, a8 as Title, a9 as Description, aa as Close, ab as createDialogScope, ac as Portal, ad as Overlay, ae as createSlottable, a as createContextScope, af as Trigger, q as cn, ag as buttonVariants, H as useAuth, J as useBackend, K as useQueryClient, ah as useQuery, N as useMutation, W as Badge, ai as Users, T as Skeleton, _ as Card, $ as CardHeader, aj as CircleCheck, ak as CardTitle, B as Button, al as ShieldOff, Z as Trash2, a3 as ue, w as Dialog, x as DialogContent, y as DialogHeader, z as DialogTitle, am as CircleAlert, an as ADMIN_USERNAME } from "./index-CVHVWwCD.js";
import { P as Progress } from "./progress-DH3zRfsd.js";
import { C as CircleX } from "./circle-x-BztSZyG9.js";
import { S as Star } from "./star-BHVzUVdz.js";
import { C as Circle } from "./circle-D_I0SP6j.js";
var ROOT_NAME = "AlertDialog";
var [createAlertDialogContext] = createContextScope(ROOT_NAME, [
  createDialogScope
]);
var useDialogScope = createDialogScope();
var AlertDialog$1 = (props) => {
  const { __scopeAlertDialog, ...alertDialogProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ...dialogScope, ...alertDialogProps, modal: true });
};
AlertDialog$1.displayName = ROOT_NAME;
var TRIGGER_NAME = "AlertDialogTrigger";
var AlertDialogTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...triggerProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { ...dialogScope, ...triggerProps, ref: forwardedRef });
  }
);
AlertDialogTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "AlertDialogPortal";
var AlertDialogPortal$1 = (props) => {
  const { __scopeAlertDialog, ...portalProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { ...dialogScope, ...portalProps });
};
AlertDialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "AlertDialogOverlay";
var AlertDialogOverlay$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...overlayProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, { ...dialogScope, ...overlayProps, ref: forwardedRef });
  }
);
AlertDialogOverlay$1.displayName = OVERLAY_NAME;
var CONTENT_NAME = "AlertDialogContent";
var [AlertDialogContentProvider, useAlertDialogContentContext] = createAlertDialogContext(CONTENT_NAME);
var Slottable = createSlottable("AlertDialogContent");
var AlertDialogContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, children, ...contentProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const cancelRef = reactExports.useRef(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      WarningProvider,
      {
        contentName: CONTENT_NAME,
        titleName: TITLE_NAME,
        docsSlug: "alert-dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogContentProvider, { scope: __scopeAlertDialog, cancelRef, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Content,
          {
            role: "alertdialog",
            ...dialogScope,
            ...contentProps,
            ref: composedRefs,
            onOpenAutoFocus: composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
              var _a;
              event.preventDefault();
              (_a = cancelRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
            }),
            onPointerDownOutside: (event) => event.preventDefault(),
            onInteractOutside: (event) => event.preventDefault(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Slottable, { children }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef })
            ]
          }
        ) })
      }
    );
  }
);
AlertDialogContent$1.displayName = CONTENT_NAME;
var TITLE_NAME = "AlertDialogTitle";
var AlertDialogTitle$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...titleProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { ...dialogScope, ...titleProps, ref: forwardedRef });
  }
);
AlertDialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "AlertDialogDescription";
var AlertDialogDescription$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...descriptionProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { ...dialogScope, ...descriptionProps, ref: forwardedRef });
});
AlertDialogDescription$1.displayName = DESCRIPTION_NAME;
var ACTION_NAME = "AlertDialogAction";
var AlertDialogAction$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...actionProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...actionProps, ref: forwardedRef });
  }
);
AlertDialogAction$1.displayName = ACTION_NAME;
var CANCEL_NAME = "AlertDialogCancel";
var AlertDialogCancel$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...cancelProps } = props;
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog);
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const ref = useComposedRefs(forwardedRef, cancelRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...cancelProps, ref });
  }
);
AlertDialogCancel$1.displayName = CANCEL_NAME;
var DescriptionWarning = ({ contentRef }) => {
  const MESSAGE = `\`${CONTENT_NAME}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${CONTENT_NAME}\` by passing a \`${DESCRIPTION_NAME}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;
  reactExports.useEffect(() => {
    var _a;
    const hasDescription = document.getElementById(
      (_a = contentRef.current) == null ? void 0 : _a.getAttribute("aria-describedby")
    );
    if (!hasDescription) console.warn(MESSAGE);
  }, [MESSAGE, contentRef]);
  return null;
};
var Root2 = AlertDialog$1;
var Portal2 = AlertDialogPortal$1;
var Overlay2 = AlertDialogOverlay$1;
var Content2 = AlertDialogContent$1;
var Action = AlertDialogAction$1;
var Cancel = AlertDialogCancel$1;
var Title2 = AlertDialogTitle$1;
var Description2 = AlertDialogDescription$1;
function AlertDialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay2,
    {
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function AlertDialogContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content2,
      {
        "data-slot": "alert-dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props
      }
    )
  ] });
}
function AlertDialogHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function AlertDialogFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function AlertDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title2,
    {
      "data-slot": "alert-dialog-title",
      className: cn("text-lg font-semibold", className),
      ...props
    }
  );
}
function AlertDialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Description2,
    {
      "data-slot": "alert-dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function AlertDialogAction({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Action,
    {
      className: cn(buttonVariants(), className),
      ...props
    }
  );
}
function AlertDialogCancel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Cancel,
    {
      className: cn(buttonVariants({ variant: "outline" }), className),
      ...props
    }
  );
}
function UserProgressModal({
  user,
  adminUsername,
  onClose
}) {
  const backend = useBackend();
  const { data: tests = [], isLoading: testsLoading } = useQuery({
    queryKey: ["tests"],
    queryFn: async () => {
      if (!backend) return [];
      return backend.listTests();
    },
    enabled: !!backend
  });
  const { data: progressList = [], isLoading: progressLoading } = useQuery({
    queryKey: ["adminUserProgress", user.username],
    queryFn: async () => {
      if (!backend || tests.length === 0) return [];
      const results = await Promise.all(
        tests.map(
          (t) => backend.adminGetUserProgress(adminUsername, user.username, Number(t.id)).then((p) => p).catch(() => null)
        )
      );
      return results.filter((r) => r !== null);
    },
    enabled: !!backend && tests.length > 0
  });
  const isLoading = testsLoading || progressLoading;
  const totalMastered = progressList.reduce(
    (sum, p) => sum + Number(p.masteredCount),
    0
  );
  const totalQuestions = progressList.reduce(
    (sum, p) => sum + Number(p.totalQuestions),
    0
  );
  const totalInProgress = progressList.reduce(
    (sum, p) => sum + Number(p.inProgressCount),
    0
  );
  const masteredTests = progressList.filter(
    (p) => Number(p.totalQuestions) > 0 && Number(p.masteredCount) === Number(p.totalQuestions)
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-lg max-h-[85vh] overflow-y-auto",
      "data-ocid": "admin.users.progress.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display", children: [
            "Progress: ",
            user.displayName || user.username
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "@",
            user.username,
            " — test mastery overview"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mt-1 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "text-sm text-muted-foreground hover:text-foreground transition-colors",
            "data-ocid": "admin.users.progress.close_button",
            children: "Close"
          }
        ) }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 py-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-lg" }, i)) }) : progressList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "py-10 text-center text-muted-foreground",
            "data-ocid": "admin.users.progress.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-8 h-8 mx-auto mb-2 opacity-40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No test progress recorded yet." })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3 mb-4", children: [
            {
              label: "Tests Mastered",
              value: masteredTests,
              total: progressList.length,
              accent: masteredTests > 0
            },
            {
              label: "Questions Mastered",
              value: totalMastered,
              total: totalQuestions,
              accent: totalMastered > 0
            },
            {
              label: "In Progress",
              value: totalInProgress,
              total: totalQuestions,
              accent: false
            }
          ].map(({ label, value, total, accent }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `rounded-lg border p-3 text-center ${accent ? "border-accent/20 bg-accent/5" : "border-border bg-card"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `font-display text-xl font-bold ${accent ? "text-accent" : "text-foreground"}`,
                    children: [
                      value,
                      total > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-normal text-muted-foreground", children: [
                        "/",
                        total
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: label })
              ]
            },
            label
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: progressList.map((p, idx) => {
            const total = Number(p.totalQuestions);
            const mastered = Number(p.masteredCount);
            const inProgress = Number(p.inProgressCount);
            const notStarted = total - mastered - inProgress;
            const pct = total > 0 ? Math.round(mastered / total * 100) : 0;
            const isTestMastered = total > 0 && mastered === total;
            const test = tests.find(
              (t) => Number(t.id) === Number(p.testId)
            );
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `rounded-lg border p-4 ${isTestMastered ? "border-accent/30 bg-accent/5" : "border-border bg-card"}`,
                "data-ocid": `admin.user_progress.item.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0 mr-2", children: [
                      isTestMastered && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3.5 h-3.5 text-accent shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground truncate", children: (test == null ? void 0 : test.name) ?? `Test ${String(p.testId)}` })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                      isTestMastered && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-xs bg-accent/15 text-accent border-accent/30 gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-2.5 h-2.5" }),
                        "Mastered"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Badge,
                        {
                          variant: "outline",
                          className: pct >= 75 ? "text-accent border-accent/30 bg-accent/5" : "text-muted-foreground border-border",
                          children: [
                            pct,
                            "%"
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: pct, className: "h-1.5 mb-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3 h-3 text-accent" }),
                      mastered,
                      " mastered"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3 text-primary" }),
                      inProgress,
                      " in progress"
                    ] }),
                    notStarted > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "w-3 h-3 text-muted-foreground" }),
                      notStarted,
                      " not started"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      total,
                      " total"
                    ] })
                  ] })
                ]
              },
              String(p.testId)
            );
          }) })
        ] })
      ]
    }
  ) });
}
function AdminUsersPage() {
  const { session } = useAuth();
  const backend = useBackend();
  const queryClient = useQueryClient();
  const adminUsername = (session == null ? void 0 : session.username) ?? "";
  const [selectedUser, setSelectedUser] = reactExports.useState(null);
  const [userToDelete, setUserToDelete] = reactExports.useState(null);
  const SEEDED_ADMIN = ADMIN_USERNAME;
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      if (!backend) return [];
      return backend.adminListUsers(adminUsername);
    },
    enabled: !!backend && !!adminUsername
  });
  const activateMutation = useMutation({
    mutationFn: async (targetUsername) => {
      if (!backend) throw new Error("Not connected");
      return backend.adminActivateUser(adminUsername, targetUsername);
    },
    onSuccess: (_, targetUsername) => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      ue.success(`User "${targetUsername}" has been activated.`);
    },
    onError: () => ue.error("Failed to activate user")
  });
  const deactivateMutation = useMutation({
    mutationFn: async (targetUsername) => {
      if (!backend) throw new Error("Not connected");
      return backend.adminDeactivateUser(adminUsername, targetUsername);
    },
    onSuccess: (_, targetUsername) => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      ue.success(`User "${targetUsername}" has been deactivated.`);
    },
    onError: () => ue.error("Failed to deactivate user")
  });
  const deleteMutation = useMutation({
    mutationFn: async (targetUsername) => {
      if (!backend) throw new Error("Not connected");
      const result = await backend.adminDeleteUser(
        adminUsername,
        targetUsername
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_, targetUsername) => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      ue.success(`User "${targetUsername}" has been permanently deleted.`);
      setUserToDelete(null);
    },
    onError: (err) => {
      ue.error(err.message || "Failed to delete user");
      setUserToDelete(null);
    }
  });
  const isMutating = activateMutation.isPending || deactivateMutation.isPending || deleteMutation.isPending;
  function canToggle(user) {
    return user.username !== adminUsername && user.role !== "admin";
  }
  function canDelete(user) {
    return user.username !== SEEDED_ADMIN && user.username !== adminUsername && user.role !== "admin";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
      "data-ocid": "admin.users.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Manage Users" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: "View user accounts, activate or deactivate access, and review test progress." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-sm px-3 py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 mr-1.5" }),
            users.length,
            " users"
          ] })
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-lg" }, i)) }) : users.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-24 text-center",
            "data-ocid": "admin.users.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-8 h-8 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-lg text-foreground mb-2", children: "No users yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-sm text-sm", children: "Users will appear here once they register." })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "admin.users.list", children: users.map((user, idx) => {
          const isCurrentUser = user.username === adminUsername;
          const isUserAdmin = user.role === "admin";
          const active = user.isActive;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: `shadow-subtle transition-all duration-200 ${!active ? "opacity-60 bg-muted/30" : ""}`,
              "data-ocid": `admin.users.item.${idx + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${active ? "bg-primary/10" : "bg-muted"}`,
                      children: active ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-muted-foreground" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-sm", children: user.displayName || user.username }),
                      isUserAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          variant: "default",
                          className: "text-xs h-5 px-1.5",
                          children: "Admin"
                        }
                      ),
                      isCurrentUser && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          variant: "outline",
                          className: "text-xs h-5 px-1.5 text-muted-foreground",
                          children: "You"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          variant: "outline",
                          className: `text-xs h-5 px-1.5 ${active ? "text-accent border-accent/30 bg-accent/5" : "text-destructive border-destructive/30 bg-destructive/5"}`,
                          children: active ? "Active" : "Deactivated"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                      "@",
                      user.username
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: () => setSelectedUser(user),
                      "data-ocid": `admin.users.progress_button.${idx + 1}`,
                      children: "View Progress"
                    }
                  ),
                  canToggle(user) ? active ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      className: "gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive",
                      disabled: isMutating,
                      onClick: () => deactivateMutation.mutate(user.username),
                      "data-ocid": `admin.users.deactivate_button.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { className: "w-3.5 h-3.5" }),
                        "Deactivate"
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      className: "gap-1.5 text-accent border-accent/30 hover:bg-accent/10 hover:text-accent",
                      disabled: isMutating,
                      onClick: () => activateMutation.mutate(user.username),
                      "data-ocid": `admin.users.activate_button.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
                        "Activate"
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      disabled: true,
                      className: "text-muted-foreground",
                      title: isCurrentUser ? "Cannot modify your own account" : "Cannot modify admin accounts",
                      children: "Protected"
                    }
                  ),
                  canDelete(user) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      className: "gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive",
                      disabled: isMutating,
                      onClick: () => setUserToDelete(user),
                      "data-ocid": `admin.users.delete_button.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
                        "Delete"
                      ]
                    }
                  )
                ] })
              ] }) })
            },
            user.username
          );
        }) }),
        selectedUser && /* @__PURE__ */ jsxRuntimeExports.jsx(
          UserProgressModal,
          {
            user: selectedUser,
            adminUsername,
            onClose: () => setSelectedUser(null)
          }
        ),
        userToDelete && /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: true, onOpenChange: (o) => !o && setUserToDelete(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "admin.users.delete.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display", children: "Delete user permanently?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
              "Are you sure you want to permanently delete",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                "@",
                userToDelete.username
              ] }),
              "? This will remove their account, all test results, and all mastery progress. This cannot be undone."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogCancel,
              {
                onClick: () => setUserToDelete(null),
                "data-ocid": "admin.users.delete.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              AlertDialogAction,
              {
                className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                disabled: deleteMutation.isPending,
                onClick: () => deleteMutation.mutate(userToDelete.username),
                "data-ocid": "admin.users.delete.confirm_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 mr-1.5" }),
                  "Delete Forever"
                ]
              }
            )
          ] })
        ] }) })
      ]
    }
  );
}
export {
  AdminUsersPage
};
