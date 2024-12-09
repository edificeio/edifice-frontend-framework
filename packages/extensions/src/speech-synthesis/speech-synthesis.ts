import { Node } from '@tiptap/core';

export interface SpeechSynthesisOptions {
  lang: string;
  pitch: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    speechSynthesis: {
      startSpeechSynthesis: () => ReturnType;
      stopSpeechSynthesis: () => ReturnType;
    };
  }
}

class SS_Node<O = any, S = any> extends Node<O, S> {
  static create<O = any, S = any>(config?: any) {
    return Node.create(config) as SS_Node<O, S>;
  }
}

export const SpeechSynthesis = SS_Node.create<SpeechSynthesisOptions>({
  name: 'speechSynthesis',
  addOptions() {
    return {
      lang: 'fr-FR',
      pitch: 1,
    };
  },
  addCommands() {
    return {
      startSpeechSynthesis:
        () =>
        ({ commands }) => {
          this.speechSynthesis = new SpeechSynthesisUtterance();
          this.speechSynthesis.lang = this.options.lang;
          this.speechSynthesis.pitch = this.options.pitch;
          this.speechSynthesis.text = this.editor.getText();

          window.speechSynthesis.speak(this.speechSynthesis);
          return commands;
        },
      stopSpeechSynthesis:
        () =>
        ({ commands }) => {
          window.speechSynthesis.cancel();
          return commands;
        },
    };
  },
});
