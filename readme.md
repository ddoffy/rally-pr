# Get started

## Installation

Go to the root of the project and run the following command:

Mac OS with Homebrew:

```
make mac 
```

Debian/Ubuntu:

```
make debian
```

Set the environment variable `RALLY_API_KEY` in your `.bashrc` or `.zshrc` file:

```
echo "export RALLY_API_KEY=your_api_key" >> ~/.bashrc
```

```
echo "export RALLY_API_KEY=your_api_key" >> ~/.zshrc
```

## Usage

When you create a new git branch to work with a US/Defect, you should follow the
convention below:

- example: Your US number is `US123456` or Your Defect number is `DE123456`
- branch name should be `feature/US123456` or `bugfix/DE123456`

Go to project which you are working with and run the following command:

```
rally-pr
```

## License

```
[MIT](https://choosealicense.com/licenses/mit/)
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b feature/US123456`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/US123456`
5. Submit a pull request :D

```
Welcome!
```
