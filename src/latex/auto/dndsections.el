(TeX-add-style-hook
 "dndsections"
 (lambda ()
   (LaTeX-add-environments
    '("monsteraction" LaTeX-env-args ["argument"] 0)))
 :latex)

