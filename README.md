Show me coups in Slack
======================

Simple lambda function to display [coups](https://joincoup.com) in a JSON format
perfect for slack commands.

Deployable via [apex](//apex.run).

## API Gateway configuration

`GET - Integration Response`

```
{
    "attachments": [
        {
            "fallback": "Check: $input.path('$.location')",
            "title": "Coups around the office",
            "title_link": "$input.path('$.location')",
            "text": "We have some coups for you!",
            "image_url": $input.json('$.location'),
            "color": "#61FFD8"
        }
    ]
}
```

## License

MIT
