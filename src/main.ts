import * as vscode from 'vscode';
import { Menu } from './status/menu';

export function activate(context: vscode.ExtensionContext) {
  Menu.show();
}

// this method is called when your extension is deactivated
export function deactivate() {}
