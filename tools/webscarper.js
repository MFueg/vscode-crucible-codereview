/**
 * Examples: https://github.com/gahabeen/jsonframe-cheerio
 */

var request = require('request');
var cheerio = require('cheerio');
let jsonframe = require('jsonframe-cheerio');

var frame = {
	resources: {
		_s: '.resource',
		_d: [
			{
				'uri-pattern': 'h3',
				'required-parameters': {
					_s: 'table tr:not(:first-child)',
					_d: [
						{
							name: 'td:nth-child(1)>p>strong',
							type: 'td:nth-child(2)>p>em>a',
							description: 'td:nth-child(3)>p'
						}
					]
				},
				methods: {
					_s: '.methods>.method',
					_d: [
						{
							kind: 'h4',
							description: 'p',
							'optional-parameters': {
								_s: 'table tr:not(:first-child)',
								_d: [
									{
										name: 'td:nth-child(1)>p>strong',
										type: 'td:nth-child(2)>p>em>a',
										description: 'td:nth-child(3)>p'
									}
								]
							},
							responses: {
								_s: 'li',
								_d: [
									{
										code: 'div:nth-child(1) || \\d+',
										value: 'div:nth-child(2) code'
									}
								]
							}
						}
					]
				}
			}
		]
	}
};

request('https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html', function(error, response, html) {
	if (!error && response.statusCode == 200) {
		var $ = cheerio.load(html);
		jsonframe($); // initializes the plugin

		var resources = $('body').scrape(frame);
		console.log(JSON.stringify(resources, null, 2));
	}
});
