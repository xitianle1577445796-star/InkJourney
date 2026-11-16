import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, FlatList, Alert, Modal, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Battery from 'expo-battery';
import * as Device from 'expo-device';
import * as Contacts from 'expo-contacts/legacy';
import { Magnetometer, Barometer, Accelerometer } from 'expo-sensors';

const TRANSLATIONS = {
  en: {
    appTitle: 'InkJourney Annals',
    newInscription: 'New Inscription',
    friendsTitle: 'Travel Mates & Friends',
    communityTitle: 'Ink Community Forum',
    tabHome: '📜 Annals',
    tabAdd: '✍️ Inscribe',
    tabFriends: '👥 Friends',
    tabCommunity: '💬 Community',
    noRecords: 'No ink records found yet.',
    noRecordsSub: 'Begin your travels and seal your memoirs.',
    sensorsHub: '⚡ Hard Native Sensors & Environment Hub',
    device: 'Device',
    battery: 'Battery',
    compass: 'Compass',
    temp: 'Temp',
    barometer: 'Barometer',
    accelerometer: 'Accelerometer',
    titleLabel: 'Title',
    titlePlaceholder: 'Enter title...',
    locationLabel: 'Location / Coordinates',
    locationPlaceholder: 'Tap GPS button to get real location...',
    getGps: '📍 Get GPS',
    photoLabel: 'Illustration / Photo Capture',
    camera: '📸 Camera',
    gallery: '🖼️ Gallery',
    reflectionsLabel: 'Reflections',
    reflectionsPlaceholder: 'Write notes...',
    saveBtn: 'Save Inscription',
    editBtn: 'Edit',
    deleteBtn: 'Delete',
    shareBtn: '📤 Share',
    editTitle: 'Edit Inscription',
    saveUpdate: 'Save Update',
    cancel: 'Cancel',
    friendPlaceholder: 'Friend name...',
    addBtn: 'Add',
    importContactsBtn: '📇 Import Contacts',
    contactsModalTitle: '📇 Capture from Phone Contacts',
    contactsSearchPlaceholder: 'Search contact name or phone...',
    contactsEmpty: 'No contacts found on this device.',
    contactAddBtn: '+ Add Mate',
    contactAddedTag: 'Added',
    contactsPermTitle: 'Contacts Permission Required',
    contactsPermMsg: 'Please allow contacts access in settings to import travel mates.',
    contactsErrorMsg: 'Unable to read device contacts.',
    statusLabel: 'Status',
    postPlaceholder: 'Share your thoughts with fellow travelers...',
    publishBtn: 'Publish to Community',
    settingsTitle: '⚙️ Settings',
    themeModeLabel: 'Theme Mode',
    dayMode: '☀️ Day Mode',
    nightMode: '🌙 Night Mode',
    imageBrightnessLabel: 'Image Brightness',
    languageLabel: 'Interface Language',
    closeBtn: 'Done',
    gpsDisabledTitle: 'Location Services Disabled',
    gpsDisabledMsg: 'Please turn on GPS in your phone settings.',
    permDeniedTitle: 'Permission Denied',
    permDeniedMsg: 'Please allow location permission to acquire exact coordinates.',
    acquiringTitle: 'Acquiring Satellite GPS',
    acquiringMsg: 'Connecting to GPS satellites for high-precision coordinates...',
    gpsSuccessTitle: 'GPS Locked',
    gpsSuccessMsg: 'Real-time high-precision satellite coordinates acquired!',
    gpsEmptyTitle: 'Location Notice',
    gpsEmptyMsg: 'Unable to acquire satellite signal. Please move to an open area.',
    gpsErrorTitle: 'Location Error',
    gpsErrorMsg: 'Failed to acquire real-time GPS location. Please try again.',
    fillAlert: 'Please fill in title and location.',
    updatedAlert: 'Updated successfully!',
  },
  zh: {
    appTitle: '墨行游记·编年',
    newInscription: '新撰游记',
    friendsTitle: '同行旅伴与好友',
    communityTitle: '墨行社区论坛',
    tabHome: '📜 游记',
    tabAdd: '✍️ 撰写',
    tabFriends: '👥 好友',
    tabCommunity: '💬 社区',
    noRecords: '暂无游记存档',
    noRecordsSub: '开启你的旅程，封存水墨记忆。',
    sensorsHub: '⚡ 原生硬件传感器与环境中心',
    device: '设备',
    battery: '电量',
    compass: '指南针',
    temp: '温度',
    barometer: '气压计',
    accelerometer: '加速度计',
    titleLabel: '游记标题',
    titlePlaceholder: '输入标题...',
    locationLabel: '实时位置 / 卫星坐标',
    locationPlaceholder: '点击右侧按钮获取真实GPS...',
    getGps: '📍 获取定位',
    photoLabel: '插图 / 现场拍摄',
    camera: '📸 相机',
    gallery: '🖼️ 相册',
    reflectionsLabel: '行旅随笔',
    reflectionsPlaceholder: '写下你的所见所感...',
    saveBtn: '保存游记',
    editBtn: '编辑',
    deleteBtn: '删除',
    shareBtn: '📤 分享',
    editTitle: '编辑游记',
    saveUpdate: '保存修改',
    cancel: '取消',
    friendPlaceholder: '输入好友名称...',
    addBtn: '添加',
    importContactsBtn: '📇 截取通讯录',
    contactsModalTitle: '📇 从手机通讯录捕获旅伴',
    contactsSearchPlaceholder: '搜索联系人姓名或号码...',
    contactsEmpty: '未在设备上找到联系人。',
    contactAddBtn: '+ 加为旅伴',
    contactAddedTag: '已添加',
    contactsPermTitle: '需要通讯录权限',
    contactsPermMsg: '请在系统设置中允许访问通讯录以导入好友。',
    contactsErrorMsg: '读取设备通讯录失败。',
    statusLabel: '状态',
    postPlaceholder: '与旅友分享你的见闻...',
    publishBtn: '发布到社区',
    settingsTitle: '⚙️ 系统设置',
    themeModeLabel: '显示模式（白天 / 黑夜）',
    dayMode: '☀️ 白天模式',
    nightMode: '🌙 黑夜模式',
    imageBrightnessLabel: '纯图片亮度调节',
    languageLabel: '界面语言选择',
    closeBtn: '完成',
    gpsDisabledTitle: '定位服务未开启',
    gpsDisabledMsg: '请在手机系统设置中开启 GPS 定位。',
    permDeniedTitle: '权限被拒绝',
    permDeniedMsg: '请允许位置权限以获取真实卫星坐标。',
    acquiringTitle: '正在获取卫星定位',
    acquiringMsg: '正在连接卫星获取高精度实时坐标...',
    gpsSuccessTitle: '定位成功',
    gpsSuccessMsg: '已成功锁定真实高精度卫星坐标！',
    gpsEmptyTitle: '定位提示',
    gpsEmptyMsg: '未能获取卫星信号，请移步至开阔户外重试。',
    gpsErrorTitle: '定位错误',
    gpsErrorMsg: '获取实时 GPS 失败，请重试。',
    fillAlert: '请填写标题并获取位置坐标。',
    updatedAlert: '更新成功！',
  },
  tw: {
    appTitle: '墨行遊記·編年',
    newInscription: '新撰遊記',
    friendsTitle: '同行旅伴與好友',
    communityTitle: '墨行社區論壇',
    tabHome: '📜 遊記',
    tabAdd: '✍️ 撰寫',
    tabFriends: '👥 好友',
    tabCommunity: '💬 社區',
    noRecords: '暫無遊記存檔',
    noRecordsSub: '開啟你的旅程，封存水墨記憶。',
    sensorsHub: '⚡ 原生硬體感測器與環境中心',
    device: '設備',
    battery: '電量',
    compass: '指南針',
    temp: '溫度',
    barometer: '氣壓計',
    accelerometer: '加速度計',
    titleLabel: '遊記標題',
    titlePlaceholder: '輸入標題...',
    locationLabel: '即時位置 / 衛星座標',
    locationPlaceholder: '點擊右側按鈕獲取真實GPS...',
    getGps: '📍 獲取定位',
    photoLabel: '插圖 / 現場拍攝',
    camera: '📸 相機',
    gallery: '🖼️ 相簿',
    reflectionsLabel: '行旅隨筆',
    reflectionsPlaceholder: '寫下你的所見所感...',
    saveBtn: '儲存遊記',
    editBtn: '編輯',
    deleteBtn: '刪除',
    shareBtn: '📤 分享',
    editTitle: '編輯遊記',
    saveUpdate: '儲存修改',
    cancel: '取消',
    friendPlaceholder: '輸入好友名稱...',
    addBtn: '新增',
    importContactsBtn: '📇 擷取通訊錄',
    contactsModalTitle: '📇 從手機通訊錄捕獲旅伴',
    contactsSearchPlaceholder: '搜尋聯絡人姓名或號碼...',
    contactsEmpty: '未在裝置上找到聯絡人。',
    contactAddBtn: '+ 加為旅伴',
    contactAddedTag: '已新增',
    contactsPermTitle: '需要通訊錄權限',
    contactsPermMsg: '請在系統設定中允許存取通訊錄以匯入好友。',
    contactsErrorMsg: '讀取裝置通訊錄失敗。',
    statusLabel: '狀態',
    postPlaceholder: '與旅友分享你的見聞...',
    publishBtn: '發佈到社區',
    settingsTitle: '⚙️ 系統設定',
    themeModeLabel: '顯示模式（白天 / 黑夜）',
    dayMode: '☀️ 白天模式',
    nightMode: '🌙 黑夜模式',
    imageBrightnessLabel: '純圖片亮度調節',
    languageLabel: '介面語言選擇',
    closeBtn: '完成',
    gpsDisabledTitle: '定位服務未開啟',
    gpsDisabledMsg: '請在手機系統設定中開啟 GPS 定位。',
    permDeniedTitle: '權限被拒絕',
    permDeniedMsg: '請允許位置權限以獲取真實衛星座標。',
    acquiringTitle: '正在獲取衛星定位',
    acquiringMsg: '正在連接衛星獲取高精度即時座標...',
    gpsSuccessTitle: '定位成功',
    gpsSuccessMsg: '已成功鎖定真實高精度衛星座標！',
    gpsEmptyTitle: '定位提示',
    gpsEmptyMsg: '未能獲取衛星訊號，請移步至開闊戶外重試。',
    gpsErrorTitle: '定位錯誤',
    gpsErrorMsg: '獲取即時 GPS 失敗，請重試。',
    fillAlert: '請填寫標題並獲取位置座標。',
    updatedAlert: '更新成功！',
  },
  ja: {
    appTitle: '墨行紀行録',
    newInscription: '新規紀行作成',
    friendsTitle: '旅の仲間とフレンド',
    communityTitle: '墨行コミュニティ',
    tabHome: '📜 紀行録',
    tabAdd: '✍️ 記録する',
    tabFriends: '👥 仲間',
    tabCommunity: '💬 広場',
    noRecords: '記録はまだありません。',
    noRecordsSub: '旅に出て、思い出を書き留めましょう。',
    sensorsHub: '⚡ ハードウェアセンサーハブ',
    device: '端末',
    battery: '電池',
    compass: '方位磁針',
    temp: '気温',
    barometer: '気圧計',
    accelerometer: '加速度',
    titleLabel: 'タイトル',
    titlePlaceholder: 'タイトルを入力...',
    locationLabel: '現在地 / GPS座標',
    locationPlaceholder: 'GPSボタンを押して座標を取得...',
    getGps: '📍 GPS取得',
    photoLabel: '写真撮影・アルバム',
    camera: '📸 カメラ',
    gallery: '🖼️ アルバム',
    reflectionsLabel: '旅の感想',
    reflectionsPlaceholder: 'メモを入力...',
    saveBtn: '記録を保存',
    editBtn: '編集',
    deleteBtn: '削除',
    shareBtn: '📤 共有',
    editTitle: '記録を編集',
    saveUpdate: '更新を保存',
    cancel: 'キャンセル',
    friendPlaceholder: '仲間の名前...',
    addBtn: '追加',
    importContactsBtn: '📇 連絡先から追加',
    contactsModalTitle: '📇 連絡先から旅の仲間を選択',
    contactsSearchPlaceholder: '名前または電話番号を検索...',
    contactsEmpty: '連絡先が見つかりません。',
    contactAddBtn: '+ 追加',
    contactAddedTag: '追加済',
    contactsPermTitle: '連絡先の権限が必要です',
    contactsPermMsg: '設定から連絡先へのアクセスを許可してください。',
    contactsErrorMsg: '連絡先の読み込みに失敗しました。',
    statusLabel: '状態',
    postPlaceholder: '旅の思いを共有しよう...',
    publishBtn: '投稿する',
    settingsTitle: '⚙️ 設定',
    themeModeLabel: '表示モード（昼 / 夜）',
    dayMode: '☀️ デイモード',
    nightMode: '🌙 ナイトモード',
    imageBrightnessLabel: '画像の明るさ調整',
    languageLabel: '表示言語',
    closeBtn: '完了',
    gpsDisabledTitle: '位置情報サービス無効',
    gpsDisabledMsg: '設定からGPSをオンにしてください。',
    permDeniedTitle: '権限拒否',
    permDeniedMsg: '位置情報の権限を許可してください。',
    acquiringTitle: 'GPS衛星に接続中',
    acquiringMsg: '高精度な緯度・経度を取得しています...',
    gpsSuccessTitle: 'GPS測位完了',
    gpsSuccessMsg: '正確な衛星座標を取得しました！',
    gpsEmptyTitle: '測位通知',
    gpsEmptyMsg: '衛星信号を受信できませんでした。屋外でお試しください。',
    gpsErrorTitle: '位置情報エラー',
    gpsErrorMsg: 'GPSの取得に失敗しました。',
    fillAlert: 'タイトルと位置情報を入力してください。',
    updatedAlert: '更新しました！',
  },
  ko: {
    appTitle: '묵행 여행기',
    newInscription: '새 여행 기록',
    friendsTitle: '여행 동반자 및 친구',
    communityTitle: '묵행 커뮤니티 포럼',
    tabHome: '📜 여행기',
    tabAdd: '✍️ 기록하기',
    tabFriends: '👥 친구',
    tabCommunity: '💬 커뮤니티',
    noRecords: '아직 저장된 여행 기록이 없습니다.',
    noRecordsSub: '여행을 시작하고 추억을 기록하세요.',
    sensorsHub: '⚡ 하드웨어 센서 및 환경 허브',
    device: '기기',
    battery: '배터리',
    compass: '나침반',
    temp: '온도',
    barometer: '기압계',
    accelerometer: '가속도계',
    titleLabel: '제목',
    titlePlaceholder: '제목 입력...',
    locationLabel: '위치 / 위성 좌표',
    locationPlaceholder: 'GPS 버튼을 눌러 실제 위치 가져오기...',
    getGps: '📍 GPS 수신',
    photoLabel: '사진 촬영 / 갤러리',
    camera: '📸 카메라',
    gallery: '🖼️ 갤러리',
    reflectionsLabel: '여행 단상',
    reflectionsPlaceholder: '메모 작성...',
    saveBtn: '기록 저장',
    editBtn: '편집',
    deleteBtn: '삭제',
    shareBtn: '📤 공유',
    editTitle: '기록 수정',
    saveUpdate: '수정 저장',
    cancel: '취소',
    friendPlaceholder: '친구 이름...',
    addBtn: '추가',
    importContactsBtn: '📇 연락처 가져오기',
    contactsModalTitle: '📇 휴대폰 연락처에서 친구 추가',
    contactsSearchPlaceholder: '이름 또는 전화번호 검색...',
    contactsEmpty: '기기에서 연락처를 찾을 수 없습니다.',
    contactAddBtn: '+ 추가',
    contactAddedTag: '추가됨',
    contactsPermTitle: '연락처 권한 필요',
    contactsPermMsg: '설정에서 연락처 접근 권한을 허용해주세요.',
    contactsErrorMsg: '연락처를 불러올 수 없습니다.',
    statusLabel: '상태',
    postPlaceholder: '여행자들과 생각을 공유하세요...',
    publishBtn: '커뮤니티에 게시',
    settingsTitle: '⚙️ 설정',
    themeModeLabel: '화면 모드 (주간 / 야간)',
    dayMode: '☀️ 주간 모드',
    nightMode: '🌙 야간 모드',
    imageBrightnessLabel: '이미지 밝기 조절',
    languageLabel: '언어 선택',
    closeBtn: '완료',
    gpsDisabledTitle: '위치 서비스 꺼짐',
    gpsDisabledMsg: '휴대폰 설정에서 GPS를 켜주세요.',
    permDeniedTitle: '권한 거부됨',
    permDeniedMsg: '정확한 좌표를 얻으려면 위치 권한을 허용해주세요.',
    acquiringTitle: '위성 GPS 수신 중',
    acquiringMsg: '고정밀 실시간 좌표를 가져오는 중입니다...',
    gpsSuccessTitle: 'GPS 고정 완료',
    gpsSuccessMsg: '실시간 고정밀 위성 좌표를 확보했습니다!',
    gpsEmptyTitle: '위치 알림',
    gpsEmptyMsg: '위성 신호를 받을 수 없습니다. 탁 트인 야외로 이동하세요.',
    gpsErrorTitle: '위치 오류',
    gpsErrorMsg: '실시간 GPS 위치를 가져오지 못했습니다.',
    fillAlert: '제목과 위치를 입력해주세요.',
    updatedAlert: '성공적으로 업데이트되었습니다!',
  },
  fr: {
    appTitle: 'Annales InkJourney',
    newInscription: 'Nouvelle Inscription',
    friendsTitle: 'Compagnons de Voyage',
    communityTitle: 'Forum Communautaire',
    tabHome: '📜 Annales',
    tabAdd: '✍️ Inscrire',
    tabFriends: '👥 Amis',
    tabCommunity: '💬 Forum',
    noRecords: 'Aucun récit trouvé.',
    noRecordsSub: 'Commencez votre voyage et scellez vos mémoires.',
    sensorsHub: '⚡ Capteurs Matériels & Environnement',
    device: 'Appareil',
    battery: 'Batterie',
    compass: 'Boussole',
    temp: 'Temp.',
    barometer: 'Baromètre',
    accelerometer: 'Accéléromètre',
    titleLabel: 'Titre',
    titlePlaceholder: 'Entrez un titre...',
    locationLabel: 'Lieu / Coordonnées GPS',
    locationPlaceholder: 'Appuyez sur GPS pour la position réelle...',
    getGps: '📍 GPS Réel',
    photoLabel: 'Illustration / Capture Photo',
    camera: '📸 Caméra',
    gallery: '🖼️ Galerie',
    reflectionsLabel: 'Réflexions',
    reflectionsPlaceholder: 'Écrivez vos notes...',
    saveBtn: 'Enregistrer',
    editBtn: 'Modifier',
    deleteBtn: 'Supprimer',
    shareBtn: '📤 Partager',
    editTitle: 'Modifier le récit',
    saveUpdate: 'Mettre à jour',
    cancel: 'Annuler',
    friendPlaceholder: 'Nom de l’ami...',
    addBtn: 'Ajouter',
    importContactsBtn: '📇 Importer Contacts',
    contactsModalTitle: '📇 Capturer depuis les Contacts',
    contactsSearchPlaceholder: 'Rechercher un nom ou numéro...',
    contactsEmpty: 'Aucun contact trouvé.',
    contactAddBtn: '+ Ajouter',
    contactAddedTag: 'Ajouté',
    contactsPermTitle: 'Permission Contacts Requise',
    contactsPermMsg: 'Veuillez autoriser l’accès aux contacts.',
    contactsErrorMsg: 'Impossible de lire les contacts.',
    statusLabel: 'Statut',
    postPlaceholder: 'Partagez vos pensées...',
    publishBtn: 'Publier',
    settingsTitle: '⚙️ Paramètres',
    themeModeLabel: 'Mode d’affichage (Jour / Nuit)',
    dayMode: '☀️ Mode Jour',
    nightMode: '🌙 Mode Nuit',
    imageBrightnessLabel: 'Luminosité des Images',
    languageLabel: 'Langue de l’interface',
    closeBtn: 'Terminer',
    gpsDisabledTitle: 'GPS Désactivé',
    gpsDisabledMsg: 'Veuillez activer le GPS dans les paramètres.',
    permDeniedTitle: 'Permission Refusée',
    permDeniedMsg: 'Veuillez autoriser la localisation.',
    acquiringTitle: 'Acquisition Satellite GPS',
    acquiringMsg: 'Connexion aux satellites pour les coordonnées exactes...',
    gpsSuccessTitle: 'GPS Verrouillé',
    gpsSuccessMsg: 'Coordonnées satellites haute précision acquises !',
    gpsEmptyTitle: 'Avis de Localisation',
    gpsEmptyMsg: 'Signal satellite introuvable. Déplacez-vous en extérieur.',
    gpsErrorTitle: 'Erreur GPS',
    gpsErrorMsg: 'Échec de la récupération de la position.',
    fillAlert: 'Veuillez remplir le titre et le lieu.',
    updatedAlert: 'Mis à jour avec succès !',
  },
  es: {
    appTitle: 'Anales InkJourney',
    newInscription: 'Nueva Inscripción',
    friendsTitle: 'Compañeros de Viaje',
    communityTitle: 'Foro Comunitario',
    tabHome: '📜 Anales',
    tabAdd: '✍️ Escribir',
    tabFriends: '👥 Amigos',
    tabCommunity: '💬 Foro',
    noRecords: 'Aún no hay registros.',
    noRecordsSub: 'Comienza tus viajes y guarda tus memorias.',
    sensorsHub: '⚡ Sensores Nativos y Entorno',
    device: 'Dispositivo',
    battery: 'Batería',
    compass: 'Brújula',
    temp: 'Temp.',
    barometer: 'Barómetro',
    accelerometer: 'Acelerómetro',
    titleLabel: 'Título',
    titlePlaceholder: 'Ingrese título...',
    locationLabel: 'Ubicación / Coordenadas',
    locationPlaceholder: 'Toque GPS para ubicación real...',
    getGps: '📍 Obtener GPS',
    photoLabel: 'Ilustración / Captura de Foto',
    camera: '📸 Cámara',
    gallery: '🖼️ Galería',
    reflectionsLabel: 'Reflexiones',
    reflectionsPlaceholder: 'Escribe notas...',
    saveBtn: 'Guardar Inscripción',
    editBtn: 'Editar',
    deleteBtn: 'Eliminar',
    shareBtn: '📤 Compartir',
    editTitle: 'Editar Inscripción',
    saveUpdate: 'Guardar Cambios',
    cancel: 'Cancelar',
    friendPlaceholder: 'Nombre del amigo...',
    addBtn: 'Añadir',
    importContactsBtn: '📇 Importar Contactos',
    contactsModalTitle: '📇 Capturar desde Contactos',
    contactsSearchPlaceholder: 'Buscar nombre o teléfono...',
    contactsEmpty: 'No se encontraron contactos.',
    contactAddBtn: '+ Añadir',
    contactAddedTag: 'Añadido',
    contactsPermTitle: 'Permiso de Contactos Requerido',
    contactsPermMsg: 'Permita el acceso a los contactos.',
    contactsErrorMsg: 'No se pudieron leer los contactos.',
    statusLabel: 'Estado',
    postPlaceholder: 'Comparte tus ideas con viajeros...',
    publishBtn: 'Publicar',
    settingsTitle: '⚙️ Ajustes',
    themeModeLabel: 'Modo de Pantalla (Día / Noche)',
    dayMode: '☀️ Modo Día',
    nightMode: '🌙 Modo Noche',
    imageBrightnessLabel: 'Brillo de Imágenes',
    languageLabel: 'Idioma de la Interfaz',
    closeBtn: 'Listo',
    gpsDisabledTitle: 'GPS Desactivado',
    gpsDisabledMsg: 'Active el GPS en los ajustes de su teléfono.',
    permDeniedTitle: 'Permiso Denegado',
    permDeniedMsg: 'Permita el acceso a la ubicación.',
    acquiringTitle: 'Adquiriendo GPS Satelital',
    acquiringMsg: 'Conectando con satélites de alta precisión...',
    gpsSuccessTitle: 'GPS Fijado',
    gpsSuccessMsg: '¡Coordenadas satelitales reales adquiridas!',
    gpsEmptyTitle: 'Aviso de Ubicación',
    gpsEmptyMsg: 'Sin señal satelital. Muévase a un área abierta.',
    gpsErrorTitle: 'Error de Ubicación',
    gpsErrorMsg: 'No se pudo obtener la ubicación GPS.',
    fillAlert: 'Complete el título y la ubicación.',
    updatedAlert: '¡Actualizado con éxito!',
  },
  de: {
    appTitle: 'InkJourney Annalen',
    newInscription: 'Neuer Eintrag',
    friendsTitle: 'Reisegefährten & Freunde',
    communityTitle: 'Ink Community Forum',
    tabHome: '📜 Annalen',
    tabAdd: '✍️ Verfassen',
    tabFriends: '👥 Freunde',
    tabCommunity: '💬 Forum',
    noRecords: 'Noch keine Einträge vorhanden.',
    noRecordsSub: 'Beginne deine Reise und halte Erinnerungen fest.',
    sensorsHub: '⚡ Hardware-Sensoren & Umgebung',
    device: 'Gerät',
    battery: 'Akku',
    compass: 'Kompass',
    temp: 'Temp.',
    barometer: 'Barometer',
    accelerometer: 'Beschleunigung',
    titleLabel: 'Titel',
    titlePlaceholder: 'Titel eingeben...',
    locationLabel: 'Standort / Koordinaten',
    locationPlaceholder: 'GPS antippen für echten Standort...',
    getGps: '📍 GPS holen',
    photoLabel: 'Illustration / Fotoaufnahme',
    camera: '📸 Kamera',
    gallery: '🖼️ Galerie',
    reflectionsLabel: 'Gedanken',
    reflectionsPlaceholder: 'Notizen schreiben...',
    saveBtn: 'Eintrag speichern',
    editBtn: 'Bearbeiten',
    deleteBtn: 'Löschen',
    shareBtn: '📤 Teilen',
    editTitle: 'Eintrag bearbeiten',
    saveUpdate: 'Speichern',
    cancel: 'Abbrechen',
    friendPlaceholder: 'Name des Freundes...',
    addBtn: 'Hinzufügen',
    importContactsBtn: '📇 Kontakte importieren',
    contactsModalTitle: '📇 Aus Telefonkontakten übernehmen',
    contactsSearchPlaceholder: 'Name oder Nummer suchen...',
    contactsEmpty: 'Keine Kontakte gefunden.',
    contactAddBtn: '+ Hinzufügen',
    contactAddedTag: 'Hinzugefügt',
    contactsPermTitle: 'Kontaktberechtigung erforderlich',
    contactsPermMsg: 'Bitte Zugriff auf Kontakte erlauben.',
    contactsErrorMsg: 'Kontakte konnten nicht gelesen werden.',
    statusLabel: 'Status',
    postPlaceholder: 'Teile deine Gedanken...',
    publishBtn: 'Veröffentlichen',
    settingsTitle: '⚙️ Einstellungen',
    themeModeLabel: 'Anzeigemodus (Tag / Nacht)',
    dayMode: '☀️ Tagmodus',
    nightMode: '🌙 Nachtmodus',
    imageBrightnessLabel: 'Bildhelligkeit',
    languageLabel: 'Anzeigesprache',
    closeBtn: 'Fertig',
    gpsDisabledTitle: 'Standort deaktiviert',
    gpsDisabledMsg: 'Bitte aktivieren Sie GPS in den Einstellungen.',
    permDeniedTitle: 'Berechtigung verweigert',
    permDeniedMsg: 'Bitte Standortberechtigung erteilen.',
    acquiringTitle: 'Satelliten-GPS wird erfasst',
    acquiringMsg: 'Verbindung zu GPS-Satelliten wird hergestellt...',
    gpsSuccessTitle: 'GPS erfasst',
    gpsSuccessMsg: 'Hochpräzise Satellitenkoordinaten erfasst!',
    gpsEmptyTitle: 'Standorthinweis',
    gpsEmptyMsg: 'Kein Satellitensignal. Bitte ins Freie gehen.',
    gpsErrorTitle: 'Standortfehler',
    gpsErrorMsg: 'GPS-Standort konnte nicht abgerufen werden.',
    fillAlert: 'Bitte Titel und Standort ausfüllen.',
    updatedAlert: 'Erfolgreich aktualisiert!',
  },
};

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '简体中文' },
  { code: 'tw', label: '繁體中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
];

