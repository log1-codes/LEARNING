#include <iostream>
using namespace std;

int main() {
    string s;
    cin >> s;

    char x;
    cin >> x;

    string result = "";

    for (char c : s) {
        if (c != x) {
            result += c;
        }
    }

    cout << result;

    return 0;
}
