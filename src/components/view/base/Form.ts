export interface FormData {
  [key: string]: string;
}

export class Form<T extends FormData> {
  protected submitButton: HTMLButtonElement;
  protected errorElement: HTMLElement;
  protected inputs: HTMLInputElement[];

  constructor(protected readonly container: HTMLFormElement) {
    this.submitButton = container.querySelector('[type="submit"]')!;
    this.errorElement = container.querySelector('.form__errors')!;
    this.inputs = Array.from(container.querySelectorAll('input'));
  }

  setSubmitEnabled(enabled: boolean) {
    this.submitButton.disabled = !enabled;
  };

  setError(message: string) {
    this.errorElement.textContent = message;
    this.errorElement.style.display = message ? 'block' : 'none';
  };

  getData(): T {
    const data = {} as T;
    this.inputs.forEach((input) => {
      data[input.name as keyof T] = input.value as any;
    })
    return data;
  };

  clear() {
    this.inputs.forEach((input) => (input.value = ''));
    this.setError('');
    this.setSubmitEnabled(true);
  };
}
