<?php
$data = require __DIR__ . '/css-defaults/css-mappings-generated.php';
echo "Data type: " . gettype($data) . "\n";
echo "Keys: " . implode(', ', array_keys($data)) . "\n";

if (isset($data['mappings'])) {
    echo "Has mappings: YES\n";
    echo "Mappings type: " . gettype($data['mappings']) . "\n";
    if (isset($data['mappings']['accordion'])) {
        echo "Accordion mappings count: " . count($data['mappings']['accordion']) . "\n";
        echo "Sample mappings:\n";
        $sample = array_slice($data['mappings']['accordion'], 0, 3);
        foreach ($sample as $key => $val) {
            echo "  $key => $val\n";
        }
    }
}
