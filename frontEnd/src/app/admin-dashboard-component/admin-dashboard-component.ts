import {
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import {
  AdminDashboard,
  PageReportResponse,
  PageResponse,
  PageResponse1,
  PostDTO,
  ReportDTO,
  TopReportedDto,
  TotalsDto,
  UsersDTO,
  WeeklyPosts,
} from '../core/services/admin-dashboard';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../components/confirm-dialog/confirm-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { TimeAgoPipe } from '../time-ago-pipe';
import { single } from 'rxjs';
import { CommentResponseDTO, Comment } from '../core/services/comment';

export interface StatCard {
  label: string;
  value: number;
  change: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    MatBadgeModule,
    RouterLink,
    TimeAgoPipe,
  ],
  templateUrl: './admin-dashboard-component.html',
  styleUrls: ['./admin-dashboard-component.css',
    '../home/post-feed/post-feed.css'
  ],
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  snackbar = inject(MatSnackBar);
  isSidebarOpen = false;

  currentFilter: 'all' | 'active' | 'banned' = 'all';
  currentPostFilter: 'all' | 'visible' | 'hidden' = 'all';
  currentUserPage = 0;
  isUsersLoading = false;
  currentPostPage = 0;
  isPostsLoading = false;

  currentReportPage = 0;
  isReportsLoading = false;

  private userObserver!: IntersectionObserver;
  private PostObserver!: IntersectionObserver;
  private ReportObserver!: IntersectionObserver;

  @ViewChild('userScrollAnchor') set setupUserAnchor(element: ElementRef) {
    if (element) {
      if (this.userObserver) this.userObserver.disconnect();

      this.userObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !this.isUsersLoading) {
            this.loadUsers();
          }
        },
        { root: null, rootMargin: '0px', threshold: 0.1 },
      );

      this.userObserver.observe(element.nativeElement);
    }
  }

  @ViewChild('reportScrollAnchor') set setupReportAnchor(element: ElementRef) {
    if (element) {
      if (this.ReportObserver) this.ReportObserver.disconnect();

      this.ReportObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !this.isReportsLoading) {
            this.loadReports();
          }
        },
        { root: null, rootMargin: '0px', threshold: 0.1 },
      );

      this.ReportObserver.observe(element.nativeElement);
    }
  }

  @ViewChild('postScrollAnchor') set setupPostAnchor(element: ElementRef) {
    if (element) {
      if (this.PostObserver) this.PostObserver.disconnect();

      this.PostObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !this.isPostsLoading) {
            this.loadPosts();
          }
        },
        { root: null, rootMargin: '0px', threshold: 0.1 },
      );

      this.PostObserver.observe(element.nativeElement);
    }
  }

  totals = signal<TotalsDto>({ users: 0, posts: 0, banned: 0, reports: 0 });
  users = signal<UsersDTO[]>([]);
  reports = signal<ReportDTO[]>([]);

  weeklyPosts = signal<WeeklyPosts[]>([]);
  topReportedUsers = signal<TopReportedDto[]>([]);
  Posts = signal<PostDTO[]>([]);
  activeTab = 0;
  today = '';
  reportFilter: 'all' | 'pending' | 'resolved' = 'all';
  get activeTabLabel(): string {
    if (this.activeTab === 1) return 'Users';
    if (this.activeTab === 2) return 'Posts';
    if (this.activeTab === 3) return 'Reports';
    return 'Overview';
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  selectTab(tab: number) {
    this.activeTab = tab;
    if (window.innerWidth <= 768) this.closeSidebar();
  }

  statCards = computed<StatCard[]>(() => [
    {
      label: 'Total Users',
      value: this.totals().users,
      change: 12,
      icon: 'group',
      color: 'teal',
    },
    {
      label: 'Total Posts',
      value: this.totals().posts,
      change: 8,
      icon: 'article',
      color: 'forest',
    },
    {
      label: 'Open Reports',
      value: this.totals().reports,
      change: -5,
      icon: 'flag',
      color: 'warn',
    },
    {
      label: 'Banned',
      value: this.totals().banned,
      change: 3,
      icon: 'block',
      color: 'muted',
    },
  ]);

  constructor(
    private adminService: AdminDashboard,
    private commentService: Comment,
    private dialog: MatDialog,
  ) {}
  ngOnInit() {
    this.adminService.getTotals().subscribe((totals) => {
      console.log(totals);

      this.totals.set(totals);
    });

    this.adminService.getWeeklyPosts().subscribe((posts) => {
      posts.map(
        (p) => (p.day = new Date(p.day.toString()).toLocaleString('en-US', { weekday: 'short' })),
      );
      this.weeklyPosts.set(posts);
    });

    this.adminService.getTopReported().subscribe((reports) => this.topReportedUsers.set(reports));
    this.loadUsers();
    this.loadPosts();
    this.loadReports();
  }

  loadPosts() {
    if (this.isPostsLoading) return;
    this.isPostsLoading = true;
    let status: boolean | undefined;

    if (this.currentPostFilter === 'visible') {
      status = true;
    } else if (this.currentPostFilter === 'hidden') {
      status = false;
    }

    this.adminService.getAllPosts(this.currentPostPage, 10, status).subscribe({
      next: (res: PageResponse1) => {
        this.currentPostPage++;
        this.Posts.update((current: PostDTO[]) => [...current, ...res.content]);
        this.isPostsLoading = false;
      },
    });
  }

  loadUsers() {
    if (this.isUsersLoading) return;
    this.isUsersLoading = true;
    let status: boolean | undefined;

    if (this.currentFilter === 'active') {
      status = true;
    } else if (this.currentFilter === 'banned') {
      status = false;
    }

    this.adminService.getAllusers(this.currentUserPage, 10, status).subscribe({
      next: (res: PageResponse) => {
        this.currentUserPage++;
        this.users.update((current: UsersDTO[]) => [...current, ...res.content]);
        this.isUsersLoading = false;
      },
    });
  }
  loadReports() {
    if (this.isReportsLoading) return;
    this.isReportsLoading = true;
    let status: boolean | undefined;

    if (this.reportFilter === 'resolved') {
      status = true;
    } else if (this.reportFilter === 'pending') {
      status = false;
    }

    this.adminService.getAllReports(this.currentReportPage, 10, status).subscribe({
      next: (res: PageReportResponse) => {
        this.currentReportPage++;
        this.reports.update((current: ReportDTO[]) => [...current, ...res.content]);
        this.isReportsLoading = false;
      },
    });
  }
  FilterReport(filter: 'all' | 'resolved' | 'pending') {
    this.reportFilter = filter;

    this.currentReportPage = 0;

    this.reports.set([]);
    this.isReportsLoading = false;
    this.loadReports();
  }
  FilterUsers(filter: 'all' | 'active' | 'banned') {
    this.currentFilter = filter;

    this.currentUserPage = 0;
    this.isUsersLoading = false;
    this.users.set([]);

    this.loadUsers();
  }
  FilteredPosts(filter: 'all' | 'visible' | 'hidden') {
    this.currentPostFilter = filter;
    this.currentPostPage = 0;
    this.isPostsLoading = false;
    this.Posts.set([]);
    this.loadPosts();
  }

  //used
  get maxPostCount(): number {
    return Math.max(...this.weeklyPosts().map((p) => p.count), 1);
  }

  openBanConfirm(user: UsersDTO) {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: {
        title: 'Ban User',
        message: `Are you sure you want to ban ${user.username}?`,
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.banUser(user);
      }
    });
  }
  banUser(user: UsersDTO) {
    this.adminService.banUser(user.username).subscribe({
      next: () => {
        this.users.update((list) => {
          const updated = list.map((u) =>
            u.username === user.username ? { ...u, status: !u.status } : u,
          );

          return updated.filter((u) => {
            if (this.currentFilter === 'active') return u.status === true;
            if (this.currentFilter === 'banned') return u.status === false;
            return true;
          });
        });
        this.snackbar.open(`user ${user.status ? 'banned' : 'unbanned'} seccefelly`, 'Close', {
          duration: 3000,
        });
      },
      error: () => {},
    });
  }
  openDeleteConfirm(user: UsersDTO) {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: {
        title: 'Delete User',
        message: `This action will permanently delete ${user.username}. Continue?`,
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser(user);
      }
    });
  }
  deleteUser(user: UsersDTO) {
    this.adminService.deleteUser(user.username).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u.username !== user.username));
        this.snackbar.open('user Delleted  seccefelly', 'Close', { duration: 3000 });
      },
      error: () => {},
    });
  }

  openHideConfermation(Post: PostDTO) {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: {
        title: 'Delete User',
        message: `This action will permanently hide this post. Continue?`,
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.hidePost(Post);
      }
    });
  }
  openDeleteConfermation(Post: PostDTO) {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: {
        title: 'Delete User',
        message: `This action will permanently delete this post. Continue?`,
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.deletePost(Post);
      }
    });
  }

  deletePost(Post: PostDTO) {
    this.adminService.deletePost(Post.id).subscribe({
      next: () => {
        this.Posts.update((list) => list.filter((p) => p.id != Post.id));
        this.snackbar.open(`Post deleted succefully`, 'close', {
          duration: 3000,
        });
      },
      error: () => {},
    });
  }

  hidePost(Post: PostDTO) {
    this.adminService.hidePost(Post.id).subscribe({
      next: () => {
        this.Posts.update((list) => {
          const updated = list.map((p) => (p.id === Post.id ? { ...p, status: !p.status } : p));

          return updated.filter((p) => {
            if (this.currentPostFilter === 'visible') return p.status === true;
            if (this.currentPostFilter === 'hidden') return p.status === false;
            return true;
          });
        });

        this.snackbar.open(`Post ${Post.status ? 'hide' : 'unhide '}  succefully`, 'close', {
          duration: 3000,
        });
      },
      error: () => {},
    });
  }

  openResolveConfermation(report: ReportDTO) {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: {
        title: 'Delete User',
        message: `This action will permanently resolve this Reports. Continue?`,
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.resolveReport(report);
      }
    });
  }

  resolveReport(report: ReportDTO) {
    this.adminService.ResolveReport(report.id).subscribe({
      next: () => {
        this.reports.update((list) => {
          const updated = list.map((p) => (p.id === report.id ? { ...p, status: !p.status } : p));

          return updated.filter((p) => {
            if (this.reportFilter === 'resolved') return p.status === true;
            if (this.reportFilter === 'pending') return p.status === false;
            return true;
          });
        });

        this.snackbar.open(
          `Report ${report.status ? 'Resolved' : 'Unresolved'}  succefully`,
          'close',
          {
            duration: 3000,
          },
        );
      },
      error: () => {},
    });
  }

  post = signal<PostDTO>({} as PostDTO);
  shouldOpen = false;
  currentSlide = 0;

  // Comments state
  showComments = false;
  isCommentsLoading = false;
  currentCommentPage = 0;
  Comments = signal<CommentResponseDTO[]>([]);

  togglePost(post: PostDTO) {
    this.shouldOpen = true;
    this.currentSlide = 0;
    this.showComments = false;
    this.currentCommentPage = 0;
    this.Comments.set([]);
    this.post.set(post);
  }

  closePostPopup() {
    this.shouldOpen = false;
    this.showComments = false;
  }
  private commentObserver!: IntersectionObserver;
  @ViewChild('commentScrollAnchor') set setupCommentAnchor(element: ElementRef) {
    if (element) {
      if (this.commentObserver) this.commentObserver.disconnect();
      this.commentObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !this.isCommentsLoading) this.loadComments(this.post().id);
        },
        { root: null, rootMargin: '0px', threshold: 0.1 },
      );
      this.commentObserver.observe(element.nativeElement);
    }
  }
  isVideo(url: string): boolean {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.webm') || lowerUrl.endsWith('.ogg');
  }
  toggleComments(post: PostDTO): void {
    this.showComments = !this.showComments;
    if (this.showComments && this.Comments().length === 0) {
      this.loadComments(post.id);
    }
  }
  loadComments(postId: number) {
    if (this.isCommentsLoading) return;
    this.isCommentsLoading = true;
    this.commentService.fetchComments(this.currentCommentPage, 5, postId).subscribe({
      next: (response) => {
        this.currentCommentPage++;
        this.Comments.update((currentList) => [...currentList, ...response.content]);
        this.isCommentsLoading = false;
      },
      error: () => (this.isCommentsLoading = false),
    });
  }

  prevSlide() {
    if (this.currentSlide > 0) this.currentSlide--;
  }

  nextSlide() {
    const images = this.post().imageUrl || [];
    if (this.currentSlide < images.length - 1) {
      this.currentSlide++;
    }
  }

  goToSlide(i: number) {
    this.currentSlide = i;
  }
  ngOnDestroy() {
    if (this.userObserver) this.userObserver.disconnect();
    if (this.PostObserver) this.PostObserver.disconnect();
    if (this.ReportObserver) this.ReportObserver.disconnect();
    if (this.commentObserver) this.commentObserver.disconnect();
  }
}
