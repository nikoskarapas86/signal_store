import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PostsService } from '../../services/posts.service';
import { PostStore } from '../../store/post-store';
export interface PostInteface {
  id: string;
  title: string;
}
export interface PostStateInterface {
  posts: PostInteface[];
  isLoading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  providers: [PostStore], //SHOULD ADD IT TO PROVIDERS
})
export class PostsComponent {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  fb = inject(FormBuilder);
  postService = inject(PostsService);
  store = inject(PostStore);

  addForm = this.fb.nonNullable.group({
    title: '',
  });

  // ngOnInit() {
  //   this.postService
  //     .getPosts()
  //     .pipe(tap((psts) => this.store.addPosts(psts)))
  //     .subscribe();
  // }
  // with state and above I converted it to SIGNALSTORE
  // state = signalState<PostStateInterface>({
  //   posts: [],
  //   error: null,
  //   isLoading: false,
  // });

  // onAdd() {
  //   const newPost = {
  //     id: (Math.random() * 100).toString(),
  //     title: this.addForm.getRawValue().title,
  //   };
  //   const upDatedPosts = [...this.store.posts(), newPost];
  //   patchState(this.store, (state) => ({ ...state, posts: upDatedPosts }));
  //   this.addForm.reset();
  // }

  // removePost(post: PostInteface) {
  //   const updatedPosts = this.store
  //     .posts()
  //     .filter((postItem) => postItem.id !== post.id);

  //   patchState(this.store, (state) => ({ ...state, posts: updatedPosts }));
  // }

  onAdd() {
    const title = this.addForm.getRawValue().title;
    this.store.onAddPost(title);
    this.addForm.reset();
  }
}
