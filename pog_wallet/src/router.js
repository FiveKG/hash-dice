import Vue from 'vue'
import Router from 'vue-router'

import welcome from './pages/welcome/index.vue'
import Index from './pages/Index'
// import Index from './pages/zTest'
import Scanner from './pages/scanner/Scanner'
import Transfer from './pages/assets/Transfer'
import Receive from './pages/assets/eos/receive/Receive'
import Resource from './pages/assets/eos/resource/Resource'
import SelectBlockchain from './pages/assets/eos/SelectBlockchain'
import AddWallet from './pages/assets/eos/AddWallet'
import ImportWallet from './pages/assets/eos/ImportWallet'
import TransferStraight from './pages/assets/eos/TransferStraight'
import SelectToken from './pages/assets/eos/SelectToken'
import FriendCreation from './pages/assets/eos/create/FriendCreation'
import ActivationCode from './pages/assets/eos/create/ActivationCode'
import BackupWallet from './pages/assets/eos/create/BackupWallet'
import BackupKey from './pages/assets/eos/create/BackupKey'
import ConfrimKey from './pages/assets/eos/create/ConfrimKey'
import CreateAccount from './pages/assets/eos/create/CreateAccount'
import ActivePay from './pages/assets/eos/create/ActivePay'
import ActivationCodeCreate from './pages/assets/eos/create/ActivationCodeCreate'
import SearchToken from './pages/assets/eos/tokens/SearchToken'
import TransferRecords from './pages/assets/eos/history/TransferRecords'
import TransferDetail from './pages/assets/eos/history/TransferDetail'
import Iframe from './pages/iframe/Iframe'
import Permission from './pages/assets/eos/permission/Permission'
import EditPermission from './pages/assets/eos/permission/EditPermission'
import PrivateKey from './pages/assets/eos/introduction/PrivateKey'
import EthAddWallet from './pages/assets/eth/AddWallet'
import EthCreateWallet from './pages/assets/eth/CreateWallet'
import EthBackupWallet from './pages/assets/eth/BackupWallet'
import EthBackupMnemonic from './pages/assets/eth/BackupMnemonic'
import EthConfrimMnemonic from './pages/assets/eth/ConfrimMnemonic'
import EthImportWallet from './pages/assets/eth/ImportWallet'
import EthTransferStraight from './pages/assets/eth/TransferStraight'
import EthWalletInfo from './pages/assets/eth/WalletInfo'
import EthTransferRecords from './pages/assets/eth/TransferRecords'
import EthTransferDetail from './pages/assets/eth/TransferDetail'
import EthReceive from './pages/assets/eth/Receive'
import EthSelectToken from './pages/assets/eth/SelectToken'
import EthSearchToken from './pages/assets/eth/SearchToken'
import PogAddWallet from './pages/assets/pog/AddWallet'
import PogImportWallet from './pages/assets/pog/ImportWallet'
import PogCreateWallet from './pages/assets/pog/CreateWallet'
import PogBackupWallet from './pages/assets/pog/BackupWallet'
import PogBackupKey from './pages/assets/pog/BackupKey'
import PogConfrimKey from './pages/assets/pog/ConfrimKey'
import PogWalletInfo from './pages/assets/pog/WalletInfo'
import PogTransferRecords from './pages/assets/pog/TransferRecords'
import PogTransferStraight from './pages/assets/pog/TransferStraight'
import PogTransferDetail from './pages/assets/pog/TransferDetail'
import PogReceive from './pages/assets/pog/Receive'
import PogSelectToken from './pages/assets/pog/SelectToken'
import PogSearchToken from './pages/assets/pog/SearchToken'
import Contacts from './pages/me/Contacts'
import CreateContact from './pages/me/CreateContact'
import ManageWallet from './pages/me/ManageWallet'
import WalletInfo from './pages/me/WalletInfo'
import Setting from './pages/me/Setting'
import I18n from './pages/me/I18n'
import CurrencyUnit from './pages/me/CurrencyUnit'
import Records from './pages/me/Records'
import CreateWallet from './pages/assets/eos/CreateWallet'
import DappList from './pages/discover/DappList'
import DappSearch from './pages/discover/DappSearch'
import SimpleLogin from './pages/discover/SimpleLogin'
import FingerprintWarn from './pages/assets/FingerprintWarn'
import MyInvitationPage from './pages/invitation/MyInvitationPage'
import Profit2 from './pages/invitation/Profit'
import Profit from './pages/invitation2/Profit'
import SubAccount from './pages/invitation/SubAccount'
import Invitation from './pages/me/Invitation'
import Announcement from './pages/me/Announcement'
import TBGFAQ from './pages/invitation/FAQ'
import TBGRules from './pages/invitation/Rules'
import MyTeam from './pages/invitation/MyTeam'
import HelpFriend from './pages/invitation/HelpFriend'
import Withdraw from './pages/invitation/Withdraw'
import BingoPool from './pages/invitation/BingoPool'
import ShareholderPool from './pages/invitation/ShareholderPool'
import ShareholderPoolDetails from './pages/invitation/ShareholderPoolDetails'
import FivePool from './pages/invitation/FivePool'
import FivePoolDetails from './pages/invitation/FivePoolDetails'
import PkPool from './pages/invitation/PkPool'
import level from './pages/invitation/level'

