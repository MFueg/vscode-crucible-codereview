import * as vscode from 'vscode';

class MenuItem implements vscode.QuickPickItem {
  public constructor(
    public readonly label: string,
    public readonly description?: string,
    public readonly detail?: string,
    public readonly picked?: boolean
  ) {}
}

export class Menu {
  static show() {
    // TODO!
    // let gitScm = vscode.scm.createSourceControl('git', 'Git');
    let entries = new Array<MenuItem>();
    entries.push(new MenuItem('Neues Review erstellen ...'));
    entries.push(new MenuItem('CR-1231'));
    entries.push(new MenuItem('CR-6122'));
    vscode.window
      .showQuickPick(entries, {
        canPickMany: false
      })
      .then((r) => {});
  }
}
