const UNDO_LIMIT = 100;

export class Undoer<T> {
  private undoStack: T[] = [];
  private redoStack: T[] = [];
  current: T;

  constructor(state: T) {
    this.current = state;
  }

  /** record a new action and clear redo history */
  addAction(action: T): void {
    this.current = action;
    if (this.undoStack.length >= UNDO_LIMIT) {
      this.undoStack.shift(); // remove oldest action
    }
    this.undoStack.push(this.current);
    this.redoStack = [];
  }

  /** pop last action from undo stack, push it to redo, and return it */
  undo(): T | null {
    console.debug('Undoing action');
    if (this.undoStack.length === 0) return null;
    const action = this.undoStack.pop()!;
    this.redoStack.push(action);
    return action;
  }

  /** pop last action from redo stack, push it to undo, and return it */
  redo(): T | null {
    console.debug('Redoing action');
    if (this.redoStack.length === 0) return null;
    const action = this.redoStack.pop()!;
    this.undoStack.push(action);
    return action;
  }

  clone(): Undoer<T> {
    const clone = new Undoer<T>(this.current);
    clone.undoStack = [...this.undoStack];
    clone.redoStack = [...this.redoStack];
    return clone;
  }
}
