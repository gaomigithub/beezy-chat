import { HttpClientBase } from '@/apis/shared'
import { UserProfile } from '@/models/user'
// import Browser from "webextension-polyfill";

export class EncooProfileHttpClient extends HttpClientBase {
  public async getUserProfile() {
    const { data } = await this.request<UserProfile>({
      method: 'GET',
      url: `/v1/profile`,
    })
    return data
  }

  public async traceEvent(eventKey: string, content: string): Promise<void> {
    // const deviceId = (await Browser.storage.local.get('deviceId'))['deviceId']
    const deviceId = await localStorage.getItem('deviceId')
    await this.request({
      method: 'POST',
      url: `/v1/eventTracking`,
      data: { eventKey, content, deviceId, browserType: 'Chrome' },
    })
  }
}