import UnBind from './pages/invitation/UnBind'
import IsBind from './pages/invitation/IsBind'
import IndexT from './pages/invitation/Index'
import NotParticipating from './pages/invitation2/NotParticipating'

import TradingCenter from './pages/invitation2/TradingCenter/TradingCenter'
import AssetPool from './pages/invitation2/AssetPool/AssetPool'
import MiningDetails from './pages/invitation2/AssetPool/MiningDetails'
import AssetLinearPool from './pages/invitation2/AssetLinearPool/AssetLinearPool'
import AssetLinearDetails from './pages/invitation2/AssetLinearPool/AssetLinearDetails'
import SaleableBalance from './pages/invitation2/SaleableBalance'
import SaleableLimit from './pages/invitation2/SaleableLimit'
import SignDetails from './pages/invitation2/SignDetails'
import DestructionDetails from './pages/invitation2/DestructionDetails'
import Notice from './pages/invitation2/Notice'

import Otc from './pages/game/otc/Otc'
import OtcGo from './pages/game/otc/OtcGo'
import HaGo from './pages/game/ha/HaGo'
import HaNine from './pages/game/ha/HaNine'
import TreasureGo from './pages/game/treasure/TreasureGo'
import TreasurePage from './pages/game/treasure/TreasurePage'
import LotteryDetailsNoLottery from './pages/game/treasure/LotteryDetailsNoLottery'
import BettingDetails from './pages/game/treasure/BettingDetails'
import TreasureRule from './pages/game/treasure/TreasureRule'
import HashDiceGo from './pages/game/hashdice/HashDiceGo'
import HashDicePage from './pages/game/hashdice/HashDicePage'
import HashDiceRule from './pages/game/hashdice/HashDiceRule'
import HashDiceDetails from './pages/game/hashdice/HashDiceDetails'


import GlovalLotto from './pages/game/qqc/GlovalLotto'
import LottoGame from './pages/game/qqc/LottoGame'
import OpenRecordList from './pages/game/qqc/OpenRecordList'
import MyBetRecordList from './pages/game/qqc/MyBetRecordList'
import GlovalLottoRule from './pages/game/qqc/GameRule'
import QqcBetDetail from './pages/game/qqc/BetDetail'
import QqcOpenDetail from './pages/game/qqc/OpenDetail'


// import LottoGame from './pages/game/qqc/LottoGame'

// 哈希分分彩部分==============================================================_start
import LotteryGo from './pages/game/hash_minute_lottery/LotteryGo'
import Lottery from './pages/game/hash_minute_lottery/Lottery'
import LotteryRecord from './pages/game/hash_minute_lottery/LotteryRecord'
import BetDetail from './pages/game/hash_minute_lottery/BetDetail'
import LotteryRule from './pages/game/hash_minute_lottery/LotteryRule'
    
// 哈希分分彩部分==============================================================_end

