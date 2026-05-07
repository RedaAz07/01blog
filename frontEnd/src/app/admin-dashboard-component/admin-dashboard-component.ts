import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { AdminDashboard, TotalsDto } from '../core/services/admin-dashboard';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'moderator';
  status: 'active' | 'banned' | 'warned';
  posts: number;
  reports: number;
  joinDate: string;
}

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
  totals = signal<TotalsDto>({ users: 0, posts: 0, banned: 0, reports: 0 });
  activeTab = 0;
  today = '';
  selectedFilter: 'all' | 'active' | 'banned' | 'warned' = 'all';
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

  users: User[] = [
    {
      id: 1,
      name: 'Karim Benali',
      email: 'karim@mail.com',
      avatar: 'KB',
      role: 'user',
      status: 'active',
      posts: 142,
      reports: 0,
      joinDate: 'Jan 12, 2024',
    },
    {
      id: 2,
      name: 'Sara El Fassi',
      email: 'sara@mail.com',
      avatar: 'SE',
      role: 'moderator',
      status: 'active',
      posts: 87,
      reports: 1,
      joinDate: 'Mar 3, 2024',
    },
    {
      id: 3,
      name: 'Omar Tahiri',
      email: 'omar.t@mail.com',
      avatar: 'OT',
      role: 'user',
      status: 'warned',
      posts: 310,
      reports: 5,
      joinDate: 'Nov 20, 2023',
    },
    {
      id: 4,
      name: 'Nadia Chraibi',
      email: 'nadia@mail.com',
      avatar: 'NC',
      role: 'user',
      status: 'banned',
      posts: 54,
      reports: 12,
      joinDate: 'Feb 14, 2024',
    },
    {
      id: 5,
      name: 'Yassine Alaoui',
      email: 'yassine@mail.com',
      avatar: 'YA',
      role: 'user',
      status: 'active',
      posts: 230,
      reports: 2,
      joinDate: 'Apr 1, 2024',
    },
    {
      id: 6,
      name: 'Lina Moussaoui',
      email: 'lina@mail.com',
      avatar: 'LM',
      role: 'user',
      status: 'warned',
      posts: 67,
      reports: 8,
      joinDate: 'Dec 5, 2023',
    },
    {
      id: 7,
      name: 'Hamza Berrada',
      email: 'hamza@mail.com',
      avatar: 'HB',
      role: 'user',
      status: 'active',
      posts: 192,
      reports: 0,
      joinDate: 'Jun 18, 2024',
    },
  ];

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

  // Analytics data
  weeklyPosts = [42, 68, 55, 91, 73, 88, 64];
  weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  topReportedUsers = this.users
    .filter((u) => u.reports > 0)
    .sort((a, b) => b.reports - a.reports)
    .slice(0, 5);

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
  }

  get filteredUsers(): User[] {
    if (this.selectedFilter === 'all') return this.users;
    return this.users.filter((u) => u.status === this.selectedFilter);
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
    return Math.max(...this.weeklyPosts);
  }

  get categoryTotal(): number {
    return this.categoryData.reduce((s, c) => s + c.count, 0);
  }

  getCategoryArc(index: number): string {
    let startAngle = 0;
    for (let i = 0; i < index; i++) {
      startAngle += (this.categoryData[i].count / this.categoryTotal) * 360;
    }
    const sweep = (this.categoryData[index].count / this.categoryTotal) * 360;
    return this.describeArc(100, 100, 72, startAngle - 90, startAngle + sweep - 90);
  }

  describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startDeg));
    const y1 = cy + r * Math.sin(toRad(startDeg));
    const x2 = cx + r * Math.cos(toRad(endDeg));
    const y2 = cy + r * Math.sin(toRad(endDeg));
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  banUser(user: User) {
    user.status = user.status === 'banned' ? 'active' : 'banned';
  }

  warnUser(user: User) {
    user.status = 'warned';
  }

  deleteUser(id: number) {
    this.users = this.users.filter((u) => u.id !== id);
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
