# TinyToast

**Little messages. Beautifully presented.**

TinyToast is a lightweight notification design playground for designers, developers, and anyone who wants to create beautiful toast notifications.

Customize notification messages, experiment with different styles, preview changes instantly, and export your designs as PNG images or reusable code components.

## ✨ Features

- **Live Preview** – See your notification design update instantly as you customize it.
- **Notification Types** – Choose between Success, Error, Warning, and Info.
- **Themes** – Switch between Light and Dark themes.
- **Custom Icons** – Select icons to match your notification.
- **Position Control** – Preview notifications in different screen positions.
- **Message Editor** – Customize notification titles and descriptions.
- **PNG Export** – Download your notification design as an image.
- **Code Export** – Copy reusable React component or HTML/CSS code.
- **Preset Gallery** – Start with ready-made notification designs.

## 🎨 Preview

Create notifications like:

**Success**

> ✓ Changes saved!
>
> Your work is safely stored.

Experiment with different notification types, themes, icons, and layouts to create a design that fits your project.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Type safety |
| Vite | Development and build tool |
| Tailwind CSS | Styling |
| Lucide | Icons |
| html-to-image | PNG export |
| GitHub Pages | Hosting |

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/edgeroboticsstudio/tinytoast.git
   ```

2. Navigate to the project directory:

   ```bash
   cd tinytoast
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal.

### Build for Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```text
tinytoast/
├── public/
│   ├── favicon.svg
│   └── logo.svg
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Editor.tsx
│   │   ├── ToastPreview.tsx
│   │   ├── ThemePicker.tsx
│   │   ├── IconPicker.tsx
│   │   ├── PresetGallery.tsx
│   │   └── ExportPanel.tsx
│   ├── utils/
│   │   ├── exportImage.ts
│   │   └── generateCode.ts
│   ├── types/
│   │   └── toast.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── README.md
├── LICENSE
└── package.json
```

## 🌐 Deployment

TinyToast is designed to be hosted on GitHub Pages.

The production build can be deployed using GitHub Actions, making it easy to maintain and publish updates directly from the repository.

## 🔒 Privacy

TinyToast is designed to work entirely in the browser.

- No account required.
- No backend or database.
- No external API required.
- Notification content stays in your browser.

## 🗺️ Roadmap

- [ ] Build the notification editor.
- [ ] Implement live notification previews.
- [ ] Add Success, Error, Warning, and Info styles.
- [ ] Implement Light and Dark themes.
- [ ] Add icon selection.
- [ ] Add notification position controls.
- [ ] Implement PNG export.
- [ ] Implement React component code generation.
- [ ] Implement HTML/CSS export.
- [ ] Add a preset gallery.
- [ ] Optimize mobile experience.
- [ ] Deploy to GitHub Pages.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome!

If you have an idea to improve TinyToast:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

For major changes, please open an issue first to discuss what you would like to improve.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**TinyToast** – Little messages. Beautifully presented.

Made with ❤️ by [Edge Robotics Studio](https://github.com/edgeroboticsstudio).
