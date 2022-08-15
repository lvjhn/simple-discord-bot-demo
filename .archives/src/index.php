<?php 
include 'vendor/autoload.php'; 

use Discord\Discord; 
use Discord\WebSockets\Intents;
use Discord\WebSockets\Event;
use Discord\Builders\MessageBuilder;

$discord = new Discord([
    'token' => 'MTAwODMyMDkwMDY3ODAyOTMyMg.GfPfQJ.s-Q2-IyJj-VkHq1JMTWB2P85O_beF_GQafqsQM', 
]);

$discord->on('ready', function ($discord) {
    echo "Bot is ready.", PHP_EOL;

    $guild = $discord->guilds[1008319167042158684];
    $channel = $guild->channels->get('id', '1008319167612600413');
    $channel->sendMessage("Hello, I've just restarted!");

    // Listen for events here
    $discord->on('message', function ($message) {
        echo "Received a message from {$message->author->username}: {$message->content}", PHP_EOL;
        
        if($message->author->username == 'untitled-app-bot') return;
        
        $builder = MessageBuilder::new(); 

        if($message->content == "llama") {
            $builder->addFile('llama.jpeg', 'llama.jpeg'); 
            $builder->setReplyTo($message);
        }

        if($message->content == "lorem-ipsum") {
            $builder = MessageBuilder::new(); 
            $builder->setContent("> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
        }

        if($message->content == "whats-your-ip") {
            $builder = MessageBuilder::new(); 
            $builder->setContent(exec('curl http://ipecho.net/plain; echo'));
        }
        
        if($message->content == "markdown-gimme") {
            $builder = MessageBuilder::new(); 
            $builder->addFile('test.md', 'test.md'); 
        }

        if($message->content == "pdf-pls") {
            $builder = MessageBuilder::new(); 
            $builder->addFile('test.pdf', 'test.pdf'); 
        }

        $message->channel->sendMessage($builder);
    });
});

$discord->run();
