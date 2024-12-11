import { useRef, useState } from 'react';

import {
  Layout,
  LoadingScreen,
  Toolbar,
  ToolbarItem,
  useEdificeClient,
} from '@edifice.io/react';
import { Editor, EditorRef } from '@edifice.io/react/editor';
import { IconEdit, IconTextToSpeech } from '@edifice.io/react/icons';

import defaultImage1 from '../assets/editeur-default-1.png';
import defaultImage2 from '../assets/editeur-default-2.png';

const initialContent = `
  <p>
    📣
    <strong>
      <span style="font-size: 18px">
        Bienvenue sur votre interface de beta test du futur éditeur multimédia
      </span>
    </strong>
    📣
  </p>
  <p style="text-align: start">
    Nous avons travaillé dur pour que ce nouvel éditeur réponde à toutes vos
    attentes.
  </p>
  <img
    src="${defaultImage1}"
    class="custom-image"
    textalign="left"
    width="645"
    height="430"
  />
  <p style="text-align: start">
    Vous pouvez tester ce nouvel éditeur en éditant ce contenu. Cliquer sur
    l’icône en haut à droite de ce texte pour passer en mode édition
  </p>
  <img
    src="${defaultImage2}"
    class="custom-image"
    textalign="justify"
    width="80"
    height="83.33333333333333"
  />
  <p style="text-align: start">
    Vous pouvez aussi vérifier que vos anciens billets de blogs seront bien
    lisibles et modifiables avec le nouvel éditeur en les sélectionnant dans le
    menu de gauche.
  </p>
  <p style="text-align: start">
    <strong> ⬅️ Sélectionner un billet dans le menu de gauche </strong>
  </p>
  <p style="text-align: start">
    ⚠️ Rassurez-vous les modifications que vous ferez sur les billets seront pas
    enregistrées ! Il s’agit uniquement de voir comment ils seront affichés et
    s’ils sont facilement éditables ⚠️
  </p>
  <p style="text-align: start">
    Et surtout, pour nous permettre de nous améliorer, ou de confirmer que vous
    êtes convaincus, laissez-nous votre avis :
    <a
      target="répondre au questionnaire en ligne (4 questions)"
      rel="noopener noreferrer nofollow"
      class="cc-tgpl01"
      href="https://survey.opendigitaleducation.com/index.php/361124?lang=fr"
      title="https://survey.opendigitaleducation.com/index.php/361124?lang=fr"
      >répondre au questionnaire en ligne (4 questions)</a
    >.
  </p>
`;

const Playground = () => {
  const [content /* setContent */] = useState(initialContent);
  const [mode, setMode] = useState<'read' | 'edit'>('read');

  const editorRef = useRef<EditorRef>(null);

  const toolbarDemo: ToolbarItem[] = [
    {
      type: 'icon',
      props: {
        'icon': <IconTextToSpeech />,
        'className': editorRef.current?.isSpeeching() ? 'bg-primary' : '',
        'aria-label': 'Synthèse vocale',
        'onClick': () => console.log(''),
      },
      name: 'video',
      visibility: mode === 'edit' ? 'hide' : 'show',
    },
    {
      type: 'icon',
      props: {
        'icon': <IconEdit />,
        'className': mode === 'edit' ? 'bg-primary' : '',
        'aria-label': 'Changer de mode',
        'onClick': () => setMode(mode === 'edit' ? 'read' : 'edit'),
      },
      name: 'mode',
    },
  ];

  const { init } = useEdificeClient();

  if (!init) return <LoadingScreen position={false} />;

  return (
    <Layout>
      <Toolbar
        items={toolbarDemo}
        variant="no-shadow"
        isBlock={true}
        align="right"
      />
      <Editor ref={editorRef} content={content} mode={mode} />
    </Layout>
  );
};

export default Playground;
