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
    shortcut: "Q",
    code: "KeyQ",
  },
  {
    description: "announce clock",
    shortcut: "C",
    code: "KeyC",
  },
  {
    description: "announce last move",
    shortcut: "L",
    code: "KeyL",
  },
  {
    description: "announce opponent",
    shortcut: "O",
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
    h(
      "p",
      "Whatever your keyboard is, these chars will be mapped to QWERTY: q, c, l, o",
    ),
    h("label", [
      "type something",
      h("input", {
        attrs: { type: "text" },
        on: {
          keydown: (event) => {
            const foundAction = actions.find((a) => a.code === event.code);
            if (foundAction) {
              const target = event.target as HTMLInputElement;
              event.preventDefault();
              target.value += foundAction.shortcut;
            }
          },
        },
      }),
    ]),
  ]);
}
