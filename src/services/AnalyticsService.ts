// /src/services/AnalyticsService.ts

export interface SwipeAnalytics {
  id?: string;
  userId: string;
  couponId: string;
  brandId?: string;
  campaignId?: string;
  swipeDirection: 'left' | 'right';
  swipeMethod: 'gesture' | 'button';
  viewStartTime: number;
  viewDuration: number;
  dragDistance: number;
  swipeVelocity: number;
  hesitationEvents: number;
  isPersonalized: boolean;
  isAiGenerated: boolean;
  conversionProbability?: number;
  category: string;
  couponValue: number;
  deviceType: 'mobile' | 'desktop';
  location?: {
    storeId?: string;
    isCheckedIn: boolean;
    latitude?: number;
    longitude?: number;
  };
  sessionId: string;
  timestamp: number;
}

export interface CouponViewAnalytics {
  id?: string;
  userId: string;
  couponId: string;
  brandId?: string;
  viewContext: 'swipe' | 'browse' | 'search' | 'category';
  viewStartTime: number;
  viewDuration: number;
  searchQuery?: string;
  categoryFilter?: string;
  isPersonalized: boolean;
  position: number; // position in feed/results
  sessionId: string;
  timestamp: number;
}

export interface SessionAnalytics {
  id?: string;
  userId: string;
  sessionId: string;
  startTime: number;
  endTime?: number;
  totalCouponsViewed: number;
  totalCouponsAccepted: number;
  totalCouponsDeclined: number;
  averageViewDuration: number;
  deviceType: 'mobile' | 'desktop';
  location?: {
    storeId?: string;
    checkedInDuration?: number;
  };
  timestamp: number;
}

class AnalyticsService {
  private sessionId: string;
  private sessionStartTime: number;
  private currentViewStartTime: number | null = null;
  private hesitationTimer: NodeJS.Timeout | null = null;
  private hesitationCount: number = 0;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.initializeSession();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async initializeSession() {
    // Initialize session tracking
    console.log(`Analytics session started: ${this.sessionId}`);
  }

  // Track when user starts viewing a coupon
  startCouponView(coupon: any, context: 'swipe' | 'browse' | 'search' | 'category', position: number = 0) {
    this.currentViewStartTime = Date.now();
    this.hesitationCount = 0;

    // Track view analytics
    const viewAnalytics: CouponViewAnalytics = {
      userId: 'user123', // Replace with actual user ID
      couponId: coupon.id,
      brandId: coupon.brandId,
      viewContext: context,
      viewStartTime: this.currentViewStartTime,
      viewDuration: 0, // Will be updated on end
      isPersonalized: coupon.isPersonalized || false,
      position,
      sessionId: this.sessionId,
      timestamp: Date.now(),
    };

    this.saveViewAnalytics(viewAnalytics);
  }

  // Track hesitation behavior (hovering, pausing)
  trackHesitation() {
    this.hesitationCount++;
    
    if (this.hesitationTimer) {
      clearTimeout(this.hesitationTimer);
    }

    this.hesitationTimer = setTimeout(() => {
      console.log(`Hesitation detected: ${this.hesitationCount} events`);
    }, 500);
  }

  // Track swipe analytics
  async trackSwipe(
    coupon: any,
    direction: 'left' | 'right',
    method: 'gesture' | 'button',
    dragInfo?: { distance: number; velocity: number }
  ) {
    const viewDuration = this.currentViewStartTime 
      ? Date.now() - this.currentViewStartTime 
      : 0;

    const swipeAnalytics: SwipeAnalytics = {
      userId: 'user123', // Replace with actual user ID
      couponId: coupon.id,
      brandId: coupon.brandId,
      campaignId: coupon.campaignId,
      swipeDirection: direction,
      swipeMethod: method,
      viewStartTime: this.currentViewStartTime || Date.now(),
      viewDuration,
      dragDistance: dragInfo?.distance || 0,
      swipeVelocity: dragInfo?.velocity || 0,
      hesitationEvents: this.hesitationCount,
      isPersonalized: coupon.isPersonalized || false,
      isAiGenerated: coupon.aiGenerated || false,
      conversionProbability: coupon.conversionProbability,
      category: coupon.category || 'uncategorized',
      couponValue: coupon.value,
      deviceType: this.getDeviceType(),
      location: await this.getCurrentLocation(),
      sessionId: this.sessionId,
      timestamp: Date.now(),
    };

    await this.saveSwipeAnalytics(swipeAnalytics);
    console.log('Swipe tracked:', swipeAnalytics);
  }