import tradePage from './pages/Trade/tradePage'


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: welcome,
    },
    {
      path: '/selectBlockchain',
      name: 'SelectBlockchain',
      component: SelectBlockchain,
    },
    {
      path: '/Scanner',
      name: 'Scanner',
      component: Scanner,
    },
    {
      path: '/Transfer',
      name: 'Transfer',
      component: Transfer,
    },
    {
      path: '/Receive',
      name: 'Receive',
      component: Receive,
    },
    {
      path: '/Resource',
      name: 'Resource',
      component: Resource,
    },
    {
      path: '/TransferStraight',
      name: 'TransferStraight',
      component: TransferStraight,
    },
    {
      path: '/DappList',
      name: 'DappList',
      component: DappList,
    },
    {
      path: '/DappSearch',
      name: 'DappSearch',
      component: DappSearch,
    },
    {
      path: '/SimpleLogin',
      name: 'SimpleLogin',
      component: SimpleLogin,
    },
    {
      path: '/CurrencyUnit',
      name: 'CurrencyUnit',
      component: CurrencyUnit,
    },
    {
      path: '/CreateWallet',
      name: 'CreateWallet',
      component: CreateWallet,
    },
    {
      path: '/Records',
      name: 'Records',
      component: Records,
    },
    {
      path: '/I18n',
      name: 'I18n',
      component: I18n,
    },
    {
      path: '/Setting',
      name: 'Setting',
      component: Setting,
    },
    {
      path: '/WalletInfo',
      name: 'WalletInfo',
      component: WalletInfo,
    },
    {
      path: '/ManageWallet',
      name: 'ManageWallet',
      component: ManageWallet,
    },
    {
      path: '/CreateContact',
      name: 'CreateContact',
      component: CreateContact,
    },
    {
      path: '/PrivateKey',
      name: 'PrivateKey',
      component: PrivateKey,
    },
    {
      path: '/EditPermission',
      name: 'EditPermission',
      component: EditPermission,
    },
    {
      path: '/Permission',
      name: 'Permission',
      component: Permission,
    },
    {
      path: '/Iframe',
      name: 'Iframe',
      component: Iframe,
    },
    {
      path: '/TransferDetail',
      name: 'TransferDetail',
      component: TransferDetail,
    },
    {
      path: '/TransferRecords',
      name: 'TransferRecords',
      component: TransferRecords,
    },
    {
      path: '/SearchToken',
      name: 'SearchToken',
      component: SearchToken,
    },
    {
      path: '/ActivePay',
      name: 'ActivePay',
      component: ActivePay,
    },
    {
      path: '/ActivationCodeCreate',
      name: 'ActivationCodeCreate',
      component: ActivationCodeCreate,
    },
    {
      path: '/SelectToken',
      name: 'SelectToken',
      component: SelectToken,
    },
    {
      path: '/Contacts',
      name: 'Contacts',
      component: Contacts,
    },
    {
      path: '/addWallet',
      name: 'AddWallet',
      component: AddWallet,
    },
    {
      path: '/importWallet',
      name: 'ImportWallet',
      component: ImportWallet,
    },
    {
      path: '/friendCreation',
      name: 'FriendCreation',
      component: FriendCreation,
    },
    {
      path: '/backupWallet',
      name: 'BackupWallet',
      component: BackupWallet,
    },
    {
      path: '/backupKey',
      name: 'BackupKey',
      component: BackupKey,
    },
    {
      path: '/confrimKey',
      name: 'ConfrimKey',
      component: ConfrimKey,
    },
    {
      path: '/createAccount',
      name: 'CreateAccount',
      component: CreateAccount,
    },
    {
      path: '/fingerprintWarn',
      name: 'FingerprintWarn',
      component: FingerprintWarn,
    },
    {
      path: '/myInvitationPage',
      name: 'MyInvitationPage',
      component: MyInvitationPage,
    },
    {
      path: '/profit',
      name: 'Profit',
      component: Profit,
    },
    {
      path: '/profit2',
      name: 'Profit2',
      component: Profit2,
    },
    {
      path: '/subAccount',
      name: 'SubAccount',
      component: SubAccount,
    },
    {
      path: '/invitation',
      name: 'Invitation',
      component: Invitation,
    },
    {
      path: '/announcement',
      name: 'Announcement',
      component: Announcement,
    },
    {
      path: '/tbg/faq',
      name: 'TBGFAQ',
      component: TBGFAQ,
    },
    {
      path: '/tbg/rules',
      name: 'TBGRules',
      component: TBGRules,
    },
    {
      path: '/myteam',
      name: 'MyTeam',
      component: MyTeam,
    },
    {
      path: '/helpFriend',
      name: 'HelpFriend',
      component: HelpFriend,
    },
    {
      path: '/withdraw',
      name: 'Withdraw',
      component: Withdraw,
    },
    {
      path: '/bingoPool',
      name: 'BingoPool',
      component: BingoPool,
    },
    {
      path: '/shareholderPool',
      name: 'ShareholderPool',
      component: ShareholderPool,
    },
    {
      path: '/shareholderPoolDetails',
      name: 'ShareholderPoolDetails',
      component: ShareholderPoolDetails,
    },
    {
      path: '/fivePool',
      name: 'FivePool',
      component: FivePool,
    },
    {
      path: '/fivePoolDetails',
      name: 'FivePoolDetails',
      component: FivePoolDetails,
    },
    {
      path: '/pkPool',
      name: 'PkPool',
      component: PkPool,
    },
    {
      path: '/level',
      name: 'level',
      component: level,
    },
    {
      path: '/ethAddWallet',
      name: 'EthAddWallet',
      component: EthAddWallet,
    },
    {
      path: '/ethCreateWallet',
      name: 'EthCreateWallet',
      component: EthCreateWallet,
    },
    {
      path: '/ethBackupWallet',
      name: 'EthBackupWallet',
      component: EthBackupWallet,
    },
    {
      path: '/ethBackupMnemonic',
      name: 'EthBackupMnemonic',
      component: EthBackupMnemonic,
    },
    {
      path: '/ethConfrimMnemonic',
      name: 'EthConfrimMnemonic',
      component: EthConfrimMnemonic,
    },
    {
      path: '/ethImportWallet',
      name: 'EthImportWallet',
      component: EthImportWallet,
    },
    {
      path: '/ethTransferStraight',
      name: 'EthTransferStraight',
      component: EthTransferStraight,
    },
    {
      path: '/ethWalletInfo',
      name: 'EthWalletInfo',
      component: EthWalletInfo,
    },
    {
      path: '/ethTransferRecords',
      name: 'EthTransferRecords',
      component: EthTransferRecords,
    },
    {
      path: '/ethReceive',
      name: 'EthReceive',
      component: EthReceive,
    },
    {
      path: '/ethSelectToken',
      name: 'EthSelectToken',
      component: EthSelectToken,
    },
    {
      path: '/ethSearchToken',
      name: 'EthSearchToken',
      component: EthSearchToken,
    },
    {
      path: '/ethTransferDetail',
      name: 'EthTransferDetail',
      component: EthTransferDetail,
    },
    {
      path: '/pogAddWallet',
      name: 'PogAddWallet',
      component: PogAddWallet,
    },
    {
      path: '/pogImportWallet',
      name: 'PogImportWallet',
      component: PogImportWallet,
    },
    {
      path: '/pogCreateWallet',
      name: 'PogCreateWallet',
      component: PogCreateWallet,
    },
    {
      path: '/pogBackupWallet',
      name: 'PogBackupWallet',
      component: PogBackupWallet,
    },
    {
      path: '/pogBackupKey',
      name: 'PogBackupKey',
      component: PogBackupKey,
    },
    {
      path: '/pogConfrimKey',
      name: 'PogConfrimKey',
      component: PogConfrimKey,
    },
    {
      path: '/pogWalletInfo',
      name: 'PogWalletInfo',
      component: PogWalletInfo,
    },
    {
      path: '/pogTransferRecords',
      name: 'PogTransferRecords',
      component: PogTransferRecords,
    },
    {
      path: '/pogTransferStraight',
      name: 'PogTransferStraight',
      component: PogTransferStraight,
    },
    {
      path: '/pogTransferDetail',
      name: 'PogTransferDetail',
      component: PogTransferDetail,
    },
    {
      path: '/pogReceive',
      name: 'PogReceive',
      component: PogReceive,
    },
    {
      path: '/pogSelectToken',
      name: 'PogSelectToken',
      component: PogSelectToken,
    },
    {
      path: '/pogSearchToken',
      name: 'PogSearchToken',
      component: PogSearchToken,
    },

    {
      path: '/tradingCenter',
      name: 'TradingCenter',
      component: TradingCenter,
    },
    {
      path: '/unBind',
      name: 'UnBind',
      component: UnBind,
    },
    {
      path: '/isBind',
      name: 'IsBind',
      component: IsBind,
    },
    {
      path: '/indexT',
      name: 'IndexT',
      component: IndexT,
    },
    {
      path: '/notParticipating',
      name: 'NotParticipating',
      component: NotParticipating,
    },

    {
      path: '/assetPool',
      name: 'AssetPool',
      component: AssetPool,
    },
    {
      path: '/miningDetails',
      name: 'MiningDetails',
      component: MiningDetails,
    },
    {
      path: '/assetLinearPool',
      name: 'AssetLinearPool',
      component: AssetLinearPool,
    },
    {
      path: '/assetLinearDetails',
      name: 'AssetLinearDetails',
      component: AssetLinearDetails,
    },
    {
      path: '/saleableBalance',
      name: 'SaleableBalance',
      component: SaleableBalance,
    },
    {
      path: '/saleableLimit',
      name: 'SaleableLimit',
      component: SaleableLimit,
    },
    {
      path: '/signDetails',
      name: 'SignDetails',
      component: SignDetails,
    },
    {
      path: '/DestructionDetails',
      name: 'DestructionDetails',
      component: DestructionDetails,
    },
    {
      path: '/Notice',
      name: 'Notice',
      component: Notice,
    },

    {
      path: '/otc',
      name: 'Otc',
      component: Otc,
    },
    {
      path: '/otcGo',
      name: 'OtcGo',
      component: OtcGo,
    },
    {
      path: '/haGo',
      name: 'HaGo',
      component: HaGo,
    },
    {
      path: '/haNine',
      name: 'HaNine',
      component: HaNine,
    },
    {
      path: '/treasureGo',
      name: 'TreasureGo',
      component: TreasureGo,
    },
    {
      path: '/treasurePage',
      name: 'TreasurePage',
      component: TreasurePage,
    },
    {
      path: '/lotteryDetailsNoLottery',
      name: 'LotteryDetailsNoLottery',
      component: LotteryDetailsNoLottery,
    },
    {
      path: '/bettingDetails',
      name: 'BettingDetails',
      component: BettingDetails,
    },
    {
      path: '/treasureRule',
      name: 'TreasureRule',
      component: TreasureRule,
    },
    {
      path: '/hashDiceGo',
      name: 'HashDiceGo',
      component: HashDiceGo,
    },
    {
      path: '/hashDicePage',
      name: 'HashDicePage',
      component: HashDicePage,
    },
    {
      path: '/hashDiceRule',
      name: 'HashDiceRule',
      component: HashDiceRule,
    },
    {
      path: '/hashDiceDetails',
      name: 'HashDiceDetails',
      component: HashDiceDetails,
    },

    //  全球彩部分==============================================================_start
    {
      path: '/GlovalLotto',
      name: 'GlovalLotto',
      component: GlovalLotto,
    },
    {
      path: '/LottoGame',
      name: 'LottoGame',
      component: LottoGame,
    },
    {
      path: '/OpenRecordList',
      name: 'OpenRecordList',
      component: OpenRecordList,
    },
    {
      path: '/MyBetRecordList',
      name: 'MyBetRecordList',
      component: MyBetRecordList,
    },
    {
      path: '/GlovalLottoRule',
      name: 'GlovalLottoRule',
      component: GlovalLottoRule,
    },
    {
      path: '/QQC/BetDetail',
      name: 'QqcBetDetail',
      component: QqcBetDetail,
    },
    {
      path: '/QQC/OpenDetail',
      name: 'QqcOpenDetail',
      component: QqcOpenDetail,
    },
    // 全球彩部分==============================================================_end
    

  

    // 哈希分分彩部分==============================================================_start
    {
      path: '/LotteryGo',
      name: 'LotteryGo',
      component: LotteryGo,
    },
    {
      path: '/Lottery',
      name: 'Lottery',
      component: Lottery,
    },
    {
      path: '/LotteryRecord',
      name: 'LotteryRecord',
      component: LotteryRecord,
    },
    {
      path: '/LotteryRule',
      name: 'LotteryRule',
      component: LotteryRule,
    },
    // 哈希分分彩部分==============================================================_end
    {
      path: '/tradePage',
      name: 'tradePage',
      component: tradePage,
    },
  ]
})

export default router