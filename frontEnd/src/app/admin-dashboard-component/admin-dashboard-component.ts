import { Component, computed, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
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
  TopReportedDto,
  TotalsDto,
  UsersDTO,
  WeeklyPosts,
} from '../core/services/admin-dashboard';

export interface Post {
  id: number;
  author: string;
  authorAvatar: string;
  content: string;
  category: string;
  likes: number;
  reports: number;
  status: 'visible' | 'hidden' | 'removed';
  date: string;
}

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
  ],
  templateUrl: './admin-dashboard-component.html',
  styleUrls: ['./admin-dashboard-component.css'],
})
export class AdminDashboardComponent implements OnInit {
  currentFilter: 'all' | 'active' | 'banned' = 'all';
  currentUserPage = 0;
  isUsersLoading = false;
  private userObserver!: IntersectionObserver;
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

  totals = signal<TotalsDto>({ users: 0, posts: 0, banned: 0, reports: 0 });
  users = signal<UsersDTO[]>([]);
  weeklyPosts = signal<WeeklyPosts[]>([]);
  topReportedUsers = signal<TopReportedDto[]>([]);
  activeTab = 0;
  today = '';
  postFilter: 'all' | 'visible' | 'hidden' | 'removed' = 'all';
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

  posts: Post[] = [
    {
      id: 1,
      author: 'Omar Tahiri',
      authorAvatar: 'OT',
      content: 'Controversial take on local politics...',
      category: 'Politics',
      likes: 234,
      reports: 7,
      status: 'visible',
      date: '2h ago',
    },
    {
      id: 2,
      author: 'Karim Benali',
      authorAvatar: 'KB',
      content: 'Best hiking spots in the Atlas Mountains 🏔️',
      category: 'Travel',
      likes: 891,
      reports: 0,
      status: 'visible',
      date: '5h ago',
    },
    {
      id: 3,
      author: 'Nadia Chraibi',
      authorAvatar: 'NC',
      content: 'Spam product links and fake discounts...',
      category: 'Spam',
      likes: 3,
      reports: 14,
      status: 'removed',
      date: '1d ago',
    },
    {
      id: 4,
      author: 'Lina Moussaoui',
      authorAvatar: 'LM',
      content: 'Misleading health information about vaccines',
      category: 'Health',
      likes: 45,
      reports: 9,
      status: 'hidden',
      date: '2d ago',
    },
    {
      id: 5,
      author: 'Yassine Alaoui',
      authorAvatar: 'YA',
      content: 'New café opening in Gueliz — must visit!',
      category: 'Food',
      likes: 562,
      reports: 0,
      status: 'visible',
      date: '3d ago',
    },
    {
      id: 6,
      author: 'Hamza Berrada',
      authorAvatar: 'HB',
      content: 'Photography walk around the medina',
      category: 'Art',
      likes: 1204,
      reports: 0,
      status: 'visible',
      date: '4d ago',
    },
  ];

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
  constructor(private adminService: AdminDashboard) {}
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
    console.log(1 , this.users());
  }
  get filteredPosts(): Post[] {
    if (this.postFilter === 'all') return this.posts;
    return this.posts.filter((p) => p.status === this.postFilter);
  }

  get filteredReports(): Report[] {
    if (this.reportFilter === 'all') return this.reports;
    return this.reports.filter((r) => r.status === this.reportFilter);
  }

  get pendingReports(): number {
    return this.reports.filter((r) => r.status === 'pending').length;
  }

  get maxPostCount(): number {
    return Math.max(...this.weeklyPosts().map((p) => p.count), 0);
  }

  get categoryTotal(): number {
    return this.categoryData.reduce((s, c) => s + c.count, 0);
  }

  banUser(user: UsersDTO) {
    // user.status = !user.status ;
  }

  deleteUser(id: number) {
    this.users().filter((u) => u.id !== id);
  }

  togglePostVisibility(post: Post) {
    post.status = post.status === 'visible' ? 'hidden' : 'visible';
  }

  removePost(post: Post) {
    post.status = 'removed';
  }

  resolveReport(report: Report) {
    report.status = 'resolved';
  }

  dismissReport(report: Report) {
    report.status = 'dismissed';
  }
}
