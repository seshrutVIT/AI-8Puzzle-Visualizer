// Tailwind's colour and font names. Colours come from the variables in css/style.css.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: 'var(--color-ink)',
        paper: 'var(--color-paper)',
        muted: 'var(--color-muted)',
        rule: 'var(--color-rule)',
        blank: 'var(--color-blank)',
        goal: 'var(--color-goal)',
        danger: 'var(--color-danger)',
        accent: 'var(--color-accent)',
      },
      fontFamily: {
        heading: ['Georgia', 'Times New Roman', 'serif'],
        body: ['Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['Consolas', 'Courier New', 'monospace'],
      },
    },
  },
};
