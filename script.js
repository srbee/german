/*
 * Fun With German
 * Pure JavaScript — no libraries or frameworks.
 *
 * Put this file in the root of your GitHub repository.
 * Put your PNG files in a folder named "pictures".
 */

const GITHUB_OWNER = "srbee";
const GITHUB_REPO = "german";
const PICTURES_FOLDER = "pictures";
const BRANCH = "main";

const gallery = document.getElementById("gallery");

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: "base"
  });
}

function showMessage(title, text) {
  gallery.innerHTML = "";

  const box = document.createElement("div");
  box.className = "message";

  const heading = document.createElement("strong");
  heading.textContent = title;

  const message = document.createElement("span");
  message.textContent = text;

  box.appendChild(heading);
  box.appendChild(message);
  gallery.appendChild(box);
}

async function loadPictures() {
  if (
    GITHUB_OWNER === "YOUR_GITHUB_USERNAME" ||
    GITHUB_REPO === "YOUR_REPOSITORY_NAME"
  ) {
    showMessage(
      "GitHub setup required",
      "Open script.js and enter your GitHub username and repository name."
    );
    return;
  }

  const apiUrl =
    `https://api.github.com/repos/${encodeURIComponent(GITHUB_OWNER)}` +
    `/${encodeURIComponent(GITHUB_REPO)}/contents/${PICTURES_FOLDER}` +
    `?ref=${encodeURIComponent(BRANCH)}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github+json"
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub returned HTTP ${response.status}`);
    }

    const files = await response.json();

    const pngFiles = files
      .filter(file =>
        file.type === "file" &&
        file.name.toLowerCase().endsWith(".png")
      )
      .sort((a, b) => naturalSort(a.name, b.name));

    if (pngFiles.length === 0) {
      showMessage(
        "No PNG pictures found",
        `Please put PNG files inside the "${PICTURES_FOLDER}" folder.`
      );
      return;
    }

    gallery.innerHTML = "";

    pngFiles.forEach((file, index) => {
      const figure = document.createElement("figure");
      figure.className = "picture-card";

      const image = document.createElement("img");
      image.src = file.download_url;
      image.alt = `Fun With German picture ${index + 1}`;
      image.loading = index === 0 ? "eager" : "lazy";
      image.decoding = "async";

      const caption = document.createElement("figcaption");
      caption.className = "picture-number";
      caption.textContent = file.name;

      figure.appendChild(image);
      figure.appendChild(caption);
      gallery.appendChild(figure);
    });

  } catch (error) {
    console.error("Error loading pictures:", error);

    showMessage(
      "Could not load pictures",
      "Please check the GitHub username, repository name, branch, and pictures folder."
    );
  }
}

loadPictures();
