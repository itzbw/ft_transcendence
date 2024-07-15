const translations =
{
	en: {
		profile: 'Profile',
		play: 'Play',
		leaderboard: 'Leaderboard', 
		language: 'Language',
		whoarewe: 'Who are We ?',
		legalnotice: 'Legal Notices',
		spring: 'Spring 2024',
		legalbody1: 'This site is for educational purposes only. None of the data collected (name, first name, email address, etc...) will be used outside of this site and will not be shared with a third party.',
		legalbody2: 'This website is the property of the members of its dev team and 42Born2Code.'
	},
	fr: {
		profile: 'Profil',
		play: 'Jouer',
		leaderboard: 'Classement',
		language: 'Langue',
		whoarewe: 'Qui sommes nous ?',
		legalnotice: 'Mentions Légales',
		spring: 'Printemps 2024',
		legalbody1: 'Ce site est à caractère pédagogique uniquement. Aucune des données recueillies (nom, prénom, adresse mail, etc...) ne sera utilisée en dehors de ce site et ne sera communiquée à un tiers.',
		legalbody2: 'Ce site est la propriété des membres de son équipe de devs et de 42Born2Code.'

	},
	ch: {
		profile: '个人资料',
		play: '玩',
		leaderboard: '排行榜',
		language: '语言',
		whoarewe: '我们是谁？',
		legalnotice: '法律声明',
		spring: '2024年春季',
		legalbody1: '本网站仅用于教育目的。收集的任何数据（姓名、名字、电子邮件地址等）都不会在本网站之外使用，也不会与第三方共享。',
		legalbody2: '本网站是其开发团队成员和42Born2Code的财产。'
	},
	jp: {
		profile: 'プロフィール',
		play: 'プレイ',
		leaderboard: 'リーダーボード',
		language: '言語',
		whoarewe: '私たちについて',
		legalnotice: '法的通知',
		spring: '2024年春',
		legalbody1: 'このサイトは教育目的のみです。収集されたデータ（名前、名字、電子メールアドレスなど）はこのサイトの外では使用されず、第三者と共有されません。',
		legalbody2: 'このウェブサイトは、その開発チームのメンバーと42Born2Codeの所有物です。'
	}
};

// get translation for the given key
function getTranslationForKey(key, language)
{
	// if the key exists, return the translation, else return the key
	if (translations[language] && translations[language][key])
		return translations[language][key];
	return key;
}

function applyLanguage()
{
	const language = localStorage.getItem('language') || 'en';
	document.documentElement.lang = language;

	// select all elements to translate
	var elementsToTranslate = document.querySelectorAll('[data-translate]');

	// each element
	elementsToTranslate.forEach(function(element) {
		var key = element.getAttribute('data-translate');
		var translation = getTranslationForKey(key, language); // Tu devrais implémenter cette fonction
		element.textContent = translation;
	});
}

function setLanguage(language)
{
	const currentLanguage = localStorage.getItem('language') || 'en';

	// check if already the current language
	if (language !== currentLanguage) {
		localStorage.setItem('language', language);
		document.documentElement.lang = language;
		location.reload();
	}
}

document.addEventListener('DOMContentLoaded', applyLanguage);