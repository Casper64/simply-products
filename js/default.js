import { _ as _asyncToGenerator, r as regenerator, c as sleep } from './module.js';

$("#menu-bars").click(function () {
  $("#main-nav").toggleClass("open");
});

/** 
 * Make a typewriting animation.
 * Example: .typewriter[data-text="text"]
 * animates the text "text" inside .writeable
 * @async
 */

function typewriter() {
  return _typewriter.apply(this, arguments);
}
/**
 * Show popup with
 * @param {string} name - The name of the popup
 */

function _typewriter() {
  _typewriter = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
    var container, writeable, i, child, str, j, _char;

    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            container = document.getElementById("typewriter");
            writeable = document.getElementById("writeable");
            i = 0, child = container.children[i];

          case 3:
            if (!(i < container.children.length - 1)) {
              _context.next = 27;
              break;
            }

            writeable.innerHTML = "";
            _context.next = 7;
            return sleep(250);

          case 7:
            str = child.getAttribute("data-text");
            j = 0, _char = str[0];

          case 9:
            if (!(j < str.length)) {
              _context.next = 22;
              break;
            }

            writeable.textContent += _char;

            if (!(_char == ".")) {
              _context.next = 16;
              break;
            }

            _context.next = 14;
            return sleep(250);

          case 14:
            _context.next = 19;
            break;

          case 16:
            if (!(_char != " ")) {
              _context.next = 19;
              break;
            }

            _context.next = 19;
            return sleep(100);

          case 19:
            j++, _char = str[j];
            _context.next = 9;
            break;

          case 22:
            _context.next = 24;
            return sleep(1000);

          case 24:
            i++, child = container.children[i];
            _context.next = 3;
            break;

          case 27:
            _context.next = 29;
            return sleep(750);

          case 29:
            writeable.setAttribute("data-text", writeable.textContent);
            writeable.classList.add("glitch-text");
            _context.next = 33;
            return sleep(750);

          case 33:
            writeable.innerHTML = "";
            writeable.classList.Constants.remove("glitch-text");
            _context.next = 37;
            return sleep(750);

          case 37:
            container.remove();

          case 38:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _typewriter.apply(this, arguments);
}

function showPopup(name) {
  document.getElementById("popup-" + name).style.display = "grid";
}
/**
 * 
 * @param {string} name - The name of the popup
 * @param {Event} event - Default event
 * @param {Element} element - Element that initiated the call
 * @param {boolean} [force=true] - Force an outcome
 */

function hidePopup(name, event, element) {
  var force = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (!force && event.target != element) {
    event.stopPropagation();
    return;
  }

  document.getElementById("popup-" + name).style.display = "none";
}
/**
 * Helper function: category value setter for a popup
 * @param {string} category 
 */

function setCategoryValue(category) {
  document.getElementById("project-category").setAttribute("value", category);
}
var index = {
  typewriter: typewriter,
  sleep: sleep,
  showPopup: showPopup,
  hidePopup: hidePopup,
  setCategoryValue: setCategoryValue
};

