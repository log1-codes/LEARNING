#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    getline(cin, s);

    int spaces = 0;

    for (char c : s) {
        if (c == ' ') {
            spaces++;
        }
    }

    cout << spaces + 1;

    return 0;
}
