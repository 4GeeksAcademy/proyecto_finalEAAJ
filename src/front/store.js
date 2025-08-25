// store.js
export const initialStore = () => {
  return {
    posts: [],
    selectedIndex: null,
    showAddForm: false
  };
};



export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_posts": {
      return { ...store, posts: action.payload.posts };
    }
    case "add_post": {
      const { post } = action.payload;
      return { ...store, posts: [post, ...store.posts], showAddForm: false };
    }
    case "like_post": {
      const { index } = action.payload;
      const updatedPosts = [...store.posts];
      updatedPosts[index].likes++;
      console.log(index);
      const likesPut = async (ind, lik) => {
        try {
          const response = await fetch(import.meta.env.VITE_BACKEND_URL + "api/articulo/update/"+ind, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              likes: lik,
            }),
          });
          if (response.status === 201) {
            alert("articulo actualizado con éxito ✅");
          } else if (response.status >= 400) {
            alert("Error: " + data.msg);
          }} catch (error) {
            console.error("Error al enviar el artículo:", error);
            alert("Error al enviar el artículo ❌");
          }
      }
      likesPut(index, updatedPosts[index].likes);
      return { ...store, posts: updatedPosts };
    }
    case "set_selected_index": {
      const { index } = action.payload;
      return { ...store, selectedIndex: index };
    }
    case "toggle_add_form": {
      return { ...store, showAddForm: !store.showAddForm };
    }
    default:
      throw new Error("Unknown action type: " + action.type);
  }
}

/* import initialPostsData from "./assets/img/BlogPosts.js";

export const initialStore = () => {
  return {
    posts: initialPostsData,
    selectedIndex: null,
    showAddForm: false
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "add_post": {
      const { post } = action.payload;
      const newPost = {
        ...post,
        body: post.body.split("\n"),
        //comments: [],
        likes: 0,
        createdOn: Date.now(),
        image: post.image || "https://placehold.co/600x400"
      };
      return {
        ...store,
        posts: [newPost, ...store.posts],
        showAddForm: false
      };
    }

    /* case "add_comment": {
      const { postIndex, comment } = action.payload;
      const updatedPosts = [...store.posts];
      updatedPosts[postIndex].comments.push({
        ...comment,
        createdOn: Date.now()
      });
      return {
        ...store,
        posts: updatedPosts
      };
    } 

    case "like_post": {
      const { index } = action.payload;
      const updatedPosts = [...store.posts];
      updatedPosts[index].likes++;
      return {
        ...store,
        posts: updatedPosts
      };
    }

    case "set_selected_index": {
      const { index } = action.payload;
      return {
        ...store,
        selectedIndex: index
      };
    }

    case "toggle_add_form": {
      return {
        ...store,
        showAddForm: !store.showAddForm
      };
    }

    default:
      throw new Error("Unknown action type: " + action.type);
  }
} */