const IMAGE_BRIGHTNESS_LEVELS = [0.2, 0.4, 0.6, 0.8, 1.0];

export default function App() {
  const [currentTab, setCurrentTab] = useState('Home');
  const [trips, setTrips] = useState([]);

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [imageBrightness, setImageBrightness] = useState(1.0);
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [title, setTitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const [batteryLevel, setBatteryLevel] = useState('Optimal');
  const [deviceName, setDeviceName] = useState('Mobile Terminal');
  const [compassHeading, setCompassHeading] = useState('0°');
  const [barometerPressure, setBarometerPressure] = useState('N/A');
  const [temperature, setTemperature] = useState('25°C (Ambient)');
  const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });

  const [editingTrip, setEditingTrip] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const [friends, setFriends] = useState([
    { id: '1', name: 'Master Wang', status: 'Exploring Mount Huang' },
    { id: '2', name: 'Li Bai', status: 'Drinking wine under the moon' },
  ]);
  const [friendName, setFriendName] = useState('');
  const [contactsModalVisible, setContactsModalVisible] = useState(false);
  const [deviceContacts, setDeviceContacts] = useState([]);
  const [contactSearch, setContactSearch] = useState('');

  const [posts, setPosts] = useState([
    { id: '1', author: 'Su Shi', content: 'Sharing my recent ink-wash painting of the Yangtze River.' },
    { id: '2', author: 'Wang Wei', content: 'Looking for companions to travel to the snowy mountains.' },
  ]);
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    loadTrips();
    loadFriends();
    loadHardwareInfo();

    Magnetometer.setUpdateInterval(400);
    const magSub = Magnetometer.addListener(data => {
      let { x, y } = data;
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      if (angle < 0) angle += 360;
      setCompassHeading(`${Math.round(angle)}°`);
    });

    Barometer.setUpdateInterval(1000);
    const baroSub = Barometer.addListener(data => {
      if (data && data.pressure) {
        setBarometerPressure(`${data.pressure.toFixed(1)} hPa`);
      }
    });

    Accelerometer.setUpdateInterval(400);
    const accelSub = Accelerometer.addListener(result => {
      setAccelData(result);
    });

    return () => {
      magSub && magSub.remove();
      baroSub && baroSub.remove();
      accelSub && accelSub.remove();
    };
  }, []);

  const loadHardwareInfo = async () => {
    try {
      const bat = await Battery.getBatteryLevelAsync();
      setBatteryLevel(bat >= 0 ? `${Math.round(bat * 100)}%` : 'AC');
      const dev = Device.modelName || Device.deviceName || 'Smart Device';
      setDeviceName(dev);
    } catch (error) {
      setBatteryLevel('Active');
      setDeviceName('Mobile Handset');
    }
  };

  const loadTrips = async () => {
    try {
      const stored = await AsyncStorage.getItem('trips');
      if (stored) setTrips(JSON.parse(stored));
    } catch (e) {
      console.log(e);
    }
  };

  const loadFriends = async () => {
    try {
      const stored = await AsyncStorage.getItem('friends');
      if (stored) setFriends(JSON.parse(stored));
    } catch (e) {
      console.log(e);
    }
  };

  const persistFriends = async (updatedList) => {
    setFriends(updatedList);
    try {
      await AsyncStorage.setItem('friends', JSON.stringify(updatedList));
    } catch (e) {
      console.log(e);
    }
  };

  const captureContactsFromDevice = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t.contactsPermTitle, t.contactsPermMsg);
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        sort: Contacts.SortTypes.FirstName,
      });

      const validContacts = (data || []).filter(
        (c) => c.name && c.name.trim().length > 0
      );
      setDeviceContacts(validContacts);
      setContactSearch('');
      setContactsModalVisible(true);
    } catch (error) {
      console.log('Contacts error:', error);
      Alert.alert('Contacts Error', t.contactsErrorMsg);
    }
  };

  const addContactAsFriend = (contact) => {
    const phone =
      contact.phoneNumbers && contact.phoneNumbers.length > 0
        ? contact.phoneNumbers[0].number
        : '';
    const email =
      contact.emails && contact.emails.length > 0
        ? contact.emails[0].email
        : '';
    const detail = phone || email || 'Contact Mate';

    const alreadyAdded = friends.some(
      (f) => f.name.toLowerCase() === contact.name.trim().toLowerCase()
    );
    if (alreadyAdded) return;

    const newMate = {
      id: `${Date.now()}_${contact.id || Math.random()}`,
      name: contact.name.trim(),
      status: `📞 ${detail}`,
    };
    persistFriends([newMate, ...friends]);
  };

  const filteredContacts = deviceContacts.filter((c) => {
    if (!contactSearch.trim()) return true;
    const q = contactSearch.toLowerCase();
    const nameMatch = c.name && c.name.toLowerCase().includes(q);
    const phoneMatch =
      c.phoneNumbers &&
      c.phoneNumbers.some((p) => p.number && p.number.toLowerCase().includes(q));
    return nameMatch || phoneMatch;
  });

  const fetchGPSLocation = async () => {
    try {
      const serviceEnabled = await Location.hasServicesEnabledAsync();
      if (!serviceEnabled) {
        Alert.alert(t.gpsDisabledTitle, t.gpsDisabledMsg);
        return;
      }

      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert(t.permDeniedTitle, t.permDeniedMsg);
        return;
      }

      Alert.alert(t.acquiringTitle, t.acquiringMsg);

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeout: 12000,
      });

      if (currentLocation && currentLocation.coords) {
        const { latitude, longitude, accuracy, altitude } = currentLocation.coords;
        const accuracyText = accuracy !== null ? `, Accuracy: ±${Math.round(accuracy)}m` : '';
        const altitudeText = altitude !== null ? `, Alt: ${Math.round(altitude)}m` : '';

        const realCoordsString = `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}${accuracyText}${altitudeText}`;
        setLocationName(realCoordsString);
        Alert.alert(t.gpsSuccessTitle, t.gpsSuccessMsg);
      } else {
        Alert.alert(t.gpsEmptyTitle, t.gpsEmptyMsg);
      }
    } catch (error) {
      console.log('Location error:', error);
      Alert.alert(t.gpsErrorTitle, t.gpsErrorMsg);
    }
  };

  const shareToExternalApps = async (shareTitle, shareBody, shareUrl) => {
    try {
      const message = `${shareTitle}\n\n${shareBody}\n\n— Shared via InkJourney`;
      await Share.share(
        {
          title: shareTitle,
          message: message,
          ...(shareUrl ? { url: shareUrl } : {}),
        },
        {
          dialogTitle: shareTitle,
        }
      );
    } catch (error) {
      Alert.alert('Share Error', error.message || 'Unable to open system share sheet.');
    }
  };

  const takePhoto = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Camera permission is required!');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Gallery permission is required!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const saveTrip = async () => {
    if (!title || !locationName) {
      Alert.alert('Notice', t.fillAlert);
      return;
    }
    const newTrip = {
      id: Date.now().toString(),
      title,
      location: locationName,
      description,
      image,
      date: new Date().toLocaleDateString(),
    };
    const updated = [newTrip, ...trips];
    setTrips(updated);
    await AsyncStorage.setItem('trips', JSON.stringify(updated));
    setTitle('');
    setLocationName('');
    setDescription('');
    setImage(null);
    setCurrentTab('Home');
  };

  const deleteTrip = async (id) => {
    const filtered = trips.filter(tr => tr.id !== id);
    setTrips(filtered);
    await AsyncStorage.setItem('trips', JSON.stringify(filtered));
  };

  const theme = isNightMode
    ? {
        overlayBg: 'rgba(9, 13, 24, 0.72)',
        headerColor: '#f8fafc',
        cardBg: 'rgba(15, 23, 42, 0.90)',
        cardBorder: '#334155',
        titleColor: '#f1f5f9',
        metaColor: '#94a3b8',
        descColor: '#cbd5e1',
        labelColor: '#e2e8f0',
        inputBg: '#1e293b',
        inputBorder: '#475569',
        inputText: '#f8fafc',
        placeholderColor: '#94a3b8',
        dashBg: 'rgba(15, 23, 42, 0.94)',
        dashTitle: '#c4b5fd',
        dashSub: '#94a3b8',
        dashVal: '#f8fafc',
        modalBg: '#0f172a',
        modalBorder: '#334155',
        modalText: '#f8fafc',
        chipBg: '#1e293b',
        chipBorder: '#475569',
        chipText: '#cbd5e1',
      }
    : {
        overlayBg: 'rgba(255, 255, 255, 0.35)',
        headerColor: '#0f172a',
        cardBg: 'rgba(255, 255, 255, 0.92)',
        cardBorder: '#cbd5e1',
        titleColor: '#0f172a',
        metaColor: '#64748b',
        descColor: '#334155',
        labelColor: '#1e293b',
        inputBg: '#ffffff',
        inputBorder: '#cbd5e1',
        inputText: '#0f172a',
        placeholderColor: '#64748b',
        dashBg: 'rgba(255, 255, 255, 0.95)',
        dashTitle: '#6d28d9',
        dashSub: '#475569',
        dashVal: '#0f172a',
        modalBg: '#ffffff',
        modalBorder: '#cbd5e1',
        modalText: '#0f172a',
        chipBg: '#f1f5f9',
        chipBorder: '#cbd5e1',
        chipText: '#334155',
      };

  return (
    <View style={styles.appContainer}>
      <Image
        source={
          currentTab === 'Home' ? require('./assets/bg.jpg') :
          currentTab === 'Add' ? require('./assets/bg2.jpg') :
          currentTab === 'Friends' ? require('./assets/bg3.jpg') :
          require('./assets/bg4.jpg')
        }
        style={[styles.bgImage, { opacity: imageBrightness }]}
      />

      <View style={[styles.contentContainer, { backgroundColor: theme.overlayBg }]}>
        {currentTab === 'Home' && (
          <ScrollView contentContainerStyle={styles.pageScroll}>
            <Text style={[styles.headerTitle, { color: theme.headerColor }]}>{t.appTitle}</Text>

            {editingTrip ? (
              <View style={[styles.editCardBox, { backgroundColor: theme.cardBg }]}>
                <Text style={[styles.label, { color: theme.labelColor }]}>{t.editTitle}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText }]}
                  value={editTitle}
                  onChangeText={setEditTitle}
                  placeholder={t.titlePlaceholder}
                  placeholderTextColor={theme.placeholderColor}
                />
                <TextInput
                  style={[styles.input, styles.area, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText }]}
                  value={editDesc}
                  onChangeText={setEditDesc}
                  placeholder={t.reflectionsPlaceholder}
                  placeholderTextColor={theme.placeholderColor}
                  multiline
                />
                <View style={styles.row}>
                  <TouchableOpacity
                    style={[styles.subBtn, { backgroundColor: '#0284c7', marginRight: 5 }]}
                    onPress={async () => {
                      const updatedTrips = trips.map(tr =>
                        tr.id === editingTrip.id ? { ...tr, title: editTitle, description: editDesc } : tr
                      );
                      setTrips(updatedTrips);
                      await AsyncStorage.setItem('trips', JSON.stringify(updatedTrips));
                      setEditingTrip(null);
                      Alert.alert('Success', t.updatedAlert);
                    }}
                  >
                    <Text style={styles.btnText}>{t.saveUpdate}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.subBtn, { backgroundColor: '#475569', marginLeft: 5 }]}
                    onPress={() => setEditingTrip(null)}
                  >
                    <Text style={styles.btnText}>{t.cancel}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            {trips.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={[styles.emptyText, { color: theme.titleColor }]}>{t.noRecords}</Text>
                <Text style={[styles.emptySub, { color: theme.metaColor }]}>{t.noRecordsSub}</Text>
              </View>
            ) : (
              trips.map((item) => (
                <View key={item.id} style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                  {item.image && (
                    <Image
                      source={{ uri: item.image }}
                      style={[styles.cardImg, { opacity: imageBrightness }]}
                    />
                  )}
                  <View style={[styles.cardBody, { backgroundColor: 'transparent', borderWidth: 0, marginBottom: 0 }]}>
                    <Text style={[styles.cardTitle, { color: theme.titleColor }]}>{item.title}</Text>
                    <Text style={[styles.cardMeta, { color: theme.metaColor }]}>📍 {item.location} | {item.date}</Text>
                    <Text style={[styles.cardDesc, { color: theme.descColor }]}>{item.description}</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                      <TouchableOpacity
                        onPress={() =>
                          shareToExternalApps(
                            `📜 ${item.title}`,
                            `📍 ${item.location} (${item.date})\n\n${item.description || ''}`,
                            item.image
                          )
                        }
                        style={[styles.delBtn, { backgroundColor: '#059669', marginRight: 8 }]}
                      >
                        <Text style={styles.delText}>{t.shareBtn}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setEditingTrip(item);
                          setEditTitle(item.title);
                          setEditDesc(item.description);
                        }}
                        style={[styles.delBtn, { backgroundColor: '#0284c7', marginRight: 8 }]}
                      >
                        <Text style={styles.delText}>{t.editBtn}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => deleteTrip(item.id)} style={styles.delBtn}>
                        <Text style={styles.delText}>{t.deleteBtn}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {currentTab === 'Add' && (
          <ScrollView contentContainerStyle={styles.pageScroll}>
            <Text style={[styles.headerTitle, { color: theme.headerColor }]}>{t.newInscription}</Text>

            <View style={[styles.dashboardCard, { backgroundColor: theme.dashBg }]}>
              <Text style={[styles.dashboardTitle, { color: theme.dashTitle }]}>{t.sensorsHub}</Text>
              <Text style={{ fontSize: 11, textAlign: 'center', color: theme.dashSub, marginBottom: 6 }}>
                {t.device}: {deviceName}
              </Text>
              <View style={styles.dashboardGrid}>
                <View style={styles.dashItem}>
                  <Text style={styles.dashIcon}>🔋</Text>
                  <Text style={[styles.dashLabel, { color: theme.metaColor }]}>{t.battery}</Text>
                  <Text style={[styles.dashVal, { color: theme.dashVal }]}>{batteryLevel}</Text>
                </View>
                <View style={styles.dashItem}>
                  <Text style={styles.dashIcon}>🧭</Text>
                  <Text style={[styles.dashLabel, { color: theme.metaColor }]}>{t.compass}</Text>
                  <Text style={[styles.dashVal, { color: theme.dashVal }]}>{compassHeading}</Text>
                </View>
                <View style={styles.dashItem}>
                  <Text style={styles.dashIcon}>🌡️</Text>
                  <Text style={[styles.dashLabel, { color: theme.metaColor }]}>{t.temp}</Text>
                  <Text style={[styles.dashVal, { color: theme.dashVal }]}>{temperature}</Text>
                </View>
                <View style={styles.dashItem}>
                  <Text style={styles.dashIcon}>📈</Text>
                  <Text style={[styles.dashLabel, { color: theme.metaColor }]}>{t.barometer}</Text>
                  <Text style={[styles.dashVal, { color: theme.dashVal }]}>{barometerPressure}</Text>
                </View>
              </View>
              <View style={[styles.dashMotionRow, { borderTopColor: theme.cardBorder }]}>
                <Text style={[styles.dashMotionText, { color: theme.dashSub }]}>
                  📈 {t.accelerometer}: X:{accelData.x.toFixed(1)} Y:{accelData.y.toFixed(1)} Z:{accelData.z.toFixed(1)}
                </Text>
              </View>
            </View>

            <Text style={[styles.label, { color: theme.labelColor }]}>{t.titleLabel}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText }]}
              placeholder={t.titlePlaceholder}
              placeholderTextColor={theme.placeholderColor}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={[styles.label, { color: theme.labelColor }]}>{t.locationLabel}</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0, marginRight: 8, backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText }]}
                placeholder={t.locationPlaceholder}
                placeholderTextColor={theme.placeholderColor}
                value={locationName}
                onChangeText={setLocationName}
              />
              <TouchableOpacity style={styles.gpsBtn} onPress={fetchGPSLocation}>
                <Text style={styles.btnText}>{t.getGps}</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: theme.labelColor }]}>{t.photoLabel}</Text>
            <View style={styles.row}>
              <TouchableOpacity style={[styles.subBtn, { backgroundColor: '#0284c7', marginRight: 5 }]} onPress={takePhoto}>
                <Text style={styles.btnText}>{t.camera}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.subBtn, { backgroundColor: '#475569', marginLeft: 5 }]} onPress={pickImage}>
                <Text style={styles.btnText}>{t.gallery}</Text>
              </TouchableOpacity>
            </View>
            {image && (
              <Image
                source={{ uri: image }}
                style={[styles.preview, { opacity: imageBrightness }]}
              />
            )}

            <Text style={[styles.label, { color: theme.labelColor }]}>{t.reflectionsLabel}</Text>
            <TextInput
              style={[styles.input, styles.area, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText }]}
              placeholder={t.reflectionsPlaceholder}
              placeholderTextColor={theme.placeholderColor}
              multiline
              value={description}
              onChangeText={setDescription}
            />

            <TouchableOpacity style={styles.mainBtn} onPress={saveTrip}>
              <Text style={styles.mainBtnText}>{t.saveBtn}</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {currentTab === 'Friends' && (
          <View style={styles.page}>
            <Text style={[styles.headerTitle, { color: theme.headerColor }]}>{t.friendsTitle}</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0, backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText }]}
                placeholder={t.friendPlaceholder}
                placeholderTextColor={theme.placeholderColor}
                value={friendName}
                onChangeText={setFriendName}
              />
              <TouchableOpacity
                style={[styles.subBtn, { backgroundColor: '#0284c7', marginLeft: 8, height: 45, justifyContent: 'center', flex: 0, paddingHorizontal: 14, marginBottom: 0 }]}
                onPress={() => {
                  if (friendName.trim()) {
                    persistFriends([{ id: Date.now().toString(), name: friendName.trim(), status: 'Traveling' }, ...friends]);
                    setFriendName('');
                  }
                }}
              >
                <Text style={styles.btnText}>{t.addBtn}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.importContactsBtn}
              onPress={captureContactsFromDevice}
              activeOpacity={0.85}
            >
              <Text style={styles.btnText}>{t.importContactsBtn}</Text>
            </TouchableOpacity>

            <FlatList
              data={friends}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={[styles.cardBody, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={[styles.cardTitle, { color: theme.titleColor }]}>{item.name}</Text>
                    <Text style={[styles.cardMeta, { color: theme.metaColor }]}>{t.statusLabel}: {item.status}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => persistFriends(friends.filter((f) => f.id !== item.id))}
                    style={[styles.delBtn, { marginTop: 0 }]}
                  >
                    <Text style={styles.delText}>{t.deleteBtn}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}

        {currentTab === 'Community' && (
          <View style={styles.page}>
            <Text style={[styles.headerTitle, { color: theme.headerColor }]}>{t.communityTitle}</Text>
            <View style={[styles.postBox, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              <TextInput
                style={[styles.areaSmall, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText }]}
                placeholder={t.postPlaceholder}
                placeholderTextColor={theme.placeholderColor}
                multiline
                value={newContent}
                onChangeText={setNewContent}
              />
              <TouchableOpacity
                style={styles.mainBtn}
                onPress={() => {
                  if (newContent) {
                    setPosts([{ id: Date.now().toString(), author: 'Me (Traveler)', content: newContent }, ...posts]);
                    setNewContent('');
                  }
                }}
              >
                <Text style={styles.mainBtnText}>{t.publishBtn}</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={posts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={[styles.cardBody, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: '#0284c7', fontWeight: 'bold' }}>@{item.author}</Text>
                    <TouchableOpacity
                      style={styles.shareChipBtn}
                      onPress={() =>
                        shareToExternalApps(
                          `💬 Ink Community — @${item.author}`,
                          item.content
                        )
                      }
                    >
                      <Text style={styles.shareChipText}>{t.shareBtn}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={{ color: theme.descColor, marginTop: 6 }}>{item.content}</Text>
                </View>
              )}
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.rightSettingsBtn}
        onPress={() => setSettingsVisible(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.rightSettingsIcon}>⚙️</Text>
      </TouchableOpacity>

      <Modal
        visible={contactsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setContactsModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.contactsModalBox, { backgroundColor: theme.modalBg, borderColor: theme.modalBorder }]}>
            <Text style={[styles.modalTitle, { color: theme.modalText }]}>{t.contactsModalTitle}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText }]}
              placeholder={t.contactsSearchPlaceholder}
              placeholderTextColor={theme.placeholderColor}
              value={contactSearch}
              onChangeText={setContactSearch}
            />
            {filteredContacts.length === 0 ? (
              <Text style={{ textAlign: 'center', color: theme.metaColor, marginVertical: 20 }}>
                {t.contactsEmpty}
              </Text>
            ) : (
              <FlatList
                data={filteredContacts}
                keyExtractor={(item, idx) => item.id || String(idx)}
                style={{ maxHeight: 320, marginBottom: 12 }}
                renderItem={({ item }) => {
                  const phone =
                    item.phoneNumbers && item.phoneNumbers.length > 0
                      ? item.phoneNumbers[0].number
                      : item.emails && item.emails.length > 0
                      ? item.emails[0].email
                      : '';
                  const isAdded = friends.some(
                    (f) => f.name.toLowerCase() === item.name.trim().toLowerCase()
                  );
                  return (
                    <View style={[styles.contactRow, { borderBottomColor: theme.cardBorder }]}>
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: theme.titleColor }}>
                          {item.name}
                        </Text>
                        {phone ? (
                          <Text style={{ fontSize: 12, color: theme.metaColor, marginTop: 2 }}>
                            {phone}
                          </Text>
                        ) : null}
                      </View>
                      <TouchableOpacity
                        disabled={isAdded}
                        onPress={() => addContactAsFriend(item)}
                        style={[
                          styles.contactPickBtn,
                          isAdded && { backgroundColor: '#64748b' },
                        ]}
                      >
                        <Text style={styles.contactPickText}>
                          {isAdded ? t.contactAddedTag : t.contactAddBtn}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            )}
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setContactsModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>{t.closeBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={settingsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.settingsModalBox, { backgroundColor: theme.modalBg, borderColor: theme.modalBorder }]}>
            <Text style={[styles.modalTitle, { color: theme.modalText }]}>{t.settingsTitle}</Text>

            <Text style={[styles.modalSectionLabel, { color: theme.modalText }]}>{t.themeModeLabel}</Text>
            <View style={styles.modeRow}>
              <TouchableOpacity
                style={[
                  styles.modeBtn,
                  { backgroundColor: theme.chipBg, borderColor: theme.chipBorder },
                  !isNightMode && styles.modeBtnDayActive,
                ]}
                onPress={() => setIsNightMode(false)}
              >
                <Text style={[styles.modeBtnText, { color: theme.chipText }, !isNightMode && styles.modeBtnDayTextActive]}>
                  {t.dayMode}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeBtn,
                  { backgroundColor: theme.chipBg, borderColor: theme.chipBorder },
                  isNightMode && styles.modeBtnNightActive,
                ]}
                onPress={() => setIsNightMode(true)}
              >
                <Text style={[styles.modeBtnText, { color: theme.chipText }, isNightMode && styles.modeBtnNightTextActive]}>
                  {t.nightMode}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSectionLabel, { color: theme.modalText }]}>
              🖼️ {t.imageBrightnessLabel}: {Math.round(imageBrightness * 100)}%
            </Text>
            <View style={styles.brightnessRow}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setImageBrightness(prev => Math.max(0.2, +(prev - 0.1).toFixed(1)))}
              >
                <Text style={styles.stepBtnText}>-</Text>
              </TouchableOpacity>

              <View style={styles.presetRow}>
                {IMAGE_BRIGHTNESS_LEVELS.map((lvl) => (
                  <TouchableOpacity
                    key={lvl}
                    style={[
                      styles.presetChip,
                      { backgroundColor: theme.chipBg, borderColor: theme.chipBorder },
                      Math.abs(imageBrightness - lvl) < 0.05 && styles.presetChipActive,
                    ]}
                    onPress={() => setImageBrightness(lvl)}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        { color: theme.chipText },
                        Math.abs(imageBrightness - lvl) < 0.05 && styles.presetChipTextActive,
                      ]}
                    >
                      {Math.round(lvl * 100)}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setImageBrightness(prev => Math.min(1.0, +(prev + 0.1).toFixed(1)))}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSectionLabel, { color: theme.modalText }]}>🌐 {t.languageLabel}</Text>
            <View style={styles.langGrid}>
              {LANGUAGE_OPTIONS.map((item) => (
                <TouchableOpacity
                  key={item.code}
                  style={[
                    styles.langChip,
                    { backgroundColor: theme.chipBg, borderColor: theme.chipBorder },
                    lang === item.code && styles.langChipActive,
                  ]}
                  onPress={() => setLang(item.code)}
                >
                  <Text
                    style={[
                      styles.langChipText,
                      { color: theme.chipText },
                      lang === item.code && styles.langChipTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setSettingsVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>{t.closeBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setCurrentTab('Home')}>
          <Text style={[styles.tabText, currentTab === 'Home' && styles.activeTab]}>{t.tabHome}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setCurrentTab('Add')}>
          <Text style={[styles.tabText, currentTab === 'Add' && styles.activeTab]}>{t.tabAdd}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setCurrentTab('Friends')}>
          <Text style={[styles.tabText, currentTab === 'Friends' && styles.activeTab]}>{t.tabFriends}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setCurrentTab('Community')}>
          <Text style={[styles.tabText, currentTab === 'Community' && styles.activeTab]}>{t.tabCommunity}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: { flex: 1, backgroundColor: '#000' },
  bgImage: { position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover' },
  contentContainer: { flex: 1, zIndex: 2 },
  page: { flex: 1, padding: 20 },
  pageScroll: { padding: 20, flexGrow: 1 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, fontFamily: 'serif' },

  dashboardCard: { borderWidth: 1.5, borderColor: '#8b5cf6', borderRadius: 12, padding: 12, marginBottom: 14 },
  dashboardTitle: { fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  dashboardGrid: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 6 },
  dashItem: { alignItems: 'center', flex: 1 },
  dashIcon: { fontSize: 18 },
  dashLabel: { fontSize: 10, fontWeight: '600', marginTop: 2 },
  dashVal: { fontSize: 12, fontWeight: 'bold', marginTop: 1 },
  dashMotionRow: { borderTopWidth: 1, paddingTop: 6, alignItems: 'center' },
  dashMotionText: { fontSize: 11, fontWeight: '600' },

  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: 'bold' },
  emptySub: { fontSize: 14, marginTop: 5 },
  card: { borderRadius: 10, marginBottom: 15, borderWidth: 1, overflow: 'hidden' },
  cardBody: { padding: 15, borderRadius: 10, marginBottom: 12, borderWidth: 1 },
  editCardBox: { padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 2, borderColor: '#0284c7' },
  cardImg: { width: '100%', height: 140, resizeMode: 'cover' },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardMeta: { fontSize: 12, marginTop: 4 },
  cardDesc: { fontSize: 14, marginTop: 6 },
  delBtn: { marginTop: 10, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, backgroundColor: '#991b1b' },
  delText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  shareChipBtn: { backgroundColor: '#059669', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 6 },
  shareChipText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  importContactsBtn: {
    backgroundColor: '#0f172a',
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  contactsModalBox: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    elevation: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  contactPickBtn: {
    backgroundColor: '#059669',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  contactPickText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  label: { fontSize: 15, fontWeight: 'bold', marginBottom: 5, marginTop: 10 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 15, marginBottom: 10 },
  area: { height: 90, textAlignVertical: 'top' },
  areaSmall: { borderWidth: 1, borderRadius: 8, padding: 10, height: 60, fontSize: 14, marginBottom: 8, textAlignVertical: 'top' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
  subBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 5 },
  gpsBtn: { backgroundColor: '#0f172a', paddingVertical: 11, paddingHorizontal: 15, borderRadius: 8, justifyContent: 'center', height: 45, borderWidth: 1, borderColor: '#38bdf8' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  preview: { width: '100%', height: 150, borderRadius: 8, resizeMode: 'cover', marginBottom: 10 },
  mainBtn: { backgroundColor: '#0f172a', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 15, marginBottom: 30, borderWidth: 1, borderColor: '#334155' },
  mainBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  postBox: { padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1 },

  rightSettingsBtn: {
    position: 'absolute',
    right: 0,
    top: '46%',
    zIndex: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.90)',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: '#38bdf8',
    elevation: 6,
  },
  rightSettingsIcon: { fontSize: 20 },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  settingsModalBox: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    elevation: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 14 },
  modalSectionLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, marginTop: 6 },
  modeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  modeBtnDayActive: { backgroundColor: '#0284c7', borderColor: '#0284c7' },
  modeBtnNightActive: { backgroundColor: '#1e1b4b', borderColor: '#38bdf8' },
  modeBtnText: { fontSize: 13, fontWeight: 'bold' },
  modeBtnDayTextActive: { color: '#ffffff' },
  modeBtnNightTextActive: { color: '#38bdf8' },
  brightnessRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  stepBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  presetRow: { flexDirection: 'row', flex: 1, justifyContent: 'space-evenly', marginHorizontal: 4 },
  presetChip: {
    paddingVertical: 6,
    paddingHorizontal: 7,
    borderRadius: 6,
    borderWidth: 1,
  },
  presetChipActive: { backgroundColor: '#0284c7', borderColor: '#0284c7' },
  presetChipText: { fontSize: 11, fontWeight: '600' },
  presetChipTextActive: { color: '#ffffff' },
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
  langChip: {
    width: '48%',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    alignItems: 'center',
  },
  langChipActive: { backgroundColor: '#0f172a', borderColor: '#38bdf8' },
  langChipText: { fontSize: 13, fontWeight: '600' },
  langChipTextActive: { color: '#38bdf8', fontWeight: 'bold' },
  modalCloseBtn: { backgroundColor: '#0f172a', paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  modalCloseBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  tabBar: { height: 60, backgroundColor: '#0f172a', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#334155', zIndex: 10 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabText: { color: '#94a3b8', fontSize: 14, fontWeight: '600' },
  activeTab: { color: '#38bdf8', fontWeight: 'bold' },
});