export { index as default, hidePopup, setCategoryValue, showPopup, typewriter };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2RlZmF1bHQvbGlzdGVuZXJzLmpzIiwiLi4vc3JjL2RlZmF1bHQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5cbiQoXCIjbWVudS1iYXJzXCIpLmNsaWNrKCgpID0+IHtcbiAgICAkKFwiI21haW4tbmF2XCIpLnRvZ2dsZUNsYXNzKFwib3BlblwiKTtcbn0pIiwiaW1wb3J0IFwiLi9saXN0ZW5lcnNcIlxuaW1wb3J0IHsgc2xlZXAgfSBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIlxuXG4vKiogXG4gKiBNYWtlIGEgdHlwZXdyaXRpbmcgYW5pbWF0aW9uLlxuICogRXhhbXBsZTogLnR5cGV3cml0ZXJbZGF0YS10ZXh0PVwidGV4dFwiXVxuICogYW5pbWF0ZXMgdGhlIHRleHQgXCJ0ZXh0XCIgaW5zaWRlIC53cml0ZWFibGVcbiAqIEBhc3luY1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdHlwZXdyaXRlcigpIHtcbiAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0eXBld3JpdGVyXCIpO1xuICAgIGxldCB3cml0ZWFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndyaXRlYWJsZVwiKTtcbiAgICBmb3IgKGxldCBpID0gMCwgY2hpbGQgPSBjb250YWluZXIuY2hpbGRyZW5baV07IGkgPCBjb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSsrLCBjaGlsZCA9IGNvbnRhaW5lci5jaGlsZHJlbltpXSkge1xuICAgICAgICB3cml0ZWFibGUuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgYXdhaXQgc2xlZXAoMjUwKTtcbiAgICAgICAgbGV0IHN0ciA9IGNoaWxkLmdldEF0dHJpYnV0ZShcImRhdGEtdGV4dFwiKTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDAsIGNoYXI9c3RyWzBdOyBqIDwgc3RyLmxlbmd0aDsgaisrLCBjaGFyID0gc3RyW2pdKSB7XG4gICAgICAgICAgICB3cml0ZWFibGUudGV4dENvbnRlbnQgKz0gY2hhcjtcbiAgICAgICAgICAgIGlmIChjaGFyID09IFwiLlwiKSBhd2FpdCBzbGVlcCgyNTApO1xuICAgICAgICAgICAgZWxzZSBpZiAoY2hhciAhPSBcIiBcIikgYXdhaXQgc2xlZXAoMTAwKTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBzbGVlcCgxMDAwKTtcbiAgICB9XG4gICAgYXdhaXQgc2xlZXAoNzUwKTtcbiAgICB3cml0ZWFibGUuc2V0QXR0cmlidXRlKFwiZGF0YS10ZXh0XCIsIHdyaXRlYWJsZS50ZXh0Q29udGVudClcbiAgICB3cml0ZWFibGUuY2xhc3NMaXN0LmFkZChcImdsaXRjaC10ZXh0XCIpO1xuICAgIGF3YWl0IHNsZWVwKDc1MCk7XG4gICAgd3JpdGVhYmxlLmlubmVySFRNTCA9IFwiXCI7XG4gICAgd3JpdGVhYmxlLmNsYXNzTGlzdC5Db25zdGFudHMucmVtb3ZlKFwiZ2xpdGNoLXRleHRcIik7XG4gICAgYXdhaXQgc2xlZXAoNzUwKTtcblxuICAgIGNvbnRhaW5lci5yZW1vdmUoKTtcbn1cblxuLyoqXG4gKiBTaG93IHBvcHVwIHdpdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHBvcHVwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaG93UG9wdXAobmFtZSkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9wdXAtXCIrbmFtZSkuc3R5bGUuZGlzcGxheSA9IFwiZ3JpZFwiO1xufVxuLyoqXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHBvcHVwXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudCAtIERlZmF1bHQgZXZlbnRcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCAtIEVsZW1lbnQgdGhhdCBpbml0aWF0ZWQgdGhlIGNhbGxcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2ZvcmNlPXRydWVdIC0gRm9yY2UgYW4gb3V0Y29tZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaGlkZVBvcHVwKG5hbWUsIGV2ZW50LCBlbGVtZW50LCBmb3JjZT1mYWxzZSkge1xuICAgIGlmICghZm9yY2UgJiYgZXZlbnQudGFyZ2V0ICE9IGVsZW1lbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3B1cC1cIituYW1lKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG59XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uOiBjYXRlZ29yeSB2YWx1ZSBzZXR0ZXIgZm9yIGEgcG9wdXBcbiAqIEBwYXJhbSB7c3RyaW5nfSBjYXRlZ29yeSBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldENhdGVnb3J5VmFsdWUoY2F0ZWdvcnkpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByb2plY3QtY2F0ZWdvcnlcIikuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgY2F0ZWdvcnkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgdHlwZXdyaXRlcixcbiAgICBzbGVlcCxcbiAgICBzaG93UG9wdXAsXG4gICAgaGlkZVBvcHVwLFxuICAgIHNldENhdGVnb3J5VmFsdWVcbn0iXSwibmFtZXMiOlsiJCIsImNsaWNrIiwidG9nZ2xlQ2xhc3MiLCJ0eXBld3JpdGVyIiwiY29udGFpbmVyIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsIndyaXRlYWJsZSIsImkiLCJjaGlsZCIsImNoaWxkcmVuIiwibGVuZ3RoIiwiaW5uZXJIVE1MIiwic2xlZXAiLCJzdHIiLCJnZXRBdHRyaWJ1dGUiLCJqIiwiY2hhciIsInRleHRDb250ZW50Iiwic2V0QXR0cmlidXRlIiwiY2xhc3NMaXN0IiwiYWRkIiwiQ29uc3RhbnRzIiwicmVtb3ZlIiwic2hvd1BvcHVwIiwibmFtZSIsInN0eWxlIiwiZGlzcGxheSIsImhpZGVQb3B1cCIsImV2ZW50IiwiZWxlbWVudCIsImZvcmNlIiwidGFyZ2V0Iiwic3RvcFByb3BhZ2F0aW9uIiwic2V0Q2F0ZWdvcnlWYWx1ZSIsImNhdGVnb3J5Il0sIm1hcHBpbmdzIjoiOztBQUVBQSxDQUFDLENBQUMsWUFBRCxDQUFELENBQWdCQyxLQUFoQixDQUFzQixZQUFNO0FBQ3hCRCxFQUFBQSxDQUFDLENBQUMsV0FBRCxDQUFELENBQWVFLFdBQWYsQ0FBMkIsTUFBM0I7QUFDSCxDQUZEOztBQ0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7U0FDc0JDLFVBQXRCO0FBQUE7QUFBQTtBQXlCQTtBQUNBO0FBQ0E7QUFDQTs7O2lFQTVCTztBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0NDLFlBQUFBLFNBREQsR0FDYUMsUUFBUSxDQUFDQyxjQUFULENBQXdCLFlBQXhCLENBRGI7QUFFQ0MsWUFBQUEsU0FGRCxHQUVhRixRQUFRLENBQUNDLGNBQVQsQ0FBd0IsV0FBeEIsQ0FGYjtBQUdNRSxZQUFBQSxDQUhOLEdBR1UsQ0FIVixFQUdhQyxLQUhiLEdBR3FCTCxTQUFTLENBQUNNLFFBQVYsQ0FBbUJGLENBQW5CLENBSHJCOztBQUFBO0FBQUEsa0JBRzRDQSxDQUFDLEdBQUdKLFNBQVMsQ0FBQ00sUUFBVixDQUFtQkMsTUFBbkIsR0FBNEIsQ0FINUU7QUFBQTtBQUFBO0FBQUE7O0FBSUNKLFlBQUFBLFNBQVMsQ0FBQ0ssU0FBVixHQUFzQixFQUF0QjtBQUpEO0FBQUEsbUJBS09DLEtBQUssQ0FBQyxHQUFELENBTFo7O0FBQUE7QUFNS0MsWUFBQUEsR0FOTCxHQU1XTCxLQUFLLENBQUNNLFlBQU4sQ0FBbUIsV0FBbkIsQ0FOWDtBQU9VQyxZQUFBQSxDQVBWLEdBT2MsQ0FQZCxFQU9pQkMsS0FQakIsR0FPc0JILEdBQUcsQ0FBQyxDQUFELENBUHpCOztBQUFBO0FBQUEsa0JBTzhCRSxDQUFDLEdBQUdGLEdBQUcsQ0FBQ0gsTUFQdEM7QUFBQTtBQUFBO0FBQUE7O0FBUUtKLFlBQUFBLFNBQVMsQ0FBQ1csV0FB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
