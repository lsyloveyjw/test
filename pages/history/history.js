Page({
  data: {
    search: '',
    onlineItems: [
      { id: 'm1', title: '减肥券', points: 20, date: '2026-02-17', icon: '🩷' },
      { id: 'm2', title: '饭票', points: 50, date: '2026-02-17', icon: '🩷' },
      { id: 'm3', title: '短途旅行', points: 150, date: '2026-02-17', icon: '🍜' },
      { id: 'm4', title: '跑腿召唤', points: 30, date: '2026-02-18', icon: '🩷' }
    ],
    offlineItems: [
      { id: 'd1', title: '说情话', points: 10, date: '2026-02-17', icon: '🍜' },
      { id: 'd2', title: '说情话', points: 10, date: '2026-02-17', icon: '🩷' }
    ]
  },

  onSearch(e) {
    this.setData({ search: e.detail.value });
  }
});
