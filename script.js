 /*
 * Fun With German
 * Picture Gallery
 *
 * File naming system:
 *   001.png  = oldest
 *   002.png
 *   003.png
 *   ...
 *   010.png  = newest
 *
 * The newest (highest-numbered) PNG is displayed first.
 */

const GITHUB_OWNER = "srbee";
const GITHUB_REPO = "german";

const PICTURES_FOLDER = "pictures";
const BRANCH = "main";

const gallery = document.getElementById("gallery");


/*
 * Convert a filename such as:
 *
 *   001.png
 *   025.png
 *   100.png
 *
 * into its numerical part.
 */
function getFileNumber(filename) {
    const match = filename.match(/^(\d+)\.png$/i);

    if (match) {
        return parseInt(match[1], 10);
    }

    return -1;
}


/*
 * Display an information/error message.
 */
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


/*
 * Load PNG files from the GitHub "pictures" folder.
 */
async function loadPictures() {

    /*
     * Check whether GitHub details have been entered.
     */
    if (
        GITHUB_OWNER === "YOUR_GITHUB_USERNAME" ||
        GITHUB_REPO === "YOUR_REPOSITORY_NAME"
    ) {

        showMessage(
            "GitHub setup required",
            "Please enter your GitHub username and repository name in script.js."
        );

        return;
    }


    /*
     * GitHub API address for the pictures folder.
     */
    const apiUrl =
        `https://api.github.com/repos/` +
        `${encodeURIComponent(GITHUB_OWNER)}/` +
        `${encodeURIComponent(GITHUB_REPO)}/` +
        `contents/${PICTURES_FOLDER}?ref=${encodeURIComponent(BRANCH)}`;


    try {

        const response = await fetch(apiUrl, {
            headers: {
                "Accept": "application/vnd.github+json"
            }
        });


        /*
         * Check whether GitHub responded successfully.
         */
        if (!response.ok) {

            throw new Error(
                `GitHub returned HTTP ${response.status}`
            );
        }


        const files = await response.json();


        /*
         * Keep only PNG files whose names follow
         * the numbering system:
         *
         * 001.png
         * 002.png
         * 003.png
         * etc.
         */
        const pngFiles = files
            .filter(file => {

                return (
                    file.type === "file" &&
                    /^\d+\.png$/i.test(file.name)
                );

            });


        /*
         * Sort from HIGHEST number to LOWEST number.
         *
         * Therefore:
         *
         * 010.png
         * 009.png
         * 008.png
         * ...
         * 001.png
         */
        pngFiles.sort((a, b) => {

            return (
                getFileNumber(b.name) -
                getFileNumber(a.name)
            );

        });


        /*
         * No pictures found.
         */
        if (pngFiles.length === 0) {

            showMessage(
                "No PNG pictures found",
                `Please put numbered PNG files such as 001.png, 002.png and 003.png inside the "${PICTURES_FOLDER}" folder.`
            );

            return;
        }


        /*
         * Clear the loading message.
         */
        gallery.innerHTML = "";


        /*
         * Create a card for every picture.
         *
         * Because pngFiles is already sorted from
         * newest to oldest, the newest picture is
         * automatically placed at the top.
         */
        pngFiles.forEach((file, index) => {

            const figure = document.createElement("figure");

            figure.className = "picture-card";


            /*
             * Create the image.
             */
            const image = document.createElement("img");

            image.src = file.download_url;

            image.alt =
                `Fun With German picture ${index + 1}`;

            /*
             * Load the first picture immediately.
             * Other pictures are loaded lazily to make
             * the page faster on mobile devices.
             */
            image.loading =
                index === 0 ? "eager" : "lazy";

            image.decoding = "async";


            /*
             * Create filename caption.
             */
            const caption =
                document.createElement("figcaption");

            caption.className = "picture-number";

            caption.textContent = file.name;


            /*
             * Put image and caption inside the card.
             */
            figure.appendChild(image);

            figure.appendChild(caption);


            /*
             * Add the card to the gallery.
             */
            gallery.appendChild(figure);

        });


    } catch (error) {

        console.error(
            "Error loading pictures:",
            error
        );


        showMessage(
            "Could not load pictures",
            "Please check your GitHub username, repository name, branch, and pictures folder."
        );

    }
}


/*
 * Start the gallery.
 */
loadPictures();
