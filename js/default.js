// 初始化数值设置

// 动画过渡时间（毫秒）单位Transition time
var Transition_time = JSON.parse(localStorage.getItem('Transition_time'));
Transition_time = Transition_time == null ? 1 : Transition_time;
var trtime = Transition_time;
var transition = 300;

// 懒加载一次加载几条数据
var Lazy_loading = 10;


// 当前点击列表
var audio_this = null; // audio.js需要

// 音乐播放列表//获取缓存数据
var Music_playlis_storage = localStorage.getItem('Music_playlis_storage');
Music_playlis_storage = JSON.parse(Music_playlis_storage);
// console.log(Music_playlis_storage)
var Music_playlist = Music_playlis_storage == undefined ? [] : Music_playlis_storage;

// 代理服务器地址
var agent = 'http://www.arthurdon.top:3000';


// 网易云音乐接口(API)


// 最新专辑
var Latest_album = '/album/newest';

// 根据专辑Id获取信息
var Latest_albumGET = '/album'; // ?id=82784844

// 获取推荐歌单 默认30个
var Recommend_songs = '/personalized';

// 根据id获取歌单详情
var Song_list_details = '/playlist/detail';//?id=2999948129

// 根据歌曲的id获取音频
var Get_audio_url = '/song/url'; //?id=1398294372

//推荐新音乐
var New_music = '/personalized/newsong';

// 根据歌曲的id获取歌词
var Music_Lyrics = '/lyric';//?id=1398294372

// 搜索歌曲
var search_sousuo = '/search';//keywords=' + 歌名

// 根据id获取歌曲详情
var Song_details = '/song/detail';//?ids=347230


