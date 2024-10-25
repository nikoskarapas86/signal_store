import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import {
  PostInteface,
  PostStateInterface,
} from '../components/posts/posts.component';
import { PostsService } from '../services/posts.service';

// ----------------- all methods are isolated to external of component
export const PostStore = signalStore(
  withState<PostStateInterface>({
    posts: [],
    error: null,
    isLoading: false,
  }),
  withComputed((store) => ({
    postsCount: computed(() => store.posts().length),
  })),
  withMethods((store, postService = inject(PostsService)) => ({
    onAddPost(title: string) {
      const newPost: PostInteface = {
        id: (Math.random() * 100).toString(),
        title,
      };
      const upDatedPosts = [...store.posts(), newPost];
      patchState(store, { posts: upDatedPosts });
    },
    removePost(post: PostInteface) {
      const updatedPosts = store
        .posts()
        .filter((postItem) => postItem.id !== post.id);

      patchState(store, { posts: updatedPosts });
    },
    addPosts(posts: PostInteface[]) {
      patchState(store, { posts });
    },
    loadPosts: rxMethod<void>(
      pipe(
        switchMap(() =>
          postService
            .getPosts()
            .pipe(tap((posts) => patchState(store, { posts })))
        )
      )
    ),
  })),
  withHooks({
    onInit(store) {
      store.loadPosts();
    },
  })
);
