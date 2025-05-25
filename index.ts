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
    description: "announce quit",
    shortcut: "q",
    code: "KeyQ",
  },
  {
    description: "announce clock",
    shortcut: "c",
    code: "KeyC",
  },
  {
    description: "announce last move",
    shortcut: "l",
    code: "KeyL",
  },
  {
    description: "announce opponent",
    shortcut: "o",
    code: "KeyO",
  },
];

let vnode: VNode;

redraw();

function redraw() {
  vnode = patch(vnode || container, h("main", [renderIntro()]));
}

function renderIntro(): VNode {
  return h("div", [
    h("h2", "Input"),
    h("p", "Try these 3 commands: q, c, l, o"),
    h("p", "They are mapped to QWERTY"),
    h("label", [
      "type something",
      h("input.num-games", {
        attrs: { type: "text" },
        on: {
          keydown: (event) => {
            if (event.code === "Tab" || event.shiftKey) return;
            const foundAction = actions.find((a) => a.code === event.code);
            if (foundAction) {
              notify(foundAction.shortcut + " for '" + foundAction.description + "'");
            } else notify(event.key + ' (not mapped)');
            const target = event.target as HTMLInputElement;
            event.preventDefault();
            target.value = event.code;
          },
        },
      }),
    ]),
    h("div#notification", { attrs: { "aria-live": "polite" } }),
  ]);
}

function notify(text: string) {
  const notification = document.getElementById("notification");
  if (notification) notification.textContent = "You typed " + text;
}
