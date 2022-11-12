import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { history } from 'umi'
import { connect } from 'umi'
import { Row, Col, Button, Popconfirm } from 'antd'
import { t } from "@lingui/macro"
import { Page } from 'components'
import { stringify } from 'qs'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'


@connect(({ user, loading }) => ({ user, loading }))
class User extends PureComponent {
  handleRefresh = newQuery => { //reset
    const { location } = this.props
    const { query, pathname } = location

    history.push({
      pathname,
      search: stringify(
        {
          ...query,
          ...newQuery,
        },
        { arrayFormat: 'repeat' }
      ),
    })
  }

  get modalProps() {
    const { dispatch, user, loading } = this.props
    const { currentItem, modalVisible, modalType } = user

    return {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      destroyOnClose: true,
      maskClosable: false,
      confirmLoading: loading.effects[`user/${modalType}`],
      title: `${
        modalType === 'create' ? t`Create User` : t`Update User`
      }`,
      centered: true,
      onOk: data => {
        dispatch({
          type: `user/${modalType}`,
          payload: data,
        }).then(() => {
          this.handleRefresh()
        })
      },
      onCancel() {
        dispatch({
          type: 'user/hideModal',
        })
      },
    }
  }

  get listProps() {
    const { dispatch, user, loading } = this.props
    const { list, pagination, selectedRowKeys } = user

    return {
      dataSource: list,
      loading: loading.effects['user/query'],
      pagination,
      onChange: page => {
        this.handleRefresh({
          page: page.current,
          pageSize: page.pageSize,
        })
      },
      onHideItem: id => {
        // dispatch({
        //   type: 'user/delete',
        //   payload: id,
        // }).then(() => {
        //   this.handleRefresh({
        //     page:
        //       list.length === 1 && pagination.current > 1
        //         ? pagination.current - 1
        //         : pagination.current,
        //   })
        // })
      },
      onInviteItem(item) {
      },
      // rowSelection: {
      //   selectedRowKeys,
      //   onChange: keys => {
      //     dispatch({
      //       type: 'user/updateState',
      //       payload: {
      //         selectedRowKeys: keys,
      //       },
      //     })
      //   },
      // },
    }
  }

  get filterProps() {
    const { location, dispatch } = this.props
    const { query } = location

    return {
      filter: {
        ...query,
      },
      onFilterChange: value => {
        this.handleRefresh({
          ...value,
        })
      },
      onSort() {
        // dispatch({
        //   type: 'user/showModal',
        //   payload: {
        //     modalType: 'create',
        //   },
        // })
      },
    }
  }

  render() {
    const { user } = this.props

    return (
      <Page inner>
        <Filter {...this.filterProps} />
        <List {...this.listProps} />
        <Modal {...this.modalProps} />
      </Page>
    )
  }
}

User.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  // dispatch: PropTypes.func,
  // loading: PropTypes.object,
}

export default User
