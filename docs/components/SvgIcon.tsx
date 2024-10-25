import { Card } from "./Card";

const icons = [
  "account",
  "actualites",
  "admin",
  "admin-portal",
  "admission-post-bac",
  "agenda",
  "archive",
  "assistance",
  "assr",
  "award",
  "banquesavoir",
  "bcdi",
  "biblionisep",
  "blog",
  "bookmark-empty",
  "cahier-de-texte",
  "cahier-textes",
  "calendar",
  "canal-numerique",
  "ccn",
  "cerise",
  "cervoprint",
  "charlemagne",
  "charte",
  "chat",
  "cidj",
  "cns",
  "collaborative-wall",
  "community",
  "competences",
  "connecteur-generique1",
  "connecteur-generique2",
  "conversation",
  "directory",
  "educagri",
  "edumedia",
  "edumoov",
  "edutheque",
  "electron",
  "elyceepicardie",
  "esidoc",
  "europress",
  "exercizer",
  "forms",
  "forum",
  "gepi",
  "glpi",
  "hiboutheque",
  "itopstore",
  "kne",
  "le-site-tv",
  "lemonde",
  "lesechos",
  "library",
  "lsu",
  "madmagz",
  "matholycee",
  "maxicours",
  "mediacentre",
  "mindmap",
  "monorientationenligne",
  "monstageenligne",
  "moodle",
  "museefrancaisphoto",
  "my-network",
  "netvibes",
  "note",
  "notebook",
  "notes",
  "onisep",
  "onisep2",
  "pad",
  "pages",
  "parametrage",
  "parametrages",
  "paraschool",
  "parcours",
  "pearltrees",
  "picardie-cursus",
  "placeholder",
  "poll",
  "presences",
  "proeps",
  "pronote",
  "public",
  "qwant-junior",
  "qwant",
  "rack",
  "rbs",
  "residence-artiste",
  "ressourcesdepartementale91",
  "sacoche",
  "schoolbook",
  "scolinfo",
  "scrapbook",
  "searchengine",
  "settings-class",
  "sharebigfiles",
  "statistics",
  "stats",
  "suitcase",
  "support",
  "timeline",
  "timelinegenerator",
  "turboself",
  "universalis",
  "unstagepourtous",
  "userbook",
  "video",
  "vie-scolaire",
  "visioconf",
  "webclasseur",
  "website",
  "wiki",
  "workspace",
];

export const SvgIcon = () => {
  return (
    <div className="grid">
      {icons.map((icon: string, index: number) => {
        return (
          <Card
            key={index}
            className="g-col-6 g-col-md-2"
            style={{
              padding: "1.6rem",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
              justifyContent: "center",
              height: "12rem",
            }}
          >
            <svg
              width="24"
              height="24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="icon"
            >
              <use xlinkHref={`apps.svg#${icon || "placeholder"}`} />
            </svg>
            <p style={{ marginBottom: 0 }}>
              <strong
                style={{
                  fontSize: "12px",
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {icon}
              </strong>
            </p>
          </Card>
        );
      })}
    </div>
  );
};
