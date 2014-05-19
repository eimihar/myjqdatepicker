<?php

shell_exec("git remote update");
echo nl2br(shell_exec("git status -uno"));

?>