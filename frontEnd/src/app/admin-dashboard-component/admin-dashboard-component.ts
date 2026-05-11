import { Component, computed, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
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
  PageResponse,
  PageResponse1,
  PostDTO,
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

export interface Report {
  id: number;
  type: 'user' | 'post';
  targetName: string;
  targetAvatar: string;
  reason: string;
  reportedBy: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

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
  styleUrls: ['./admin-dashboard-component.css'],
})
export class AdminDashboardComponent implements OnInit {
  snackbar = inject(MatSnackBar);

  currentFilter: 'all' | 'active' | 'banned' = 'all';
  currentPostFilter: 'all' | 'visible' | 'hidden' = 'all';
  currentUserPage = 0;
  isUsersLoading = false;
  currentPostPage = 0;
  isPostsLoading = false;
  private userObserver!: IntersectionObserver;
  private PostObserver!: IntersectionObserver;

  @ViewChild('userScrollAnchor') set setupUserAnchor(element: ElementRef) {
    if (element && !this.userObserver) {
      const options = { root: null, rootMargin: '0px', threshold: 0.1 };
      this.userObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !this.isUsersLoading) {
          console.log(this.users());
          this.loadUsers();
        }
      }, options);

      this.userObserver.observe(element.nativeElement);
    }
  }

  @ViewChild('postScrollAnchor') set setupPostAnchor(element: ElementRef) {
    if (element && !this.PostObserver) {
      const options = { root: null, rootMargin: '0px', threshold: 0.1 };
      this.PostObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !this.isPostsLoading) {
          console.log(this.Posts());

          this.loadPosts();
        }
      }, options);

      this.PostObserver.observe(element.nativeElement);
    }
  }

  totals = signal<TotalsDto>({ users: 0, posts: 0, banned: 0, reports: 0 });
  users = signal<UsersDTO[]>([]);
  weeklyPosts = signal<WeeklyPosts[]>([]);
  topReportedUsers = signal<TopReportedDto[]>([]);
  Posts = signal<PostDTO[]>([]);
  activeTab = 0;
  today = '';
  reportFilter: 'all' | 'pending' | 'resolved' | 'dismissed' = 'all';
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
      label: 'Banned Today',
      value: this.totals().banned,
      change: 3,
      icon: 'block',
      color: 'muted',
    },
  ]);

  reports: Report[] = [
    {
      id: 1,
      type: 'user',
      targetName: 'Omar Tahiri',
      targetAvatar: 'OT',
      reason: 'Harassment in comments',
      reportedBy: 'Karim Benali',
      severity: 'high',
      date: '1h ago',
      status: 'pending',
    },
    {
      id: 2,
      type: 'post',
      targetName: 'Spam product post',
      targetAvatar: 'NC',
      reason: 'Spam / misleading content',
      reportedBy: 'Sara El Fassi',
      severity: 'medium',
      date: '3h ago',
      status: 'resolved',
    },
    {
      id: 3,
      type: 'user',
      targetName: 'Lina Moussaoui',
      targetAvatar: 'LM',
      reason: 'Spreading misinformation',
      reportedBy: 'Yassine Alaoui',
      severity: 'high',
      date: '6h ago',
      status: 'pending',
    },
    {
      id: 4,
      type: 'post',
      targetName: 'Misleading health post',
      targetAvatar: 'LM',
      reason: 'Dangerous health claims',
      reportedBy: 'Multiple users',
      severity: 'high',
      date: '1d ago',
      status: 'pending',
    },
    {
      id: 5,
      type: 'user',
      targetName: 'Hamza Berrada',
      targetAvatar: 'HB',
      reason: 'Suspected fake account',
      reportedBy: 'Anonymous',
      severity: 'low',
      date: '2d ago',
      status: 'dismissed',
    },
    {
      id: 6,
      type: 'post',
      targetName: 'Political post',
      targetAvatar: 'OT',
      reason: 'Inciting content',
      reportedBy: 'Nadia Chraibi',
      severity: 'medium',
      date: '2d ago',
      status: 'pending',
    },
  ];

  categoryData = [
    { label: 'Politics', count: 3420, color: '#408a71' },
    { label: 'Travel', count: 5810, color: '#285a48' },
    { label: 'Food', count: 4200, color: '#b0e4cc' },
    { label: 'Health', count: 2100, color: '#6b8f82' },
    { label: 'Art', count: 2810, color: '#234b3e' },
  ];
  constructor(
    private adminService: AdminDashboard,
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
        res.content.map((c) => {
          try {
            const editorData = JSON.parse(c.content);

            const text = editorData.blocks
              ?.filter((b: any) => !['image', 'video'].includes(b.type))
              ?.map((b: any) => {
                switch (b.type) {
                  case 'paragraph':
                    return b.data.text;

                  case 'header':
                    return b.data.text;

                  case 'list':
                    return b.data.items.join(' ');

                  case 'quote':
                    return b.data.text;

                  default:
                    return '';
                }
              })
              .join(' ');

            c.content = text;
          } catch (e) {
            c.content = '';
          }
        });

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

  FilterUsers(filter: 'all' | 'active' | 'banned') {
    this.currentFilter = filter;

    this.currentUserPage = 0;

    this.users.set([]);

    this.loadUsers();
  }
  FilteredPosts(filter: 'all' | 'visible' | 'hidden') {
    this.currentPostFilter = filter;
    this.currentPostPage = 0;
    this.Posts.set([]);
    this.loadPosts();
  }

  get filteredReports(): Report[] {
    if (this.reportFilter === 'all') return this.reports;
    return this.reports.filter((r) => r.status === this.reportFilter);
  }

  get pendingReports(): number {
    return this.reports.filter((r) => r.status === 'pending').length;
  }
  //used
  get maxPostCount(): number {
    return Math.max(...this.weeklyPosts().map((p) => p.count), 0);
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
      error: (err) => {
        let errorM = err || err?.error || 'Faild to ban this user ';
        this.snackbar.open(errorM, 'Close', { duration: 3000 });
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
        this.snackbar.open('user Delleted  seccefelly', 'Close', { duration: 3000 });
      },
      error: (err) => {
        let errorM = err || err?.error || 'Faild to delete this  user ';
        this.snackbar.open(errorM, 'Close', { duration: 3000 });
      },
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
      error: () => {
        this.snackbar.open(`Faild  to delete this Post`, 'close', {
          duration: 3000,
        });
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

        this.snackbar.open(`Post ${Post.status ? 'hide' : 'unhide '}  succefully`, 'close', {
          duration: 3000,
        });
      },
      error: (err) => {
        let errorMsg = err || err?.Error || 'faild to hide this post';
        this.snackbar.open(errorMsg, 'close', {
          duration: 3000,
        });
      },
    });
  }

  resolveReport(report: Report) {
    report.status = 'resolved';
  }

  dismissReport(report: Report) {
    report.status = 'dismissed';
  }
}
