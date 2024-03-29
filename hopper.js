const fs = require('fs');
const Discord = require('discord.js');
const { token } = require('./security/config.json');

// Créer une instance du client Discord
const client = new Discord.Client();

// Événement déclenché une fois que le bot est prêt
client.once('ready', () => {
    console.log('Bot is ready.');

    // Lire la liste des utilisateurs à bannir depuis le fichier txt
    fs.readFile('./bannissements/usersToBan.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read usersToBan.txt:', err);
            return;
        }

        // Séparer les identifiants des utilisateurs en utilisant des sauts de ligne comme délimiteurs
        const userIds = data.trim().split('\n');

        // Parcourir chaque serveur Discord où le bot est présent
        client.guilds.cache.forEach(guild => {
            // Parcourir chaque identifiant d'utilisateur
            userIds.forEach(userId => {
                // Bannir l'utilisateur du serveur Discord avec la raison spécifiée
                guild.members.ban(userId.trim(), { reason: 'Demandes et participations aux partages de contenus interdits.' })
                    .then(user => console.log(`Banned user ${user.id} from server ${guild.name}`))
                    .catch(error => console.error(`Failed to ban user ${userId} from server ${guild.name}`, error));
            });
        });
    });
});

// Se connecter au serveur Discord en utilisant le token du bot
client.login(token);