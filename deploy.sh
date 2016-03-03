aws deploy push \
  --application-name rpgchef \
  --description "This is a revision for the application rpgchef" \
  --s3-location s3://aws-code-deploy-rpgchef/rpgchef.zip \
  --source deploy