  // Track coupon redemption at checkout
  async trackRedemption(couponId: string, redemptionValue: number, storeId?: string) {
    const redemptionData = {
      couponId,
      userId: 'user123',
      redemptionValue,
      storeId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
    };

    // Save to your database
    console.log('Redemption tracked:', redemptionData);
  }

  // Get current device type
  private getDeviceType(): 'mobile' | 'desktop' {
    return window.innerWidth <= 768 ? 'mobile' : 'desktop';
  }

  // Get current location if available
  private async getCurrentLocation(): Promise<any> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ isCheckedIn: false });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            isCheckedIn: false, // Update based on your check-in logic
          });
        },
        () => {
          resolve({ isCheckedIn: false });
        },
        { timeout: 5000 }
      );
    });
  }

  // Save analytics to your chosen storage (localStorage for now, Supabase later)
  private async saveSwipeAnalytics(analytics: SwipeAnalytics) {
    try {
      // For now, save to localStorage - replace with Supabase later
      const existing = JSON.parse(localStorage.getItem('swipe_analytics') || '[]');
      existing.push(analytics);
      localStorage.setItem('swipe_analytics', JSON.stringify(existing));

      // TODO: Replace with Supabase integration
      // await supabase.from('swipe_analytics').insert(analytics);
    } catch (error) {
      console.error('Failed to save swipe analytics:', error);
    }
  }

  private async saveViewAnalytics(analytics: CouponViewAnalytics) {
    try {
      const existing = JSON.parse(localStorage.getItem('view_analytics') || '[]');
      existing.push(analytics);
      localStorage.setItem('view_analytics', JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to save view analytics:', error);
    }
  }

  // Get analytics data for dashboards
  async getSwipeAnalytics(filters?: {
    userId?: string;
    brandId?: string;
    couponId?: string;
    dateRange?: { start: number; end: number };
  }): Promise<SwipeAnalytics[]> {
    try {
      const data = JSON.parse(localStorage.getItem('swipe_analytics') || '[]');
      
      if (!filters) return data;

      return data.filter((item: SwipeAnalytics) => {
        if (filters.userId && item.userId !== filters.userId) return false;
        if (filters.brandId && item.brandId !== filters.brandId) return false;
        if (filters.couponId && item.couponId !== filters.couponId) return false;
        if (filters.dateRange) {
          if (item.timestamp < filters.dateRange.start || item.timestamp > filters.dateRange.end) {
            return false;
          }
        }
        return true;
      });
    } catch (error) {
      console.error('Failed to get analytics:', error);
      return [];
    }
  }

  // Generate summary metrics for CPG dashboard
  async getCampaignMetrics(campaignId: string) {
    const analytics = await this.getSwipeAnalytics({ brandId: campaignId });
    
    const totalImpressions = analytics.length;
    const acceptedSwipes = analytics.filter(a => a.swipeDirection === 'right').length;
    const declinedSwipes = analytics.filter(a => a.swipeDirection === 'left').length;
    const averageViewDuration = analytics.reduce((sum, a) => sum + a.viewDuration, 0) / totalImpressions;
    const averageHesitation = analytics.reduce((sum, a) => sum + a.hesitationEvents, 0) / totalImpressions;
    
    return {
      totalImpressions,
      acceptanceRate: totalImpressions > 0 ? (acceptedSwipes / totalImpressions) * 100 : 0,
      declineRate: totalImpressions > 0 ? (declinedSwipes / totalImpressions) * 100 : 0,
      averageViewDuration: Math.round(averageViewDuration / 1000), // Convert to seconds
      averageHesitation,
      gestureVsButton: {
        gesture: analytics.filter(a => a.swipeMethod === 'gesture').length,
        button: analytics.filter(a => a.swipeMethod === 'button').length,
      },
    };
  }

  // End session tracking
  endSession() {
    const sessionData: SessionAnalytics = {
      userId: 'user123',
      sessionId: this.sessionId,
      startTime: this.sessionStartTime,
      endTime: Date.now(),
      totalCouponsViewed: 0, // Calculate based on view analytics
      totalCouponsAccepted: 0, // Calculate based on swipe analytics
      totalCouponsDeclined: 0, // Calculate based on swipe analytics
      averageViewDuration: 0, // Calculate average
      deviceType: this.getDeviceType(),
      timestamp: Date.now(),
    };

    console.log('Session ended:', sessionData);
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();