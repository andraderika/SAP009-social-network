import {
  salvarPost,
  pegarPost,
  deletarPost,
  editarPosts,
} from '../../firebase/firestore.js';

import { auth } from '../../firebase/firebase.js';

import logo from '../../img/lofeedsemfundo.png';
import sair from '../../img/logout.png';
import postar from '../../img/checked.png';
import user from '../../img/profile-user.png';
import editar from '../../img/editar-informacao.png';
import checked from '../../img/checked.png';
import deletar from '../../img/botao-apagar.png';

export default () => {
  const container = document.createElement('div');
  const template = `
     <header class="header">
       <div class="div-img-logo">
         <img class="logo-feed" src=${logo} alt='logo HelParents' class='img-logo'>
      </div>
      <button class="btn-sair">
       <img class="img-sair" src=${sair} alt='logo HelParents' class='img-logo'>
     </button>
    </header>
    <main>
      <div class="postando">
        <textarea id="txt-area" cols="69" rows="4" placeholder= "Escreva seu post"></textarea>
        <div class="position-btn-postar">
          <button class="btn-postar" id="bntPublicar">
           <img class='postar-img' src=${postar} alt='logo-google'>
          </button>
        </div>
       <ul class="feed-postado">
       </ul>
     </div>
    </main>
     `;

  container.innerHTML = template;

  const printPost = async () => {
    const arrayPosts = await pegarPost();
    const postList = arrayPosts.map((posts) => `
      <li class="areaPostado li" id="${posts.id}">
        <div class="position-username-data">
          <div class="position-username">
              <img class="img-user-name" src=${user} alt="user-name">
              <p class="user-name">${posts.username}</p>
            </div>
            <p class="post-date">${posts.date}</p>
          </div>
              <textarea class="txt-postado" disabled name="" id="txt-area-postado${posts.id}" cols="70" rows="5">${posts.text}</textarea>
              <div class="position-btn-postar">
              <button id="${posts.id}curtir" class="btn-postar editado">
                <img class='editar-img' src='./img/ame.png' alt='salvar'>
              </button>
                ${posts.userId === auth.currentUser.uid ? `  
              <button id="${posts.id}editar" class="btn-postar editado">
                <img class='editar-img' src=${editar} alt='editar'>
              </button>
              <button id="${posts.id}salvar" class="btn-postar editado">
                <img class='editar-img' src=${checked} alt='salvar'>
              </button>
              <button id="${posts.id}deletar" class="btn-postar delete">
                <img class='excluir-img' src=${deletar} alt='deletar'>
              </button>
    
              ` : ''}
            </div>
          </li>   
    `).join('');

    container.querySelector('.feed-postado').innerHTML = postList;

    arrayPosts.forEach((post) => {
      if (post.userId === auth.currentUser.uid) {
        const btnDeletar = document.getElementById(`${post.id} deletar`);
        btnDeletar.addEventListener('click', (e) => {
          e.preventDefault();
          if (window.customConfirm('Tem certeza de que deseja excluir a publicação?')) {
            deletarPost(post.id)
              .then(() => {
                const areaPostado = document.getElementById(post.id);
                areaPostado.remove();
              });
          }
        });
      }
    });

    arrayPosts.forEach((post) => {
      if (post.userId === auth.currentUser.uid) {
        const btnEditar = document.getElementById(`${post.id} editar`);
        const textPostado = document.getElementById(`${post.id} txt-area-postado`);
        const btnSalvar = document.getElementById(`${post.id} salvar `);
        btnSalvar.addEventListener('click', () => {
          editarPosts(post.id, textPostado.value);
          textPostado.setAttribute('disabled', true);
          btnEditar.removeAttribute('hidden');
        });

        btnEditar.addEventListener('click', (e) => {
          e.preventDefault();
          if (window.customConfirm('Tem certeza de que deseja editar a publicação?')) {
            btnEditar.setAttribute('hidden', true);
            textPostado.removeAttribute('disabled');
          }
        });
      }
    });
  };
  printPost();

  const textArea = container.querySelector('#txt-area');
  const btnPublicar = container.querySelector('#bntPublicar');
  btnPublicar.addEventListener('click', () => {
    if (textArea.value !== '') {
      const today = new Date();
      const userName = auth.currentUser.displayName;
      const idUser = auth.currentUser.uid;

      salvarPost(today, idUser, textArea.value, userName).then(() => {
        printPost();
      });
    } else { window.customConfirm('Por favor, preencha o campo de postagem!'); }
  });

  const btnSair = container.querySelector('.btn-sair');
  btnSair.addEventListener('click', () => {
    window.location.hash = '#login';
  });
  return container;
};
