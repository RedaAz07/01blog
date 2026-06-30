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
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
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
    MatInputModule,
    FormsModule,
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
  searchTerm = signal<string>('');

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.users();
    return this.users().filter((user) =>
      user.username.toLowerCase().includes(term) ||
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term)
    );
  });

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
    this.today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    this.adminService.getTotals().subscribe((totals) => {

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
      error: () => {
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
      error: () => {
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
      error: () => {
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
    this.searchTerm.set('');

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
        this.snackbar.open(`user ${user.status ? 'banned' : 'unbanned'} successfully`, 'Close', {
          duration: 3000,
        });
      },
      error: () => {
        this.snackbar.open('Failed to update user status. Please try again.', 'Close', { duration: 4000 });
      },
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
        this.snackbar.open('User deleted successfully', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackbar.open('Failed to delete user. Please try again.', 'Close', { duration: 4000 });
      },
    });
  }

  openHideConfirmation(Post: PostDTO) {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: {
        title: 'Hide Post',
        message: `This action will ${Post.status ? 'hide' : 'unhide'} this post. Continue?`,
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.hidePost(Post);
      }
    });
  }
  openDeleteConfirmation(Post: PostDTO) {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: {
        title: 'Delete Post',
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
        this.snackbar.open(`Post deleted successfully`, 'Close', {
          duration: 3000,
        });
      },
      error: () => {
        this.snackbar.open('Failed to delete post. Please try again.', 'Close', { duration: 4000 });
      },
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

        this.snackbar.open(`Post ${Post.status ? 'hidden' : 'shown'} successfully`, 'Close', {
          duration: 3000,
        });
      },
      error: () => {
        this.snackbar.open('Failed to update post visibility. Please try again.', 'Close', { duration: 4000 });
      },
    });
  }

  isPostReport(report: ReportDTO): boolean {
    return report.type?.toUpperCase() === 'POST';
  }

  reportTargetLabel(report: ReportDTO): string {
    if (this.isPostReport(report)) {
      return report.reportedPostId != null
        ? `Post #${report.reportedPostId} by @${report.reported}`
        : `Reported post by @${report.reported}`;
    }

    return `@${report.reportedUserId}`;
  }

  reportActionLabel(report: ReportDTO, action: 'hide' | 'delete' | 'ban'): string {
    if (this.isPostReport(report)) {
      return action === 'hide' ? 'Hide post' : 'Delete post';
    }

    return action === 'ban' ? 'Ban user' : 'Delete user';
  }

  openReportActionConfirm(report: ReportDTO, action: 'hide' | 'delete' | 'ban') {
    const actionLabel = this.reportActionLabel(report, action);
    const targetLabel = this.reportTargetLabel(report);

    const ref = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: {
        title: actionLabel,
        message: `This will ${action === 'hide' ? 'hide' : action === 'delete' ? 'delete' : 'ban'} ${targetLabel} and mark the report as solved. Continue?`,
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.executeReportAction(report, action);
      }
    });
  }

  private executeReportAction(report: ReportDTO, action: 'hide' | 'delete' | 'ban') {
    if (this.isPostReport(report)) {
      const postId = report.reportedPostId;
      if (postId == null) {
        this.snackbar.open('This report does not include a post id.', 'Close', { duration: 3000 });
        return;
      }

      if (action === 'delete' && !report.status) {
        this.adminService.ResolveReport(report.id).subscribe({
          next: () => {
            this.setReportResolvedLocally(report);
            this.deleteReportedPost(report, postId, true);
          },
          error: () => {
            this.snackbar.open('Failed to resolve report. Please try again.', 'Close', { duration: 4000 });
          },
        });
        return;
      }

      const request = action === 'delete' ? this.adminService.deletePost(postId) : this.adminService.hidePost(postId);

      request.subscribe({
        next: () => {
          this.updatePostAfterReportAction(postId, action);
          this.finishResolvedReport(report, `${this.reportActionLabel(report, action)} completed`);
        },
        error: () => {
          this.snackbar.open(`Failed to ${action} post. Please try again.`, 'Close', { duration: 4000 });
        },
      });
      return;
    }

    const username = report.reported;
    if (action === 'delete' && !report.status) {
      this.adminService.ResolveReport(report.id).subscribe({
        next: () => {
          this.setReportResolvedLocally(report);
          this.deleteReportedUser(report, username, true);
        },
        error: () => {
          this.snackbar.open('Failed to resolve report. Please try again.', 'Close', { duration: 4000 });
        },
      });
      return;
    }

    const request = action === 'delete' ? this.adminService.deleteUser(username) : this.adminService.banUser(username);

    request.subscribe({
      next: () => {
        this.updateUserAfterReportAction(username, action);
        this.finishResolvedReport(report, `${this.reportActionLabel(report, action)} completed`);
      },
      error: () => {
        this.snackbar.open(`Failed to ${action} user. Please try again.`, 'Close', { duration: 4000 });
      },
    });
  }

  private deleteReportedPost(report: ReportDTO, postId: number, reportWasResolved = false) {
    this.adminService.deletePost(postId).subscribe({
      next: () => {
        this.updatePostAfterReportAction(postId, 'delete');
        if (reportWasResolved) {
          this.snackbar.open(`${this.reportActionLabel(report, 'delete')} completed and report solved`, 'Close', {
            duration: 3000,
          });
          return;
        }

        this.finishResolvedReport(report, `${this.reportActionLabel(report, 'delete')} completed`);
      },
      error: () => {
        this.snackbar.open('Failed to delete post. Please try again.', 'Close', { duration: 4000 });
      },
    });
  }

  private deleteReportedUser(report: ReportDTO, username: string, reportWasResolved = false) {
    this.adminService.deleteUser(username).subscribe({
      next: () => {
        this.updateUserAfterReportAction(username, 'delete');
        if (reportWasResolved) {
          this.snackbar.open(`${this.reportActionLabel(report, 'delete')} completed and report solved`, 'Close', {
            duration: 3000,
          });
          return;
        }

        this.finishResolvedReport(report, `${this.reportActionLabel(report, 'delete')} completed`);
      },
      error: () => {
        this.snackbar.open('Failed to delete user. Please try again.', 'Close', { duration: 4000 });
      },
    });
  }

  private setReportResolvedLocally(report: ReportDTO) {
    this.reports.update((list) => {
      const updated = list.map((item) => (item.id === report.id ? { ...item, status: true } : item));

      return updated.filter((item) => {
        if (this.reportFilter === 'resolved') return item.status === true;
        if (this.reportFilter === 'pending') return item.status === false;
        return true;
      });
    });
  }

  private updatePostAfterReportAction(postId: number, action: 'hide' | 'delete' | 'ban') {
    if (action === 'delete') {
      this.Posts.update((list) => list.filter((post) => post.id !== postId));
      return;
    }

    this.Posts.update((list) =>
      list.map((post) => (post.id === postId ? { ...post, status: !post.status } : post)),
    );
    this.Posts.update((list) => {
      if (this.currentPostFilter === 'visible') return list.filter((post) => post.status === true);
      if (this.currentPostFilter === 'hidden') return list.filter((post) => post.status === false);
      return list;
    });
  }

  private updateUserAfterReportAction(username: string, action: 'hide' | 'delete' | 'ban') {
    if (action === 'delete') {
      this.users.update((list) => list.filter((user) => user.username !== username));
      this.topReportedUsers.update((list) => list.filter((user) => user.username !== username));
      return;
    }

    this.users.update((list) =>
      list.map((user) => (user.username === username ? { ...user, status: !user.status } : user)),
    );
    this.topReportedUsers.update((list) =>
      list.map((user) => (user.username === username ? { ...user, status: !user.status } : user)),
    );
    this.users.update((list) => {
      if (this.currentFilter === 'active') return list.filter((user) => user.status === true);
      if (this.currentFilter === 'banned') return list.filter((user) => user.status === false);
      return list;
    });
  }

  private finishResolvedReport(report: ReportDTO, successMessage: string) {
    if (report.status) {
      this.snackbar.open(successMessage, 'Close', { duration: 3000 });
      return;
    }

    this.adminService.ResolveReport(report.id).subscribe({
      next: () => {
        this.reports.update((list) => {
          const updated = list.map((item) => (item.id === report.id ? { ...item, status: true } : item));

          return updated.filter((item) => {
            if (this.reportFilter === 'resolved') return item.status === true;
            if (this.reportFilter === 'pending') return item.status === false;
            return true;
          });
        });

        this.snackbar.open(`${successMessage} and report solved`, 'Close', { duration: 3000 });
      },
      error: () => {
        
        this.snackbar.open(`${successMessage}, but report solving failed`, 'Close', { duration: 4000 });
      },
    });
  }

  openResolveConfirmation(report: ReportDTO) {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: {
        title: 'Resolve Report',
        message: `This action will permanently resolve this report. Continue?`,
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.finishResolvedReport(report, 'Report resolved');
      }
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
