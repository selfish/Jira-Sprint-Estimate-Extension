var intervals = [
    {
        "text": "30 Seconds",
        "value": 1000 * 30
    }, {
        "text": "1 Minute",
        "value": 1000 * 60
    }, {
        "text": "2 Minutes",
        "value": 1000 * 60 * 2
    }, {
        "text": "5 Minutes",
        "value": 1000 * 60 * 5
    }, {
        "text": "10 Minutes",
        "value": 1000 * 60 * 10
    }, {
        "text": "20 Minutes",
        "value": 1000 * 60 * 20
    }, {
        "text": "30 Minutes",
        "value": 1000 * 60 * 30
    }, {
        "text": "1 Hour",
        "value": 1000 * 60 * 60
    }, {
        "text": "2 Hours",
        "value": 1000 * 60 * 60 * 2
    }, {
        "text": "4 Hours",
        "value": 1000 * 60 * 60 * 4
    }, {
        "text": "8 Hours",
        "value": 1000 * 60 * 60 * 8
    }
];

this.manifest = {
    "name": "Stash Pull Request Notifier",
    "icon": "../../icons/icon32.png",
    "settings": [
        {
            "tab": i18n.get("general"),
            "group": "Details",
            "name": "versionDetails",
            "type": "description",
            "text": chrome.runtime.getManifest().name
        },
        {
            "tab": i18n.get("general"),
            "group": "Details",
            "name": "versionDetails",
            "type": "description",
            "text": "Version: " + chrome.runtime.getManifest().version + " - Updated: " + localStorage["_updated"] || ''
        },
        ///////////////
        {
            "tab": i18n.get("general"),
            "group": i18n.get("jira_server"),
            "name": "server",
            "type": "text",
            "label": i18n.get("server_address"),
            "text": i18n.get("url_example")
        },
        ///////////////
        {
            "tab": i18n.get("general"),
            "group": i18n.get("content_filtering"),
            "name": "custom_jql_description",
            "type": "description",
            "text": i18n.get("custom_jql_description")
        },
        {
            "tab": i18n.get("general"),
            "group": i18n.get("content_filtering"),
            "name": "custom_jql",
            "type": "text",
            "label": i18n.get("custom_jql"),
            "text": i18n.get("jql_example")
        }
    ],
    "alignment": [
        [
            "server",
            "custom_jql"
            //"password"
        ]

    ]
};
