import React from 'react'
import { Tabs, TabPane } from '@douyinfe/semi-ui'
import Department from '../department'
import Personnel from '../personnel'
import useFreeLogin from '../../client/use-free-login'

function MainContent() {
  const { userInfo, code } = useFreeLogin()

  return (
    <Tabs lazyRender>
      <TabPane tab="部门管理" itemKey="1">
        <Department />
      </TabPane>
      <TabPane tab="人员管理" itemKey="2">
        <Personnel />
      </TabPane>
      <TabPane tab={code ? code : 111111} itemKey="3">
        <Department />
      </TabPane>
    </Tabs>
  )
}

export default MainContent
