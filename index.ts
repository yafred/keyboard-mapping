import {
  h,
  init,
  VNode,
  classModule,
  attributesModule,
  eventListenersModule,
  styleModule,
} from "snabbdom";

const patch = init([
  classModule,
  attributesModule,
  eventListenersModule,
  styleModule,
]);
const container = document.getElementById("container");

interface Action {
  description: string;
  shortcut: string;
  code: string;
}

const actions: Action[] = [
  {
    description: "announce clock",
    shortcut: "c",
    code: "",
  },
  {
    description: "announce last move",
    shortcut: "l",
    code: "",
  },
  {
    description: "announce opponent",
    shortcut: "o",
    code: "",
  },
];

let vnode: VNode;

redraw();

function redraw() {
  vnode = patch(vnode || container, h("main", [renderIntro(), renderHelp()]));
}

function renderIntro(): VNode {
  return h("div", [
    h("h2", "Input"),
    h(
      "p",
      "Try typing characters, map the commands in the heading below, try again",
    ),
    h("label", [
      "type something",
      h("input.num-games", {
        attrs: { type: "text" },
        on: {
          keydown: (event) => {
            if (event.code === "Tab" || event.shiftKey) return;
            const foundAction = actions.find((a) => a.code === event.code);
            if (foundAction)
              notify(foundAction.shortcut + " for " + foundAction.description);
            else notify(event.key);
            const target = event.target as HTMLInputElement;
            event.preventDefault();
            target.value = event.code;
          },
        },
      }),
    ]),
  ]);
}

function renderHelp(): VNode {
  return h("div", [
    h("h2", "Actions and keyboard mappings"),
    h(
      "div",
      {
        attrs: {
          role: "table",
          "aria-label": "Actions and mappings table",
          class: "grid-container",
          "aria-rowcount": actions.length,
        },
      },
      [
        h(
          "div",
          {
            attrs: {
              role: "row",
              class: "grid-header",
            },
          },
          [
            h("div", { attrs: { role: "columnheader" } }, "Description"),
            h("div", { attrs: { role: "columnheader" } }, "Shortcut"),
            h("div", { attrs: { role: "columnheader" } }, "Keyboard mapping"),
          ],
        ),

        ...actions.map((item, index) => {
          return h(
            "div",
            {
              attrs: {
                role: "row",
                class: "grid-data",
                "aria-rowindex": index + 1,
              },
            },
            [
              h("div", { attrs: { role: "cell" } }, item.description),
              h("div", { attrs: { role: "cell" } }, item.shortcut),
              h(
                "div",
                { attrs: { role: "cell" } },
                h("label", [
                  "enter mapping for " + item.description,
                  h("input", {
                    attrs: { type: "text" },
                    on: {
                      keydown: (event) => {
                        if (event.code === "Tab" || event.shiftKey) return;
                        const target = event.target as HTMLInputElement;
                        event.preventDefault();
                        target.value = event.code;
                        notify(event.code);
                        actions[index].code = event.code;
                      },
                    },
                  }),
                ]),
              ),
            ],
          );
        }),
      ],
    ),
    h("div#notification", { attrs: { "aria-live": "polite" } }),
  ]);
}

function notify(text: string) {
  const notification = document.getElementById("notification");
  if (notification) notification.textContent = "You typed " + text;
}
